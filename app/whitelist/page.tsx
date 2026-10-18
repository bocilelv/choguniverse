import { prisma } from '@/lib/db'
import { RaffleCard } from '@/components/RaffleCard'
import { LiveFeed } from '@/components/LiveFeed'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const raffles = await prisma.raffle.findMany({ orderBy: { endDate: 'asc' } })
  const now = Date.now()
  const live = raffles.filter((r) => r.startDate.getTime() <= now && r.endDate.getTime() > now)
  const ended = raffles.filter((r) => r.endDate.getTime() <= now)

  const toCard = (r: (typeof raffles)[number]) => ({
    ...r, startDate: r.startDate.toISOString(), endDate: r.endDate.toISOString(),
  })

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* HERO — art bar ala choguniverse */}
      <section className="relative rounded-3xl border-2 border-ink overflow-hidden mb-10 shadow-[6px_6px_0_ink]">
        <div className="relative aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/choglist-hero.webp" alt="chogs waiting for whitelist" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/90 via-cream/40 to-transparent" />
          <div className="absolute top-6 left-6 sm:top-8 sm:left-10">
            <h1 className="font-black text-3xl sm:text-5xl tracking-tight leading-none drop-shadow-sm">
              WHITELIST<br /><span className="text-pink">RAFFLES</span>
            </h1>
            <p className="mt-2 font-bold text-xs sm:text-sm text-ink/80 max-w-xs drop-shadow-sm">
              gated whitelist raffles for CHOG Genesis holders
            </p>
          </div>
          <a href="/collab"
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 font-black text-xs sm:text-sm bg-ink text-cream border-2 border-ink rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 shadow-[3px_3px_0_rgba(0,0,0,0.3)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-pink hover:border-ink transition-colors">
            REQUEST COLLAB →
          </a>
        </div>
      </section>

      {/* LIVE ENTRIES FEED */}
      <LiveFeed />

      {/* LIVE */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-black text-xl">LIVE</h2>
        <span className="text-[10px] font-black px-2 py-1 rounded-md bg-pink text-white border-2 border-ink">● RUNNING NOW</span>
      </div>
      {live.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {live.map((r) => <RaffleCard key={r.id} raffle={toCard(r)} />)}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-ink/30 p-10 text-center font-bold text-ink/40 mb-8">
          no live raffles right now — check back soon
        </div>
      )}

      {/* ENDED */}
      <div className="flex items-center gap-3 mb-4 mt-10">
        <h2 className="font-black text-xl">ENDED</h2>
      </div>
      {ended.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ended.map((r) => <RaffleCard key={r.id} raffle={toCard(r)} />)}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-ink/30 p-10 text-center font-bold text-ink/40">
          no ended raffles yet
        </div>
      )}
    </main>
  )
}
