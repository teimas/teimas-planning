import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, Alert, TouchableOpacity, Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/Button';
import { PlanningCard } from '@/components/PlanningCard';
import useSessionStore, { Participant } from '@/stores/sessionStore';
import * as Clipboard from 'expo-clipboard';

// Standard Fibonacci sequence used in Planning Poker
const CARD_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '?', '∞'];

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
    if (currentSession?.isRevealed) return;
    
    setSelectedCard(value === selectedCard ? null : value);
    if (value !== selectedCard) {
      await castVote(value);
    }
  };
  
  const handleLeaveSession = () => {
    useSessionStore.getState().leaveSession();
    router.replace('home' as any);
  };
  
  const handleReveal = async () => {
    if (!currentSession || !isHost) return;
    await revealVotes();
  };
  
  const handleReset = async () => {
    if (!currentSession || !isHost) return;
    await resetVotes();
  };
  
  const handleShare = async () => {
    if (!id) return;
    
    try {
      await Share.share({
        message: `Join my Planning Poker session with ID: ${id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const copyToClipboard = async () => {
    if (!id) return;
    
    await Clipboard.setStringAsync(id);
    Alert.alert(t('session.copied'));
  };
  
  // Calculate average and most frequent vote
  const calculateResults = () => {
    if (!currentSession || !currentSession.isRevealed) return null;
    
    const votes = Object.values(currentSession.participants)
      .map(p => p.vote)
      .filter(v => v && !isNaN(Number(v))) as string[];
    
    if (votes.length === 0) return null;
    
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
    
    return {
      average: average.toFixed(1),
      mostFrequent,
    };
  };
  
  const results = calculateResults();
  
  const renderParticipant = ({ item }: { item: Participant }) => {
    const hasVoted = !!item.vote;
    const isCurrentUser = item.id === currentParticipant?.id;
    
    return (
      <View style={[
        styles.participantItem, 
        isCurrentUser && styles.currentUserItem
      ]}>
        <ThemedText style={styles.participantName}>
          {item.name} {isCurrentUser && '(You)'}
          {item.id === currentSession?.creator && ' 👑'}
        </ThemedText>
        
        <View style={styles.voteContainer}>
          {currentSession?.isRevealed ? (
            <ThemedText style={styles.voteValue}>
              {item.vote || '?'}
            </ThemedText>
          ) : (
            <ThemedText style={styles.votePlaceholder}>
              {hasVoted ? '✓' : '...'}
            </ThemedText>
          )}
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
          {sessionState.error ? `Error: ${sessionState.error}` : 'Attempting to connect to session...'}
        </ThemedText>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Go Back"
            onPress={() => router.replace('home' as any)}
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
        
        <View style={styles.cardsSection}>
          <ThemedText type="subtitle">{t('planningPoker.yourEstimation')}</ThemedText>
          
          <View style={styles.cardGrid}>
            {CARD_VALUES.map((value) => (
              <PlanningCard
                key={value}
                value={value}
                selected={value === selectedCard}
                onSelect={handleCardSelect}
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
              <ThemedText style={styles.resultsTitle}>Results:</ThemedText>
              <ThemedText>Average: {results.average}</ThemedText>
              <ThemedText>Most common: {results.mostFrequent}</ThemedText>
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
}); 