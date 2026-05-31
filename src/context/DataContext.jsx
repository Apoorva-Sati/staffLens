import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { loadPublicFile } from "../utils/dataService";
import { computeDashboardStats } from "../utils/dashboardStats";
import { computePerformanceStats } from "../utils/performanceStats";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    loadPublicFile("/dashboard_dummy_data.xlsx")
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Compute once when data loads — available to all components
  const stats = useMemo(() => computeDashboardStats(data), [data]);
  const perfStats   = useMemo(() => computePerformanceStats(data), [data]);

  return (
    <DashboardContext.Provider value={{ data, stats, perfStats, loading, error }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}