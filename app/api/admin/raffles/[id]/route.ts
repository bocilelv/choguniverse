import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ message: 'forbidden' }, { status: 403 })
  const body = await req.json()
  const data: any = {}
  if (body.title !== undefined) data.title = String(body.title).trim()
  if (body.description !== undefined) data.description = String(body.description).trim() || null
  if (body.image !== undefined) data.image = String(body.image).trim()
  if (body.blockchain !== undefined) data.blockchain = String(body.blockchain).trim()
  if (body.totalSpots !== undefined) data.totalSpots = Math.max(1, parseInt(body.totalSpots) || 100)
  if (body.twitterHandle1 !== undefined) data.twitterHandle1 = String(body.twitterHandle1).trim() || 'chog'
  if (body.twitterHandle2 !== undefined) data.twitterHandle2 = String(body.twitterHandle2).trim() || null
  if (body.twitterHandle3 !== undefined) data.twitterHandle3 = String(body.twitterHandle3).trim() || null
  if (body.discordInvite1 !== undefined) data.discordInvite1 = String(body.discordInvite1).trim() || null
  if (body.discordInvite2 !== undefined) data.discordInvite2 = String(body.discordInvite2).trim() || null
  if (body.likePostUrl !== undefined) data.likePostUrl = String(body.likePostUrl).trim() || null
  if (body.rtPostUrl !== undefined) data.rtPostUrl = String(body.rtPostUrl).trim() || null
  if (body.endDate !== undefined) data.endDate = new Date(body.endDate)
  if (body.startDate !== undefined) data.startDate = new Date(body.startDate)
  try {
    const raffle = await prisma.raffle.update({ where: { id: params.id }, data })
    return NextResponse.json({ ok: true, raffle })
  } catch {
    return NextResponse.json({ message: 'raffle not found' }, { status: 404 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ message: 'forbidden' }, { status: 403 })
  try {
    await prisma.raffle.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: 'raffle not found' }, { status: 404 })
  }
}
