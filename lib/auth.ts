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
    async session({ session, token }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } })
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
