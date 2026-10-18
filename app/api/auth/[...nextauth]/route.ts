import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// ==== ACCOUNT LINKING (per-request, lewat cookie link_to=<userId>) ====
// Dipasang dari tombol "Connect X/Discord" di /profile sebelum signIn().
let LINK_TARGET: string | null = null
let LINK_EMAIL: string | null = null

const handler = NextAuth({
  ...(authOptions as any),
  callbacks: {
    callbacks: (authOptions as any).callbacks || {},
    async signIn({ user, account }: any) {
      try {
        const provider = account?.provider
        const providerId = account?.providerAccountId
        const data: any = { name: user.name, image: user.image }
        if (provider === 'discord') {
          data.discordId = providerId
          data.discordUsername = user.name || 'chog'
        }
        if (provider === 'twitter') {
          data.twitterId = providerId
          data.twitterUsername = (user as any).username || user.name
        }

        // LINK MODE: user udah login & nyambungin provider kedua -> merge ke akun existing
        if (LINK_TARGET) {
          const target = await prisma.user.findUnique({ where: { id: LINK_TARGET } })
          if (target) {
            await prisma.user.update({ where: { id: target.id }, data })
            LINK_EMAIL = target.email
            return true
          }
        }

        // LOGIN NORMAL: cari existing by provider id dulu, kalau ada update; kalau ga upsert by email
        const byProvider = provider === 'discord'
          ? await prisma.user.findUnique({ where: { discordId: providerId } }).catch(() => null)
          : await prisma.user.findUnique({ where: { twitterId: providerId } }).catch(() => null)
        if (byProvider) {
          await prisma.user.update({ where: { id: byProvider.id }, data })
          LINK_EMAIL = byProvider.email
          return true
        }

        const email = user.email || `${provider}:${providerId}@chog.local`
        const byEmail = await prisma.user.findUnique({ where: { email } })
        if (byEmail) {
          await prisma.user.update({ where: { id: byEmail.id }, data })
          LINK_EMAIL = byEmail.email
        } else {
          await prisma.user.create({ data: { email, ...data } })
          LINK_EMAIL = email
        }
        return true
      } catch (e) {
        console.error('signIn err', e)
        return true
      }
    },
    async jwt({ token, user, account }: any) {
      if (user && account) {
        token.email = LINK_EMAIL || user.email || `${account.provider}:${account.providerAccountId}@chog.local`
      }
      return token
    },
    // session callback dari authOptions tetap dipakai
    session: (authOptions as any).callbacks?.session as any,
  },
})

export async function GET(req: Request) {
  LINK_TARGET = readLinkCookie(req)
  LINK_EMAIL = null
  return handler(req, {})
}

export async function POST(req: Request) {
  LINK_TARGET = readLinkCookie(req)
  LINK_EMAIL = null
  return handler(req, {})
}

function readLinkCookie(req: Request): string | null {
  const cookie = req.headers.get('cookie') || ''
  const m = cookie.match(/link_to=([^;]+)/)
  return m ? decodeURIComponent(m[1]) : null
}
