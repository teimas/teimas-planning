import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/Button';
import { PlanningCard } from '@/components/PlanningCard';

// Standard Fibonacci sequence used in Planning Poker
const CARD_VALUES = ['0', '1', '2', '3', '5', '8', '13', '21', '?', '∞'];

export default function PlanningPokerScreen() {
  const { t } = useTranslation();
  const { name } = useLocalSearchParams<{ name: string }>();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const handleCardSelect = (value: string) => {
    if (!confirmed) {
      setSelectedCard(value === selectedCard ? null : value);
    }
  };

  const handleReset = () => {
    setSelectedCard(null);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    if (selectedCard) {
      setConfirmed(true);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">{t('planningPoker.title')}</ThemedText>
        <ThemedText>
          {name}
        </ThemedText>
      </View>

      <View style={styles.estimationSection}>
        <ThemedText type="subtitle">{t('planningPoker.yourEstimation')}</ThemedText>
        {selectedCard ? (
          <View style={styles.selectedCardContainer}>
            <PlanningCard
              value={selectedCard}
              selected={true}
              onSelect={() => {}}
            />
          </View>
        ) : (
          <ThemedText style={styles.selectPrompt}>
            {t('planningPoker.selectCard')}
          </ThemedText>
        )}
      </View>

      <View style={styles.cardsContainer}>
        <ThemedText type="subtitle" style={styles.cardsTitle}>
          {t('planningPoker.storyPoints')}
        </ThemedText>
        <FlatList
          data={CARD_VALUES}
          renderItem={({ item }) => (
            <PlanningCard
              value={item}
              selected={item === selectedCard}
              onSelect={handleCardSelect}
            />
          )}
          keyExtractor={(item) => item}
          numColumns={5}
          contentContainerStyle={styles.cardsList}
        />
      </View>

      <View style={styles.actionsContainer}>
        <Button
          title={t('planningPoker.resetSelection')}
          onPress={handleReset}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title={t('planningPoker.confirmSelection')}
          onPress={handleConfirm}
          variant="primary"
          style={styles.actionButton}
          disabled={!selectedCard || confirmed}
        />
      </View>

      <LanguageSelector />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  estimationSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  selectedCardContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  selectPrompt: {
    marginTop: 15,
    fontSize: 16,
    fontStyle: 'italic',
  },
  cardsContainer: {
    flex: 1,
  },
  cardsTitle: {
    marginBottom: 10,
  },
  cardsList: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  actionButton: {
    width: '45%',
  },
}); 