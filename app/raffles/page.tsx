import { prisma } from '@/lib/db'
import { RaffleGrid } from '@/components/RaffleGrid'

export const dynamic = 'force-dynamic'

export default async function RafflesPage() {
  const raffles = await prisma.raffle.findMany({ orderBy: { endDate: 'desc' } })
  const data = raffles.map((r) => ({
    ...r,
    startDate: r.startDate.toISOString(),
    endDate: r.endDate.toISOString(),
  }))
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-black text-2xl mb-6">ALL RAFFLES</h1>
      <RaffleGrid raffles={data} />
    </main>
  )
}
