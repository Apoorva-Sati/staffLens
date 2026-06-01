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
  const { stats } = useDashboard()

  if (!stats?.dailyTasksTrendData?.length) return null

  const chartData = stats.dailyTasksTrendData

  const formatDate = (value) => {
    return new Date(value).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    })
  }

  return (
    <div className="rounded-2xl border border-(--border) bg-(--card-bg) p-5 shadow-sm">

      <div className="mb-5 text-xs font-bold tracking-[1.5px] text-(--text-muted) uppercase">
        Daily Tasks Trend
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%" >
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
            />

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

            <YAxis
              tick={{
                fill: 'var(--text-muted)',
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={
                <CustomTooltip
                  items={[
                    {
                      label: 'Tasks',
                      value: (_, payload) => payload?.[0]?.value ?? 0,
                    },
                  ]}
                />
              }
            />

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