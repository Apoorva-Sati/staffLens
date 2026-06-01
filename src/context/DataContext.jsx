import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { loadPublicFile } from "../utils/dataService";
import { computeDashboardStats } from "../utils/dashboardStats";
import { computePerformanceStats } from "../utils/performanceStats";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // ── Filter state ──────────────────────────────────────────────────
  const [selectedMonths,      setSelectedMonths]      = useState([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);

  useEffect(() => {
    loadPublicFile("/dashboard_dummy_data.xlsx")
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Date parser (matches Filters.jsx MM/DD/YY logic) ─────────────
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = String(dateStr).split("/");
    if (parts.length !== 3) return null;
    const [month, day, year] = parts;
    const fullYear = Number(year) < 100 ? `20${year}` : year;
    const d = new Date(fullYear, month - 1, day);
    return isNaN(d.getTime()) ? null : d;
  };

  // ── Filtered data (drives everything else) ────────────────────────
  const filteredData = useMemo(() => {
    let rows = data;

    if (selectedMonths.length > 0) {
      rows = rows.filter((row) => {
        const d = parseDate(row.Date);
        if (!d) return false;
        const label = d.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        return selectedMonths.includes(label);
      });
    }

    if (selectedSupervisors.length > 0) {
      rows = rows.filter((row) =>
        selectedSupervisors.includes(row.Supervisor?.trim())
      );
    }

    return rows;
  }, [data, selectedMonths, selectedSupervisors]);

  // ── Stats recompute on filteredData ───────────────────────────────
  const stats     = useMemo(() => computeDashboardStats(filteredData),    [filteredData]);
  const perfStats = useMemo(() => computePerformanceStats(filteredData),  [filteredData]);

  // ── Setters exposed to Filters ────────────────────────────────────
  const setFilters = useCallback(({ months, supervisors }) => {
    if (months      !== undefined) setSelectedMonths(months);
    if (supervisors !== undefined) setSelectedSupervisors(supervisors);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        data,          
        filteredData,  
        stats,
        perfStats,
        loading,
        error,
        selectedMonths,
        selectedSupervisors,
        setFilters,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}