import React from 'react'

import Card from '../components/Card'
import Spinner from '../components/Spinner'
import Filters from '../components/Filters'
import DailyTasksTrend from '../components/charts/DailyTasksTrend'
import RoasterPerformance from '../components/charts/RoasterPerformance'

import { useDashboard } from '../context/DataContext'
import { getCardHeadings } from '../constants/CardHeadings'

const Dashboard = () => {
  const { stats, loading, error } = useDashboard()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <p className="p-4 text-red-500">
        Error: {error}
      </p>
    )
  }

  if (!stats) return null

  const cards = getCardHeadings(stats)

  return (
    <div className="space-y-6 p-4">

      {/* Top Section */}
      {/* Change justify-end to justify-start whenever you want left alignment */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
        <Filters />
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Reports Section */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

        {/* Daily Trend */}
        <div className="min-w-0">
          <DailyTasksTrend />
        </div>

        {/* Roaster Performance */}
        <div className="min-w-0">
          <RoasterPerformance />
        </div>

      </div>
    </div>
  )
}

export default Dashboard