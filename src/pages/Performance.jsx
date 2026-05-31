import React, { useState } from 'react'
import { useDashboard } from '../context/DataContext'
import LeaderboardTable from '../components/LeaderboardTable'
import Spinner from '../components/Spinner'
import StaffProductivityChart from '../components/charts/StaffProductivityChart'
import SupervisorAvgChart from '../components/charts/SupervisorAvgChart'
import DonutChart from '../components/charts/DonutChart'
import SubSkillBreakdown from '../components/charts/SubSkillBreakdown'
import StaffConsistencyChart from '../components/charts/StaffConsistencyChart'
import TeamLeaderboard from '../components/charts/TeamLeaderboard'

const Performance = () => {
  const { perfStats, loading, error } = useDashboard()
  const [activeTab, setActiveTab] = useState('leaderboard')
  const TABS = [
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'staff', label: 'Staff Analysis' },
    { id: 'team', label: 'Team & Skills' },
    { id: 'supervisors', label: 'Supervisors' },
  ]

  if (loading) return <div className="flex h-full items-center justify-center"><Spinner /></div>
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>
  if (!perfStats) return null

  const { top3, bottom3, bestSupervisor, allStaffAvg } = perfStats

  return (
    <div className="p-6 flex flex-col gap-4">

<div className="flex gap-1 border-b border-(--border) sticky top-0 z-10 bg-(--bg-main)">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-semibold transition-colors duration-150 border-b-2 -mb-px
            ${activeTab === tab.id
                ? 'border-(--primary) text-(--text-main)'
                : 'border-transparent text-(--text-muted) hover:text-(--text-secondary)'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'leaderboard' && (
        <LeaderboardTable top3={top3} bottom3={bottom3} bestSupervisor={bestSupervisor} />
      )}

      {activeTab === 'staff' && (
        <div className="flex flex-col gap-4">
          <StaffProductivityChart allStaffAvg={allStaffAvg} />
          <StaffConsistencyChart />
        </div>
      )}

      {activeTab === 'team' && (
        <div className="grid grid-cols-2 gap-4 items-start">
          <TeamLeaderboard />
          <SubSkillBreakdown />
        </div>
      )}

      {activeTab === 'supervisors' && (
        <div className="flex flex-col gap-4">
          <SupervisorAvgChart />
          <DonutChart />
        </div>
      )}

    </div>
  )
}

export default Performance