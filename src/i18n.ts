import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from './locales/en/translation.json'
import guTranslation from './locales/gu/translation.json'

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            gu: { translation: guTranslation },
        },
        fallbackLng: 'en', // Default language if browser language isn't available
        interpolation: {
            escapeValue: false, // React already escapes values to prevent XSS
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'], // Caches selected language in localStorage
        },
    })

export default i18n