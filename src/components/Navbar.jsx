import React from 'react'
import { NavLink } from 'react-router-dom'
import { navItems } from '../constants/NavItems'

const Navbar = () => {
  return (
    <div className="flex-1 flex flex-col">
      <nav className="p-3 flex flex-row md:flex-col gap-1 w-full justify-around md:justify-start">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            style={{ textDecoration: 'none' }}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
              transition-colors duration-150 w-full justify-center md:justify-start
              nav-item ${isActive ? 'active' : ''}
            `}
          >
            <span className="nav-icon flex items-center justify-center">{item.icon}</span>
            <span className="md:inline">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Navbar;