import { useDashboard } from '../context/DataContext'
import { useLocation } from "react-router-dom";
import Filters from "./Filters";

const Header = () => {
  const location = useLocation()
  const { activeTab } = useDashboard()

  const isPerformancePage = location.pathname.startsWith('/performance')
  const isDashboardPage   = location.pathname.startsWith('/dashboard')
  const isStaffTab        = isPerformancePage && activeTab === 'staff'

  return (
    <div className="flex items-center justify-between h-full border-l border-b border-[#2a2a2a] px-4">
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
    </div>
  )
};

export default Header;