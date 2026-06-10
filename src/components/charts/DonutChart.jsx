import React, { useRef, useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useDashboard } from '../../context/DataContext'

const COLORS = ['var(--primary)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '10px 14px',
      }}>
        <p style={{ color: 'var(--text-main)', fontWeight: 700, marginBottom: 4 }}>{d.name}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Total Tasks: <strong style={{ color: 'var(--primary)' }}>{d.totalTasks}</strong></p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Avg Productivity: <strong style={{ color: 'var(--primary)' }}>{d.avgProductivity}</strong></p>
      </div>
    )
  }
  return null
}

const DonutChart = () => {
  const { perfStats } = useDashboard()
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(320)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width)
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  if (!perfStats) return null
  const { supervisorList } = perfStats
  if (!supervisorList || supervisorList.length === 0) return null

  const outerRadius = Math.min(Math.floor(containerWidth * 0.32), 140)
  const innerRadius = Math.floor(outerRadius * 0.64)
  const labelFontSize = Math.max(9, Math.floor(outerRadius * 0.12))
  const chartHeight = outerRadius * 2 + 90

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius: ir, outerRadius: or, payload }) => {
    const RADIAN = Math.PI / 180
    const radius = ir + (or - ir) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={labelFontSize} fontWeight={600}>
        {`${payload.totalTasks}/${payload.avgProductivity}`}
      </text>
    )
  }

  const chartData = supervisorList.map(s => ({
    name:            s.name,
    value:           s.totalTasks,
    totalTasks:      s.totalTasks,
    avgProductivity: s.avgProductivity,
  }))

  return (
    <div className="card" ref={containerRef}>
      <div className="text-xs font-bold tracking-[1.5px] text-(--text-muted) mb-5">
        TASKS BY SUPERVISOR
      </div>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {chartData.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} stroke="var(--bg-main)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value, entry) => (
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                {`${value}: ${entry.payload.totalTasks}/${entry.payload.avgProductivity}`}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DonutChart
