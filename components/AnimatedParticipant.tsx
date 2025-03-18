import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Animated, 
  Easing,
  ImageSourcePropType
} from 'react-native';
import { ThemedText } from './ThemedText';
import { Participant } from '@/stores/sessionStore';
import { useTranslation } from 'react-i18next';

interface AnimatedParticipantProps {
  participant: Participant;
  isCurrentUser?: boolean;
  isCreator?: boolean;
  hasVoted?: boolean;
  imageSource: ImageSourcePropType;
  showName?: boolean;
  style?: any;
}

export function AnimatedParticipant({ 
  participant, 
  isCurrentUser = false, 
  isCreator = false, 
  hasVoted = false,
  imageSource,
  showName = true,
  style
}: AnimatedParticipantProps) {
  const { t } = useTranslation();
  
  // Animation values
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Entry animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5))
      })
    ]).start();
  }, []);
  
  // Pulse animation when voted
  useEffect(() => {
    if (hasVoted) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease)
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease)
        })
      ]).start();
    }
  }, [hasVoted]);
  
  return (
    <Animated.View style={[
      styles.container,
      isCurrentUser && styles.currentUser,
      !hasVoted && styles.notVoted,
      {
        opacity: opacityAnim,
        transform: [
          { translateY: translateAnim },
          { scale: pulseAnim }
        ]
      },
      style
    ]}>
      <Image 
        source={imageSource} 
        style={styles.image}
      />
      
      {showName && (
        <View style={styles.nameContainer}>
          <ThemedText style={[
            styles.name,
            !hasVoted && styles.notVotedText
          ]}>
            {participant.name}
            {isCurrentUser && t('session.youIndicator')}
            {isCreator && ' 👑'}
          </ThemedText>
          
          {hasVoted && (
            <View style={styles.votedBadge}>
              <ThemedText style={styles.votedBadgeText}>✓</ThemedText>
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 6,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  currentUser: {
    backgroundColor: 'rgba(255, 255, 200, 0.5)',
  },
  notVoted: {
    opacity: 0.6,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 80,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
    marginRight: 4,
  },
  notVotedText: {
    color: '#BBBBBB',
  },
  votedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
  },
  votedBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  }
}); 