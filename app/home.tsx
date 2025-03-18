import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/Button';
import useSessionStore from '@/stores/sessionStore';
import { useUserStore } from '@/stores/userStore';

export default function HomeScreen() {
  const { t } = useTranslation();
  const [sessionId, setSessionId] = useState('');
  const [createMode, setCreateMode] = useState(true);
  
  const name = useUserStore(state => state.name);
  
  const { createSession, joinSession, loading, error } = useSessionStore();
  
  const handleCreateSession = async () => {
    try {
      console.log('Creating session for user:', name);
      const sessionId = await useSessionStore.getState().createSession(name || 'Anonymous');
      console.log('Session created successfully, navigating to session with ID:', sessionId);
      
      // Short timeout to simulate network delay
      setTimeout(() => {
        router.push({
          pathname: '/planning-session',
          params: { id: sessionId },
        });
      }, 300);
    } catch (error) {
      console.error('Error creating session:', error);
      Alert.alert(
        t('common.error'),
        error instanceof Error ? error.message : String(error)
      );
    }
  };
  
  const handleJoinSession = async () => {
    if (!sessionId.trim()) {
      Alert.alert(
        t('common.error'),
        t('session.invalidSession')
      );
      return;
    }
    
    try {
      const formattedSessionId = sessionId.trim().toUpperCase();
      await joinSession(formattedSessionId, name || 'Anonymous');
      
      // Short timeout to simulate network delay
      setTimeout(() => {
        router.push({
          pathname: '/planning-session',
          params: { id: formattedSessionId },
        });
      }, 300);
    } catch (error) {
      Alert.alert(
        t('common.error'),
        error instanceof Error ? error.message : String(error)
      );
    }
  };
  
  const toggleMode = () => {
    setCreateMode(!createMode);
    setSessionId('');
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{t('planningPoker.title')}</ThemedText>
      
      <ThemedText style={styles.welcome}>
        {t('login.title')}, {name}!
      </ThemedText>
      
      {createMode ? (
        <View style={styles.formContainer}>
          <ThemedText type="subtitle">{t('session.create')}</ThemedText>
          
          <ThemedText style={styles.infoText}>
            {t('session.youAreHost')}
          </ThemedText>
          
          <Button
            title={t('session.create')}
            onPress={handleCreateSession}
            variant="primary"
            disabled={loading}
            style={styles.button}
          />
          
          <TouchableOpacity onPress={toggleMode} style={styles.toggleLink}>
            <ThemedText style={styles.toggleText}>
              {t('session.join')}
            </ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <ThemedText type="subtitle">{t('session.join')}</ThemedText>
          
          <TextInput
            style={styles.input}
            placeholder={t('session.sessionIdPlaceholder')}
            value={sessionId}
            onChangeText={setSessionId}
            autoCapitalize="characters"
            maxLength={8}
          />
          
          <Button
            title={t('session.join')}
            onPress={handleJoinSession}
            variant="primary"
            disabled={!sessionId.trim() || loading}
            style={styles.button}
          />
          
          <TouchableOpacity onPress={toggleMode} style={styles.toggleLink}>
            <ThemedText style={styles.toggleText}>
              {t('session.create')}
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
      
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
  welcome: {
    fontSize: 18,
    marginVertical: 20,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    marginVertical: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginVertical: 15,
  },
  button: {
    width: '80%',
    marginVertical: 10,
  },
  toggleLink: {
    marginTop: 20,
    paddingVertical: 10,
  },
  toggleText: {
    color: '#3498db',
    fontSize: 16,
  },
}); 