'use client'

import Link from 'next/link'

type Raffle = {
  id: string; title: string; image: string; endDate: string; totalSpots: number; entriesCount: number; blockchain: string; status: string
}

function timeLeft(endDate: string) {
  const ms = new Date(endDate).getTime() - Date.now()
  if (ms <= 0) return 'ENDED'
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h left`
  return `${h}h ${m}m left`
}

export function RaffleCard({ raffle }: { raffle: Raffle }) {
  const ended = raffle.status === 'ENDED' || new Date(raffle.endDate).getTime() < Date.now()
  return (
    <Link href={`/raffles/${raffle.id}`} className="group block rounded-2xl border-2 border-ink bg-white overflow-hidden shadow-[4px_4px_0_ink] hover:shadow-[6px_6px_0_ink] hover:-translate-y-0.5 transition-all">
      <div className="relative aspect-square bg-cream2 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={raffle.image} alt={raffle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <span className={`absolute top-2 left-2 text-[10px] font-black px-2 py-1 rounded-md border border-ink ${ended ? 'bg-ink text-cream' : 'bg-pink text-white'}`}>
          {ended ? 'ENDED' : '● LIVE'}
        </span>
        <span className="absolute top-2 right-2 text-[10px] font-black px-2 py-1 rounded-md border border-ink bg-gold text-ink">
          {raffle.blockchain}
        </span>
      </div>
      <div className="p-3">
        <h3 className="font-black text-sm leading-tight truncate">{raffle.title}</h3>
        <div className="mt-2 grid grid-cols-3 gap-1 text-center">
          <div>
            <div className="text-[9px] font-bold text-ink/50 uppercase">Ends in</div>
            <div className={`text-[11px] font-black ${ended ? 'text-ink/40' : 'text-pink'}`}>{timeLeft(raffle.endDate)}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold text-ink/50 uppercase">Entries</div>
            <div className="text-[11px] font-black">{raffle.entriesCount}</div>
          </div>
          <div>
            <div className="text-[9px] font-bold text-ink/50 uppercase">Spots</div>
            <div className="text-[11px] font-black">{raffle.totalSpots}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
