// src/components/Header.jsx
import { useState } from 'react'
import { useDashboard } from '../context/DataContext'
import { useLocation } from "react-router-dom";
import Filters from "./Filters";
import FileUploadModal from "./FileUploadModal";

const Header = () => {
  const location = useLocation()
  const { activeTab, uploadedDataId } = useDashboard()
  const [showUpload, setShowUpload] = useState(false)

  const isPerformancePage = location.pathname.startsWith('/performance')
  const isDashboardPage   = location.pathname.startsWith('/dashboard')
  const isStaffTab        = isPerformancePage && activeTab === 'staff'

  return (
    <>
      <div className="flex items-center justify-between h-full border-l border-b border-[#2a2a2a] px-4 gap-3">
        <div className="flex-1 min-w-0 text-left">
          <div className="text-lg sm:text-xl md:text-2xl font-bold truncate">
            Productivity Dashboard - AAN
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">

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

        {/* Upload button */}
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
          <span className="hidden sm:inline">Upload</span>

          {/* green dot indicator when custom data is active */}
          {uploadedDataId && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#2ecc71] border-2 border-(--bg-main)" />
          )}
        </button>
      </div>

      {showUpload && (
        <FileUploadModal onClose={() => setShowUpload(false)} />
      )}
    </>
  )
};

export default Header;