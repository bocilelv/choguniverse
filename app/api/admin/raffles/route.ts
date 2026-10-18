import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/db'

async function bodyToData(body: any) {
  return {
    title: String(body.title || '').trim(),
    description: body.description ? String(body.description).trim() : null,
    image: String(body.image || 'https://picsum.photos/seed/chog/600/600').trim(),
    blockchain: String(body.blockchain || 'MONAD').trim(),
    startDate: body.startDate ? new Date(body.startDate) : new Date(),
    endDate: new Date(body.endDate),
    totalSpots: Math.max(1, parseInt(body.totalSpots) || 100),
    twitterFollowRequired: body.twitterFollowRequired !== false,
    twitterHandle: String(body.twitterHandle || 'chog').trim(),
    discordRequired: body.discordRequired !== false,
    discordInvite: String(body.discordInvite || 'https://discord.gg/chog').trim(),
    status: 'LIVE',
  }
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ message: 'forbidden' }, { status: 403 })
  const raffles = await prisma.raffle.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ raffles })
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ message: 'forbidden' }, { status: 403 })
  const body = await req.json()
  const data = await bodyToData(body)
  if (!data.title || isNaN(data.endDate.getTime())) {
    return NextResponse.json({ message: 'title & valid endDate required' }, { status: 400 })
  }
  const raffle = await prisma.raffle.create({ data })
  return NextResponse.json({ ok: true, raffle })
}
