/**
 * Performance.jsx — updated with i18n support
 *
 * Changes from original:
 *  - Tab labels use t('tabs.*')
 *  - Loading / error strings use t()
 *  - Sort & performance options are translated
 */

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
import { useI18n } from '../hooks/useI18n'

const Performance = () => {
  const { perfStats, loading, error, activeTab, setActiveTab } = useDashboard()
  const { t } = useI18n()

  const TABS = [
    { id: 'leaderboard', label: t('tabs.leaderboard') },
    { id: 'staff',       label: t('tabs.staff') },
    { id: 'team',        label: t('tabs.team') },
    { id: 'supervisors', label: t('tabs.supervisors') },
  ]

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
        <span className="ms-2 text-sm text-(--text-muted)">{t('loading')}</span>
      </div>
    )
  }
  if (error) return <p className="p-4 text-red-500">{t('error', { message: error })}</p>
  if (!perfStats) return null

  return (
    <div className="p-4 md:p-6 flex flex-col gap-4 w-full min-w-0">
      {/* Tab bar */}
      <div className="w-full border-b border-(--border) sticky top-0 z-10 bg-(--bg-main)">
        <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap no-scrollbar md:overflow-visible">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-5 py-2.5 text-sm font-semibold transition-colors duration-150
                border-b-2 -mb-px shrink-0
                ${activeTab === tab.id
                  ? 'border-(--primary) text-(--text-main)'
                  : 'border-transparent text-(--text-muted) hover:text-(--text-secondary)'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start w-full">
          <TeamLeaderboard />
          <SubSkillBreakdown />
        </div>
      )}

      {activeTab === 'supervisors' && (
        <div className="flex flex-col gap-4 w-full">
          <SupervisorAvgChart />
          <DonutChart />
        </div>
      )}
    </div>
  )
}

// ── Staff tab ─────────────────────────────────────────────────────────────────

const StaffTab = () => {
  const { perfStats, perfPerformance, perfSort, setPerfFilters } = useDashboard()
  const { t } = useI18n()

  const PERF_LABEL_MAP = {
    'All Performance': t('filters.allPerformance'),
    'Above Average':   t('filters.aboveAverage'),
    'Below Average':   t('filters.belowAverage'),
  }

  const PERF_KEY_MAP = {
    [t('filters.allPerformance')]:  'All Performance',
    [t('filters.aboveAverage')]:    'Above Average',
    [t('filters.belowAverage')]:    'Below Average',
  }

  const SORT_LABEL_MAP = {
    'Name':                 t('filters.sortName'),
    'Tasks ↓':              t('filters.sortTasksDesc'),
    'Avg Productivity ↓':   t('filters.sortAvgDesc'),
    'Avg Productivity ↑':   t('filters.sortAvgAsc'),
    'Working Days ↓':       t('filters.sortDaysDesc'),
  }

  const SORT_KEY_MAP = {
    [t('filters.sortName')]:      'Name',
    [t('filters.sortTasksDesc')]: 'Tasks ↓',
    [t('filters.sortAvgDesc')]:   'Avg Productivity ↓',
    [t('filters.sortAvgAsc')]:    'Avg Productivity ↑',
    [t('filters.sortDaysDesc')]:  'Working Days ↓',
  }

  const performanceOptions = [
    t('filters.allPerformance'),
    t('filters.aboveAverage'),
    t('filters.belowAverage'),
  ]

  const sortOptions = [
    t('filters.sortName'),
    t('filters.sortTasksDesc'),
    t('filters.sortAvgDesc'),
    t('filters.sortAvgAsc'),
    t('filters.sortDaysDesc'),
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
      case 'Avg Productivity ↓':  list.sort((a, b) => b.avg - a.avg);                break
      case 'Avg Productivity ↑':  list.sort((a, b) => a.avg - b.avg);                break
      case 'Working Days ↓':      list.sort((a, b) => b.days - a.days);              break
      default: break
    }

    return list
  }, [perfStats, perfPerformance, perfSort])

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-2 justify-end">
        <Dropdown
          label={PERF_LABEL_MAP[perfPerformance] ?? perfPerformance}
          options={performanceOptions}
          onSelect={(val) => setPerfFilters({ performance: PERF_KEY_MAP[val] ?? val })}
        />
        <Dropdown
          label={SORT_LABEL_MAP[perfSort] ?? perfSort}
          options={sortOptions}
          onSelect={(val) => setPerfFilters({ sort: SORT_KEY_MAP[val] ?? val })}
        />
      </div>
      <StaffProductivityChart overrideList={filtered} />
      <StaffConsistencyChart />
    </div>
  )
}

export default Performance
