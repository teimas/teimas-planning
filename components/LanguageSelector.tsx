import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/components/ThemedText';

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          i18n.language === 'en' && styles.activeButton
        ]}
        onPress={() => changeLanguage('en')}
      >
        <ThemedText style={styles.text}>EN</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          i18n.language === 'es' && styles.activeButton
        ]}
        onPress={() => changeLanguage('es')}
      >
        <ThemedText style={styles.text}>ES</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 