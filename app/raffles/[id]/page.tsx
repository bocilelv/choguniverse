import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { EnterButton } from './EnterButton'

export const dynamic = 'force-dynamic'

export default async function RaffleDetail({ params }: { params: { id: string } }) {
  const r = await prisma.raffle.findUnique({ where: { id: params.id } })
  if (!r) notFound()

  const ms = r.endDate.getTime() - Date.now()
  const ended = r.status === 'ENDED' || ms <= 0
  const timeStr = ended ? 'ENDED' : (ms > 86400000
    ? `${Math.floor(ms / 86400000)}d ${Math.floor((ms % 86400000) / 3600000)}h left`
    : `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m left`)

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="rounded-3xl border-2 border-ink bg-white overflow-hidden shadow-[6px_6px_0_ink]">
        <div className="relative aspect-[16/9] bg-cream2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
          <span className={`absolute top-3 left-3 text-xs font-black px-3 py-1.5 rounded-lg border-2 border-ink ${ended ? 'bg-ink text-cream' : 'bg-pink text-white'}`}>
            {ended ? 'ENDED' : '● LIVE'}
          </span>
          <span className="absolute top-3 right-3 text-xs font-black px-3 py-1.5 rounded-lg border-2 border-ink bg-gold">
            {r.blockchain}
          </span>
        </div>
        <div className="p-6">
          <h1 className="font-black text-2xl leading-tight">{r.title}</h1>
          <p className="mt-3 font-semibold text-sm text-ink/70 leading-relaxed">{r.description}</p>

          <div className="mt-6 grid grid-cols-3 gap-2 text-center border-2 border-ink rounded-2xl overflow-hidden">
            <div className="p-3 bg-cream2">
              <div className="text-[10px] font-black text-ink/50 uppercase">Ends in</div>
              <div className={`font-black ${ended ? 'text-ink/40' : 'text-pink'}`}>{timeStr}</div>
            </div>
            <div className="p-3 bg-cream2 border-x-2 border-ink">
              <div className="text-[10px] font-black text-ink/50 uppercase">Entries</div>
              <div className="font-black">{r.entriesCount}</div>
            </div>
            <div className="p-3 bg-cream2">
              <div className="text-[10px] font-black text-ink/50 uppercase">Spots</div>
              <div className="font-black">{r.totalSpots}</div>
            </div>
          </div>

          {/* REQUIREMENTS */}
          <div className="mt-6">
            <div className="font-black text-sm mb-2">REQUIREMENTS</div>
            <div className="space-y-2">
              {r.twitterFollowRequired && (
                <div className="flex items-center gap-2 border-2 border-ink rounded-xl px-3 py-2 bg-cream2 text-sm font-bold">
                  <span>✅</span> Follow <span className="text-purple">{r.twitterHandle}</span> on X
                </div>
              )}
              {r.discordRequired && (
                <div className="flex items-center gap-2 border-2 border-ink rounded-xl px-3 py-2 bg-cream2 text-sm font-bold">
                  <span>✅</span> Join the <span className="text-purple">Chog Discord</span>
                </div>
              )}
            </div>
            <p className="mt-2 text-[11px] font-bold text-ink/50">requirements are verified when you enter — mock mode: auto-pass</p>
          </div>

          <div className="mt-6">
            <EnterButton raffleId={r.id} ended={ended} />
          </div>
        </div>
      </div>
    </main>
  )
}
