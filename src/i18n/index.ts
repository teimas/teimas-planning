import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en';
import es from './locales/es';

// Define locales
export const LANGUAGES: Record<string, string> = {
  en: 'English',
  es: 'Español',
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

// Function to get the current language
export const getCurrentLanguage = async (): Promise<string> => {
  try {
    const storedLanguage = await AsyncStorage.getItem('language');
    
    // If we have a stored language and it's valid, use it
    if (storedLanguage && Object.keys(LANGUAGES).includes(storedLanguage)) {
      return storedLanguage;
    }
    
    // If no stored language, use device language
    const deviceLanguage = getLocales()[0].languageCode;
    // Check if device language is supported, otherwise use English
    const language = deviceLanguage && Object.keys(LANGUAGES).includes(deviceLanguage) 
      ? deviceLanguage 
      : 'en';
    
    // Store the selected language
    await AsyncStorage.setItem('language', language);
    return language;
  } catch (error) {
    console.error('Error getting language:', error);
    return 'en';
  }
};

// Function to set the application language
export const setLanguage = async (language: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem('language', language);
    await i18n.changeLanguage(language);
    return true;
  } catch (error) {
    console.error('Error setting language:', error);
    return false;
  }
};

// Initialize language on app start
export const initializeLanguage = async (): Promise<void> => {
  const language = await getCurrentLanguage();
  await i18n.changeLanguage(language);
};

export default i18n; 