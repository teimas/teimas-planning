import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  View, 
  Animated, 
  Platform,
  Easing
} from 'react-native';
import { ThemedText } from './ThemedText';

interface PlanningCardProps {
  value: string;
  selected?: boolean;
  onSelect: (value: string) => void;
  revealed?: boolean;
}

export function AnimatedPlanningCard({ 
  value, 
  selected = false, 
  onSelect, 
  revealed = false 
}: PlanningCardProps) {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const elevationAnim = useRef(new Animated.Value(2)).current;
  
  // Run animation when selected state changes
  useEffect(() => {
    if (selected) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease)
        }),
        Animated.timing(elevationAnim, {
          toValue: 8,
          duration: 200,
          useNativeDriver: false
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease)
        }),
        Animated.timing(elevationAnim, {
          toValue: 2,
          duration: 150,
          useNativeDriver: false
        })
      ]).start();
    }
  }, [selected]);
  
  // Run flip animation when revealed
  useEffect(() => {
    if (revealed) {
      Animated.sequence([
        // First flip to 90 degrees
        Animated.timing(rotateAnim, {
          toValue: 90,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        // Then flip back to 0
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        })
      ]).start();
    }
  }, [revealed]);
  
  // Convert rotation value to interpolated rotation string
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 90, 180],
    outputRange: ['0deg', '90deg', '180deg']
  });
  
  // Determine shadow style based on platform
  const getShadowStyle = () => {
    if (Platform.OS === 'web') {
      return {
        boxShadow: `0px ${elevationAnim.interpolate({
          inputRange: [0, 10],
          outputRange: ['1px', '15px']
        })} ${elevationAnim.interpolate({
          inputRange: [0, 10],
          outputRange: ['2px', '20px']
        })} rgba(0,0,0,0.2)`
      };
    } else {
      return {
        shadowOffset: { 
          width: 0, 
          height: elevationAnim.interpolate({
            inputRange: [0, 10],
            outputRange: [1, 6]
          }) 
        },
        shadowOpacity: elevationAnim.interpolate({
          inputRange: [0, 10],
          outputRange: [0.2, 0.4]
        }),
        shadowRadius: elevationAnim.interpolate({
          inputRange: [0, 10],
          outputRange: [1, 4]
        }),
        elevation: elevationAnim
      };
    }
  };
  
  return (
    <TouchableOpacity 
      onPress={() => onSelect(value)} 
      activeOpacity={0.8}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.card,
          selected && styles.selected,
          {
            transform: [
              { scale: scaleAnim },
              { rotateY: rotation }
            ],
            ...getShadowStyle()
          }
        ]}
      >
        <ThemedText style={[
          styles.value,
          selected && styles.selectedText
        ]}>
          {value}
        </ThemedText>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 6,
    minWidth: 60,
    minHeight: 90,
  },
  card: {
    width: 60,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  selected: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedText: {
    color: 'white',
  }
}); 