import React from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { useDashboard } from '../../context/DataContext'
import CustomTooltip from '../CustomTooltip'

const StaffConsistencyChart = () => {
  const { data } = useDashboard()

  if (!data || data.length === 0) return null

  const staffMap = {}

  data.forEach((row) => {
    const name = row.NAME
    const closing = row['TOTAL CLOSING'] || 0
    const date = row.Date

    if (!name) return

    if (!staffMap[name]) {
      staffMap[name] = {
        total: 0,
        days: new Set(),
      }
    }

    staffMap[name].total += closing

    if (date) {
      staffMap[name].days.add(date)
    }
  })

  const chartData = Object.entries(staffMap).map(([name, s]) => ({
    name,
    x: s.days.size,
    y: parseFloat((s.total / (s.days.size || 1)).toFixed(2)),
    total: s.total,
  }))

  const avgDays = parseFloat(
    (
      chartData.reduce((sum, d) => sum + d.x, 0) /
      chartData.length
    ).toFixed(1)
  )

  const avgProd = parseFloat(
    (
      chartData.reduce((sum, d) => sum + d.y, 0) /
      chartData.length
    ).toFixed(2)
  )

  // 2. Define data mapping for your reusable tooltip
  const tooltipItems = [
    { label: 'Working Days', value: 'x' },
    { label: 'Avg Productivity', value: 'y' },
    { label: 'Total Tasks', value: 'total' }
  ]

  return (
    <div className="rounded-2xl border border-(--border) bg-(--card-bg) p-5  bg-card  shadow-sm">
      <div className="mb-1 text-xs font-bold tracking-[1.5px] text-(--text-muted)">
        STAFF CONSISTENCY
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
          />

          <XAxis
            type="number"
            dataKey="x"
            name="Working Days"
            label={{
              value: 'Working Days',
              position: 'insideBottom',
              offset: -2,
              fill: 'var(--text-muted)',
              fontSize: 11,
            }}
            tick={{
              fill: 'var(--text-muted)',
              fontSize: 11,
            }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />

          <YAxis
            type="number"
            dataKey="y"
            name="Avg Productivity"
            tick={{
              fill: 'var(--text-muted)',
              fontSize: 11,
            }}
            axisLine={false}
            tickLine={false}
          />

          {/* 3. Call your global custom tooltip component */}
          <Tooltip
            content={
              <CustomTooltip 
                title={(dataRow) => dataRow.name} 
                items={tooltipItems} 
              />
            }
            cursor={{ strokeDasharray: '3 3' }}
          />

          {/* Average Quadrant Lines */}
          <ReferenceLine
            x={avgDays}
            stroke="var(--border)"
            strokeDasharray="4 4"
          />

          <ReferenceLine
            y={avgProd}
            stroke="var(--border)"
            strokeDasharray="4 4"
          />

          <Scatter
            data={chartData}
            fill="var(--primary)"
            opacity={0.85}
            shape={(props) => {
              const { cx, cy, payload } = props

              return (
                <g>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="var(--primary)"
                    opacity={0.85}
                  />

                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fill="var(--text-secondary)"
                    fontSize={10}
                  >
                    {payload.name.split(' ')[0]}
                  </text>
                </g>
              )
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StaffConsistencyChart