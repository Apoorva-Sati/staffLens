import { useState, useEffect } from 'react'
import { useDashboard } from '../context/DataContext'
import { useLocation } from "react-router-dom";
import Filters from "./Filters";
import FileUploadModal from "./FileUploadModal";

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const Header = () => {
  const location = useLocation()
  const { activeTab, uploadedDataId } = useDashboard()
  const [showUpload, setShowUpload] = useState(false)
  const [isDark, setIsDark] = useState(
    () => (localStorage.getItem('theme') || 'dark') === 'dark'
  )

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [isDark])

  const isPerformancePage = location.pathname.startsWith('/performance')
  const isDashboardPage   = location.pathname.startsWith('/dashboard')
  const isStaffTab        = isPerformancePage && activeTab === 'staff'

  const hasFilters = isPerformancePage || isDashboardPage

  return (
    <>
      <div className="flex flex-col px-4 py-3 gap-2">
        {/* Row 1: title + action buttons — always a single row */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-xl md:text-2xl font-bold truncate text-left tracking-tight text-(--text-main)">
              Productivity Dashboard
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsDark(d => !d)}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="
                flex items-center justify-center w-8 h-8
                rounded-full border border-(--border)
                bg-(--card-bg) text-(--text-muted)
                hover:border-(--primary) hover:text-(--primary)
                transition-all duration-200 shrink-0
              "
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            <button
              onClick={() => setShowUpload(true)}
              title="Upload data file"
              className="
                relative flex items-center gap-2 px-3 py-1.5
                rounded-full text-xs font-semibold
                border transition-all duration-200
                shrink-0
                border-(--primary) text-(--primary)
                hover:bg-(--primary) hover:text-white
              "
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span>Upload</span>

              {uploadedDataId && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-(--color-success) border-2 border-(--bg-main)" />
              )}
            </button>
          </div>
        </div>

        {/* Row 2: filters — only shown on pages that have them */}
        {hasFilters && (
          <div className="flex justify-end">
            {isPerformancePage && (
              <Filters
                showMonths
                showSupervisors
                showPerformance={isStaffTab}
                showSort={isStaffTab}
              />
            )}
            {isDashboardPage && (
              <Filters
                showMonths
                showSupervisors
              />
            )}
          </div>
        )}
      </div>
      {showUpload && (
        <FileUploadModal onClose={() => setShowUpload(false)} />
      )}
    </>
  )
};

export default Header;
