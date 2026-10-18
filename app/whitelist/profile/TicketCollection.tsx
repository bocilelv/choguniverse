import Link from 'next/link'

type Ticket = {
  id: string
  ticketNumber: number
  isWinner: boolean
  raffle: { id: string; title: string; image: string; endDate: Date; blockchain: string }
}

// Koleksi kartu tiket user — tiap entry = 1 kartu (art + nomor tiket)
export function TicketCollection({ tickets }: { tickets: Ticket[] }) {
  if (!tickets.length) return null
  return (
    <>
      <h2 className="font-black text-xl mt-10 mb-4">MY TICKETS ({tickets.length})</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tickets.map((t) => {
          const ended = t.raffle.endDate.getTime() <= Date.now()
          return (
            <Link key={t.id} href={`/raffles/${t.raffle.id}`}
              className="group block rounded-2xl border-2 border-ink bg-white overflow-hidden shadow-[4px_4px_0_ink] hover:shadow-[2px_2px_0_ink] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <div className="relative aspect-square bg-cream2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.raffle.image} alt={t.raffle.title} className="w-full h-full object-contain" loading="lazy" />
                <span className="absolute top-2 left-2 text-[10px] font-black px-2 py-1 rounded-md bg-ink text-cream border-2 border-ink">
                  #{String(t.ticketNumber).padStart(3, '0')}
                </span>
                {t.isWinner && (
                  <span className="absolute top-2 right-2 text-[10px] font-black px-2 py-1 rounded-md bg-gold border-2 border-ink">
                    🏆 WON
                  </span>
                )}
              </div>
              <div className="p-2.5">
                <div className="font-black text-xs truncate">{t.raffle.title}</div>
                <div className="text-[10px] font-bold text-ink/50 mt-0.5">
                  {ended ? 'ended' : 'live'} · {t.raffle.blockchain}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
