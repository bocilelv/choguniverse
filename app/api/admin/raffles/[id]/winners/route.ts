import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/db'

// Pick winners: pilih acak dari entri valid, tandai isWinner=true
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ message: 'forbidden' }, { status: 403 })

  const raffle = await prisma.raffle.findUnique({
    where: { id: params.id },
    include: { entries: { where: { isValid: true }, include: { user: true } } },
  })
  if (!raffle) return NextResponse.json({ message: 'raffle not found' }, { status: 404 })
  if (raffle.entries.length === 0) return NextResponse.json({ message: 'no entries to pick from' }, { status: 400 })

  // shuffle Fisher-Yates
  const pool = [...raffle.entries]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const winnerCount = Math.min(raffle.totalSpots, pool.length)
  const winners = pool.slice(0, winnerCount)

  await prisma.$transaction([
    prisma.entry.updateMany({ where: { raffleId: raffle.id }, data: { isWinner: false } }),
    ...winners.map((w) => prisma.entry.update({ where: { id: w.id }, data: { isWinner: true } })),
    prisma.raffle.update({ where: { id: raffle.id }, data: { status: 'ENDED' } }),
  ])

  return NextResponse.json({
    ok: true,
    winners: winners.map((w) => ({
      id: w.id,
      name: w.user.name,
      twitter: w.user.twitterUsername,
      discord: w.user.discordUsername,
      wallets: { evm: w.user.evmAddress, sui: w.user.suiAddress, btc: w.user.btcAddress, inj: w.user.injAddress },
    })),
  })
}
