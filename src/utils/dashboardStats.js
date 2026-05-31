export function computeDashboardStats(data) {
  if (!data || data.length === 0) return null;

  // ── Total tasks ───────────────────────────────────────────────────────
  const totalTasks = data.reduce(
    (sum, row) => sum + (row["TOTAL CLOSING"] || 0),
    0,
  );

  // ── Unique names ──────────────────────────────────────────────────────
  const uniqueNames = [...new Set(data.map((row) => row.NAME).filter(Boolean))];
  // ── Active staff ──────────────────────────────────────────────────────
  const uniqueIds = [...new Set(data.map((row) => row.LOGIN).filter(Boolean))];
  const activeStaff = uniqueIds.length;

  // ── Working days per staff ────────────────────────────────────────────
  const staffDaysMap = {};
  const staffTotalTaskClosed = {};

  data.forEach((row) => {
    const { NAME: name, Date: date } = row;
    const closing = row["TOTAL CLOSING"] || 0;
    if (!name) return;

    if (!staffDaysMap[name]) staffDaysMap[name] = new Set();
    if (!staffTotalTaskClosed[name]) staffTotalTaskClosed[name] = 0;

    staffTotalTaskClosed[name] += closing;
    if (date) staffDaysMap[name].add(date);
  });

  

  // ── Overall avg (avg of each person's avg) ────────────────────────────
  const staffAvgs = Object.keys(staffTotalTaskClosed).map(
    (name) => staffTotalTaskClosed[name] / (staffDaysMap[name]?.size || 1),
  );
  const overallAvg =
    staffAvgs.length > 0
      ? (staffAvgs.reduce((s, a) => s + a, 0) / staffAvgs.length).toFixed(2)
      : "0.00";

  // ── Top performer (min 2 days to avoid inflated 1-day avg) ────────────
  const MIN_DAYS = 2;
  let topName = "--";
  let topAvgVal = 0;

  Object.entries(staffTotalTaskClosed).forEach(([name, total]) => {
    const days = staffDaysMap[name]?.size || 0;
    if (days < MIN_DAYS) return;
    const avg = total / days;
    if (avg > topAvgVal) {
      topAvgVal = avg;
      topName = name;
    }
  });

  const topAvg = topAvgVal > 0 ? topAvgVal.toFixed(2) : "0.00";

  // ── Avg working days ──────────────────────────────────────────────────
  const totalWorkingDays = Object.values(staffDaysMap).reduce(
    (sum, days) => sum + days.size,
    0,
  );
  const avgWorkingDays =
    activeStaff > 0 ? (totalWorkingDays / activeStaff).toFixed(1) : "0.0";

  return {
    totalTasks,
    activeStaff,
    avgWorkingDays,
    overallAvg,
    topName,
    topAvg,
  };
}
