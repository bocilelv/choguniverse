import { prisma } from '@/lib/db'
import { RaffleCard } from '@/components/RaffleCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const raffles = await prisma.raffle.findMany({
    where: { status: 'LIVE' },
    orderBy: { endDate: 'asc' },
    take: 6,
  })
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* HERO */}
      <section className="relative rounded-3xl border-2 border-ink overflow-hidden bg-gradient-to-br from-cream2 to-gold/30 p-8 sm:p-12 mb-10">
        <h1 className="font-black text-3xl sm:text-5xl tracking-tight leading-none">
          WHITELIST<br /><span className="text-pink">RAFFLES</span>
        </h1>
        <p className="mt-3 font-bold text-sm sm:text-base text-ink/70 max-w-md">
          gated whitelist raffles for the choguniverse — follow, join, win spots.
        </p>
        <Link href="/raffles" className="inline-block mt-5 font-black text-sm bg-pink text-white border-2 border-ink rounded-xl px-6 py-3 shadow-[4px_4px_0_ink] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
          BROWSE RAFFLES →
        </Link>
        <div className="absolute right-4 bottom-2 text-6xl sm:text-8xl opacity-20 select-none">🐴</div>
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
