import React from 'react'
import { useDashboard } from '../context/DataContext'

const Performance = () => {
  const { data, loading, error } = useDashboard()

  if (loading) return <p className="p-4">Loading data...</p>
  if (error)   return <p className="p-4 text-red-500">Error: {error}</p>

  // ── Per-staff totals and working days ───────────────────────────────────
  const staffTotals  = {}
  const staffDaysMap = {}
  const supervisorMap = {}

  data.forEach(row => {
    const name = row.NAME
    const supervisor = row.Supervisor
    if (!name) return

    staffTotals[name]  = (staffTotals[name]  || 0) + (row["TOTAL CLOSING"] || 0)

    if (!staffDaysMap[name]) staffDaysMap[name] = new Set()
    if (row.Date) staffDaysMap[name].add(row.Date)

    // Map supervisor → staff members
    if (supervisor) {
      if (!supervisorMap[supervisor]) supervisorMap[supervisor] = new Set()
      supervisorMap[supervisor].add(name)
    }
  })

  // Avg productivity per staff (total tasks / working days)
  const staffAvg = Object.keys(staffTotals).map(name => ({
    name,
    avg: parseFloat((staffTotals[name] / (staffDaysMap[name]?.size || 1)).toFixed(2)),
    total: staffTotals[name],
  }))

  const sorted     = [...staffAvg].sort((a, b) => b.avg - a.avg)
  const top3       = sorted.slice(0, 3)
  const bottom3    = [...staffAvg].sort((a, b) => a.avg - b.avg).slice(0, 3)

  // Best supervisor: highest avg productivity across their team
  const supervisorStats = Object.entries(supervisorMap).map(([sup, members]) => {
    const memberArr = [...members]
    const totalTasks = memberArr.reduce((s, n) => s + (staffTotals[n] || 0), 0)
    const avgProd    = memberArr.reduce((s, n) => {
      return s + (staffTotals[n] / (staffDaysMap[n]?.size || 1))
    }, 0) / memberArr.length
    return { sup, avgProd: avgProd.toFixed(2), totalTasks, teamSize: memberArr.length }
  }).sort((a, b) => b.avgProd - a.avgProd)

  const bestSup = supervisorStats[0] || {}

  return (
    <div className="p-6">
      <h2 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '16px' }}>
        PERFORMANCE SUMMARY
      </h2>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>TOP 3 PERFORMERS</th>
              <th style={{ textAlign: 'right' }}>AVG PRODUCTIVITY</th>
              <th>BOTTOM 3 PERFORMERS</th>
              <th style={{ textAlign: 'right' }}>AVG PRODUCTIVITY</th>
              <th>BEST SUPERVISOR</th>
              <th style={{ textAlign: 'right' }}>VALUE</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2].map(i => (
              <tr key={i}>
                {/* Top performers */}
                <td style={{ color: 'var(--text-secondary)' }}>
                  {top3[i] ? `#${i + 1} ${top3[i].name}` : '—'}
                </td>
                <td style={{ textAlign: 'right', color: '#2ecc71', fontWeight: 600 }}>
                  {top3[i]?.avg ?? '—'}
                </td>

                {/* Bottom performers */}
                <td style={{ color: 'var(--text-secondary)' }}>
                  {bottom3[i] ? `#${i + 1} ${bottom3[i].name}` : '—'}
                </td>
                <td style={{ textAlign: 'right', color: 'var(--primary)', fontWeight: 600 }}>
                  {bottom3[i]?.avg ?? '—'}
                </td>

                {/* Best supervisor — only row 0,1,2,3 */}
                {i === 0 && <>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Supervisor</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-main)' }}>{bestSup.sup}</td>
                </>}
                {i === 1 && <>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Avg Productivity</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-main)' }}>{bestSup.avgProd}</td>
                </>}
                {i === 2 && <>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Total Tasks</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-main)' }}>{bestSup.totalTasks}</td>
                </>}
              </tr>
            ))}
            {/* Extra row for Team size */}
            <tr>
              <td /><td />
              <td /><td />
              <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Team size</td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-main)' }}>{bestSup.teamSize}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Performance