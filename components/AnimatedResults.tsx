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
  results: VoteResult[];
  average: string;
  mostFrequent: string;
  totalVotes: number;
}

export function AnimatedResults({ 
  results, 
  average, 
  mostFrequent,
  totalVotes
}: AnimatedResultsProps) {
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const barAnims = useRef(results.map(() => new Animated.Value(0)));
  
  // Entry animation
  useEffect(() => {
    // Reset all animations on new results
    barAnims.current = results.map(() => new Animated.Value(0));
    
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
        duration: 600,
        delay: 200 + (index * 100), // Staggered delay for each bar
        useNativeDriver: Platform.OS !== 'web', // Native driver doesn't work with width animation on web
        easing: Easing.out(Easing.cubic)
      });
    });
    
    Animated.stagger(50, barAnimations).start();
  }, [results]);
  
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryLabel}>{t('session.average')}</ThemedText>
          <ThemedText style={styles.summaryValue}>{average}</ThemedText>
        </View>
        
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryLabel}>{t('session.mostCommon')}</ThemedText>
          <ThemedText style={styles.summaryValue}>{mostFrequent}</ThemedText>
        </View>
        
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryLabel}>{t('session.totalVotes')}</ThemedText>
          <ThemedText style={styles.summaryValue}>{totalVotes}</ThemedText>
        </View>
      </View>
      
      <View style={styles.barsContainer}>
        {results.map((result, index) => (
          <View key={result.value} style={styles.barRow}>
            <ThemedText style={styles.barLabel}>{result.value}</ThemedText>
            <View style={styles.barBackground}>
              <Animated.View 
                style={[
                  styles.barFill,
                  { 
                    width: Platform.OS === 'web' 
                      ? barAnims.current[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', `${result.percentage}%`]
                        })
                      : undefined,
                    transform: Platform.OS !== 'web' ? [
                      { 
                        scaleX: barAnims.current[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.01, result.percentage / 100]
                        }) 
                      }
                    ] : undefined,
                    transformOrigin: 'left',
                  }
                ]}
              />
            </View>
            <ThemedText style={styles.barValue}>{result.count} ({result.percentage}%)</ThemedText>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
      }
    })
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)'
  },
  summaryItem: {
    alignItems: 'center'
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.6
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  barsContainer: {
    marginTop: 5
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  barLabel: {
    width: 30,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
    textAlign: 'center'
  },
  barBackground: {
    flex: 1,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 10,
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    width: '0%', // Start at 0% and animate to the final percentage
    backgroundColor: '#3498db',
    borderRadius: 10,
    transformOrigin: 'left'
  },
  barValue: {
    width: 70,
    fontSize: 12,
    marginLeft: 8,
    textAlign: 'right'
  }
}); 