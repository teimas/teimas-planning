import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

interface PlanningCardProps {
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
}

export const PlanningCard: React.FC<PlanningCardProps> = ({ 
  value, 
  selected, 
  onSelect 
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selected]}
      onPress={() => onSelect(value)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <Text style={[styles.cardValue, selected && styles.selectedText]}>
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 70,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selected: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
    transform: [{ translateY: -10 }],
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
}); 