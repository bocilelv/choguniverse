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
      // Keep the exact same redirect URI for BOTH authorization and token exchange.
      // Discord compares this value byte-for-byte at the token endpoint.
      authorization: {
        url: 'https://discord.com/api/oauth2/authorize',
        params: {
          scope: 'identify email',
          redirect_uri: 'https://www.choguniverse.xyz/api/auth/callback/discord',
        },
      },
      token: {
        async request({ params }: any) {
          const response = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.DISCORD_CLIENT_ID || '',
              client_secret: process.env.DISCORD_CLIENT_SECRET || '',
              grant_type: 'authorization_code',
              code: String(params.code || ''),
              redirect_uri: 'https://www.choguniverse.xyz/api/auth/callback/discord',
            }),
          })
          const tokens = await response.json()
          if (!response.ok || !tokens.access_token) {
            console.error('Discord token exchange failed', {
              status: response.status,
              error: tokens.error,
              description: tokens.error_description,
            })
            throw new Error(`Discord token exchange failed: ${tokens.error || response.status}`)
          }
          // The profile is fetched from Discord's /users/@me endpoint.
          // Ignore the optional OIDC id_token to avoid mixing OAuth and OIDC flows.
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

        // LOGIN NORMAL: cari existing by provider id DULU (hindari unique duplikat),
        // baru fallback ke email upsert
        const byProvider = provider === 'discord'
          ? await prisma.user.findUnique({ where: { discordId: providerId } }).catch(() => null)
          : provider === 'twitter'
            ? await prisma.user.findUnique({ where: { twitterId: providerId } }).catch(() => null)
            : null
        if (byProvider) {
          await prisma.user.update({ where: { id: byProvider.id }, data })
          return true
        }

        const email = user.email || `${provider}:${providerId}@chog.local`
        await prisma.user.upsert({
          where: { email },
          update: data,
          create: {
            email,
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
      // simpan provider info untuk resolve akun
      if (account) {
        token.provider = account.provider
        token.providerAccountId = account.providerAccountId
      }
      if (user && account) {
        // X OAuth 2.0 sering tidak mengirim email — resolve via provider id dulu
        const byProvider = account.provider === 'discord'
          ? await prisma.user.findUnique({ where: { discordId: account.providerAccountId } }).catch(() => null)
          : account.provider === 'twitter'
            ? await prisma.user.findUnique({ where: { twitterId: account.providerAccountId } }).catch(() => null)
            : null
        token.email = byProvider?.email || user.email || `${account.provider}:${account.providerAccountId}@chog.local`
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
      let email = session.user?.email || (token.email as string | undefined)
      let dbUser = email ? await prisma.user.findUnique({ where: { email } }).catch(() => null) : null
      // fallback: session email basi (akun merged) -> resolve by provider id
      if (!dbUser && token.providerAccountId) {
        dbUser = (token.provider as string) === 'discord'
          ? await prisma.user.findUnique({ where: { discordId: token.providerAccountId as string } }).catch(() => null)
          : await prisma.user.findUnique({ where: { twitterId: token.providerAccountId as string } }).catch(() => null)
        if (dbUser) email = dbUser.email
      }
      if (session.user && email) session.user.email = email
      if (dbUser) {
        ;(session.user as any).id = dbUser.id
        ;(session.user as any).discordId = dbUser.discordId
        ;(session.user as any).twitterId = dbUser.twitterId
        ;(session.user as any).twitterUsername = dbUser.twitterUsername
        ;(session.user as any).discordUsername = dbUser.discordUsername
      }
      return session
    },
  },
}
