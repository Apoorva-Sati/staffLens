import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { isRTL as checkRTL, SUPPORTED_LANGS, applyLangAttributes } from '../i18n/i18n'

// ─────────────────────────────────────────────────────────────────────────────
// Primary hook
// ─────────────────────────────────────────────────────────────────────────────

export function useI18n() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) ?? 'en'
  const rtl  = checkRTL(lang)
  const dir  = rtl ? 'rtl' : 'ltr'

  /** Switch language and persist to localStorage */
  const changeLang = useCallback(
    (/** @type {string} */ nextLang) => {
      if (!SUPPORTED_LANGS.includes(nextLang)) return
      i18n.changeLanguage(nextLang)
      applyLangAttributes(nextLang)
    },
    [i18n]
  )

  /**
   * Format a date string (e.g. "1/15/25") to a locale-aware display string.
   * Falls back gracefully if the date is unparseable.
   *
   * @param {string|Date} dateInput
   * @param {Intl.DateTimeFormatOptions} [options]
   */
  const formatDate = useCallback(
    (dateInput, options = { day: '2-digit', month: 'short' }) => {
      try {
        const date =
          dateInput instanceof Date ? dateInput : new Date(dateInput)
        if (isNaN(date.getTime())) return String(dateInput)
        const locale = lang === 'ar' ? 'ar-SA' : 'en-IN'
        return date.toLocaleDateString(locale, options)
      } catch {
        return String(dateInput)
      }
    },
    [lang]
  )

  /**
   * Format a timestamp (ms) to a locale-aware date+time string.
   * Used in the upload history list.
   */
  const formatDateTime = useCallback(
    (/** @type {number} */ ts) => {
      try {
        const locale = lang === 'ar' ? 'ar-SA' : 'en-IN'
        return new Date(ts).toLocaleString(locale, {
          day:    '2-digit',
          month:  'short',
          year:   'numeric',
          hour:   '2-digit',
          minute: '2-digit',
        })
      } catch {
        return String(ts)
      }
    },
    [lang]
  )

  /**
   * Format a number with locale-appropriate digit grouping.
   *
   * @param {number} num
   * @param {Intl.NumberFormatOptions} [options]
   */
  const formatNumber = useCallback(
    (num, options = {}) => {
      try {
        const locale = lang === 'ar' ? 'ar-SA' : 'en-IN'
        // Always use Western Arabic numerals (arabic-numerals) for clarity
        return new Intl.NumberFormat(locale, {
          numberingSystem: 'latn',
          ...options,
        }).format(num)
      } catch {
        return String(num)
      }
    },
    [lang]
  )

  return {
    t,
    lang,
    dir,
    isRTL: rtl,
    changeLang,
    formatDate,
    formatDateTime,
    formatNumber,
    i18n,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Narrow hooks (import only what you need)
// ─────────────────────────────────────────────────────────────────────────────

/** Returns only the translator function */
export function useT() {
  const { t } = useTranslation()
  return t
}

/** Returns { lang, isRTL, dir } — useful for layout / styling */
export function useDir() {
  const { i18n } = useTranslation()
  const lang = i18n.language?.slice(0, 2) ?? 'en'
  const rtl  = checkRTL(lang)
  return { lang, isRTL: rtl, dir: rtl ? 'rtl' : 'ltr' }
}
