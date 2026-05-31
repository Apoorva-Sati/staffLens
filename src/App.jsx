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
      <div className="flex flex-col h-screen">
        <div className="flex h-16">
          <div className="w-64 flex items-center justify-center">
            <img
              src="/Logo.png"
              alt="Logo"
              className="w-40 h-auto"/>
          </div>
          <div className="flex-1">
            <Header/>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64">
            <Navbar/>
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