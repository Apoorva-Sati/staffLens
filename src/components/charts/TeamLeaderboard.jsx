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

const TeamLeaderboard = () => {
  const { data } = useDashboard()

  if (!data || data.length === 0) return null

  // ── Team Aggregation ────────────────────────────────────────────────
  const teamMap = {}

  data.forEach((row) => {
    const team = row.TEAM?.trim()
    const name = row.NAME?.trim()

    // FIX: convert to number
    const closing = Number(row['TOTAL CLOSING']) || 0

    if (!team) return

    if (!teamMap[team]) {
      teamMap[team] = {
        total: 0,
        staff: new Set(),
      }
    }

    // Numeric addition
    teamMap[team].total += closing

    if (name) {
      teamMap[team].staff.add(name)
    }
  })

  // ── Chart Data ──────────────────────────────────────────────────────
  const chartData = Object.entries(teamMap)
    .map(([team, s]) => {
      const staffCount = s.staff.size || 1

      return {
        team,
        total: s.total,
        staffCount,
        avgPerStaff: Number(
          (s.total / staffCount).toFixed(2)
        ),
      }
    })
    .sort((a, b) => b.avgPerStaff - a.avgPerStaff)

  const max = chartData[0]?.avgPerStaff || 1

  // ── Tooltip Config ──────────────────────────────────────────────────
  const tooltipItems = [
    {
      label: 'Total Tasks',
      value: 'total',
    },
    {
      label: 'Avg / Staff',
      value: 'avgPerStaff',
    },
    {
      label: 'Staff Count',
      value: 'staffCount',
    },
  ]

  return (
    <div className="card">

      <div className="text-xs font-bold tracking-[1.5px] text-muted mb-5">
        TEAM LEADERBOARD
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          layout="horizontal"
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 20,
          }}
          barSize={30}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="var(--border)"
          />

          {/* X Axis */}
          <XAxis
            type="category"
            dataKey="team"
            interval={0}
            angle={-15}
            height={60}
            tick={{
              fill: 'var(--text-secondary)',
              fontSize: 12,
              dy: 10,
              dx: -5,
            }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />

          {/* Y Axis */}
          <YAxis
            type="number"
            domain={[0, Math.ceil(max) + 1]}
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
              <CustomTooltip items={tooltipItems} />
            }
            cursor={{
              fill: 'rgba(255,255,255,0.03)',
            }}
          />

          {/* Bars */}
          <Bar
            dataKey="avgPerStaff"
            radius={[4, 4, 0, 0]}
            label={{
              position: 'top',
              fill: 'var(--primary)',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {chartData.map((entry, i) => {
              // Default middle rank color
              let barColor = 'var(--primary-dark)'

              // Best team
              if (i === 0) {
                barColor = 'var(--primary)'
              }

              // Worst team
              else if (i === chartData.length - 1) {
                barColor = 'var(--chart-warning)'
              }

              return (
                <Cell
                  key={entry.team}
                  fill={barColor}
                  opacity={
                    i === chartData.length - 1
                      ? 1
                      : Math.max(0.2, 1 - i * 0.08)
                  }
                />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TeamLeaderboard