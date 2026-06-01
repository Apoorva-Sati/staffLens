export function computeDashboardStats(data) {
  if (!data || data.length === 0) return null

  // ── Total Tasks ──────────────────────────────────────────────────────
  const totalTasks = data.reduce(
    (sum, row) => sum + (Number(row['TOTAL CLOSING']) || 0),
    0
  )

  // ── Unique Staff ─────────────────────────────────────────────────────
  const uniqueNames = [
    ...new Set(data.map((row) => row.NAME).filter(Boolean)),
  ]

  const uniqueIds = [
    ...new Set(data.map((row) => row.LOGIN).filter(Boolean)),
  ]

  const activeStaff = uniqueIds.length

  // ── Staff Working Days + Totals ─────────────────────────────────────
  const staffDaysMap = {}
  const staffTotalTaskClosed = {}

  data.forEach((row) => {
    const name = row.NAME?.trim()
    const date = row.Date
    const closing = Number(row['TOTAL CLOSING']) || 0

    if (!name) return

    if (!staffDaysMap[name]) {
      staffDaysMap[name] = new Set()
    }

    if (!staffTotalTaskClosed[name]) {
      staffTotalTaskClosed[name] = 0
    }

    staffTotalTaskClosed[name] += closing

    if (date) {
      staffDaysMap[name].add(String(date))
    }
  })

  // ── Overall Avg ─────────────────────────────────────────────────────
  const staffAvgs = Object.keys(staffTotalTaskClosed).map((name) => {
    const totalClosed = staffTotalTaskClosed[name]
    const workingDays = staffDaysMap[name]?.size || 1

    return totalClosed / workingDays
  })

  const overallAvg =
    staffAvgs.length > 0
      ? (
          staffAvgs.reduce((sum, avg) => sum + avg, 0) /
          staffAvgs.length
        ).toFixed(2)
      : '0.00'

  // ── Top Performer ───────────────────────────────────────────────────
  const MIN_DAYS = 2

  let topName = '--'
  let topAvgVal = 0

  Object.entries(staffTotalTaskClosed).forEach(([name, total]) => {
    const days = staffDaysMap[name]?.size || 0

    if (days < MIN_DAYS) return

    const avg = total / days

    if (avg > topAvgVal) {
      topAvgVal = avg
      topName = name
    }
  })

  const topAvg =
    topAvgVal > 0
      ? topAvgVal.toFixed(2)
      : '0.00'

  // ── Avg Working Days ────────────────────────────────────────────────
  const totalWorkingDays = Object.values(staffDaysMap).reduce(
    (sum, daysSet) => sum + daysSet.size,
    0
  )

  const avgWorkingDays =
    activeStaff > 0
      ? (totalWorkingDays / activeStaff).toFixed(1)
      : '0.0'

  // ── ROASTER PERFORMANCE DATA ───────────────────────────────────────
  const shiftMap = {}

  data.forEach((row) => {
    const shift = row.ROASTER?.trim().toUpperCase()
    const name = row.NAME?.trim()
    const closing = Number(row['TOTAL CLOSING']) || 0

    if (!shift) return

    if (!shiftMap[shift]) {
      shiftMap[shift] = {
        total: 0,
        staff: new Set(),
      }
    }

    shiftMap[shift].total += closing

    if (name) {
      shiftMap[shift].staff.add(name)
    }
  })

  const shiftOrder = ['MORNING', 'AFTERNOON', 'EVENING']

  const roasterPerformanceData = shiftOrder
    .filter((shift) => shiftMap[shift])
    .map((shift) => {
      const total = shiftMap[shift].total
      const staffCount = shiftMap[shift].staff.size || 1

      return {
        shift,
        total,
        staffCount,
        avgPerStaff: Number((total / staffCount).toFixed(2)),
      }
    })

  // ── DAILY TASK TREND DATA ───────────────────────────────────────────
  const dateMap = {}

  data.forEach((row) => {
    const date = row.Date

    if (!date) return

    const closing = Number(row['TOTAL CLOSING']) || 0

    dateMap[String(date)] =
      (dateMap[String(date)] || 0) + closing
  })

  const dailyTasksTrendData = Object.entries(dateMap)
    .map(([date, total]) => ({
      date,
      total,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  // ── Final Return ────────────────────────────────────────────────────
  return {
    totalTasks,
    activeStaff,
    avgWorkingDays,
    overallAvg,
    topName,
    topAvg,
    uniqueNames,
    roasterPerformanceData,
    dailyTasksTrendData,
  }
}