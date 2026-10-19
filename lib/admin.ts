import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// ADMIN = role-based: OWNER (email di ADMIN_EMAIL env) atau MOD (dipromote owner)
export async function getUserRole(): Promise<{ role: string; userId: string; email: string } | null> {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!email) return null
  const admins = (process.env.ADMIN_EMAIL || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
  const isOwner = admins.includes(email.toLowerCase())
  const dbUser = await prisma.user.findUnique({ where: { email } }).catch(() => null)
  if (isOwner) {
    // owner pasti punya role OWNER di DB
    if (dbUser && dbUser.role !== 'OWNER') {
      await prisma.user.update({ where: { id: dbUser.id }, data: { role: 'OWNER' } }).catch(() => {})
    }
    return { role: 'OWNER', userId: dbUser?.id || '', email }
  }
  if (dbUser && (dbUser.role === 'MOD' || dbUser.role === 'OWNER')) {
    return { role: dbUser.role, userId: dbUser.id, email }
  }
  return null
}

export async function isAdmin(): Promise<boolean> {
  return (await getUserRole()) !== null
}
