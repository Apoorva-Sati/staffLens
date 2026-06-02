import React, { useMemo } from 'react'
import { useDashboard } from '../context/DataContext'
import MultiSelectDropdown from './MultiSelectDropdown'
import Dropdown from './Dropdown'

const Filters = ({
  showMonths      = false,
  showSupervisors = false,
  showPerformance = false,
  showSort        = false,
}) => {
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

  const performanceOptions = ['All Performance', 'Above Average', 'Below Average']
  const sortOptions = [
    'Name',
    'Tasks ↓',
    'Avg Productivity ↓',
    'Avg Productivity ↑',
    'Working Days ↓',
  ]

  const handleReset = () => {
    setFilters({ months: [], supervisors: [] })
    setPerfFilters({ performance: 'All Performance', sort: 'Name' })
  }

  return (
    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto justify-end items-end">
      {showMonths && (
        <div className="w-full sm:w-auto">
          <MultiSelectDropdown
            label="Months"
            options={monthOptions}
            selected={selectedMonths}
            onChange={(vals) => setFilters({ months: vals })}
          />
        </div>
      )}
      {showSupervisors && (
        <div className="w-full sm:w-auto">
          <MultiSelectDropdown
            label="Supervisors"
            options={supervisorOptions}
            selected={selectedSupervisors}
            onChange={(vals) => setFilters({ supervisors: vals })}
          />
        </div>
      )}
      {showPerformance && (
        <div className="w-full sm:w-auto">
          <Dropdown
            label={perfPerformance}
            options={performanceOptions}
            onSelect={(val) => setPerfFilters({ performance: val })}
          />
        </div>
      )}

      {showSort && (
        <div className="w-full sm:w-auto">
          <Dropdown
            label={perfSort}
            options={sortOptions}
            onSelect={(val) => setPerfFilters({ sort: val })}
          />
        </div>
      )}
      <button
        onClick={handleReset}
        title="Reset filters"
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10"/>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
        <span className="sm:hidden text-xs font-semibold">Reset Filters</span>
      </button>
    </div>
  )
}

export default Filters