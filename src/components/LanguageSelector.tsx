import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/components/ThemedText';
import { useLanguage } from '@src/contexts/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, languages, changeLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">{t('common.language')}</ThemedText>
      <View style={styles.languageButtons}>
        {Object.entries(languages).map(([code, name]) => (
          <TouchableOpacity
            key={code}
            style={[
              styles.languageButton,
              currentLanguage === code && styles.activeLanguage,
            ]}
            onPress={() => changeLanguage(code)}
          >
            <ThemedText
              style={[
                styles.languageText,
                currentLanguage === code && styles.activeLanguageText,
              ]}
            >
              {name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 8,
    backgroundColor: '#f0f0f0',
  },
  activeLanguage: {
    backgroundColor: '#3498db',
  },
  languageText: {
    color: '#333',
  },
  activeLanguageText: {
    color: '#fff',
  },
}); 