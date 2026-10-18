import type { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import TwitterProvider from 'next-auth/providers/twitter'
import { prisma } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-me',
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      // Discord baru-baru ini mulai mengirim id_token; openid-client menolaknya
      // tanpa issuer. Kita tukar token manual & buang id_token — data user
      // tetap diambil via userinfo (identify email).
      token: {
        request: async ({ provider, params }: any) => {
          const res = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: 'Basic ' + Buffer.from(`${provider.clientId}:${provider.clientSecret}`).toString('base64'),
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              code: params.code,
              redirect_uri: provider.callbackUrl,
            }),
          })
          const tokens = await res.json()
          if (!tokens.access_token) throw new Error('discord token error: ' + JSON.stringify(tokens))
          delete tokens.id_token
          return { tokens }
        },
      },
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || '',
      clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
      version: '2.0',
    }),
  ],
  callbacks: {
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

        // LINK MODE: user udah login & connect provider kedua -> merge ke akun existing
        let linkTarget: string | null = null
        try {
          const { cookies } = await import('next/headers')
          const jar = cookies()
          linkTarget = jar.get('link_to')?.value || null
        } catch { /* no cookie access */ }
        if (linkTarget) {
          const target = await prisma.user.findUnique({ where: { id: linkTarget } })
          if (target) {
            await prisma.user.update({ where: { id: target.id }, data })
            return true
          }
        }

        await prisma.user.upsert({
          where: { email: user.email || `${account?.provider}:${account?.providerAccountId}@chog.local` },
          update: data,
          create: {
            email: user.email || `${account?.provider}:${account?.providerAccountId}@chog.local`,
            ...data,
          },
        })
        return true
      } catch (e) {
        console.error('signIn err', e)
        return true
      }
    },
    async jwt({ token, user, account }: any) {
      // X OAuth 2.0 sering tidak mengirim email — pakai fallback stabil
      if (user && account) {
        token.email = user.email || `${account.provider}:${account.providerAccountId}@chog.local`
        // LINK MODE: pertahankan email akun asli (yang di-link)
        try {
          const { cookies } = await import('next/headers')
          const linkTarget = cookies().get('link_to')?.value
          if (linkTarget) {
            const target = await prisma.user.findUnique({ where: { id: linkTarget } })
            if (target) token.email = target.email
          }
        } catch { /* ignore */ }
      }
      return token
    },
    async session({ session, token }) {
      const email = session.user?.email || (token.email as string | undefined)
      if (session.user && !session.user.email && email) {
        session.user.email = email
      }
      if (email) {
        const dbUser = await prisma.user.findUnique({ where: { email } })
        if (dbUser) {
          ;(session.user as any).id = dbUser.id
          ;(session.user as any).discordId = dbUser.discordId
          ;(session.user as any).twitterId = dbUser.twitterId
          ;(session.user as any).twitterUsername = dbUser.twitterUsername
          ;(session.user as any).discordUsername = dbUser.discordUsername
        }
      }
      return session
    },
  },
}
