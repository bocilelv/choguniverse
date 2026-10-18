import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ message: 'login first' }, { status: 401 })

  const body = await req.json()
  const clean = (s: unknown) => (typeof s === 'string' ? s.trim().slice(0, 100) || null : null)

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      evmAddress: clean(body.evmAddress),
      suiAddress: clean(body.suiAddress),
      btcAddress: clean(body.btcAddress),
      injAddress: clean(body.injAddress),
    },
  })
  return NextResponse.json({ ok: true })
}
