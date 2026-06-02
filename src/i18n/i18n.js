import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from '../locales/en/translation.json'
import ar from '../locales/ar/translation.json'

// ── Supported locales ──────────────────────────────────────────────────────
export const SUPPORTED_LANGS = /** @type {const} */ (['en', 'ar'])
export const DEFAULT_LANG    = 'en'
export const RTL_LANGS       = new Set(['ar'])

/** Returns true when the given language code is RTL */
export const isRTL = (/** @type {string} */ lang) => RTL_LANGS.has(lang)

// ── Apply direction + font to <html> ──────────────────────────────────────
export function applyLangAttributes(lang = DEFAULT_LANG) {
  const dir = isRTL(lang) ? 'rtl' : 'ltr'
  document.documentElement.setAttribute('lang', lang)
  document.documentElement.setAttribute('dir',  dir)
  document.documentElement.style.fontFamily = isRTL(lang)
    ? "'Cairo', 'Noto Sans Arabic', sans-serif"
    : "'Inter', sans-serif"
}

// ── i18next init ──────────────────────────────────────────────────────────
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },

    // Language detection order: localStorage → navigator → fallback
    detection: {
      order:         ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18n_lang',
      caches:        ['localStorage'],
    },

    lng:         undefined,      // let detector decide
    fallbackLng: DEFAULT_LANG,
    supportedLngs: SUPPORTED_LANGS,

    interpolation: {
      escapeValue: false,          // React already escapes
    },

    // No need for Suspense — bundles are bundled inline
    react: {
      useSuspense: false,
    },
  })

// ── Sync direction whenever language changes ──────────────────────────────
i18n.on('languageChanged', applyLangAttributes)

// Apply once immediately so first render is correct
applyLangAttributes(i18n.language)

export default i18n
