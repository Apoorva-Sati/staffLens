import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useDashboard } from '../../context/DataContext'
import CustomTooltip from '../CustomTooltip'

const COLORS = ['var(--primary)', 'var(--primary-dark)', '#f39c12', '#2ecc71', '#3498db', '#9b59b6']

const SubSkillBreakdown = () => {
  const { data } = useDashboard()
  if (!data || data.length === 0) return null

  const skillMap = {}
  data.forEach(row => {
    const skill = row["SUB SKILL"]?.trim()
    const closing = row["TOTAL CLOSING"] || 0
    if (!skill) return
    skillMap[skill] = (skillMap[skill] || 0) + closing
  })

  const total = Object.values(skillMap).reduce((a, b) => a + b, 0)
  const chartData = Object.entries(skillMap)
    .map(([name, value]) => ({
      name,
      value,
      percent: ((value / total) * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value)

  const tooltipItems = [
    { label: 'Total Tasks', value: (dataRow) => dataRow.value },
    { label: 'Share', value: (dataRow) => `${dataRow.percent}%` }
  ]

  return (
    <div className="bg-card border border-(--border) rounded-xl p-5 shadow-sm">
      <div className="text-xs font-bold tracking-[1.5px] text-(--text-muted) mb-5">
        SUB SKILL BREAKDOWN
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            label={({ percent }) => `${(percent)}%`}
            labelLine={{ stroke: 'var(--border)' }}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="var(--bg-main)" strokeWidth={2} />
            ))}
          </Pie>

          {/* 3. Wire up your custom global tooltip component */}
          <Tooltip
            content={
              <CustomTooltip
                title={(dataRow) => dataRow.name}
                items={tooltipItems}
              />
            }
          />

          <Legend
            formatter={value => <span className="text-(--text-secondary) text-xs">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SubSkillBreakdown