# Choglist — Whitelist Raffle Platform

Whitelist raffle platform for the Choguniverse (Chogathon build).
Stack: Next.js 14 (App Router) · TypeScript · Tailwind · Prisma + SQLite · NextAuth (Discord + X)

## Setup

```bash
npm install
npx prisma db push
npx tsx prisma/seed.ts
cp .env.example .env   # isi client id/secret Discord & X
npm run dev
```

## Env vars (.env)

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="random-string"
NEXTAUTH_URL="http://localhost:3000"
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
TWITTER_CLIENT_ID=""
TWITTER_CLIENT_SECRET=""
```

## OAuth setup (butuh dari lu)

**Discord:** https://discord.com/developers/applications → New Application → OAuth2 → Copy Client ID & Secret → Redirect URI: `http://localhost:3000/api/auth/callback/discord`

**X/Twitter:** https://developer.twitter.com → Project & App → User authentication settings → OAuth 2.0 → Callback URI: `http://localhost:3000/api/auth/callback/twitter` → Copy Client ID (API key) & Client Secret

## Routes

- `/` — landing + live raffles
- `/raffles` — semua raffle
- `/raffles/[id]` — detail + Enter Raffle
- `/login` — Discord / X login
- `/profile` — data user + connected accounts + riwayat raffle
- `/admin` — list raffles + users (sementara)
- `POST /api/enter` — entry endpoint (requirement check = mock auto-pass)
