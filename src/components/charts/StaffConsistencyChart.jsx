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

  // ── X Axis domain — start near the first data point, not 0 ─────────
  const minDays = Math.min(...chartData.map((d) => d.x))
  const maxDays = Math.max(...chartData.map((d) => d.x))
  const xPad = Math.max(1, Math.round((maxDays - minDays) * 0.08))
  const xDomain = [Math.max(0, minDays - xPad), maxDays + xPad]

  // ── Label collision avoidance ────────────────────────────────────────
  const labelOffsets = (() => {
    const xRange = xDomain[1] - xDomain[0] || 1
    const yVals = chartData.map((d) => d.y)
    const yRange = (Math.max(...yVals) - Math.min(...yVals)) || 1
    const xThresh = xRange * 0.09
    const yThresh = yRange * 0.3

    const offsets = Object.fromEntries(
      chartData.map((d) => [d.name, { dy: -14, dx: 0 }])
    )

    for (let i = 0; i < chartData.length; i++) {
      for (let j = i + 1; j < chartData.length; j++) {
        const a = chartData[i]
        const b = chartData[j]
        if (
          Math.abs(a.x - b.x) < xThresh &&
          Math.abs(a.y - b.y) < yThresh
        ) {
          // Stagger vertically if both labels are at the same level
          if (offsets[a.name].dy === offsets[b.name].dy) {
            offsets[a.name].dy = -22
            offsets[b.name].dy = 12
          }
          // Also nudge horizontally when very close in x
          if (Math.abs(a.x - b.x) < xThresh * 0.4) {
            offsets[a.name].dx = -10
            offsets[b.name].dx = 10
          }
        }
      }
    }

    return offsets
  })()

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
            domain={xDomain}
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
              const { dy, dx } = labelOffsets[payload.name] ?? { dy: -14, dx: 0 }

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
                    x={cx + dx}
                    y={cy + dy}
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