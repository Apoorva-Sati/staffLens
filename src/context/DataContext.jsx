import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { loadPublicFile } from "../utils/dataService";
import { computeDashboardStats } from "../utils/dashboardStats";
import { computePerformanceStats } from "../utils/performanceStats";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // ── Global filter state ───────────────────────────────────────────
  const [selectedMonths,      setSelectedMonths]      = useState([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);

  // ── Performance page local filters (lifted so Header→Filters can write) ──
  const [perfPerformance, setPerfPerformance] = useState('All Performance');
  const [perfSort,        setPerfSort]        = useState('Name');

  useEffect(() => {
    loadPublicFile("/dashboard_dummy_data.xlsx")
      .then(({ data }) => {
        const normalized = data.map(row => ({
          ...row,
          NAME:       row.NAME?.trim()       || row.NAME,
          Supervisor: row.Supervisor?.trim() || row.Supervisor,
          TEAM:       row.TEAM?.trim()       || row.TEAM,
        }))
        setData(normalized)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = String(dateStr).split("/");
    if (parts.length !== 3) return null;
    const [month, day, year] = parts;
    const fullYear = Number(year) < 100 ? `20${year}` : year;
    const d = new Date(fullYear, month - 1, day);
    return isNaN(d.getTime()) ? null : d;
  };

  const filteredData = useMemo(() => {
    let rows = data;

    if (selectedMonths.length > 0) {
      rows = rows.filter((row) => {
        const d = parseDate(row.Date);
        if (!d) return false;
        const label = d.toLocaleString("default", { month: "long", year: "numeric" });
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

  const rawStats  = useMemo(() => computeDashboardStats(data),         [data]);
  const stats     = useMemo(() => computeDashboardStats(filteredData), [filteredData]);
  const perfStats = useMemo(() => computePerformanceStats(filteredData), [filteredData]);

  const setFilters = useCallback(({ months, supervisors }) => {
    if (months      !== undefined) setSelectedMonths(months);
    if (supervisors !== undefined) setSelectedSupervisors(supervisors);
  }, []);

  const setPerfFilters = useCallback(({ performance, sort }) => {
    if (performance !== undefined) setPerfPerformance(performance);
    if (sort        !== undefined) setPerfSort(sort);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        data,
        filteredData,
        stats,
        perfStats,
        rawStats,
        loading,
        error,
        selectedMonths,
        selectedSupervisors,
        setFilters,
        // performance page filters
        perfPerformance,
        perfSort,
        setPerfFilters,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}