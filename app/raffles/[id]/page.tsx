import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { EnterButton } from './EnterButton'

export const dynamic = 'force-dynamic'

export default async function RaffleDetail({ params }: { params: { id: string } }) {
  const r = await prisma.raffle.findUnique({
    where: { id: params.id },
    include: {
      entries: {
        where: { isWinner: true },
        include: { user: true },
      },
    },
  })
  if (!r) notFound()

  const now = Date.now()
  const start = r.startDate.getTime()
  const end = r.endDate.getTime()
  const upcoming = start > now
  const ended = end <= now

  const follows = [r.twitterHandle1, r.twitterHandle2, r.twitterHandle3].filter(Boolean)
  const discords = [r.discordInvite1, r.discordInvite2].filter(Boolean)

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <a href="/" className="inline-block font-black text-xs mb-4 hover:text-pink">← BACK</a>

      <div className="rounded-3xl border-2 border-ink overflow-hidden bg-white shadow-[6px_6px_0_ink]">
        <div className="relative aspect-video bg-cream2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={r.image} alt={r.title} className="w-full h-full object-contain" />
          <span className={`absolute top-3 left-3 text-xs font-black px-3 py-1.5 rounded-lg border-2 border-ink ${upcoming ? 'bg-gold' : ended ? 'bg-ink text-cream' : 'bg-pink text-white'}`}>
            {upcoming ? 'SOON' : ended ? 'ENDED' : '● LIVE'}
          </span>
          <span className="absolute top-3 right-3 text-xs font-black px-3 py-1.5 rounded-lg bg-white border-2 border-ink">
            {r.blockchain}
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <h1 className="font-black text-2xl">{r.title}</h1>
          <p className="mt-2 font-bold text-sm text-ink/70">{r.description}</p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl border-2 border-ink bg-cream2 p-3 text-center">
              <div className="font-black text-[10px] text-ink/50 uppercase">{upcoming ? 'Starts in' : ended ? 'Ended' : 'Ends in'}</div>
              <div className="font-black text-sm mt-1 tabular-nums" data-countdown data-end={r.endDate.toISOString()} data-start={r.startDate.toISOString()}>
                {upcoming ? new Date(r.startDate).toLocaleString() : new Date(r.endDate).toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl border-2 border-ink bg-cream2 p-3 text-center">
              <div className="font-black text-[10px] text-ink/50 uppercase">Entries</div>
              <div className="font-black text-xl mt-1">{r.entriesCount}</div>
            </div>
            <div className="rounded-xl border-2 border-ink bg-cream2 p-3 text-center">
              <div className="font-black text-[10px] text-ink/50 uppercase">Spots</div>
              <div className="font-black text-xl mt-1">{r.totalSpots}</div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border-2 border-ink bg-cream2 p-4">
            <div className="font-black text-[10px] text-ink/50 uppercase mb-2">Requirements</div>
            <div className="space-y-2">
              {follows.map((h) => (
                <div key={h} className="flex items-center gap-2 font-bold text-sm">
                  <span className="text-green-600">✅</span> Follow <a href={`https://x.com/${h}`} target="_blank" rel="noopener" className="text-pink underline">@{h}</a> on X
                </div>
              ))}
              {discords.map((d, i) => (
                <div key={d} className="flex items-center gap-2 font-bold text-sm">
                  <span className="text-green-600">✅</span> Join <a href={d || "#"} target="_blank" rel="noopener" className="text-pink underline">Discord server {i + 1}</a>
                </div>
              ))}
              {r.likePostUrl && (
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span className="text-green-600">✅</span> <a href={r.likePostUrl} target="_blank" rel="noopener" className="text-pink underline">Like this post</a>
                </div>
              )}
              {r.rtPostUrl && (
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span className="text-green-600">✅</span> <a href={r.rtPostUrl} target="_blank" rel="noopener" className="text-pink underline">RT this post</a>
                </div>
              )}
            </div>
            <p className="mt-2 text-[11px] font-bold text-ink/40">requirements are verified when you enter — mock mode: auto-pass</p>
          </div>

          <div className="mt-5">
            <EnterButton raffleId={r.id} ended={ended || upcoming} upcoming={upcoming} />
          </div>

          {r.entries.length > 0 && (
            <div className="mt-6 rounded-2xl border-2 border-ink bg-gold/30 p-4">
              <div className="font-black text-[10px] text-ink/60 uppercase mb-2">🏆 Winners ({r.entries.length}/{r.totalSpots})</div>
              <div className="flex flex-wrap gap-2">
                {r.entries.map((e) => (
                  <span key={e.id} className="text-xs font-black px-2.5 py-1.5 rounded-lg border-2 border-ink bg-white">
                    {e.user.twitterUsername ? '@' + e.user.twitterUsername : e.user.name || e.user.email.slice(0, 12)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
