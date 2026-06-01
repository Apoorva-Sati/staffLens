import React from "react";
import { useLocation } from "react-router-dom";
import Filters from "./Filters";

const Header = () => {
  const location = useLocation();

  const pathname = location.pathname;

  // FILTER VISIBILITY
const isPerformancePage = pathname.startsWith('/performance')
const isDashboardPage = pathname.startsWith('/dashboard')
console.log('Current Path:', pathname)

  return (
    <div className="flex items-center justify-between h-full border-l border-b border-[#2a2a2a] px-4">

      {/* TITLE */}
      <div className="flex-1 min-w-0 text-left">
        <div
          className="text-lg sm:text-xl md:text-2xl font-bold truncate"
          title="Productivity Dashboard - AAN"
        >
          Productivity Dashboard - AAN
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">

{isPerformancePage && (
  <Filters
    showMonths
    showSupervisors
    showPerformance
    showSort
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
  );
};

export default Header;