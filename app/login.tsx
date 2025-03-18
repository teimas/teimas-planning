import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/Button';
import { useUserStore } from '@/stores/userStore';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  const handleContinue = () => {
    if (name.trim() !== '') {
      useUserStore.getState().setName(name);
      router.push('home' as any);
    } else {
      // ... existing code ...
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{t('login.title')}</ThemedText>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t('login.namePlaceholder')}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>
      
      <Button 
        title={t('login.continueButton')} 
        onPress={handleContinue} 
        variant="primary"
        disabled={name.trim().length === 0}
        style={styles.button}
      />
      
      <LanguageSelector />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputContainer: {
    width: '100%',
    marginVertical: 24,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    width: '80%',
  },
}); 