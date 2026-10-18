'use client'

import { useEffect, useState } from 'react'

type FeedItem = {
  id: string; ticket: number; user: string; image?: string | null
  raffleId: string; raffle: string; at: string
}

function ago(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  return `${Math.floor(s / 3600)}h ago`
}

export function LiveFeed() {
  const [items, setItems] = useState<FeedItem[]>([])

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch('/api/feed', { cache: 'no-store' })
        const data = await res.json()
        if (alive && Array.isArray(data.feed)) setItems(data.feed)
      } catch { /* offline tolerant */ }
    }
    load()
    const iv = setInterval(load, 5000)
    return () => { alive = false; clearInterval(iv) }
  }, [])

  if (items.length === 0) return null

  return (
    <div className="mb-10 overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-[4px_4px_0_ink]">
      <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-ink bg-ink text-cream">
        <span className="w-2 h-2 rounded-full bg-pink animate-pulse" />
        <span className="font-black text-[11px] uppercase tracking-wide">Live entries</span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto px-4 py-3 scrollbar-none">
        {items.map((it) => (
          <a key={it.id} href={`/raffles/${it.raffleId}`}
            className="shrink-0 flex items-center gap-2 rounded-xl border-2 border-ink bg-cream2 pl-1.5 pr-3 py-1.5 hover:bg-gold transition-colors">
            {it.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.image} alt="" className="w-7 h-7 rounded-full border-2 border-ink object-cover" />
            ) : (
              <span className="w-7 h-7 rounded-full border-2 border-ink bg-white flex items-center justify-center text-xs font-black">?</span>
            )}
            <span className="text-xs font-black whitespace-nowrap">
              {it.user.startsWith('@') ? it.user : it.user}
            </span>
            <span className="text-[11px] font-bold text-ink/50 whitespace-nowrap">
              entered <b>{it.raffle.slice(0, 18)}</b> · ticket #{it.ticket} · {ago(it.at)}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
