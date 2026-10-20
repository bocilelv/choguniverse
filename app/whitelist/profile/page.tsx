import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { RaffleCard } from '@/components/RaffleCard'
import { ConnectAccounts } from './ConnectAccounts'
import { WalletForms } from './WalletForms'
import { TicketCollection } from './TicketCollection'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return (
      <main className="max-w-md mx-auto px-4 py-16 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/profile-art.webp" alt="chog lock globe" className="w-36 h-36 mx-auto object-contain mb-4" />
        <h1 className="font-black text-2xl">LOGIN REQUIRED</h1>
        <p className="mt-2 font-bold text-sm text-ink/60">login to see your profile</p>
        <a href="/whitelist/login" className="inline-block mt-6 font-black text-sm bg-pink text-white border-2 border-ink rounded-xl px-6 py-3 shadow-[4px_4px_0_ink]">GO TO LOGIN →</a>
      </main>
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { entries: { include: { raffle: true }, orderBy: { createdAt: 'desc' } } },
  })
  if (!user) return <main className="p-8 text-center font-bold">user not found — re-login</main>

  const raffles = user.entries.map((e) => e.raffle)

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* BACK TO WL RAFFLES */}
      <a href="/whitelist" className="inline-flex items-center gap-1.5 font-bold text-sm px-3.5 py-2 rounded-lg border-2 border-ink bg-white hover:bg-cream2 transition-colors mb-4">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        WL RAFFLES
      </a>

      {/* USER CARD */}
      <div className="rounded-3xl border-2 border-ink bg-white p-5 sm:p-6 shadow-[6px_6px_0_ink] flex items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.image || ''} alt="" className="w-20 h-20 rounded-2xl border-2 border-ink object-cover" />
        <div className="min-w-0">
          <h1 className="font-black text-2xl truncate">{user.name || 'chog'}</h1>
          <p className="text-xs font-bold text-ink/50 truncate">{user.email}</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {user.discordId && <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#5865F2] text-white border border-ink">DISCORD ✓</span>}
            {user.twitterId && <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-ink text-white border border-ink">X ✓</span>}
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-gold border border-ink">{user.entries.length} ENTRIES</span>
          </div>
        </div>
      </div>

      {/* CONNECT ACCOUNTS */}
      <ConnectAccounts
        userId={user.id}
        hasDiscord={!!user.discordId}
        hasTwitter={!!user.twitterId}
        discordUsername={user.discordUsername}
        twitterUsername={user.twitterUsername}
      />

      {/* WALLETS */}
      <WalletForms
        evmAddress={user.evmAddress}
        suiAddress={user.suiAddress}
        btcAddress={user.btcAddress}
        injAddress={user.injAddress}
      />

      {/* SOCIAL DATA */}
      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border-2 border-ink bg-cream2 p-4">
          <div className="font-black text-xs text-ink/50 uppercase mb-2">X / Twitter</div>
          {user.twitterId ? (
            <div className="text-sm font-bold space-y-1">
              <div>@{user.twitterUsername || user.name}</div>
              <div className="text-xs text-ink/50">id: {user.twitterId}</div>
            </div>
          ) : <div className="text-sm font-bold text-ink/40">not connected</div>}
        </div>
        <div className="rounded-2xl border-2 border-ink bg-cream2 p-4">
          <div className="font-black text-xs text-ink/50 uppercase mb-2">Discord</div>
          {user.discordId ? (
            <div className="text-sm font-bold space-y-1">
              <div>{user.discordUsername || user.name}</div>
              <div className="text-xs text-ink/50">id: {user.discordId}</div>
            </div>
          ) : <div className="text-sm font-bold text-ink/40">not connected</div>}
        </div>
      </div>

      {/* TICKET COLLECTION */}
      <TicketCollection tickets={user.entries.map((e) => ({
        id: e.id, ticketNumber: e.ticketNumber, isWinner: e.isWinner,
        raffle: { id: e.raffle.id, title: e.raffle.title, image: e.raffle.image, endDate: e.raffle.endDate, blockchain: e.raffle.blockchain },
      }))} />

      {/* ENTRY HISTORY */}
      <h2 className="font-black text-xl mt-10 mb-4">MY RAFFLES ({raffles.length})</h2>
      {raffles.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {raffles.map((r) => (
            <RaffleCard key={r.id} raffle={{ ...r, startDate: r.startDate.toISOString(), endDate: r.endDate.toISOString() }} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-ink/40 p-8 text-center font-bold text-ink/50">
          no raffles entered yet — <a href="/whitelist/raffles" className="text-pink underline">browse raffles</a>
        </div>
      )}
    </main>
  )
}
