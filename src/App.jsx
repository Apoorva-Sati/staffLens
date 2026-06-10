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
      <div className="flex flex-col md:flex-row md:h-screen w-full bg-(--bg-main) text-(--text-main)">

        {/* Desktop-only sidebar */}
        <div className="hidden md:flex md:w-64 flex-col border-r border-(--sidebar-border) bg-(--sidebar-nav-bg) shrink-0">
          <div className="h-16 flex items-center px-6">
            <img src="/Company_LOGO.png" alt="Logo" className="w-40 h-auto" />
          </div>
          <Navbar />
        </div>

        {/* Main column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Mobile-only logo bar */}
          <div className="md:hidden h-16 flex items-center px-6 border-b border-(--sidebar-border) bg-(--sidebar-nav-bg) shrink-0">
            <img src="/Company_LOGO.png" alt="Logo" className="w-32 h-auto" />
          </div>

          {/* Header */}
          <div className="md:min-h-16 border-b border-(--border) bg-(--sidebar-bg)">
            <Header />
          </div>

          {/* Mobile-only navbar — sits below header */}
          <div className="md:hidden border-b border-(--sidebar-border) bg-(--sidebar-nav-bg) shrink-0">
            <Navbar />
          </div>

          {/* Page content */}
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
