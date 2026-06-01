import React from 'react'
import { useDashboard } from '../context/DataContext'
import ChartImage from './ChartImage'

const getInitials = (name) =>
    name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'

const Avatar = ({ name, isBottom }) => (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0 border-2 ${isBottom ? 'border-(--primary) bg-(--primary-dark)' : 'border-[#2ecc71] bg-(--primary-dark)'}`}>
        {getInitials(name)}
    </div>
)

const RankBadge = ({ rank, isBottom }) => (
    <div className={`w-5.5 h-5.5 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-white ${isBottom ? 'bg-[var(--primary)]' : 'bg-[#2ecc71]'}`}>
        {rank}
    </div>
)

const PerformerCard = ({ rank, name, avg, isBottom }) => (
    <div className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-transform duration-200 hover:translate-x-1 bg-(--bg-secondary) ${isBottom ? 'border-[rgba(237,28,36,0.2)]' : 'border-[rgba(46,204,113,0.2)]'}`}>
        <RankBadge rank={rank} isBottom={isBottom} />
        <Avatar name={name} isBottom={isBottom} />
        <div className="flex-1 min-w-0">
            <div className="text-(--text-main) font-semibold text-sm truncate" title={name}>
                {name}
            </div>
        </div>
        <div className={`text-xl font-extrabold ${isBottom ? 'text-(--primary)' : 'text-[#2ecc71]'}`}>
            {avg}
        </div>
    </div>
)

const StatRow = ({ label, value, bar, icons }) => (
    <div className="mb-5">
        <div className="text-[11px] font-bold tracking-widest text-(--text-muted) mb-1">{label}</div>
        <div className="text-[28px] font-extrabold leading-none text-(--text-main)">{value}</div>
        {bar != null && (
            <div className="mt-2 h-1 rounded-full bg-(--border)">
                <div
                    className="h-full rounded-full bg-(--primary) transition-all duration-1000"
                    style={{ width: `${Math.min(bar, 100)}%` }}
                />
            </div>
        )}
        {icons != null && (
            <div className="mt-2 flex gap-1 flex-wrap">
                {Array.from({ length: Math.min(icons, 10) }).map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 640 640" className="fill-(--primary)">
                        <path d="M320 64C355.3 64 384 92.7 384 128C384 163.3 355.3 192 320 192C284.7 192 256 163.3 256 128C256 92.7 284.7 64 320 64zM416 376C416 401 403.3 423 384 435.9L384 528C384 554.5 362.5 576 336 576L304 576C277.5 576 256 554.5 256 528L256 435.9C236.7 423 224 401 224 376L224 336C224 283 267 240 320 240C373 240 416 283 416 336L416 376z" />
                    </svg>
                ))}
            </div>
        )}
    </div>
)

// ── Supervisor mini-card for multi-select mode ─────────────────────────────
const SupervisorPill = ({ name }) => (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-(--bg-main) border border-(--border)">
        <div className="w-6 h-6 rounded-full bg-(--primary-dark) border border-(--primary) flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            {getInitials(name)}
        </div>
        <span className="text-xs font-semibold text-(--text-main) truncate max-w-20" title={name}>
            {name}
        </span>
    </div>
)

const LeaderboardTable = ({ top3, bottom3, bestSupervisor }) => {
    const { stats, perfStats, rawStats, selectedSupervisors } = useDashboard()
    const totalTasks = stats?.totalTasks || 0

    // ── Determine which supervisors to show ────────────────────────────────
    const allSupervisors = perfStats?.supervisorList || []

    // If supervisors are selected in filter, show those; otherwise show best
    const isFiltered = selectedSupervisors.length > 0

    // Build display list: filtered selection or just the best one
    const displaySupervisors = isFiltered
        ? allSupervisors.filter(s => selectedSupervisors.includes(s.name))
        : bestSupervisor
            ? [bestSupervisor]
            : []

    // Primary supervisor shown in the main card (first/best of selection)
    const primarySup = displaySupervisors[0] || null

    // Extra supervisors when multiple selected
    const extraSups = displaySupervisors.slice(1)

    // ── Card label logic ───────────────────────────────────────────────────
    const cardLabel = isFiltered
        ? selectedSupervisors.length === 1
            ? 'SELECTED SUPERVISOR'
            : `SELECTED SUPERVISORS`
        : 'BEST SUPERVISOR'

    // ── Aggregated stats across all selected supervisors ──────────────────
    const aggregated = displaySupervisors.reduce(
        (acc, s) => ({
            totalTasks: acc.totalTasks + s.totalTasks,
            teamSize: acc.teamSize + s.teamSize,
            avgProductivity: acc.avgProductivity + s.avgProductivity,
        }),
        { totalTasks: 0, teamSize: 0, avgProductivity: 0 }
    )
    const displayAvg = displaySupervisors.length > 0
        ? (aggregated.avgProductivity / displaySupervisors.length).toFixed(2)
        : '—'
    const displayTasks = displaySupervisors.length > 0 ? aggregated.totalTasks : '—'
    const displayTeamSize = displaySupervisors.length > 0 ? aggregated.teamSize : '—'

    return (
        <div className="grid grid-cols-[1fr_auto] gap-4 items-start">

            {/* LEFT — Leaderboard */}
            <div className="card">
                <div className="text-xs font-bold tracking-[1.5px] text-(--text-muted) mb-5">
                    PERFORMANCE LEADERBOARDS
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="text-[11px] font-bold tracking-widest text-[#2ecc71] mb-3">TOP 3 PERFORMERS</div>
                        <div className="flex flex-col gap-2">
                            {top3?.map((p, i) => (
                                <PerformerCard key={p.name} rank={i + 1} name={p.name} avg={p.avg} isBottom={false} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-[11px] font-bold tracking-widest text-(--primary) mb-3">BOTTOM 3 PERFORMERS</div>
                        <div className="flex flex-col gap-2">
                            {bottom3?.map((p, i) => (
                                <PerformerCard key={p.name} rank={i + 1} name={p.name} avg={p.avg} isBottom={true} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT — Supervisor card */}
            <div className="bg-card border border-(--border) rounded-xl p-5 shadow-sm min-w-60">
                <div className="text-xs font-bold tracking-[1.5px] text-(--text-muted) mb-5">
                    TEAM SUMMARY & SUPERVISOR STATS
                </div>

                {primarySup ? (
                    <>
                        {/* Supervisor identity section */}
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-(--border)">
                            <div className="w-13 h-13 rounded-full bg-(--primary-dark) border-2 border-(--primary) flex items-center justify-center text-lg font-bold text-white shrink-0">
                                {getInitials(primarySup.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[11px] text-(--text-muted) tracking-widest mb-0.5">
                                    {cardLabel}
                                </div>
                                <div className="text-base font-bold text-(--text-main) truncate">
                                    {primarySup.name}
                                </div>

                                {/* Extra supervisors as pills */}
                                {extraSups.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {extraSups.slice(0, 2).map(s => (
                                            <SupervisorPill key={s.name} name={s.name} />
                                        ))}
                                        {extraSups.length > 2 && (
                                            <div className="flex items-center px-2 py-1 rounded-lg bg-(--bg-main) border border-(--border)">
                                                <span className="text-xs font-bold text-(--text-muted)">
                                                    +{extraSups.length - 2}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between mb-5 text-left">
                            <StatRow
                                label={isFiltered && displaySupervisors.length > 1 ? 'COMBINED AVG PRODUCTIVITY' : 'AVERAGE PRODUCTIVITY'}
                                value={displayAvg}
                            />
                            <ChartImage />
                        </div>

                        <StatRow
                            label="TOTAL TASKS COMPLETED"
                            value={displayTasks}
                            bar={rawStats?.totalTasks > 0 ? (aggregated.totalTasks / rawStats.totalTasks) * 100 : 0}
                        />

                        <StatRow
                            label="TEAM SIZE"
                            value={displayTeamSize}
                            icons={typeof displayTeamSize === 'number' ? displayTeamSize : 0}
                        />
                    </>
                ) : (
                    <div className="text-sm text-(--text-muted) text-center py-8">
                        No supervisor data available
                    </div>
                )}
            </div>

        </div>
    )
}

export default LeaderboardTable