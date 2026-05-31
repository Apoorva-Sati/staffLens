import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useDashboard } from '../../context/DataContext'
import CustomTooltip from '../CustomTooltip'

const TeamLeaderboard = () => {
  const { data } = useDashboard()
  if (!data || data.length === 0) return null

  const teamMap = {}
  data.forEach(row => {
    const team    = row.TEAM?.trim()
    const name    = row.NAME
    const closing = row["TOTAL CLOSING"] || 0
    if (!team) return
    if (!teamMap[team]) teamMap[team] = { total: 0, staff: new Set() }
    teamMap[team].total += closing
    if (name) teamMap[team].staff.add(name)
  })

  const chartData = Object.entries(teamMap)
    .map(([team, s]) => ({
      team,
      total:       s.total,
      staffCount:  s.staff.size,
      avgPerStaff: parseFloat((s.total / s.staff.size).toFixed(2)),
    }))
    .sort((a, b) => b.avgPerStaff - a.avgPerStaff)

  const max = chartData[0]?.avgPerStaff || 1

  const tooltipItems = [
    { label: 'Total Tasks', value: 'total' },
    { label: 'Avg / Staff', value: 'avgPerStaff' },
    { label: 'Staff Count', value: 'staffCount' }
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
          margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          barSize={30}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
          
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
              dx: -5
            }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />
          
          <YAxis
            type="number"
            domain={[0, Math.ceil(max) + 1]}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          
          {/* 3. Call your generic component here using the content prop */}
          <Tooltip 
            content={<CustomTooltip items={tooltipItems} />} 
            cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
          />
          
          <Bar
  dataKey="avgPerStaff"
  radius={[4, 4, 0, 0]}
  label={{ position: 'top', fill: 'var(--primary)', fontSize: 12, fontWeight: 600 }}
>
  {chartData.map((entry, i) => {
    // Determine the color based on rank
    let barColor = 'var(--primary-dark)'; // Default fallback for middle ranks
    
    if (i === 0) {
      barColor = 'var(--primary)'; // Highest team gets main primary color
    } else if (i === chartData.length - 1) {
      barColor = '#EAB308'; // 👈 Least team gets Tailwind's yellow-500 hex
    }

    return (
      <Cell
        key={entry.team}
        fill={barColor}
        opacity={i === chartData.length - 1 ? 1 : Math.max(0.2, 1 - i * 0.08)}
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