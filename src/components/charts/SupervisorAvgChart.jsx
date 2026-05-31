import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useDashboard } from '../../context/DataContext'

const COLORS = ['var(--primary)', '#7a0f14', '#b5860d', '#2ecc71', '#3498db']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '10px 14px',
      }}>
        <p style={{ color: 'var(--text-main)', fontWeight: 700, marginBottom: 4 }}>{label}</p>
        <p style={{ color: 'var(--primary)', fontSize: '13px' }}>
          Supervisor Avg: <strong>{payload[0].value}</strong>
        </p>
      </div>
    )
  }
  return null
}

const SupervisorAvgChart = () => {
  const { perfStats } = useDashboard()
  if (!perfStats) return null

  const chartData = perfStats.supervisorList?.map(s => ({
  name: s.name,
  avg:  s.avgProductivity,
})) || []

  const maxAvg = Math.ceil(chartData[0]?.avg || 1) + 2

  return (
    <div className="card">
      <div className="text-xs font-bold tracking-[1.5px] text-(--text-muted) mb-5">
        SUPERVISOR TEAM AVERAGE
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          barSize={80}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--text-secondary)', fontSize: 13 }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, maxAvg]}
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar
            dataKey="avg"
            radius={[4, 4, 0, 0]}
            label={{ position: 'top', fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}
          >
            {chartData.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SupervisorAvgChart