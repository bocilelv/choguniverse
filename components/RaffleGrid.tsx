'use client'

import { useState } from 'react'
import { RaffleCard } from '@/components/RaffleCard'

type Raffle = {
  id: string; title: string; image: string; startDate?: string; endDate: string
  totalSpots: number; entriesCount: number; blockchain: string
}

const TABS = ['ALL', 'LIVE', 'ENDED', 'UPCOMING'] as const

export function RaffleGrid({ raffles }: { raffles: Raffle[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('ALL')

  const now = Date.now()
  const filtered = raffles.filter((r) => {
    const start = r.startDate ? new Date(r.startDate).getTime() : 0
    const end = new Date(r.endDate).getTime()
    if (tab === 'LIVE') return start <= now && end > now
    if (tab === 'ENDED') return end <= now
    if (tab === 'UPCOMING') return start > now
    return true
  })

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`font-black text-xs px-4 py-2 rounded-xl border-2 border-ink transition-colors ${tab === t ? 'bg-ink text-cream' : 'bg-white hover:bg-cream2'}`}>
            {t} {t !== 'ALL' && <span className="opacity-50">({raffles.filter((r) => {
              const s = r.startDate ? new Date(r.startDate).getTime() : 0
              const e = new Date(r.endDate).getTime()
              return t === 'LIVE' ? s <= now && e > now : t === 'ENDED' ? e <= now : s > now
            }).length})</span>}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((r) => <RaffleCard key={r.id} raffle={r} />)}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-ink/30 p-10 text-center font-bold text-ink/40">
          no {tab.toLowerCase()} raffles right now
        </div>
      )}
    </>
  )
}
