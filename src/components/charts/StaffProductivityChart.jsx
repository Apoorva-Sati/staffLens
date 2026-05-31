import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useDashboard } from '../../context/DataContext'
// 1. Import your reusable CustomTooltip component
import CustomTooltip from '../CustomTooltip' 

const StaffProductivityChart = () => {
  const { perfStats } = useDashboard()

  if (!perfStats) return null

  const chartData = perfStats.staffList?.map(p => ({ name: p.name, avg: p.avg })) || []
  const maxAvg = chartData[0]?.avg || 1
  const minAvg = chartData[chartData.length - 1]?.avg || 0

  // 2. Define data items configuration for the shared tooltip component
  const tooltipItems = [
    { label: 'Avg Productivity', value: 'avg' }
  ]

  return (
    <div className="bg-card border border-(--border) rounded-xl p-5 shadow-sm">
      <div className="text-xs font-bold tracking-[1.5px] text-(--text-muted) mb-5">
        AVERAGE PRODUCTIVITY BY STAFF
      </div>
      <div className="overflow-y-auto max-h-150">  
        <ResponsiveContainer width="100%" height={Math.max(chartData.length * 44, 300)}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 50, left: 80, bottom: 0 }}
              barSize={22}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                type="number"
                domain={[0, Math.ceil(maxAvg) + 1]}
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border)' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: 'var(--text-secondary)', fontSize: 13 }}
                axisLine={false}
                tickLine={false}
                width={75}
              />
              
              {/* 3. Replaced with your global CustomTooltip component */}
              <Tooltip 
                content={
                  <CustomTooltip 
                    title={(dataRow, label) => label} 
                    items={tooltipItems} 
                  />
                } 
                cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
              />
              
              <Bar 
                dataKey="avg" 
                radius={[0, 4, 4, 0]} 
                label={{ position: 'right', fill: 'var(--primary)', fontSize: 12, fontWeight: 600 }}
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={entry.avg === minAvg ? '#EAB308' : 'var(--primary-dark)'}
                    stroke={entry.avg === maxAvg ? 'var(--primary)' : 'transparent'}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default StaffProductivityChart