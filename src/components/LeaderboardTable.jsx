import React from 'react'
import { useDashboard } from '../context/DataContext'
import ChartImage from './ChartImage'

const getInitials = (name) =>
    name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'

const PODIUM_CONFIG = [
    { rank: 2, color: '#7a0f14', pedestalH: 72, avatarSize: 44 },
    { rank: 1, color: '#ed1c24', pedestalH: 104, avatarSize: 60 },
    { rank: 3, color: '#666666', pedestalH: 48, avatarSize: 40 },
]

const CrownIcon = ({ color }) => (
    <svg width="22" height="18" viewBox="0 0 24 18" fill={color} className="mb-1">
        <path d="M2 15h20v2H2zm1-2h18l-3-9-5 6-3-7-3 7-5-6z" />
    </svg>
)

const PodiumSlot = ({ person, config }) => {
    const { rank, color, pedestalH, avatarSize } = config
    return (
        <div className="flex flex-col items-center" style={{ width: 88 }}>
            {rank === 1 && <CrownIcon color={color} />}
            <div
                className="rounded-full flex items-center justify-center font-bold text-white shadow-md mb-1.5 border-2 border-white"
                style={{ width: avatarSize, height: avatarSize, background: color, fontSize: Math.round(avatarSize * 0.3) }}
            >
                {getInitials(person.name)}
            </div>
            <div
                className="text-xs font-bold text-(--text-main) text-center leading-tight w-full truncate px-1 mb-0.5"
                title={person.name}
            >
                {person.name}
            </div>
            <div className="font-extrabold mb-1.5 text-base" style={{ color }}>
                {person.avg}
            </div>
            <div
                className="w-full rounded-t-lg flex items-center justify-center font-black text-white"
                style={{ height: pedestalH, background: color, fontSize: 30, opacity: 0.92 }}
            >
                {rank}
            </div>
        </div>
    )
}

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

    const allSupervisors = perfStats?.supervisorList || []
    const isFiltered = selectedSupervisors.length > 0

    const displaySupervisors = isFiltered
        ? allSupervisors.filter(s => selectedSupervisors.includes(s.name))
        : bestSupervisor ? [bestSupervisor] : []

    const primarySup = displaySupervisors[0] || null
    const extraSups = displaySupervisors.slice(1)

    const cardLabel = isFiltered
        ? selectedSupervisors.length === 1 ? 'SELECTED SUPERVISOR' : 'SELECTED SUPERVISORS'
        : 'BEST SUPERVISOR'

    const aggregated = displaySupervisors.reduce(
        (acc, s) => ({
            totalTasks: acc.totalTasks + s.totalTasks,
            teamSize: acc.teamSize + s.teamSize,
            avgProductivity: acc.avgProductivity + s.avgProductivity,
        }),
        { totalTasks: 0, teamSize: 0, avgProductivity: 0 }
    )
    const displayAvg = displaySupervisors.length > 0
        ? (aggregated.avgProductivity / displaySupervisors.length).toFixed(2) : '—'
    const displayTasks = displaySupervisors.length > 0 ? aggregated.totalTasks : '—'
    const displayTeamSize = displaySupervisors.length > 0 ? aggregated.teamSize : '—'

    const podiumOrder = top3?.length >= 3
        ? [
            { person: top3[1], config: PODIUM_CONFIG[0] },
            { person: top3[0], config: PODIUM_CONFIG[1] },
            { person: top3[2], config: PODIUM_CONFIG[2] },
          ]
        : []

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 items-start w-full">
            {/* TOP 3 CARD */}
            <div className="card w-full">
                <div className="text-[11px] font-bold tracking-widest text-(--text-muted) mb-4">
                    TOP 3 PERFORMERS
                </div>
                {podiumOrder.length === 3 ? (
                    <div className="flex items-end justify-center gap-2">
                        {podiumOrder.map(({ person, config }) => (
                            <PodiumSlot key={person.name} person={person} config={config} />
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-(--text-muted)">Not enough data</div>
                )}
            </div>

            {/* BOTTOM 3 CARD */}
            <div className="card w-full">
                <div className="text-[11px] font-bold tracking-widest text-(--text-muted) mb-4">
                    BOTTOM 3 PERFORMERS
                </div>
                <div className="flex flex-col gap-2">
                    {bottom3?.map((p, i) => (
                        <div
                            key={p.name}
                            className="flex items-center gap-3 px-3 py-3 rounded-xl bg-(--bg-secondary) border border-(--border)"
                            style={{ borderLeft: '4px solid #ed1c24' }}
                        >
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                                style={{ background: '#ed1c24' }}
                            >
                                {i + 1}
                            </div>
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                                style={{ background: '#7a0f14' }}
                            >
                                {getInitials(p.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-(--text-main) truncate" title={p.name}>
                                    {p.name}
                                </div>
                            </div>
                            <div className="text-lg font-extrabold shrink-0" style={{ color: '#ed1c24' }}>
                                {p.avg}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SUPERVISOR PANEL */}
            <div className="bg-card border border-(--border) rounded-xl p-5 shadow-sm w-full lg:min-w-60 lg:w-auto">
                <div className="text-xs font-bold tracking-[1.5px] text-(--text-muted) mb-5">
                    TEAM SUMMARY & SUPERVISOR STATS
                </div>
                {primarySup ? (
                    <>
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
                        <div className="flex items-center justify-between mb-5 text-left gap-4">
                            <StatRow
                                label={isFiltered && displaySupervisors.length > 1 ? 'COMBINED AVG PRODUCTIVITY' : 'AVERAGE PRODUCTIVITY'}
                                value={displayAvg}
                            />
                            <div className="shrink-0"><ChartImage /></div>
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

export default LeaderboardTable;
