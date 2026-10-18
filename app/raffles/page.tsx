import { prisma } from '@/lib/db'
import { RaffleCard } from '@/components/RaffleCard'

export const dynamic = 'force-dynamic'

export default async function RafflesPage() {
  const raffles = await prisma.raffle.findMany({ orderBy: { endDate: 'asc' } })
  const live = raffles.filter(r => r.status === 'LIVE' && r.endDate.getTime() > Date.now())
  const ended = raffles.filter(r => r.status === 'ENDED' || r.endDate.getTime() <= Date.now())
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-black text-2xl sm:text-3xl mb-6">ALL RAFFLES</h1>
      <h2 className="font-black text-lg mb-3 text-pink">● LIVE ({live.length})</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {live.map(r => <RaffleCard key={r.id} raffle={{ ...r, endDate: r.endDate.toISOString() }} />)}
      </div>
      <h2 className="font-black text-lg mb-3 text-ink/50">ENDED ({ended.length})</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {ended.map(r => <RaffleCard key={r.id} raffle={{ ...r, endDate: r.endDate.toISOString() }} />)}
      </div>
    </main>
  )
}
