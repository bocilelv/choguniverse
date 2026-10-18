import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'

// Live feed: entry terbaru (username + raffle + waktu)
export async function GET() {
  const entries = await prisma.entry.findMany({
    orderBy: { createdAt: 'desc' },
    take: 12,
    include: {
      user: { select: { name: true, twitterUsername: true, image: true } },
      raffle: { select: { id: true, title: true, image: true } },
    },
  })
  return NextResponse.json({
    feed: entries.map((e) => ({
      id: e.id,
      ticket: e.ticketNumber,
      user: e.user.twitterUsername || e.user.name || 'anon',
      image: e.user.image,
      raffleId: e.raffle.id,
      raffle: e.raffle.title,
      raffleImage: e.raffle.image,
      at: e.createdAt.toISOString(),
    })),
  })
}
