/**
 * Navbar.jsx — updated with i18n support
 *
 * Changes from original:
 *  - Nav item labels translated via t()
 *  - RTL-safe icon alignment (icons always on start side)
 */

import React from 'react'
import { NavLink } from 'react-router-dom'
import { useT } from '../hooks/useI18n'

// Icons are defined inline so we can keep them decoupled from translation keys
const NAV_ITEMS = [
  {
    key: 'nav.dashboard',
    path: '/dashboard',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3"  y="3"  width="7" height="7" />
        <rect x="14" y="3"  width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3"  y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    key: 'nav.performance',
    path: '/performance',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
]

const Navbar = () => {
  const t = useT()

  return (
    <div className="flex-1 flex flex-col">
      <nav className="p-3 flex flex-row md:flex-col gap-1 w-full justify-around md:justify-start">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            style={{ textDecoration: 'none' }}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
              transition-colors duration-150 w-full justify-center md:justify-start
              nav-item ${isActive ? 'active' : ''}
            `}
          >
            <span className="nav-icon flex items-center justify-center">
              {item.icon}
            </span>
            <span className="md:inline">{t(item.key)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Navbar
