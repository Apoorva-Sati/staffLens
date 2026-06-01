// src/context/DataContext.jsx
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { loadPublicFile } from "../utils/dataService";
import { computeDashboardStats } from "../utils/dashboardStats";
import { computePerformanceStats } from "../utils/performanceStats";
import { getUploadHistory } from "../utils/uploadHistory";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [publicData, setPublicData]   = useState([]);
  const [uploadedData, _setUploadedData] = useState(null);  // null = use public
  const [uploadedDataId, setUploadedDataId] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // ── Global filter state ────────────────────────────────────────────────────
  const [selectedMonths, setSelectedMonths]         = useState([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
  const [activeTab, setActiveTab]                   = useState('leaderboard');

  // ── Performance page local filters ────────────────────────────────────────
  const [perfPerformance, setPerfPerformance] = useState('All Performance');
  const [perfSort, setPerfSort]               = useState('Name');

  // ── Load public file on mount ─────────────────────────────────────────────
  useEffect(() => {
    loadPublicFile("/dashboard_dummy_data.xlsx")
      .then(({ data }) => {
        const normalized = data.map(row => ({
          ...row,
          NAME:       row.NAME?.trim()       || row.NAME,
          Supervisor: row.Supervisor?.trim() || row.Supervisor,
          TEAM:       row.TEAM?.trim()       || row.TEAM,
        }));
        setPublicData(normalized);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Restore last upload session ───────────────────────────────────────────
  // On first load, if history exists, re-hydrate the latest upload automatically
  useEffect(() => {
    const history = getUploadHistory();
    if (history.length > 0) {
      const latest = history[0];
      _setUploadedData(latest.data);
      setUploadedDataId(latest.id);
    }
  }, []);

  // ── Exposed setter for the upload modal ───────────────────────────────────
  const setUploadedData = useCallback((data, id) => {
    _setUploadedData(data);
    setUploadedDataId(id);
    // Reset filters when data source changes
    setSelectedMonths([]);
    setSelectedSupervisors([]);
  }, []);

  // ── Active data: uploaded overrides public ────────────────────────────────
  const data = useMemo(
    () => uploadedData ?? publicData,
    [uploadedData, publicData]
  );

  // ── Date parser ───────────────────────────────────────────────────────────
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = String(dateStr).split("/");
    if (parts.length !== 3) return null;
    const [month, day, year] = parts;
    const fullYear = Number(year) < 100 ? `20${year}` : year;
    const d = new Date(fullYear, month - 1, day);
    return isNaN(d.getTime()) ? null : d;
  };

  // ── Filtered data ─────────────────────────────────────────────────────────
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

  // ── Stats ─────────────────────────────────────────────────────────────────
  const rawStats  = useMemo(() => computeDashboardStats(data),         [data]);
  const stats     = useMemo(() => computeDashboardStats(filteredData), [filteredData]);
  const perfStats = useMemo(() => computePerformanceStats(filteredData), [filteredData]);

  // ── Filter setters ────────────────────────────────────────────────────────
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
        perfPerformance,
        perfSort,
        setPerfFilters,
        activeTab,
        setActiveTab,
        // upload-related
        uploadedData,
        uploadedDataId,
        setUploadedData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}