import { NextRequest, NextResponse } from 'next/server'
import { getUserRole } from '@/lib/admin'
import { prisma } from '@/lib/db'

// OWNER: promote/demote moderator by email
export async function POST(req: NextRequest) {
  const me = await getUserRole()
  if (!me || me.role !== 'OWNER') {
    return NextResponse.json({ message: 'owner only' }, { status: 403 })
  }
  const { email, action } = await req.json()
  if (!email || !action) return NextResponse.json({ message: 'email & action required' }, { status: 400 })

  const target = await prisma.user.findUnique({ where: { email: String(email).toLowerCase().trim() } })
  if (!target) return NextResponse.json({ message: 'user not found — they must login at least once first' }, { status: 404 })
  if (target.role === 'OWNER') return NextResponse.json({ message: 'cannot modify the owner' }, { status: 400 })

  const newRole = action === 'promote' ? 'MOD' : 'USER'
  await prisma.user.update({ where: { id: target.id }, data: { role: newRole } })
  return NextResponse.json({ ok: true, user: { email: target.email, role: newRole } })
}

// list users + roles (admin only)
export async function GET() {
  const me = await getUserRole()
  if (!me) return NextResponse.json({ message: 'forbidden' }, { status: 403 })
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, twitterUsername: true, discordUsername: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ users, me: me.role })
}
