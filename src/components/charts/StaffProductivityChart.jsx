import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useDashboard } from '../../context/DataContext'
import CustomTooltip from '../CustomTooltip' 

const StaffProductivityChart = ({ overrideList }) => {
  const { perfStats } = useDashboard()
  if (!perfStats) return null

  const sourceList = overrideList ?? perfStats.staffList ?? []
  const chartData = sourceList.map(p => ({ name: p.name, avg: p.avg }))
  const maxAvg = chartData[0]?.avg || 1

  const minIdx = chartData.reduce(
    (minI, d, i, arr) => (d.avg < arr[minI].avg ? i : minI),
    0
  )

  const maxIdx = chartData.reduce(
    (maxI, d, i, arr) => (d.avg > arr[maxI].avg ? i : maxI),
    0
  )

  // top = light gray, lowest = red, rest cycle through dark maroon & dark gray
  const MID_PALETTE = ['var(--chart-2)', 'var(--chart-3)']

  const getBarColor = (entry, i) => {
    if (i === minIdx) return 'var(--primary)'
    if (i === maxIdx) return 'var(--chart-4)'
    const midIndex = i < Math.min(minIdx, maxIdx) ? i
      : i > Math.max(minIdx, maxIdx) ? i - 2
      : i - 1
    return MID_PALETTE[midIndex % MID_PALETTE.length]
  }

  const tooltipItems = [
    { label: 'Avg Productivity', value: 'avg' }
  ]

  return (
    <div className="bg-card border border-(--border) rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="text-xs font-bold tracking-[1.5px] text-(--text-muted)">
          AVERAGE PRODUCTIVITY BY STAFF
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--chart-4)' }} />
            <span className="text-xs text-(--text-muted)">Top</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--primary)' }} />
            <span className="text-xs text-(--text-muted)">Lowest</span>
          </div>
        </div>
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
              label={{ position: 'right', fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}
            >
              {chartData.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={getBarColor(entry, i)}
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