const STORAGE_KEY = 'dashboard_upload_history'
const MAX_HISTORY = 5

/**
 * @typedef {Object} UploadEntry
 * @property {string} id          - Unique ID
 * @property {string} fileName    - Original file name
 * @property {number} timestamp   - Unix ms
 * @property {Object[]} data      - Parsed row data
 */

/** Load all stored entries (newest first) */
export function getUploadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

/** Save a new entry, evicting oldest if over MAX_HISTORY */
export function saveUploadEntry(fileName, data) {
  const history = getUploadHistory()

  const entry = {
    id: `upload_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    fileName,
    timestamp: Date.now(),
    data,
  }

  // Newest first, cap at MAX_HISTORY
  const updated = [entry, ...history].slice(0, MAX_HISTORY)

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (e) {
    // localStorage quota exceeded – drop the oldest and retry
    const trimmed = [entry, ...history].slice(0, MAX_HISTORY - 1)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    } catch {
      console.warn('uploadHistory: could not persist entry (storage full)')
    }
  }

  return entry
}

/** Remove a single entry by id */
export function deleteUploadEntry(id) {
  const history = getUploadHistory().filter((e) => e.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

/** Clear all history */
export function clearUploadHistory() {
  localStorage.removeItem(STORAGE_KEY)
}