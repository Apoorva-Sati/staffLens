import React, { useState } from 'react'
import { useDashboard } from '../context/DataContext'
import Dropdown from './Dropdown'

const Filters = ({ onFilterChange }) => {
  const { data } = useDashboard()

  const [month, setMonth]      = useState('All Months')
  const [supervisor, setSup]   = useState('All Supervisors')
  const [performance, setPerf] = useState('All Performance')
  const [sort, setSort]        = useState('Avg Productivity ↓')

  const parseDate = (dateStr) => {
  if (!dateStr) return null

  const [day, month, year] = dateStr.split('-')

  const d = new Date(year, month - 1, day)

  return isNaN(d.getTime()) ? null : d
}

  const months = ['All Months', ...new Set(
    data.map(row => {
      if (!row.Date) return null
      const d = new Date(row.Date)
      return isNaN(d) ? null : d.toLocaleString('default', { month: 'long', year: 'numeric' })
    }).filter(Boolean)
  )]

  const supervisors  = ['All Supervisors', ...new Set(data.map(row => row.Supervisor).filter(Boolean))]
  const performances = ['All Performance', 'Above Average', 'Below Average']
  const sorts        = ['Name', 'Tasks ↓', 'Avg Productivity ↓', 'Avg Productivity ↑', 'Working Days ↓']

  const notify = (updates) => {
    onFilterChange?.({ month, supervisor, performance, sort, ...updates })
  }

  const handleMonth = (val) => { setMonth(val);  notify({ month: val }) }
  const handleSup   = (val) => { setSup(val);    notify({ supervisor: val }) }
  const handlePerf  = (val) => { setPerf(val);   notify({ performance: val }) }
  const handleSort  = (val) => { setSort(val);   notify({ sort: val }) }

  const handleReload = () => {
    setMonth('All Months')
    setSup('All Supervisors')
    setPerf('All Performance')
    setSort('Avg Productivity ↓')
    notify({ month: 'All Months', supervisor: 'All Supervisors', performance: 'All Performance', sort: 'Avg Productivity ↓' })
  }

  return (
    <div className="flex items-center gap-2 flex-wrap justify-end">

      <Dropdown label={month}       options={months}       onSelect={handleMonth} />
      <Dropdown label={supervisor}  options={supervisors}  onSelect={handleSup} />
      <Dropdown label={performance} options={performances} onSelect={handlePerf} />
      <Dropdown label={sort}        options={sorts}        onSelect={handleSort} />

      {/* Reload */}
      <button
        onClick={handleReload}
        title="Reset filters"
        className="flex items-center p-1.5 bg-transparent border-none text-[var(--primary)] cursor-pointer hover:opacity-75 transition-opacity"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
      </button>

      {/* Print */}
      <button
        onClick={() => window.print()}
        title="Print"
        className="flex items-center p-1.5 bg-transparent border-none cursor-pointer hover:opacity-75 transition-opacity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-[18px] h-[18px] fill-[var(--primary)]">
          <path d="M128 128C128 92.7 156.7 64 192 64L405.5 64C422.5 64 438.8 70.7 450.8 82.7L493.3 125.2C505.3 137.2 512 153.5 512 170.5L512 208L128 208L128 128zM64 320C64 284.7 92.7 256 128 256L512 256C547.3 256 576 284.7 576 320L576 416C576 433.7 561.7 448 544 448L512 448L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 448L96 448C78.3 448 64 433.7 64 416L64 320zM192 480L192 512L448 512L448 416L192 416L192 480zM520 336C520 322.7 509.3 312 496 312C482.7 312 472 322.7 472 336C472 349.3 482.7 360 496 360C509.3 360 520 349.3 520 336z"/>
        </svg>
      </button>

    </div>
  )
}

export default Filters