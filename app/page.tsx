import { prisma } from '@/lib/db'
import { RaffleCard } from '@/components/RaffleCard'


export const dynamic = 'force-dynamic'

export default async function Home() {
  const raffles = await prisma.raffle.findMany({
    where: { status: 'LIVE' },
    orderBy: { endDate: 'asc' },
    take: 6,
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
        </div>
      </section>

      {/* GRID */}
      <h2 className="font-black text-xl mb-4">LIVE RAFFLES</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {raffles.map((r) => (
          <RaffleCard key={r.id} raffle={{ ...r, endDate: r.endDate.toISOString() }} />
        ))}
      </div>
    </main>
  )
}
