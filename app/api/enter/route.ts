import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'login first' }, { status: 401 })
  }
  const { raffleId } = await req.json()
  if (!raffleId) return NextResponse.json({ message: 'raffleId required' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  const raffle = await prisma.raffle.findUnique({ where: { id: raffleId } })
  if (!user || !raffle) return NextResponse.json({ message: 'not found' }, { status: 404 })
  if (raffle.endDate.getTime() < Date.now() || raffle.status === 'ENDED') {
    return NextResponse.json({ message: 'raffle ended' }, { status: 400 })
  }

  const existing = await prisma.entry.findUnique({ where: { userId_raffleId: { userId: user.id, raffleId } } })
  if (existing) return NextResponse.json({ message: 'already entered' }, { status: 400 })

  // MOCK requirement check — anggap twitter follow = true (testing mode)
  // TODO: real follow check via API when ready
  const twitterOk = true
  const discordOk = true
  const isValid = twitterOk && discordOk

  await prisma.entry.create({ data: { userId: user.id, raffleId, isValid } })
  const updated = await prisma.raffle.update({
    where: { id: raffleId },
    data: { entriesCount: { increment: 1 } },
  })

  return NextResponse.json({ message: "You're in! 🎟️", entriesCount: updated.entriesCount })
}
