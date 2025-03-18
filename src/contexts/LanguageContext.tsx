import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { initializeLanguage, getCurrentLanguage, setLanguage, LANGUAGES } from '@src/i18n';

// Define the context type
interface LanguageContextType {
  currentLanguage: string;
  languages: Record<string, string>;
  changeLanguage: (language: string) => Promise<void>;
  isLoading: boolean;
}

// Create the context with default values
export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  languages: LANGUAGES,
  changeLanguage: async () => {},
  isLoading: true,
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

// Provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize the language on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeLanguage();
        const language = await getCurrentLanguage();
        setCurrentLanguage(language);
      } catch (error) {
        console.error('Error initializing language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Function to change the language
  const changeLanguage = async (language: string) => {
    try {
      const success = await setLanguage(language);
      if (success) {
        setCurrentLanguage(language);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        languages: LANGUAGES,
        changeLanguage,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}; 