// src/pages/Performance.jsx
import React from 'react'
import { useDashboard } from '../context/DataContext'
import PerformanceTable from '../components/PerformanceTable'
import Spinner from '../components/Spinner'

const Performance = () => {
  const { perfStats, loading, error } = useDashboard()

  if (loading) return <div className="flex h-full items-center justify-center"><Spinner /></div>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>
  if (!perfStats) return null

  const { top3, bottom3, bestSupervisor } = perfStats

  return (
    <div className="p-6">
      <PerformanceTable
        top3={top3}
        bottom3={bottom3}
        bestSupervisor={bestSupervisor}
      />
    </div>
  )
}

export default Performance