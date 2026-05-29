import { createContext, useContext, useEffect, useState } from "react";
import { loadPublicFile } from "../utils/dataService";

const DataContext = createContext(null);

export function DashboardProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPublicFile("/dashboard_dummy_data.xlsx")
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DataContext);
}