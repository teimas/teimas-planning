import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Animated, 
  Easing,
  Platform,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { useTranslation } from 'react-i18next';

interface VoteResult {
  value: string;
  count: number;
  percentage: number;
}

interface AnimatedResultsProps {
  voteResults: VoteResult[];
  average: string | number;
  mostFrequent: string;
  totalVotes: number;
}

export function AnimatedResults({ 
  voteResults = [], 
  average, 
  mostFrequent,
  totalVotes
}: AnimatedResultsProps) {
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const barAnims = useRef(voteResults.map(() => new Animated.Value(0)));
  
  // Entry animation
  useEffect(() => {
    // Reset all animations on new results
    barAnims.current = voteResults.map(() => new Animated.Value(0));
    
    // Fade in the results summary
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease)
    }).start();
    
    // Animate bars in sequence with staggered delay
    const barAnimations = barAnims.current.map((anim, index) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      });
    });
    
    Animated.stagger(100, barAnimations).start();
  }, [voteResults]);
  
  // Empty state
  if (voteResults.length === 0 || totalVotes === 0) {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.summaryContainer, { opacity: fadeAnim }]}>
          <ThemedText style={styles.noVotesText}>No votes yet</ThemedText>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Summary Section */}
      <Animated.View style={[styles.summaryContainer, { opacity: fadeAnim }]}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Average: {average}</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Most frequent: {mostFrequent}</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Total votes: {totalVotes}</ThemedText>
          </View>
        </View>
      </Animated.View>

      {/* Results Bars */}
      <View style={styles.barsContainer}>
        {voteResults.map((result, index) => (
          <View key={`result-${result.value}`} style={styles.barRow}>
            <View style={styles.barLabelContainer}>
              <ThemedText style={styles.barLabel}>{result.value}</ThemedText>
            </View>
            <View style={styles.barBackground}>
              <Animated.View 
                style={[
                  styles.barFill,
                  { 
                    width: barAnims.current[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', `${result.percentage}%`]
                    })
                  }
                ]}
              />
            </View>
            <View style={styles.barValueContainer}>
              <ThemedText style={styles.barValue}>
                {result.count} ({result.percentage}%)
              </ThemedText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    
    // For Web
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
      }
    })
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  summaryItem: {
    alignItems: 'center'
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.6
  },
  barsContainer: {
    marginTop: 5
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  barLabelContainer: {
    width: 30,
    fontSize: 14,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  barBackground: {
    flex: 1,
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 4,
    transformOrigin: 'left'
  },
  barValueContainer: {
    width: 70,
    textAlign: 'right'
  },
  barValue: {
    fontSize: 12
  },
  noVotesText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
}); 