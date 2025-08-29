import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';
import itTranslations from './locales/it.json';
import ptTranslations from './locales/pt.json';
import jaTranslations from './locales/ja.json';
import zhTranslations from './locales/zh.json';
import arTranslations from './locales/ar.json';
import hiTranslations from './locales/hi.json';

const resources = {
  en: {
    translation: enTranslations
  },
  es: {
    translation: esTranslations
  },
  fr: {
    translation: frTranslations
  },
  de: {
    translation: deTranslations
  },
  it: {
    translation: itTranslations
  },
  pt: {
    translation: ptTranslations
  },
  ja: {
    translation: jaTranslations
  },
  zh: {
    translation: zhTranslations
  },
  ar: {
    translation: arTranslations
  },
  hi: {
    translation: hiTranslations
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Supported languages
    supportedLngs: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh', 'ar', 'hi'],

    // Language names for UI
    load: 'languageOnly',

    // Default namespace
    defaultNS: 'translation',

    // React i18next options
    react: {
      useSuspense: false,
    },
  });

export default i18n;
