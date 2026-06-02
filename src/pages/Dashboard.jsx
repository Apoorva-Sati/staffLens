import React from 'react'
import Card from '../components/Card'
import Spinner from '../components/Spinner'
import Filters from '../components/Filters'
import DailyTasksTrend from '../components/charts/DailyTasksTrend'
import RoasterPerformance from '../components/charts/RoasterPerformance'
import { useDashboard } from '../context/DataContext'
import { getCardHeadings } from '../constants/CardHeadings'
import { useI18n } from '../hooks/useI18n'

const Dashboard = () => {
  const { stats, loading, error } = useDashboard()
  const { t, i18n } = useI18n()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
        <span className="ms-2 text-sm text-(--text-muted)">{t('loading')}</span>
      </div>
    )
  }

  if (error) {
    return (
      <p className="p-4 text-red-500">
        {t('error', { message: error })}
      </p>
    )
  }

  if (!stats) return null

  const cards = getCardHeadings(stats, t)
  const isRtl = i18n?.dir?.() === 'rtl' || i18n?.language === 'ar'

  return (
    <div className="space-y-6 p-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="min-w-0">
          <DailyTasksTrend />
        </div>
        <div className="min-w-0">
          <RoasterPerformance />
        </div>
      </div>
    </div>
  )
}

export default Dashboard