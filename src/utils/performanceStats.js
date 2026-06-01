export function computePerformanceStats(data) {
  if (!data || data.length === 0) return null

  // ── Staff Aggregation ────────────────────────────────────────────────
  const staffMap = {}

  data.forEach((row) => {
    const name = row.NAME?.trim()
    const supervisor = row.Supervisor?.trim()
    const date = row.Date

    // FIX: convert to number
    const closing = Number(row['TOTAL CLOSING']) || 0

    if (!name) return

    if (!staffMap[name]) {
      staffMap[name] = {
        total: 0,
        days: new Set(),
        supervisor,
      }
    }

    // Numeric addition
    staffMap[name].total += closing

    // Unique working days
    if (date) {
      staffMap[name].days.add(String(date))
    }
  })

  // ── Staff Average List ──────────────────────────────────────────────
  const staffAvgList = Object.entries(staffMap).map(([name, s]) => {
    const workingDays = s.days.size || 1
    const avg = s.total / workingDays

    return {
      name,
      avg: Number(avg.toFixed(2)),
      total: s.total,
      days: s.days.size,
      supervisor: s.supervisor,
    }
  })

  // ── Sorting Logic ───────────────────────────────────────────────────
  const sortByPerformance = (a, b) => {
    // Higher avg first
    if (b.avg !== a.avg) {
      return b.avg - a.avg
    }

    // More total work first
    if (b.total !== a.total) {
      return b.total - a.total
    }

    // Fewer days preferred
    return a.days - b.days
  }

  const sortByLowestPerformance = (a, b) => {
    // Lower avg first
    if (a.avg !== b.avg) {
      return a.avg - b.avg
    }

    // Less total work first
    if (a.total !== b.total) {
      return a.total - b.total
    }

    // More days worse
    return b.days - a.days
  }

  // ── Top / Bottom Performers ─────────────────────────────────────────
  const top3 = [...staffAvgList]
    .sort(sortByPerformance)
    .slice(0, 3)

  const bottom3 = [...staffAvgList]
    .sort(sortByLowestPerformance)
    .slice(0, 3)

  // ── Full Staff Rankings ─────────────────────────────────────────────
  const allStaffAvg = [...staffAvgList]
    .sort(sortByPerformance)

  const staffList = [...staffAvgList]
    .sort(sortByPerformance)

  // ── Supervisor Aggregation ──────────────────────────────────────────
  const supMap = {}

  staffAvgList.forEach(({ supervisor, avg, total }) => {
    if (!supervisor) return

    if (!supMap[supervisor]) {
      supMap[supervisor] = {
        avgs: [],
        total: 0,
        teamSize: 0,
      }
    }

    supMap[supervisor].avgs.push(avg)
    supMap[supervisor].total += total
    supMap[supervisor].teamSize += 1
  })

  // ── Supervisor List ─────────────────────────────────────────────────
  const supervisorList = Object.entries(supMap)
    .map(([name, s]) => {
      const avgProductivity =
        s.avgs.reduce((a, b) => a + b, 0) / s.avgs.length

      return {
        name,
        avgProductivity: Number(avgProductivity.toFixed(2)),
        totalTasks: s.total,
        teamSize: s.teamSize,
      }
    })
    .sort((a, b) => {
      if (b.avgProductivity !== a.avgProductivity) {
        return b.avgProductivity - a.avgProductivity
      }

      return b.totalTasks - a.totalTasks
    })

  // ── Best Supervisor ─────────────────────────────────────────────────
  const bestSupervisor =
    supervisorList.length > 0
      ? supervisorList[0]
      : null

  // ── Final Return ────────────────────────────────────────────────────
  return {
    top3,
    bottom3,
    bestSupervisor,
    supervisorList,
    staffList,
    allStaffAvg,
  }
}