import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, Alert, TouchableOpacity, Share, Image, ImageURISource } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/Button';
import { PlanningCard } from '@/components/PlanningCard';
import { AnimatedPlanningCard } from '@/components/AnimatedPlanningCard';
import { AnimatedParticipant } from '@/components/AnimatedParticipant';
import { AnimatedResults } from '@/components/AnimatedResults';
import useSessionStore, { Participant } from '@/stores/sessionStore';
import * as Clipboard from 'expo-clipboard';

// Standard Fibonacci sequence used in Planning Poker
const CARD_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '?', '∞'];

// Generic avatar for users without images
const DEFAULT_AVATAR = require('@/assets/images/icon.png');

// Define routes for type checking in the namespace
declare global {
  namespace ReactNavigation {
    interface RootParamList {
      home: undefined;
      'planning-session': { id: string };
      'planning-poker': { sessionId?: string };
      login: undefined;
    }
  }
}

export default function PlanningSessionScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  
  const { 
    currentSession, 
    currentParticipant,
    loading,
    error,
    castVote,
    revealVotes,
    resetVotes,
    leaveSession
  } = useSessionStore();
  
  // Check if user is host
  const isHost = currentSession?.creator === currentParticipant?.id;
  
  // Effect to handle navigation directly to the session URL
  useEffect(() => {
    if (id && !currentSession) {
      console.log('Attempting to load session:', id);
      try {
        // If there's no session but we have an ID, check if it exists
        useSessionStore.getState().joinSession(id, 'Guest')
          .then(() => {
            console.log('Successfully joined session:', id);
          })
          .catch(error => {
            console.error('Failed to join session:', error);
            Alert.alert('Error', `Failed to join session: ${error instanceof Error ? error.message : String(error)}`);
          });
      } catch (error) {
        console.error('Error in joinSession effect:', error);
        Alert.alert('Error', `Error in join session: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }, [id, currentSession]);
  
  useEffect(() => {
    // Set selected card from current participant
    if (currentParticipant?.vote) {
      setSelectedCard(currentParticipant.vote);
    } else {
      setSelectedCard(null);
    }
  }, [currentParticipant]);
  
  useEffect(() => {
    // Handle navigation back
    return () => {
      if (currentSession) {
        leaveSession();
      }
    };
  }, []);
  
  const handleCardSelect = async (value: string) => {
    if (currentSession?.isRevealed) {return;}
    
    setSelectedCard(value === selectedCard ? null : value);
    if (value !== selectedCard) {
      await castVote(value);
    }
  };
  
  const handleLeaveSession = () => {
    useSessionStore.getState().leaveSession();
    router.replace('/home');
  };
  
  const handleReveal = async () => {
    if (!currentSession || !isHost) {return;}
    await revealVotes();
  };
  
  const handleReset = async () => {
    if (!currentSession || !isHost) {return;}
    await resetVotes();
  };
  
  const handleShare = async () => {
    if (!id) {return;}
    
    try {
      await Share.share({
        message: t('session.joinMessage', { id }),
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const copyToClipboard = async () => {
    if (!id) {return;}
    
    await Clipboard.setStringAsync(id);
    Alert.alert(t('session.copied'));
  };
  
  // Calculate average and most frequent vote
  const calculateResults = () => {
    if (!currentSession || !currentSession.isRevealed) {return null;}
    
    const votes = Object.values(currentSession.participants)
      .map(p => p.vote)
      .filter(v => v && !isNaN(Number(v))) as string[];
    
    if (votes.length === 0) {return null;}
    
    // Convert to numbers and calculate average
    const numericVotes = votes.map(v => Number(v));
    const average = numericVotes.reduce((sum, vote) => sum + vote, 0) / numericVotes.length;
    
    // Find most frequent vote
    const voteCount: Record<string, number> = {};
    votes.forEach(vote => {
      voteCount[vote] = (voteCount[vote] || 0) + 1;
    });
    
    let mostFrequent = votes[0];
    let maxCount = 0;
    
    Object.entries(voteCount).forEach(([vote, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequent = vote;
      }
    });
    
    // Format data for the AnimatedResults component
    const results = Object.entries(voteCount).map(([value, count]) => ({
      value,
      count,
      percentage: Math.round((count / votes.length) * 100)
    })).sort((a, b) => {
      // Sort numeric values numerically, non-numeric at the end
      const aNum = parseFloat(a.value);
      const bNum = parseFloat(b.value);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      
      if (isNaN(aNum)) {return 1;}
      if (isNaN(bNum)) {return -1;}
      
      return 0;
    });
    
    return {
      average: average.toFixed(1),
      mostFrequent,
      totalVotes: votes.length,
      voteResults: results
    };
  };
  
  // Group participants by their vote choice
  const getParticipantsByVote = () => {
    if (!currentSession || !currentSession.isRevealed) {return null;}
    
    const groupedParticipants: Record<string, Participant[]> = {};
    
    // Group participants by their vote
    Object.values(currentSession.participants).forEach(participant => {
      if (participant.vote) {
        if (!groupedParticipants[participant.vote]) {
          groupedParticipants[participant.vote] = [];
        }
        groupedParticipants[participant.vote].push(participant);
      }
    });
    
    // Sort groups by vote value (numeric if possible)
    const sortedGroups = Object.entries(groupedParticipants).sort((a, b) => {
      // Special handling for non-numeric votes
      if (a[0] === '?' || a[0] === '∞') {return 1;}
      if (b[0] === '?' || b[0] === '∞') {return -1;}
      return Number(a[0]) - Number(b[0]);
    });
    
    return sortedGroups;
  };
  
  // Get participants who have voted but not revealed
  const getVotedParticipants = () => {
    if (!currentSession || currentSession.isRevealed) {return [];}
    
    return Object.values(currentSession.participants)
      .filter(p => p.vote !== null && p.vote !== undefined);
  };
  
  const results = calculateResults();
  const votedParticipants = getVotedParticipants();
  const participantsByVote = getParticipantsByVote();
  
  const renderParticipant = ({ item }: { item: Participant }) => {
    const hasVoted = !!item.vote;
    const isCurrentUser = item.id === currentParticipant?.id;
    const imageSource = getParticipantImage(item.image);
    
    return (
      <View style={[
        styles.participantItem, 
        isCurrentUser && styles.currentUserItem,
        !hasVoted && styles.notVotedItem
      ]}>
        <View style={styles.participantInfo}>
          <Image 
            source={imageSource} 
            style={styles.participantListImage}
          />
          <ThemedText style={[
            styles.participantName,
            !hasVoted && styles.notVotedText
          ]}>
            {item.name} {isCurrentUser && t('session.youIndicator')}
            {item.id === currentSession?.creator && ' 👑'}
          </ThemedText>
        </View>
        
        <View style={styles.voteContainer}>
          {currentSession?.isRevealed ? (
            <ThemedText style={styles.voteValue}>
              {item.vote || '?'}
            </ThemedText>
          ) : (
            <ThemedText style={[styles.votePlaceholder, hasVoted ? styles.hasVotedText : styles.notVotedText]}>
              {hasVoted ? '✓' : '...'}
            </ThemedText>
          )}
        </View>
      </View>
    );
  };
  
  // Handle dynamic image imports
  const getParticipantImage = (imagePath: string | null) => {
    if (!imagePath) {return DEFAULT_AVATAR;}
    
    // Since imagePath is now just the initials, use it directly to look up the image
    const initials = imagePath;
    
    // Map of available images
    const images: Record<string, any> = {
      'AR': require('@/assets/images/people/AR.png'),
      'AP': require('@/assets/images/people/AP.png'),
      'BA': require('@/assets/images/people/BA.png'),
      'CV': require('@/assets/images/people/CV.png'),
      'DG': require('@/assets/images/people/DG.png'),
      'DP': require('@/assets/images/people/DP.png'),
      'IE': require('@/assets/images/people/IE.png'),
      'JD': require('@/assets/images/people/JD.png'),
      'LB': require('@/assets/images/people/LB.png'),
      'RG': require('@/assets/images/people/RG.png'),
      'RGA': require('@/assets/images/people/RGA.png'),
      'RV': require('@/assets/images/people/RV.png'),
      'SC': require('@/assets/images/people/SC.png'),
      'SG': require('@/assets/images/people/SG.png'),
      'VP': require('@/assets/images/people/VP.png'),
      'VQ': require('@/assets/images/people/VQ.png'),
    };
    
    return images[initials] || DEFAULT_AVATAR;
  };
  
  const renderDynamicParticipantImage = ({ item }: { item: Participant }) => {
    const imageSource = getParticipantImage(item.image);
    const isCurrentUser = item.id === currentParticipant?.id;
    const isCreator = item.id === currentSession?.creator;
    const hasVoted = !!item.vote;
    
    return (
      <AnimatedParticipant
        participant={item}
        isCurrentUser={isCurrentUser}
        isCreator={isCreator}
        hasVoted={hasVoted}
        imageSource={imageSource}
        showName={true}
        style={styles.votedParticipantContainer}
      />
    );
  };
  
  // Render a single participant image, used in both voting and results view
  const renderParticipantImage = (participant: Participant, showName: boolean = true) => {
    const imageSource = getParticipantImage(participant.image);
    
    return (
      <View key={participant.id} style={styles.votedParticipantContainer}>
        <Image 
          source={imageSource} 
          style={styles.participantImage}
        />
        {showName && (
          <ThemedText style={styles.votedParticipantName}>
            {participant.name}
          </ThemedText>
        )}
      </View>
    );
  };
  
  // Render a group of participants who selected the same card
  const renderVoteGroup = ([voteValue, participants]: [string, Participant[]]) => {
    return (
      <View key={voteValue} style={styles.voteGroupContainer}>
        <View style={styles.voteGroupHeader}>
          <View style={styles.voteCardContainer}>
            <PlanningCard
              value={voteValue}
              selected={true}
              onSelect={() => {}}
            />
          </View>
          <ThemedText style={styles.voteGroupCount}>
            {participants.length} {participants.length === 1 ? t('session.vote') : t('session.votes')}
          </ThemedText>
        </View>
        
        <View style={styles.voteGroupParticipants}>
          {participants.map(participant => renderParticipantImage(participant))}
        </View>
      </View>
    );
  };
  
  if (!currentSession || !currentParticipant) {
    const sessionState = useSessionStore.getState();
    console.log('No session or participant data available. ID:', id, 'Error:', sessionState.error);
    
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.loadingText}>{t('common.loading')}</ThemedText>
        <ThemedText style={styles.errorText}>
          {sessionState.error ? `Error: ${sessionState.error}` : t('session.connectingAttempt')}
        </ThemedText>
        
        <View style={styles.buttonContainer}>
          <Button
            title={t('common.goBack')}
            onPress={() => router.replace('/home')}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </ThemedView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title">{t('planningPoker.title')}</ThemedText>
          
          <View style={styles.sessionInfo}>
            <ThemedText style={styles.sessionIdLabel}>
              {t('session.sessionId')}
            </ThemedText>
            <TouchableOpacity onPress={copyToClipboard}>
              <ThemedText style={styles.sessionIdValue}>
                {id} 📋
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Voted participants gallery - only show when not revealed */}
        {!currentSession.isRevealed && votedParticipants.length > 0 && (
          <View style={styles.votedParticipantsSection}>
            <ThemedText type="subtitle">{t('session.whoHasVoted')}</ThemedText>
            <FlatList
              data={votedParticipants}
              renderItem={renderDynamicParticipantImage}
              keyExtractor={(item) => item.id}
              horizontal
              style={styles.votedParticipantsList}
              contentContainerStyle={styles.votedParticipantsContent}
            />
          </View>
        )}
        
        <View style={styles.cardsSection}>
          <ThemedText type="subtitle">{t('planningPoker.yourEstimation')}</ThemedText>
          
          <View style={styles.cardGrid}>
            {CARD_VALUES.map((value) => (
              <AnimatedPlanningCard
                key={value}
                value={value}
                selected={value === selectedCard}
                onSelect={handleCardSelect}
                revealed={currentSession.isRevealed}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.participantsSection}>
          <ThemedText type="subtitle">{t('session.participants')}</ThemedText>
          
          <FlatList
            data={Object.values(currentSession.participants)}
            renderItem={renderParticipant}
            keyExtractor={(item) => item.id}
            style={styles.participantsList}
          />
          
          {currentSession.isRevealed && results && (
            <View style={styles.resultsContainer}>
              <ThemedText style={styles.resultsTitle}>{t('session.results')}</ThemedText>
              
              <AnimatedResults
                results={results.voteResults}
                average={results.average}
                mostFrequent={results.mostFrequent}
                totalVotes={results.totalVotes}
              />
              
              {/* Vote Groups */}
              {participantsByVote && (
                <View style={styles.voteGroupsContainer}>
                  <ThemedText style={styles.voteGroupsTitle}>
                    {t('session.groupedVotes')}
                  </ThemedText>
                  {participantsByVote.map(renderVoteGroup)}
                </View>
              )}
            </View>
          )}
        </View>
        
        <View style={styles.actionsContainer}>
          {isHost && (
            <View style={styles.hostActions}>
              <Button
                title={currentSession.isRevealed ? t('session.reset') : t('session.reveal')}
                onPress={currentSession.isRevealed ? handleReset : handleReveal}
                variant="primary"
                style={styles.actionButton}
              />
              
              <Button
                title={t('session.share')}
                onPress={handleShare}
                variant="outline"
                style={styles.actionButton}
              />
            </View>
          )}
          
          <Button
            title={t('session.leave')}
            onPress={handleLeaveSession}
            variant="outline"
            style={styles.leaveButton}
          />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  sessionIdLabel: {
    marginRight: 5,
  },
  sessionIdValue: {
    fontWeight: 'bold',
  },
  votedParticipantsSection: {
    marginBottom: 15,
  },
  votedParticipantsList: {
    marginTop: 10,
  },
  votedParticipantsContent: {
    paddingHorizontal: 5,
  },
  votedParticipantContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 80,
  },
  participantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  votedParticipantName: {
    fontSize: 12,
    textAlign: 'center',
  },
  cardsSection: {
    marginBottom: 20,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  participantsSection: {
    flex: 1,
    marginBottom: 10,
  },
  participantsList: {
    marginTop: 5,
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currentUserItem: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantListImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  participantName: {
    fontSize: 16,
  },
  voteContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
  },
  voteValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  votePlaceholder: {
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    borderRadius: 8,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultsSummary: {
    marginBottom: 10,
  },
  voteGroupsContainer: {
    marginTop: 10,
  },
  voteGroupsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  actionsContainer: {
    marginTop: 10,
  },
  hostActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  leaveButton: {
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 30,
    width: '100%',
  },
  voteGroupContainer: {
    marginBottom: 10,
  },
  voteGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  voteCardContainer: {
    marginRight: 10,
  },
  voteGroupCount: {
    fontSize: 12,
  },
  voteGroupParticipants: {
    flexDirection: 'row',
  },
  voteGroupImages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  notVotedItem: {
    backgroundColor: 'rgba(240, 240, 240, 0.5)',
  },
  notVotedText: {
    color: '#BBBBBB',
  },
  hasVotedText: {
    color: '#2ecc71',
    fontWeight: 'bold',
  },
}); 