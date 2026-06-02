/**
 * Filters.jsx — updated with i18n support
 *
 * Changes from original:
 *  - Filter labels use t() translations
 *  - Sort / performance options use translated strings
 *  - RTL-safe reset button icon
 */

import React, { useMemo } from 'react'
import { useDashboard } from '../context/DataContext'
import MultiSelectDropdown from './MultiSelectDropdown'
import Dropdown from './Dropdown'
import { useI18n } from '../hooks/useI18n'

const Filters = ({
  showMonths      = false,
  showSupervisors = false,
  showPerformance = false,
  showSort        = false,
}) => {
  const { t } = useI18n()

  const {
    data,
    selectedMonths,
    selectedSupervisors,
    setFilters,
    perfPerformance,
    perfSort,
    setPerfFilters,
  } = useDashboard()

  const parseDate = (dateStr) => {
    if (!dateStr) return null
    const parts = String(dateStr).split('/')
    if (parts.length !== 3) return null
    const [month, day, year] = parts
    const fullYear = Number(year) < 100 ? `20${year}` : year
    const d = new Date(fullYear, month - 1, day)
    return isNaN(d.getTime()) ? null : d
  }

  const monthOptions = useMemo(() => {
    if (!data?.length) return []
    const months = data
      .map((row) => {
        const d = parseDate(row.Date)
        if (!d) return null
        return d.toLocaleString('default', { month: 'long', year: 'numeric' })
      })
      .filter(Boolean)
    return [...new Set(months)]
  }, [data])

  const supervisorOptions = useMemo(() =>
    [...new Set(data.map((row) => row.Supervisor).filter(Boolean))],
  [data])

  // Translated option arrays (value → display label)
  const performanceOptions = [
    t('filters.allPerformance'),
    t('filters.aboveAverage'),
    t('filters.belowAverage'),
  ]

  const sortOptions = [
    t('filters.sortName'),
    t('filters.sortTasksDesc'),
    t('filters.sortAvgDesc'),
    t('filters.sortAvgAsc'),
    t('filters.sortDaysDesc'),
  ]

  // Map translated sort labels back to English keys used internally
  const SORT_KEY_MAP = {
    [t('filters.sortName')]:     'Name',
    [t('filters.sortTasksDesc')]: 'Tasks ↓',
    [t('filters.sortAvgDesc')]:  'Avg Productivity ↓',
    [t('filters.sortAvgAsc')]:   'Avg Productivity ↑',
    [t('filters.sortDaysDesc')]: 'Working Days ↓',
  }

  const SORT_LABEL_MAP = {
    'Name':                 t('filters.sortName'),
    'Tasks ↓':              t('filters.sortTasksDesc'),
    'Avg Productivity ↓':   t('filters.sortAvgDesc'),
    'Avg Productivity ↑':   t('filters.sortAvgAsc'),
    'Working Days ↓':       t('filters.sortDaysDesc'),
  }

  const PERF_KEY_MAP = {
    [t('filters.allPerformance')]:  'All Performance',
    [t('filters.aboveAverage')]:    'Above Average',
    [t('filters.belowAverage')]:    'Below Average',
  }

  const PERF_LABEL_MAP = {
    'All Performance': t('filters.allPerformance'),
    'Above Average':   t('filters.aboveAverage'),
    'Below Average':   t('filters.belowAverage'),
  }

  const handleReset = () => {
    setFilters({ months: [], supervisors: [] })
    setPerfFilters({ performance: 'All Performance', sort: 'Name' })
  }

  return (
    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto justify-end items-end">
      {showMonths && (
        <div className="w-full sm:w-auto">
          <MultiSelectDropdown
            label={t('filters.months')}
            options={monthOptions}
            selected={selectedMonths}
            onChange={(vals) => setFilters({ months: vals })}
          />
        </div>
      )}
      {showSupervisors && (
        <div className="w-full sm:w-auto">
          <MultiSelectDropdown
            label={t('filters.supervisors')}
            options={supervisorOptions}
            selected={selectedSupervisors}
            onChange={(vals) => setFilters({ supervisors: vals })}
          />
        </div>
      )}
      {showPerformance && (
        <div className="w-full sm:w-auto">
          <Dropdown
            label={PERF_LABEL_MAP[perfPerformance] ?? perfPerformance}
            options={performanceOptions}
            onSelect={(val) => setPerfFilters({ performance: PERF_KEY_MAP[val] ?? val })}
          />
        </div>
      )}
      {showSort && (
        <div className="w-full sm:w-auto">
          <Dropdown
            label={SORT_LABEL_MAP[perfSort] ?? perfSort}
            options={sortOptions}
            onSelect={(val) => setPerfFilters({ sort: SORT_KEY_MAP[val] ?? val })}
          />
        </div>
      )}

      <button
        onClick={handleReset}
        title={t('header.resetFilters')}
        className="
          col-span-2 sm:col-span-1
          flex items-center justify-center gap-2
          p-2.5 sm:p-1.5
          bg-(--bg-secondary) sm:bg-transparent
          border border-(--border) sm:border-none
          rounded-xl sm:rounded-none
          text-(--primary) cursor-pointer
          hover:opacity-75 transition-all
        "
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
        <span className="sm:hidden text-xs font-semibold">{t('header.resetFilters')}</span>
      </button>
    </div>
  )
}

export default Filters
