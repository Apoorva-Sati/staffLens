import "./App.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import { DashboardProvider } from "./context/DataContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PerformanceReport from "./pages/Performance";

function App() {
  return (
    <DashboardProvider>
      <div className="flex flex-col md:flex-row md:h-screen w-full bg-(--bg-main) text-white">
        <div className="w-full md:w-64 flex flex-col border-b md:border-b-0 md:border-r border-(--border) shrink-0">
          <div className="h-16 flex items-center px-6 justify-between md:justify-start ">
            <img
              src="/Company_LOGO.png"
              alt="Logo"
              className="w-32 md:w-40 h-auto"
            />
          </div>
          <Navbar />
        </div>
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="md:h-16 border-b border-(--border)">
            <Header />
          </div>
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/performance" element={<PerformanceReport />} />
            </Routes>
          </div>
        </div>

      </div>
    </DashboardProvider>
  );
}

export default App;