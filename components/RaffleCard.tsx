'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Raffle = {
  id: string
  title: string
  image: string
  startDate?: string | Date
  endDate: string | Date
  totalSpots: number
  entriesCount: number
  blockchain: string
}

function fmt(ms: number): string {
  if (ms <= 0) return '00:00:00'
  const d = Math.floor(ms / 86400000)
  const h = Math.floor((ms % 86400000) / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const p = (n: number) => String(n).padStart(2, '0')
  return d > 0 ? `${d}d ${p(h)}:${p(m)}:${p(s)}` : `${p(h)}:${p(m)}:${p(s)}`
}

export function RaffleCard({ raffle }: { raffle: Raffle }) {
  const [remaining, setRemaining] = useState<number | null>(null)

  const start = raffle.startDate ? new Date(raffle.startDate).getTime() : 0
  const end = new Date(raffle.endDate).getTime()

  useEffect(() => {
    const tick = () => setRemaining(end - Date.now())
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [end])

  const upcoming = start > Date.now()
  const ended = remaining !== null && remaining <= 0
  const label = upcoming ? 'STARTS IN' : ended ? 'ENDED' : 'ENDS IN'
  const time = upcoming ? fmt(start - Date.now()) : remaining !== null ? fmt(remaining) : '…'

  return (
    <Link href={`/raffles/${raffle.id}`}
      className="group block rounded-2xl border-2 border-ink bg-white overflow-hidden shadow-[4px_4px_0_ink] hover:shadow-[2px_2px_0_ink] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
      <div className="relative aspect-square bg-cream2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={raffle.image} alt={raffle.title} className="w-full h-full object-contain bg-cream2" loading="lazy" />
        <span className={`absolute top-2 left-2 text-[10px] font-black px-2 py-1 rounded-md border-2 border-ink ${upcoming ? 'bg-gold' : ended ? 'bg-ink text-cream' : 'bg-pink text-white'}`}>
          {upcoming ? 'SOON' : ended ? 'ENDED' : '● LIVE'}
        </span>
        <span className="absolute top-2 right-2 text-[10px] font-black px-2 py-1 rounded-md bg-white border-2 border-ink">
          {raffle.blockchain}
        </span>
      </div>
      <div className="p-3">
        <h3 className="font-black text-sm truncate">{raffle.title}</h3>
        <div className="mt-2 flex items-center justify-between text-[11px] font-bold">
          <span className="text-ink/50">{label}</span>
          <span className={`tabular-nums ${ended ? 'text-ink/40' : 'text-pink'}`}>{time}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-cream2 border border-ink/20 overflow-hidden">
          <div className="h-full bg-pink" style={{ width: `${Math.min(100, (raffle.entriesCount / Math.max(1, raffle.totalSpots)) * 100)}%` }} />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] font-black">
          <span>{raffle.entriesCount} ENTRIES</span>
          <span className="text-ink/50">{raffle.totalSpots} SPOTS</span>
        </div>
      </div>
    </Link>
  )
}
