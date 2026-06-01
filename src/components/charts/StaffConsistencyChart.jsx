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
  const { stats, perfStats } = useDashboard()

  if (!perfStats?.staffList?.length) return null

  // ── Build chart data from centralized stats ─────────────────────────
  const chartData = perfStats.staffList.map((staff) => ({
    name: staff.name,
    x: staff.days,
    y: Number(staff.avg),
    total: Number(staff.total),
  }))

  // ── Average Working Days ────────────────────────────────────────────
  const avgDays =
    chartData.length > 0
      ? Number(
          (
            chartData.reduce((sum, d) => sum + d.x, 0) /
            chartData.length
          ).toFixed(1)
        )
      : 0

  // ── Average Productivity ────────────────────────────────────────────
  const avgProd =
    chartData.length > 0
      ? Number(
          (
            chartData.reduce((sum, d) => sum + d.y, 0) /
            chartData.length
          ).toFixed(2)
        )
      : 0

  // ── Tooltip Config ──────────────────────────────────────────────────
  const tooltipItems = [
    {
      label: 'Working Days',
      value: 'x',
    },
    {
      label: 'Avg Productivity',
      value: 'y',
    },
    {
      label: 'Total Tasks',
      value: 'total',
    },
  ]

  return (
    <div className="rounded-2xl border border-(--border) bg-(--card-bg) p-5 bg-card shadow-sm">

      <div className="mb-1 text-xs font-bold tracking-[1.5px] text-(--text-muted)">
        STAFF CONSISTENCY
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
          />

          {/* X Axis */}
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

          {/* Y Axis */}
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

          {/* Tooltip */}
          <Tooltip
            content={
              <CustomTooltip
                title={(dataRow) => dataRow.name}
                items={tooltipItems}
              />
            }
            cursor={{ strokeDasharray: '3 3' }}
          />

          {/* Average Lines */}
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

          {/* Scatter Points */}
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
                    {payload.name?.split(' ')[0]}
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