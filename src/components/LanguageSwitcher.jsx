import React, { useState } from 'react'
import { useI18n } from '../hooks/useI18n'
import { SUPPORTED_LANGS } from '../i18n/i18n'

// ── Label map ─────────────────────────────────────────────────────────────────
const LANG_LABELS = {
  en: { short: 'EN', native: 'English' },
  ar: { short: 'ع',  native: 'العربية' },
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const GlobeIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2"  y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const ChevronIcon = ({ open }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const LanguageSwitcher = ({ compact = false }) => {
  const { lang, changeLang, t } = useI18n()
  const [open, setOpen] = useState(false)

  const currentLabel = LANG_LABELS[lang] ?? LANG_LABELS.en

  return (
    <div className="relative shrink-0">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t('language.switchLanguage')}
        title={t('language.switchLanguage')}
        className="
          flex items-center gap-1.5
          px-2.5 py-1.5
          rounded-full
          text-[13px] font-semibold
          border border-(--border)
          bg-(--card-bg)
          text-(--text-secondary)
          hover:border-(--primary)
          hover:text-(--primary)
          transition-all duration-200
          cursor-pointer
          select-none
          whitespace-nowrap
        "
      >
        <GlobeIcon />
        <span>{currentLabel.short}</span>
        {!compact && <ChevronIcon open={open} />}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10"
          />

          {/* Menu */}
          <ul
            role="listbox"
            aria-label={t('language.switchLanguage')}
            className="
              absolute top-[calc(100%+6px)]
              end-0
              z-20 m-0 p-1.5 list-none
              min-w-36
              rounded-xl
              border border-(--border)
              bg-(--card-bg)
              shadow-lg
            "
          >
            {SUPPORTED_LANGS.map((code) => {
              const label   = LANG_LABELS[code]
              const active  = code === lang

              return (
                <li key={code} role="option" aria-selected={active}>
                  <button
                    onClick={() => { changeLang(code); setOpen(false) }}
                    className={`
                      w-full flex items-center gap-2.5
                      text-left px-3 py-2
                      rounded-lg border-none cursor-pointer
                      text-[13px] transition-colors duration-150
                      ${active
                        ? 'bg-(--primary-dark) text-white'
                        : 'bg-transparent text-(--text-secondary) hover:bg-[#1f1f1f]'
                      }
                    `}
                  >
                    {/* Language flag emoji */}
                    <span className="text-base leading-none" aria-hidden="true">
                      {code === 'en' ? '🇬🇧' : '🇸🇦'}
                    </span>

                    <span className="flex flex-col leading-tight">
                      <span className="font-semibold">{label.native}</span>
                      <span className="text-[10px] opacity-60 uppercase tracking-wider">
                        {code}
                      </span>
                    </span>

                    {active && (
                      <svg
                        className="ms-auto shrink-0"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}

export default LanguageSwitcher
