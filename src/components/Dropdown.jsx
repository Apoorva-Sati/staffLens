// src/components/Dropdown.jsx
import React, { useState } from 'react'

const Dropdown = ({ label, options, onSelect }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative w-36 shrink-0">

      {/* Trigger button — fixed width, truncate long labels */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-full text-[13px] cursor-pointer bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--border)] whitespace-nowrap overflow-hidden"
      >
        <span className="truncate">{label}</span>
        <svg className="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10"
          />

          {/* Menu */}
          <ul className="absolute top-[calc(100%+6px)] left-0 z-20 m-0 p-1.5 list-none min-w-45 rounded-xl border border-(--border) bg-(--card-bg) shadow-(--shadow)">
            {options.map(opt => (
              <li key={opt}>
                <button
                  onClick={() => { onSelect(opt); setOpen(false) }}
                  className={`w-full text-left px-3 py-2 rounded-lg border-none cursor-pointer text-[13px] transition-colors duration-150
                    ${opt === label
                      ? 'bg-(--primary-dark) text-white'
                      : 'bg-transparent text-(--text-secondary) hover:bg-[#1f1f1f]'
                    }`}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default Dropdown