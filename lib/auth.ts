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
    async signIn({ user, account }) {
      // simpan / update user di DB tiap login
      try {
        const data: any = { name: user.name, image: user.image }
        if (account?.provider === 'discord') {
          data.discordId = account.providerAccountId
          data.discordUsername = (user.name || '') + '#' + ((user as any).discriminator || '0000')
        }
        if (account?.provider === 'twitter') {
          data.twitterId = account.providerAccountId
          data.twitterUsername = (user as any).username || user.name
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
    async jwt({ token, user, account }) {
      // X OAuth 2.0 sering tidak mengirim email — pakai fallback stabil
      if (user && account) {
        token.email = user.email || `${account.provider}:${account.providerAccountId}@chog.local`
      }
      if (token.email && !user) {
        // keep existing token email on refresh
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
