import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const raffles = await prisma.raffle.findMany({ orderBy: { createdAt: 'desc' } })
  const users = await prisma.user.findMany({ include: { _count: { select: { entries: true } } } })
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-black text-2xl mb-2">ADMIN <span className="text-ink/40 text-sm font-bold">(sementara)</span></h1>

      <h2 className="font-black text-lg mt-6 mb-3">Raffles ({raffles.length})</h2>
      <div className="border-2 border-ink rounded-2xl overflow-hidden bg-white">
        {raffles.map(r => (
          <div key={r.id} className="flex items-center justify-between px-4 py-3 border-b border-ink/10 last:border-0">
            <div className="min-w-0">
              <div className="font-black text-sm truncate">{r.title}</div>
              <div className="text-[10px] font-bold text-ink/50">{r.entriesCount} entries · {r.totalSpots} spots · {r.blockchain}</div>
            </div>
            <span className={`text-[10px] font-black px-2 py-1 rounded border border-ink ${r.status === 'ENDED' ? 'bg-ink text-cream' : 'bg-pink text-white'}`}>{r.status}</span>
          </div>
        ))}
      </div>

      <h2 className="font-black text-lg mt-8 mb-3">Users ({users.length})</h2>
      <div className="border-2 border-ink rounded-2xl overflow-hidden bg-white">
        {users.length === 0 && <div className="px-4 py-6 text-center font-bold text-ink/40 text-sm">no users yet</div>}
        {users.map(u => (
          <div key={u.id} className="flex items-center gap-3 px-4 py-3 border-b border-ink/10 last:border-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u.image || '/placeholder.svg'} alt="" className="w-8 h-8 rounded-full border border-ink object-cover" />
            <div className="min-w-0 flex-1">
              <div className="font-black text-sm truncate">{u.name || 'anon'}</div>
              <div className="text-[10px] font-bold text-ink/50 truncate">
                {u.discordId ? 'DISCORD' : ''} {u.twitterId ? '· X' : ''} {u.discordId || u.twitterId ? '' : 'no social'}
              </div>
            </div>
            <span className="text-[10px] font-black px-2 py-1 rounded bg-gold border border-ink">{u._count.entries} entries</span>
          </div>
        ))}
      </div>
    </main>
  )
}
