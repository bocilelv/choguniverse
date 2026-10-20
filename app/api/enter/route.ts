import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { checkIfUserFollows } from '@/lib/twitter'
import { notifyEntry } from '@/lib/notify'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ message: 'login first' }, { status: 401 })

  const { raffleId } = await req.json()
  if (!raffleId) return NextResponse.json({ message: 'raffleId required' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  const raffle = await prisma.raffle.findUnique({ where: { id: raffleId } })
  if (!user || !raffle) return NextResponse.json({ message: 'not found' }, { status: 404 })

  if (raffle.endDate <= new Date()) return NextResponse.json({ message: 'raffle already ended' }, { status: 400 })
  if (raffle.startDate > new Date()) return NextResponse.json({ message: 'raffle not started yet' }, { status: 400 })

  const existing = await prisma.entry.findUnique({ where: { userId_raffleId: { userId: user.id, raffleId } } })
  if (existing) return NextResponse.json({ message: 'already entered this raffle' }, { status: 400 })

  // Requirement check (mock dulu — lihat lib/twitter.ts untuk ganti ke X API)
  if (raffle.twitterHandle1) {
    const follows = await checkIfUserFollows(raffle.twitterHandle1, 'mock-token')
    if (!follows) return NextResponse.json({ message: `follow @${raffle.twitterHandle1} on X first` }, { status: 403 })
  }

  // Wallet check: raffle SUI -> user harus sudah paste alamat SUI, dst.
  if (raffle.walletChain) {
    const walletMap: Record<string, string | null> = {
      EVM: user.evmAddress, SUI: user.suiAddress, BTC: user.btcAddress, INJ: user.injAddress,
    }
    const wallet = walletMap[raffle.walletChain]
    if (!wallet) {
      return NextResponse.json(
        { message: `paste your ${raffle.walletChain} wallet address in your profile first`, needsWallet: raffle.walletChain },
        { status: 400 },
      )
    }
  }

  const ticketNumber = raffle.entriesCount + 1
  await prisma.$transaction([
    prisma.entry.create({ data: { userId: user.id, raffleId, isValid: true, ticketNumber } }),
    prisma.raffle.update({ where: { id: raffleId }, data: { entriesCount: { increment: 1 } } }),
  ])

  // ping Discord: collab manager dapat notif tiap ada yang enter
  notifyEntry({
    user: user.twitterUsername ? '@' + user.twitterUsername : (user.discordUsername || user.name || user.email.slice(0, 12)),
    userImage: user.image,
    raffle: raffle.title,
    ticket: ticketNumber,
    entriesCount: raffle.entriesCount + 1,
    totalSpots: raffle.totalSpots,
  })

  return NextResponse.json({ ok: true, ticketNumber })
}
