export function computePerformanceStats(data) {
  if (!data || data.length === 0) return null

  // ── Staff Aggregation ────────────────────────────────────────────────
  const staffMap = {}

  data.forEach((row) => {
    const name       = row.NAME?.trim()
    const supervisor = row.Supervisor?.trim()
    const date       = row.Date
    const closing    = Number(row['TOTAL CLOSING']) || 0

    if (!name) return

    if (!staffMap[name]) {
      staffMap[name] = {
        total:      0,
        days:       new Set(),
        supervisor,            // captured from first row
      }
    }

    staffMap[name].total += closing
    if (date) staffMap[name].days.add(String(date))
  })

  // ── Staff Average List ──────────────────────────────────────────────
  const staffAvgList = Object.entries(staffMap).map(([name, s]) => {
    const workingDays = s.days.size || 1
    const avg         = s.total / workingDays

    return {
      name,
      avg:        Number(avg.toFixed(2)),
      total:      s.total,
      days:       s.days.size,
      supervisor: s.supervisor,
    }
  })

  // ── Sorting Logic ───────────────────────────────────────────────────
  const sortByPerformance = (a, b) => {
    if (b.avg   !== a.avg)   return b.avg   - a.avg
    if (b.total !== a.total) return b.total - a.total
    return a.days - b.days
  }

  const sortByLowestPerformance = (a, b) => {
    if (a.avg   !== b.avg)   return a.avg   - b.avg
    if (a.total !== b.total) return a.total - b.total
    return b.days - a.days
  }

  // ── Top / Bottom Performers ─────────────────────────────────────────
  const top3    = [...staffAvgList].sort(sortByPerformance).slice(0, 3)
  const bottom3 = [...staffAvgList].sort(sortByLowestPerformance).slice(0, 3)

  // ── Full Staff Rankings ─────────────────────────────────────────────
  const staffList    = [...staffAvgList].sort(sortByPerformance)
  const allStaffAvg  = [...staffAvgList].sort(sortByPerformance)

  // ── Supervisor Aggregation (directly from raw rows, not staffMap) ────
  // This avoids double-counting when a staff member appears under
  // multiple supervisors across different rows.
  const supMap = {}

  data.forEach((row) => {
    const supervisor = row.Supervisor?.trim()
    const name       = row.NAME?.trim()
    const closing    = Number(row['TOTAL CLOSING']) || 0

    if (!supervisor || !name) return

    if (!supMap[supervisor]) {
      supMap[supervisor] = {
        total:     0,
        staffSet:  new Set(),
        // collect per-staff avgs separately for productivity calc
        staffAvgs: {},
      }
    }

    supMap[supervisor].total += closing
    supMap[supervisor].staffSet.add(name)

    // Accumulate per-staff totals + days under this supervisor
    if (!supMap[supervisor].staffAvgs[name]) {
      supMap[supervisor].staffAvgs[name] = { total: 0, days: new Set() }
    }
    supMap[supervisor].staffAvgs[name].total += closing
    if (row.Date) {
      supMap[supervisor].staffAvgs[name].days.add(String(row.Date))
    }
  })

  // ── Supervisor List ─────────────────────────────────────────────────
  const supervisorList = Object.entries(supMap)
    .map(([name, s]) => {
      // Avg productivity = mean of each staff's (total/days) under this supervisor
      const perStaffAvgs = Object.values(s.staffAvgs).map(({ total, days }) =>
        total / (days.size || 1)
      )
      const avgProductivity =
        perStaffAvgs.reduce((a, b) => a + b, 0) / (perStaffAvgs.length || 1)

      return {
        name,
        avgProductivity: Number(avgProductivity.toFixed(2)),
        totalTasks:      s.total,
        teamSize:        s.staffSet.size,
      }
    })
    .sort((a, b) => {
      if (b.avgProductivity !== a.avgProductivity)
        return b.avgProductivity - a.avgProductivity
      return b.totalTasks - a.totalTasks
    })

  // ── Best Supervisor ─────────────────────────────────────────────────
  const bestSupervisor = supervisorList[0] ?? null

  return {
    top3,
    bottom3,
    bestSupervisor,
    supervisorList,
    staffList,
    allStaffAvg,
  }
}