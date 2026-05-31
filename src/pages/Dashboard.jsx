import React from 'react'
import Card from '../components/Card'
import { useDashboard } from '../context/DataContext'
import Spinner from '../components/Spinner'
import { getCardHeadings } from '../constants/CardHeadings'

const Dashboard = () => {
  const { stats, loading, error } = useDashboard()

  if (loading) return <div className="flex h-full items-center justify-center"><Spinner /></div>
  if (error)   return <p className="p-4 text-red-500">Error: {error}</p>
  if (!stats)  return null

const cards = getCardHeadings(stats)
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 p-4">
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
  )
}

export default Dashboard