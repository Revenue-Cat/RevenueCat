import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import en from './locales/en.json';
import es from './locales/es.json';
import uk from './locales/uk.json';

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
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    compatibilityJSON: 'v3', // For React Native compatibility
  });

export default i18n; 