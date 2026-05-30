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
      title: "Total Tasks",
      value: totalTasks,
      subtitle: "Completed Tasks",
      icon: <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        className="w-10 h-10 fill-(--primary)">
        <path d="M197.8 100.3C208.7 107.9 211.3 122.9 203.7 133.7L147.7 213.7C143.6 219.5 137.2 223.2 130.1 223.8C123 224.4 116 222 111 217L71 177C61.7 167.6 61.7 152.4 71 143C80.3 133.6 95.6 133.7 105 143L124.8 162.8L164.4 106.2C172 95.3 187 92.7 197.8 100.3zM197.8 260.3C208.7 267.9 211.3 282.9 203.7 293.7L147.7 373.7C143.6 379.5 137.2 383.2 130.1 383.8C123 384.4 116 382 111 377L71 337C61.6 327.6 61.6 312.4 71 303.1C80.4 293.8 95.6 293.7 104.9 303.1L124.7 322.9L164.3 266.3C171.9 255.4 186.9 252.8 197.7 260.4zM288 160C288 142.3 302.3 128 320 128L544 128C561.7 128 576 142.3 576 160C576 177.7 561.7 192 544 192L320 192C302.3 192 288 177.7 288 160zM288 320C288 302.3 302.3 288 320 288L544 288C561.7 288 576 302.3 576 320C576 337.7 561.7 352 544 352L320 352C302.3 352 288 337.7 288 320zM224 480C224 462.3 238.3 448 256 448L544 448C561.7 448 576 462.3 576 480C576 497.7 561.7 512 544 512L256 512C238.3 512 224 497.7 224 480zM128 440C150.1 440 168 457.9 168 480C168 502.1 150.1 520 128 520C105.9 520 88 502.1 88 480C88 457.9 105.9 440 128 440z" />
      </svg>
    },
    {
      title: "Active Staff",
      value: activeStaff,
      subtitle: "Employees",
      icon: <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        className="w-10 h-10 fill-(--primary)">
        <path d="M320 64C355.3 64 384 92.7 384 128C384 163.3 355.3 192 320 192C284.7 192 256 163.3 256 128C256 92.7 284.7 64 320 64zM416 376C416 401 403.3 423 384 435.9L384 528C384 554.5 362.5 576 336 576L304 576C277.5 576 256 554.5 256 528L256 435.9C236.7 423 224 401 224 376L224 336C224 283 267 240 320 240C373 240 416 283 416 336L416 376zM160 96C190.9 96 216 121.1 216 152C216 182.9 190.9 208 160 208C129.1 208 104 182.9 104 152C104 121.1 129.1 96 160 96zM176 336L176 368C176 400.5 188.1 430.1 208 452.7L208 528C208 529.2 208 530.5 208.1 531.7C199.6 539.3 188.4 544 176 544L144 544C117.5 544 96 522.5 96 496L96 439.4C76.9 428.4 64 407.7 64 384L64 352C64 299 107 256 160 256C172.7 256 184.8 258.5 195.9 262.9C183.3 284.3 176 309.3 176 336zM432 528L432 452.7C451.9 430.2 464 400.5 464 368L464 336C464 309.3 456.7 284.4 444.1 262.9C455.2 258.4 467.3 256 480 256C533 256 576 299 576 352L576 384C576 407.7 563.1 428.4 544 439.4L544 496C544 522.5 522.5 544 496 544L464 544C451.7 544 440.4 539.4 431.9 531.7C431.9 530.5 432 529.2 432 528zM480 96C510.9 96 536 121.1 536 152C536 182.9 510.9 208 480 208C449.1 208 424 182.9 424 152C424 121.1 449.1 96 480 96z" />
      </svg>
    },
    {
      title: "Overall Avg",
      value: overallAvg,
      subtitle: "Tasks / Staff",
      icon: <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        className="w-10 h-10 fill-(--primary)"
      >
        <path d="M128 128C128 110.3 113.7 96 96 96C78.3 96 64 110.3 64 128L64 464C64 508.2 99.8 544 144 544L544 544C561.7 544 576 529.7 576 512C576 494.3 561.7 480 544 480L144 480C135.2 480 128 472.8 128 464L128 128zM534.6 214.6C547.1 202.1 547.1 181.8 534.6 169.3C522.1 156.8 501.8 156.8 489.3 169.3L384 274.7L326.6 217.4C314.1 204.9 293.8 204.9 281.3 217.4L185.3 313.4C172.8 325.9 172.8 346.2 185.3 358.7C197.8 371.2 218.1 371.2 230.6 358.7L304 285.3L361.4 342.7C373.9 355.2 394.2 355.2 406.7 342.7L534.7 214.7z" />
      </svg>
    },
    {
      title: "Top Performer",
      value: topName,
      subtitle: `${topAvg} Avg/Day`,
      icon: <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        className="w-10 h-10 fill-(--primary)">
        <path d="M353.8 118.1L330.2 70.3C326.3 62 314.1 61.7 309.8 70.3L286.2 118.1L233.9 125.6C224.6 127 220.6 138.5 227.5 145.4L265.5 182.4L256.5 234.5C255.1 243.8 264.7 251 273.3 246.7L320.2 221.9L366.8 246.3C375.4 250.6 385.1 243.4 383.6 234.1L374.6 182L412.6 145.4C419.4 138.6 415.5 127.1 406.2 125.6L353.9 118.1zM288 320C261.5 320 240 341.5 240 368L240 528C240 554.5 261.5 576 288 576L352 576C378.5 576 400 554.5 400 528L400 368C400 341.5 378.5 320 352 320L288 320zM80 384C53.5 384 32 405.5 32 432L32 528C32 554.5 53.5 576 80 576L144 576C170.5 576 192 554.5 192 528L192 432C192 405.5 170.5 384 144 384L80 384zM448 496L448 528C448 554.5 469.5 576 496 576L560 576C586.5 576 608 554.5 608 528L608 496C608 469.5 586.5 448 560 448L496 448C469.5 448 448 469.5 448 496z" />
      </svg>
    },
    {
      title: "Avg Working Days",
      value: avgWorkingDays,
      subtitle: "Per Staff",
      icon: <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          className="w-10 h-10 fill-(--primary)">
          <path d="M353.8 118.1L330.2 70.3C326.3 62 314.1 61.7 309.8 70.3L286.2 118.1L233.9 125.6C224.6 127 220.6 138.5 227.5 145.4L265.5 182.4L256.5 234.5C255.1 243.8 264.7 251 273.3 246.7L320.2 221.9L366.8 246.3C375.4 250.6 385.1 243.4 383.6 234.1L374.6 182L412.6 145.4C419.4 138.6 415.5 127.1 406.2 125.6L353.9 118.1zM288 320C261.5 320 240 341.5 240 368L240 528C240 554.5 261.5 576 288 576L352 576C378.5 576 400 554.5 400 528L400 368C400 341.5 378.5 320 352 320L288 320zM80 384C53.5 384 32 405.5 32 432L32 528C32 554.5 53.5 576 80 576L144 576C170.5 576 192 554.5 192 528L192 432C192 405.5 170.5 384 144 384L80 384zM448 496L448 528C448 554.5 469.5 576 496 576L560 576C586.5 576 608 554.5 608 528L608 496C608 469.5 586.5 448 560 448L496 448C469.5 448 448 469.5 448 496z" />
        </svg>
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
            icon={card.icon}
          />
        ))}
      </div>
    </>
  )
}

export default Dashboard
