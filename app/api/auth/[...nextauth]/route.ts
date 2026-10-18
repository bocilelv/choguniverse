import { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Route auth standar next-auth — param `nextauth` (signin/callback/signout/...)
// diteruskan apa adanya dari URL ke handler.
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
