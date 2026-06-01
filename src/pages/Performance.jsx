import React, { useState, useMemo } from 'react'
import { useDashboard } from '../context/DataContext'
import LeaderboardTable from '../components/LeaderboardTable'
import Spinner from '../components/Spinner'
import StaffProductivityChart from '../components/charts/StaffProductivityChart'
import SupervisorAvgChart from '../components/charts/SupervisorAvgChart'
import DonutChart from '../components/charts/DonutChart'
import SubSkillBreakdown from '../components/charts/SubSkillBreakdown'
import StaffConsistencyChart from '../components/charts/StaffConsistencyChart'
import TeamLeaderboard from '../components/charts/TeamLeaderboard'
import Dropdown from '../components/Dropdown'

const TABS = [
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'staff',       label: 'Staff Analysis' },
  { id: 'team',        label: 'Team & Skills' },
  { id: 'supervisors', label: 'Supervisors' },
]

const Performance = () => {
  const { perfStats, loading, error,activeTab, setActiveTab } = useDashboard()

  if (loading) return <div className="flex h-full items-center justify-center"><Spinner /></div>
  if (error)   return <p className="p-4 text-red-500">Error: {error}</p>
  if (!perfStats) return null

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
        <LeaderboardTable
          top3={perfStats.top3}
          bottom3={perfStats.bottom3}
          bestSupervisor={perfStats.bestSupervisor}
        />
      )}

      {activeTab === 'staff' && <StaffTab />}

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

const StaffTab = () => {
  const { perfStats, perfPerformance, perfSort, setPerfFilters, activeTab, setActiveTab } = useDashboard()

  const performanceOptions = ['All Performance', 'Above Average', 'Below Average']
  const sortOptions = [
    'Name',
    'Tasks ↓',
    'Avg Productivity ↓',
    'Avg Productivity ↑',
    'Working Days ↓',
  ]

  const filtered = useMemo(() => {
    if (!perfStats?.staffList) return []
    let list = [...perfStats.staffList]

    const overallAvg = list.reduce((s, p) => s + p.avg, 0) / (list.length || 1)

    if (perfPerformance === 'Above Average') {
      list = list.filter((p) => p.avg >= overallAvg)
    } else if (perfPerformance === 'Below Average') {
      list = list.filter((p) => p.avg < overallAvg)
    }

    switch (perfSort) {
      case 'Name':                list.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'Tasks ↓':             list.sort((a, b) => b.total - a.total);            break
      case 'Avg Productivity ↓':  list.sort((a, b) => b.avg - a.avg);               break
      case 'Avg Productivity ↑':  list.sort((a, b) => a.avg - b.avg);               break
      case 'Working Days ↓':      list.sort((a, b) => b.days - a.days);             break
      default: break
    }

    return list
  }, [perfStats, perfPerformance, perfSort])

    return (
    <div className="flex flex-col gap-4">
      {/* no dropdowns here anymore */}
      <StaffProductivityChart overrideList={filtered} />
      <StaffConsistencyChart />
    </div>
  )
}

export default Performance