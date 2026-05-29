import React, { useState } from 'react'

const navItems = [
  {
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: 'Performance',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
]

const Navbar = () => {
  const [active, setActive] = useState('Dashboard')

  return (
    <div className="sidebar">

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActive(item.label)}
            className={`nav-item ${active === item.label ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            <span className="nav-dot" />
          </button>
        ))}
      </nav>

      {/* Bottom user card */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">A</div>
          <div>
            <p className="user-name">Admin</p>
            <p className="user-email">admin@etisalat.com</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Navbar