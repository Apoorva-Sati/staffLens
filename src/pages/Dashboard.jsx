import React from 'react'
import Card from '../components/Card'
import { useDashboard } from '../context/DataContext'

const Dashboard = () => {
  const { data, loading, error } = useDashboard()

  if (loading) return <p className="p-4">Loading data...</p>
  if (error)   return <p className="p-4 text-red-500">Error: {error}</p>

  // ── Compute values from Excel data ─────────────────────────────────────
  const totalTasks    = data.reduce((sum, row) => sum + (row["TOTAL CLOSING"] || 0), 0)
  const uniqueNames   = [...new Set(data.map(row => row.NAME).filter(Boolean))]
  const activeStaff   = uniqueNames.length

  // Unique dates to calculate working days per staff
  const staffDaysMap  = {}
  data.forEach(row => {
    if (row.NAME && row.Date) {
      if (!staffDaysMap[row.NAME]) staffDaysMap[row.NAME] = new Set()
      staffDaysMap[row.NAME].add(row.Date)
    }
  })
  const totalWorkingDays = Object.values(staffDaysMap).reduce((sum, days) => sum + days.size, 0)
  const avgWorkingDays   = activeStaff > 0 ? (totalWorkingDays / activeStaff).toFixed(1) : "0.0"
  const overallAvg       = activeStaff > 0 ? (totalTasks / activeStaff).toFixed(2) : "0.00"

  // Top performer by total closing tasks
  const staffTotals = {}
  data.forEach(row => {
    if (row.NAME) {
      staffTotals[row.NAME] = (staffTotals[row.NAME] || 0) + (row["TOTAL CLOSING"] || 0)
    }
  })
  const topName    = Object.keys(staffTotals).sort((a, b) => staffTotals[b] - staffTotals[a])[0] || "-"
  const topAvgDays = staffDaysMap[topName]?.size || 1
  const topAvg     = topName !== "-" ? (staffTotals[topName] / topAvgDays).toFixed(2) : "0.00"

  // ── Card config ────────────────────────────────────────────────────────
  const cardHeadings = [
    {
      title:    "Total Tasks",
      value:    totalTasks,
      subtitle: "Completed Tasks",
    },
    {
      title:    "Active Staff",
      value:    activeStaff,
      subtitle: "Employees",
    },
    {
      title:    "Overall Avg",
      value:    overallAvg,
      subtitle: "Tasks / Staff",
    },
    {
      title:    "Top Performer",
      value:    topName,
      subtitle: `${topAvg} Avg/Day`,
    },
    {
      title:    "Avg Working Days",
      value:    avgWorkingDays,
      subtitle: "Per Staff",
    },
  ]

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 p-4">
        {cardHeadings.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
          />
        ))}
      </div>
    </>
  )
}

export default Dashboard
