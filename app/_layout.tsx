import React from 'react';
import { Stack, Slot } from 'expo-router';
import { LanguageProvider } from '@src/contexts/LanguageContext';
import '@src/i18n'; // Import i18n configuration

// Define the route types
declare global {
  namespace ReactNavigation {
    interface RootParamList {
      index: undefined;
      login: undefined;
      home: undefined;
      'planning-poker': { sessionId?: string };
      'planning-session': { id: string };
    }
  }
}

// This configures the navigation
export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="home" />
        <Stack.Screen name="planning-poker" />
        <Stack.Screen 
          name="planning-session" 
          options={{ gestureEnabled: false }}
        />
      </Stack>
    </LanguageProvider>
  );
} 