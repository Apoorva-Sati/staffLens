// src/components/PerformanceTable.jsx
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
    <div
        className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-transform duration-200 hover:translate-x-1 bg-(--bg-secondary) ${isBottom ? 'border-[rgba(237,28,36,0.2)]' : 'border-[rgba(46,204,113,0.2)]'}`}
    >
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
            <div className="mt-2 flex gap-1">
                {Array.from({ length: icons }).map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 640 640" className="fill-(--primary)">
                        <path d="M320 64C355.3 64 384 92.7 384 128C384 163.3 355.3 192 320 192C284.7 192 256 163.3 256 128C256 92.7 284.7 64 320 64zM416 376C416 401 403.3 423 384 435.9L384 528C384 554.5 362.5 576 336 576L304 576C277.5 576 256 554.5 256 528L256 435.9C236.7 423 224 401 224 376L224 336C224 283 267 240 320 240C373 240 416 283 416 336L416 376z" />
                    </svg>
                ))}
            </div>
        )}
    </div>
)

const PerformanceTable = ({ top3, bottom3, bestSupervisor }) => {
    const { stats } = useDashboard()
    const totalTasks = stats?.totalTasks || 0

    return (
        <div className="grid grid-cols-[1fr_auto] gap-4">

            {/* LEFT — Leaderboard */}
            <div className="card">
                <div className="text-xs font-bold tracking-[1.5px] text-(--text-muted) mb-5">
                    PERFORMANCE LEADERBOARDS
                </div>
                <div className="grid grid-cols-2 gap-6">

                    {/* Top 3 */}
                    <div>
                        <div className="text-[11px] font-bold tracking-widest text-[#2ecc71] mb-3">
                            TOP 3 PERFORMERS
                        </div>
                        <div className="flex flex-col gap-2">
                            {top3?.map((p, i) => (
                                <PerformerCard key={p.name} rank={i + 1} name={p.name} avg={p.avg} isBottom={false} />
                            ))}
                        </div>
                    </div>

                    {/* Bottom 3 */}
                    <div>
                        <div className="text-[11px] font-bold tracking-widest text-(--primary) mb-3">
                            BOTTOM 3 PERFORMERS
                        </div>
                        <div className="flex flex-col gap-2">
                            {bottom3?.map((p, i) => (
                                <PerformerCard key={p.name} rank={i + 1} name={p.name} avg={p.avg} isBottom={true} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* RIGHT — Supervisor stats */}
            <div className="card min-w-60">
                <div className="text-xs font-bold tracking-[1.5px] text-(--text-muted) mb-5">
                    TEAM SUMMARY & SUPERVISOR STATS
                </div>

                {/* Supervisor avatar */}
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-(--border)">
                    <div className="w-13 h-13 rounded-full bg-(--primary-dark) border-2 border-(--primary) flex items-center justify-center text-lg font-bold text-white shrink-0">
                        {getInitials(bestSupervisor?.name)}
                    </div>
                    <div>
                        <div className="text-[11px] text-(--text-muted) tracking-widest">BEST SUPERVISOR</div>
                        <div className="text-base font-bold text-(--text-main)">{bestSupervisor?.name || '—'}</div>
                    </div>
                </div>
                <div className="flex items-center justify-between mb-5 text-left">
                    <StatRow label="AVERAGE PRODUCTIVITY" value={bestSupervisor?.avgProductivity ?? '—'} />
                    <ChartImage />
                </div>
                <StatRow label="TOTAL TASKS COMPLETED" value={bestSupervisor?.totalTasks ?? '—'} bar={(bestSupervisor?.totalTasks / totalTasks) * 100} />
                <StatRow label="TEAM SIZE" value={bestSupervisor?.teamSize ?? '—'} icons={Math.min(bestSupervisor?.teamSize ?? 0, 10)} />
            </div>

        </div>
    )
}

export default PerformanceTable