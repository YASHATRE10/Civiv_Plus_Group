import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';
import mr from './mr.json';

const LANGUAGE_STORAGE_KEY = 'civicpulse_language';
const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage || 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'mr'],
    interpolation: {
      escapeValue: false
    }
  });

i18n.on('languageChanged', (lang) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
});

export default i18n;
