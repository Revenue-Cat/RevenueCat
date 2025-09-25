import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getSystemLanguageSync } from '../utils/languageUtils';

// Import translations
import en from './locales/en.json';
import es from './locales/es.json';
import uk from './locales/uk.json';
import fr from './locales/fr.json';

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  uk: {
    translation: uk,
  },
  fr: {
    translation: fr,
  },
};

// Get system language as default
const systemLanguage = getSystemLanguageSync();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: systemLanguage, // Use system language as default
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    compatibilityJSON: 'v4', // For React Native compatibility
  });

export default i18n; 