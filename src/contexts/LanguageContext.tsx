import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'es' | 'uk';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language on mount
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es' || savedLanguage === 'uk')) {
          setLanguageState(savedLanguage as Language);
        }
      } catch (error) {
        console.log('Error loading saved language:', error);
      }
    };
    
    loadSavedLanguage();
  }, []);

  useEffect(() => {
    // Update i18n language when language changes
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleSetLanguage = async (newLanguage: Language) => {
    try {
      // Save language to AsyncStorage
      await AsyncStorage.setItem('selectedLanguage', newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.log('Error saving language:', error);
      // Still update the language even if saving fails
      setLanguageState(newLanguage);
    }
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
