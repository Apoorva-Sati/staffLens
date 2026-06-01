import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

import { useDashboard } from '../../context/DataContext'
import CustomTooltip from '../CustomTooltip'

const SHIFT_COLORS = {
  MORNING: '#f39c12',
  AFTERNOON: 'var(--primary)',
  EVENING: 'var(--primary-dark)',
}

const RoasterPerformance = () => {
  const { stats } = useDashboard()

  if (!stats?.roasterPerformanceData?.length) return null

  const chartData = stats.roasterPerformanceData

  return (
    <div className="card">
      <div className="text-xs font-bold tracking-[1.5px] text-(--text-muted) mb-1">
        ROASTER PERFORMANCE
      </div>

      <div className="flex gap-4 mb-4 flex-wrap">
        {chartData.map((s) => (
          <div key={s.shift} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ background: SHIFT_COLORS[s.shift] }}
            />

            <span className="text-xs text-(--text-muted)">
              {s.shift} ({s.staffCount} staff)
            </span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          barSize={60}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="var(--border)"
          />

          <XAxis
            dataKey="shift"
            tick={{
              fill: 'var(--text-secondary)',
              fontSize: 13,
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
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            content={
              <CustomTooltip
                items={[
                  {
                    label: 'Total Tasks',
                    value: (_, payload) => payload?.[0]?.value ?? 0,
                  },
                  {
                    label: 'Avg / Staff',
                    value: (data) => data.avgPerStaff,
                  },
                ]}
              />
            }
          />

          <Bar
            dataKey="total"
            radius={[4, 4, 0, 0]}
            label={{
              position: 'top',
              fill: 'var(--text-secondary)',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.shift}
                fill={SHIFT_COLORS[entry.shift]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RoasterPerformance