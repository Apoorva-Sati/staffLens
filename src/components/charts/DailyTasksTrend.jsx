import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { useDashboard } from '../../context/DataContext'
import CustomTooltip from '../CustomTooltip'

const DailyTasksTrend = () => {
  const { data } = useDashboard()

  if (!data || data.length === 0) return null

  // Group total tasks by date
  const dateMap = {}

  data.forEach((row) => {
    const date = row.Date
    const closing = Number(row['TOTAL CLOSING']) || 0

    if (!date) return

    dateMap[date] = (dateMap[date] || 0) + closing
  })

  // Convert to chart data
  const chartData = Object.entries(dateMap)
    .map(([date, total]) => ({
      date,
      total,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  // Format dates nicely
  const formatDate = (value) => {
    return new Date(value).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    })
  }

  return (
    <div className="rounded-2xl border border-(--border) bg-(--card-bg) p-5 shadow-sm">

      {/* Heading */}
      <div className="mb-5 text-xs font-bold tracking-[1.5px] text-(--text-muted) uppercase">
        Daily Tasks Trend
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
            />

            {/* X Axis */}
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              minTickGap={35}
              tick={{
                fill: 'var(--text-muted)',
                fontSize: 11,
              }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />

            {/* Y Axis */}
            <YAxis
              tick={{
                fill: 'var(--text-muted)',
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
            />

            {/* Tooltip */}
            <Tooltip
              content={
                <CustomTooltip
                  items={[
                    {
                      label: 'Tasks',
                      value: (_, payload) => payload[0]?.value,
                    },
                  ]}
                />
              }
            />

            {/* Line */}
            <Line
              type="monotone"
              dataKey="total"
              stroke="var(--primary)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: 'var(--primary)',
                stroke: 'var(--primary-dark)',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DailyTasksTrend