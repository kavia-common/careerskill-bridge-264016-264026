import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// PUBLIC_INTERFACE
export function initI18n() {
  /**
   * Initialize i18next for multilingual support.
   * Loads resources for English and Spanish and sets a sensible fallback.
   */
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          common: require('./locales/en/common.json'),
        },
        es: {
          common: require('./locales/es/common.json'),
        },
      },
      lng: navigator.language?.startsWith('es') ? 'es' : 'en',
      fallbackLng: 'en',
      ns: ['common'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
}

export default i18n;
