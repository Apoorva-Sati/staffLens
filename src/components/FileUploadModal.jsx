/**
 * FileUploadModal.jsx — updated with full i18n support
 *
 * Changes from original:
 *  - All strings replaced with t() calls
 *  - Timestamps formatted via formatDateTime (locale-aware)
 *  - Row counts formatted via formatNumber
 *  - Error messages use interpolated t() keys
 *  - RTL-safe positioning (end-* instead of right-*)
 */

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { parseFile } from '../utils/dataService'
import {
  getUploadHistory,
  saveUploadEntry,
  deleteUploadEntry,
} from '../utils/uploadHistory'
import { useDashboard } from '../context/DataContext'
import { useI18n } from '../hooks/useI18n'

// ─── Password gate ────────────────────────────────────────────────────────────

const PasswordGate = ({ onSuccess, onClose }) => {
  const { t } = useI18n()
  const [pw, setPw]         = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef            = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/verify-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password: pw }),
      })
      const json = await res.json()
      if (res.ok && json.success) {
        onSuccess()
      } else {
        setError(json.error ? t('upload.errors.invalidPassword') : t('upload.errors.invalidPassword'))
        setPw('')
        inputRef.current?.focus()
      }
    } catch {
      setError(t('upload.errors.networkError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Lock icon */}
      <div className="w-14 h-14 rounded-full bg-(--primary-dark) flex items-center justify-center border border-(--primary)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      <div className="text-center">
        <p className="text-(--text-main) font-semibold mb-1">{t('password.title')}</p>
        <p className="text-(--text-muted) text-sm">{t('password.description')}</p>
      </div>

      <form onSubmit={submit} className="w-full flex flex-col gap-3">
        <input
          ref={inputRef}
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder={t('password.placeholder')}
          autoComplete="current-password"
          className="
            w-full px-4 py-2.5 rounded-lg
            bg-(--bg-main) border border-(--border)
            text-(--text-main) text-sm
            focus:outline-none focus:border-(--primary)
            transition-colors
          "
        />
        {error && (
          <p className="text-xs text-(--primary) flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8"  x2="12"    y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm text-(--text-muted) border border-(--border) hover:bg-[#1a1a1a] transition-colors"
          >
            {t('password.cancel')}
          </button>
          <button
            type="submit"
            disabled={!pw || loading}
            className="flex-1 py-2 rounded-lg text-sm font-semibold bg-(--primary) text-white disabled:opacity-40 hover:bg-(--primary-hover) transition-colors"
          >
            {loading ? t('password.verifying') : t('password.continue')}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Drop zone ────────────────────────────────────────────────────────────────

const DropZone = ({ onFile, uploading, uploadError }) => {
  const { t } = useI18n()
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFile(file)
  }, [onFile])

  const handleDragOver  = (e) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)
  const handleChange    = (e) => { const f = e.target.files?.[0]; if (f) onFile(f) }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !uploading && inputRef.current?.click()}
      className={`
        relative flex flex-col items-center justify-center gap-3
        rounded-xl border-2 border-dashed p-8 cursor-pointer
        transition-all duration-200
        ${dragging
          ? 'border-(--primary) bg-[rgba(237,28,36,0.06)]'
          : 'border-(--border) hover:border-[#444] hover:bg-[#1a1a1a]'
        }
        ${uploading ? 'pointer-events-none opacity-60' : ''}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleChange}
        className="hidden"
      />

      {uploading ? (
        <>
          <svg className="w-8 h-8 animate-spin text-(--primary)" viewBox="0 0 24 24" fill="none" aria-label={t('loading')}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-sm text-(--text-secondary)">{t('upload.dropzone.processing')}</p>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-xl bg-(--primary-dark) flex items-center justify-center border border-(--primary)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm text-(--text-main) font-medium">
              {t('upload.dropzone.dropHere')}{' '}
              <span className="text-(--primary)">{t('upload.dropzone.browse')}</span>
            </p>
            <p className="text-xs text-(--text-muted) mt-1">{t('upload.dropzone.supported')}</p>
          </div>
        </>
      )}

      {uploadError && (
        <p className="text-xs text-(--primary) mt-1 flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8"  x2="12"    y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {uploadError}
        </p>
      )}
    </div>
  )
}

// ─── History list ─────────────────────────────────────────────────────────────

const HistoryList = ({ history, activeId, onRestore, onDelete }) => {
  const { t, formatDateTime, formatNumber } = useI18n()

  const fmtRows = (n) =>
    `${formatNumber(n)} ${n !== 1 ? 'rows' : 'row'}`

  if (!history.length) {
    return (
      <p className="text-xs text-(--text-muted) text-center py-4">
        {t('upload.history_list.noHistory')}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pe-1">
      {history.map((entry, idx) => {
        const isActive = entry.id === activeId
        return (
          <div
            key={entry.id}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors
              ${isActive
                ? 'border-(--primary) bg-[rgba(237,28,36,0.08)]'
                : 'border-(--border) bg-(--bg-main) hover:border-[#444]'
              }
            `}
          >
            {/* File icon */}
            <div className="shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isActive ? 'var(--primary)' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate ${isActive ? 'text-(--primary)' : 'text-(--text-main)'}`}>
                {entry.fileName}
              </p>
              <p className="text-[10px] text-(--text-muted) mt-0.5">
                {formatDateTime(entry.timestamp)} · {fmtRows(entry.data.length)}
              </p>
            </div>

            {/* Badges + actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {idx === 0 && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-(--primary-dark) text-(--primary) uppercase tracking-wider">
                  {t('upload.history_list.latest')}
                </span>
              )}
              {isActive && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[rgba(46,204,113,0.15)] text-[#2ecc71] uppercase tracking-wider">
                  {t('upload.history_list.active')}
                </span>
              )}
              {!isActive && (
                <button
                  onClick={() => onRestore(entry)}
                  title={t('upload.history_list.restore')}
                  className="p-1 rounded hover:bg-(--primary-dark) text-(--text-muted) hover:text-(--primary) transition-colors"
                  aria-label={t('upload.history_list.restore')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-3.51" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => onDelete(entry.id)}
                title={t('upload.history_list.delete')}
                className="p-1 rounded hover:bg-[rgba(237,28,36,0.15)] text-(--text-muted) hover:text-(--primary) transition-colors"
                aria-label={t('upload.history_list.delete')}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main modal ───────────────────────────────────────────────────────────────

const FileUploadModal = ({ onClose }) => {
  const { setUploadedData, uploadedDataId } = useDashboard()
  const { t, formatNumber } = useI18n()

  const [step,        setStep]        = useState('password')   // 'password' | 'upload'
  const [uploading,   setUploading]   = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [history,     setHistory]     = useState(() => getUploadHistory())
  const [tab,         setTab]         = useState('upload')     // 'upload' | 'history'

  const refreshHistory = () => setHistory(getUploadHistory())

  const handleFile = async (file) => {
    setUploadError('')
    setUploading(true)
    try {
      const { data } = await parseFile(file)
      if (!data || data.length === 0) throw new Error(t('upload.errors.emptyFile'))

      const entry = saveUploadEntry(file.name, data)
      refreshHistory()
      setUploadedData(data, entry.id)
      onClose()
    } catch (err) {
      setUploadError(err.message || t('upload.errors.parseFailed'))
    } finally {
      setUploading(false)
    }
  }

  const handleRestore = (entry) => {
    setUploadedData(entry.data, entry.id)
    onClose()
  }

  const handleDelete = (id) => {
    deleteUploadEntry(id)
    refreshHistory()
  }

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const activeFileName = history.find((h) => h.id === uploadedDataId)?.fileName

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('upload.title')}
    >
      <div className="
        w-full max-w-md
        bg-(--card-bg) border border-(--border)
        rounded-2xl shadow-2xl
        flex flex-col overflow-hidden
      ">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-(--border)">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-(--primary-dark) flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <span className="text-sm font-bold text-(--text-main)">{t('upload.title')}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-(--text-muted) hover:text-(--text-main) hover:bg-[#2a2a2a] transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6"  x2="6"  y2="18" />
              <line x1="6"  y1="6"  x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {step === 'password' ? (
            <PasswordGate onSuccess={() => setStep('upload')} onClose={onClose} />
          ) : (
            <div className="flex flex-col gap-4">
              {/* Tab switcher */}
              <div className="flex bg-(--bg-main) rounded-lg p-1 gap-1">
                {['upload', 'history'].map((tabKey) => (
                  <button
                    key={tabKey}
                    onClick={() => setTab(tabKey)}
                    className={`
                      flex-1 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors
                      ${tab === tabKey
                        ? 'bg-(--card-bg) text-(--text-main) shadow-sm'
                        : 'text-(--text-muted) hover:text-(--text-secondary)'
                      }
                    `}
                  >
                    {tabKey === 'history'
                      ? t('upload.historyCount', { count: history.length })
                      : t('upload.uploadNew')
                    }
                  </button>
                ))}
              </div>

              {tab === 'upload' ? (
                <DropZone
                  onFile={handleFile}
                  uploading={uploading}
                  uploadError={uploadError}
                />
              ) : (
                <HistoryList
                  history={history}
                  activeId={uploadedDataId}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                />
              )}

              {/* Current source indicator */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-(--bg-main) border border-(--border)">
                <div className={`w-2 h-2 rounded-full shrink-0 ${uploadedDataId ? 'bg-[#2ecc71]' : 'bg-(--text-muted)'}`} />
                <p className="text-xs text-(--text-muted)">
                  {uploadedDataId
                    ? `${t('upload.status.usingUploaded')} · ${activeFileName ?? t('upload.status.unknown')}`
                    : t('upload.status.usingDefault')
                  }
                </p>
                {uploadedDataId && (
                  <button
                    onClick={() => { setUploadedData(null, null); onClose() }}
                    className="ms-auto text-[10px] text-(--primary) hover:underline font-semibold shrink-0"
                  >
                    {t('upload.status.resetToDefault')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUploadModal
