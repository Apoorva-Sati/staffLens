export function computePerformanceStats(data) {
  if (!data || data.length === 0) return null

  const staffMap = {}

  data.forEach(row => {
    const name       = row.NAME
    const supervisor = row.Supervisor
    const closing    = row["TOTAL CLOSING"] || 0
    const date       = row.Date
    if (!name) return

    if (!staffMap[name]) {
      staffMap[name] = { total: 0, days: new Set(), supervisor }
    }
    staffMap[name].total += closing
    if (date) staffMap[name].days.add(date)
  })

  // Avg per staff = total tasks / unique working days
  const staffAvgList = Object.entries(staffMap).map(([name, s]) => ({
    name,
    avg:        parseFloat((s.total / (s.days.size || 1)).toFixed(2)),
    total:      s.total,
    days:       s.days.size,
    supervisor: s.supervisor,
  }))
  
// Primary: avg descending
// Tiebreaker 1: total tasks descending (more work done)
// Tiebreaker 2: fewer days worked (same output in less time)
const top3 = [...staffAvgList].sort((a, b) => {
  if (b.avg !== a.avg) return b.avg - a.avg
  if (b.total !== a.total) return b.total - a.total
  return a.days - b.days
}).slice(0, 3)

const bottom3 = [...staffAvgList].sort((a, b) => {
  if (a.avg !== b.avg) return a.avg - b.avg
  if (a.total !== b.total) return a.total - b.total
  return b.days - a.days
}).slice(0, 3)


const allStaffAvg = [...staffAvgList].sort((a, b) => {
  if (b.avg !== a.avg) return b.avg - a.avg
  if (b.total !== a.total) return b.total - a.total
  return a.days - b.days
})

  // Best supervisor: highest avg of their team's individual avgs
  const supMap = {}
  staffAvgList.forEach(({ supervisor, avg, total }) => {
    if (!supervisor) return
    if (!supMap[supervisor]) supMap[supervisor] = { avgs: [], total: 0, teamSize: 0 }
    supMap[supervisor].avgs.push(avg)
    supMap[supervisor].total     += total
    supMap[supervisor].teamSize  += 1
  })

  const bestSupervisor = Object.entries(supMap)
    .map(([name, s]) => ({
      name,
      avgProductivity: parseFloat((s.avgs.reduce((a, b) => a + b, 0) / s.avgs.length).toFixed(2)),
      totalTasks:      s.total,
      teamSize:        s.teamSize,
    }))
    .sort((a, b) => b.avgProductivity - a.avgProductivity)[0] || null

// Full supervisor list for charts
const supervisorList = Object.entries(supMap)
  .map(([name, s]) => ({
    name,
    avgProductivity: parseFloat((s.avgs.reduce((a, b) => a + b, 0) / s.avgs.length).toFixed(2)),
    totalTasks:      s.total,
    teamSize:        s.teamSize,
  }))
  .sort((a, b) => b.avgProductivity - a.avgProductivity)

const staffList = staffAvgList.sort((a, b) => b.avg - a.avg)

return { top3, bottom3, bestSupervisor, supervisorList, staffList, allStaffAvg }
}