import React from 'react'
import { useTranslation } from 'react-i18next'
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

const SHIFT_COLORS = {
  MORNING: '#f39c12',
  AFTERNOON: 'var(--primary)',
  EVENING: 'var(--primary-dark)',
}

const RoasterPerformance = () => {
  const { t, i18n } = useTranslation()
  const { stats } = useDashboard()

  if (!stats?.roasterPerformanceData?.length) return null

  const chartData = stats.roasterPerformanceData.map((item) => ({
    ...item,
    translatedShift: t(`shifts.${item.shift}`, item.shift),
  }))

  const isRtl = i18n.dir() === 'rtl'
  
  // Helper function to format numbers dynamically based on current language locale ('ar-SA' or 'en-US')
  const formatNumber = (num) => {
    return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-SA' : 'en-US').format(num)
  }

  return (
    <div className="card">
      <div className="text-xs font-bold tracking-[1.5px] text-(--text-muted) mb-1 uppercase">
        {t('charts.roasterPerformance')}
      </div>

      <div className="flex gap-4 mb-4 flex-wrap" dir={isRtl ? 'rtl' : 'ltr'}>
        {chartData.map((s) => (
          <div key={s.shift} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ background: SHIFT_COLORS[s.shift] || 'var(--primary)' }}
            />

            {/* Formatted staff count number */}
            <span className="text-xs text-(--text-muted) inline-flex gap-1">
              <span>{s.translatedShift}</span>
              <span>
                ({formatNumber(s.staffCount)} {t('charts.staffCount')})
              </span>
            </span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: isRtl ? 15 : 20, left: isRtl ? 20 : 5, bottom: 0 }}
          barSize={60}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="var(--border)"
          />

          <XAxis
            dataKey="translatedShift"
            tick={{
              fill: 'var(--text-secondary)',
              fontSize: 13,
            }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />

          <YAxis
            orientation={isRtl ? 'right' : 'left'}
            tickFormatter={formatNumber} // Formats the numbers on the Y-Axis line
            tick={{
              fill: 'var(--text-muted)',
              fontSize: 11,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            content={
              <CustomTooltip
                items={[
                  {
                    label: t('charts.totalTasks'),
                    value: (_, payload) => formatNumber(payload?.[0]?.value ?? 0),
                  },
                  {
                    label: t('charts.avgPerStaff'),
                    value: (data) => formatNumber(data.avgPerStaff),
                  },
                ]}
              />
            }
          />

          <Bar
            dataKey="total"
            radius={[4, 4, 0, 0]}
            // Recharts customized label formatter to modify numbers sitting on top of bars
            label={(props) => {
              const { x, y, width, value } = props
              return (
                <text
                  x={x + width / 2}
                  y={y - 6}
                  fill="var(--text-secondary)"
                  fontSize={12}
                  fontWeight={600}
                  textAnchor="middle"
                >
                  {formatNumber(value)}
                </text>
              )
            }}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.shift}
                fill={SHIFT_COLORS[entry.shift] || 'var(--primary)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RoasterPerformance