import './App.css'
import Header from './components/Header'
import Navbar from './components/Navbar'
import { DashboardProvider } from './context/DataContext'

function App() {
  return (
    <DashboardProvider>
      <div className="flex flex-col h-screen">
        <div className="flex h-16 ">
          <div className="w-64 flex items-center justify-center ">
            <img
              src="/Logo.png"
              alt="Logo"
              className="w-36 h-auto"/>
          </div>
          <div className="flex-1">
            <Header/>
          </div>
        </div>
        <div className="flex flex-1">
          <div className="w-64">
            <Navbar/>
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}

export default App