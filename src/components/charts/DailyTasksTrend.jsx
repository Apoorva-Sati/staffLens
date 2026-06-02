import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { useDashboard } from '../../context/DataContext'
import CustomTooltip from '../CustomTooltip'
import { useI18n } from '../../hooks/useI18n'

const DailyTasksTrend = () => {
  const { stats } = useDashboard()
  const { t, formatDate, i18n } = useI18n()

  if (!stats?.dailyTasksTrendData?.length) return null

  const chartData = stats.dailyTasksTrendData
  const isRtl = i18n?.dir?.() === 'rtl' || i18n?.language === 'ar'

  const formatNumber = (num) => {
    const currentLang = i18n?.language === 'ar' ? 'ar-SA' : 'en-US'
    return new Intl.NumberFormat(currentLang).format(num)
  }

  const formatTick = (value) =>
    formatDate(new Date(value), { day: '2-digit', month: 'short' })

  return (
    <div className="rounded-2xl border border-(--border) bg-(--card-bg) p-5 shadow-sm">
      <div className="mb-5 text-xs font-bold tracking-[1.5px] text-(--text-muted) uppercase">
        {t('charts.dailyTasksTrend')}
      </div>

      <div className="h-64 w-full" dir={isRtl ? 'rtl' : 'ltr'}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ 
              top: 10, 
              right: isRtl ? 15 : 20, 
              left: isRtl ? 20 : 0, 
              bottom: 5 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

            <XAxis
              dataKey="date"
              tickFormatter={formatTick}
              minTickGap={35}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />

            <YAxis
              orientation={isRtl ? 'right' : 'left'} 
              tickFormatter={formatNumber}         
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
              content={
                <CustomTooltip
                  items={[
                    {
                      label: t('charts.totalTasks'),
                      value: (_, payload) => formatNumber(payload?.[0]?.value ?? 0),
                    },
                  ]}
                />
              }
            />

            <Line
              type="monotone"
              dataKey="total"
              stroke="var(--primary)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: 'var(--primary)',
                stroke: 'var(--primary-dark)',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DailyTasksTrend