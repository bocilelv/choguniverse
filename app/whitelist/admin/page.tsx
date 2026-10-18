import { prisma } from '@/lib/db'
import { isAdmin } from '@/lib/admin'
import { AdminClient } from './AdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return (
      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">⛔</div>
        <h1 className="font-black text-2xl">ADMIN ONLY</h1>
        <p className="mt-2 font-bold text-sm text-ink/60">this page is restricted</p>
      </main>
    )
  }

  const raffles = await prisma.raffle.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      entries: {
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      },
    },
  })

  return (
    <AdminClient
      raffles={raffles.map((r) => ({
        ...r,
        startDate: r.startDate.toISOString(),
        endDate: r.endDate.toISOString(),
        createdAt: r.createdAt.toISOString(),
        entries: r.entries.map((e) => ({
          id: e.id,
          isWinner: e.isWinner,
          isValid: e.isValid,
          name: e.user.name,
          email: e.user.email,
          twitter: e.user.twitterUsername,
          discord: e.user.discordUsername,
          evm: e.user.evmAddress,
          sui: e.user.suiAddress,
          btc: e.user.btcAddress,
          inj: e.user.injAddress,
        })),
      }))}
    />
  )
}
