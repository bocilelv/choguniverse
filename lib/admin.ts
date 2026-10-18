import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!email) return false
  const admins = (process.env.ADMIN_EMAIL || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return admins.includes(email.toLowerCase())
}
