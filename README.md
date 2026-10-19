# CHOG UNIVERSE

**A community toolkit for the CHOG NFT ecosystem — 5 tools, one home.**

Live at **https://www.choguniverse.xyz**

Built for the Chogathon. Every game runs on-chain (testnet during the hackathon, mainnet-ready EVM contracts) — trustless escrow, on-chain RNG, no custodial wallets.

## The Tools

| Tool | What it does | Where |
|---|---|---|
| **World Map** | Chog holders plant pins anywhere on the world map. Each pin hyperlinks to the holder's X profile. Fully on-chain (ChogWorld contract). | `/map` |
| **Chogffle** | NFT raffles with trustless escrow — the prize NFT is held by the smart contract itself, not a wallet. Auto-draw keeper settles winners on-chain when time ends. | `/chogffle` |
| **Chogping** | Paid love-letter announcements (0.002 ETH) — send a message that pings the Chog Discord. | `/chogping` |
| **Chogflip** | Double-or-nothing coinflip on Robinhood Chain testnet + Monad testnet. Provably fair on-chain RNG. | `/chogflip` |
| **Whitelist** | Raffle platform for whitelist spots. Login with Discord or X, complete tasks (follows, joins, like/RT), paste your wallet, get a unique ticket number. Admin panel with role-based access (owner promotes moderators). | `/whitelist` |

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, Node.js
- **Database:** Prisma ORM + Neon Postgres (SQLite for local dev)
- **Auth:** NextAuth v4 — Discord OAuth2 + X OAuth2 with account linking
- **Blockchain:** Solidity, EVM (Robinhood Chain testnet + Monad testnet), ethers.js
- **Hosting:** Vercel (app) + VPS (keeper bot, event indexer, data snapshots)
- **Integrations:** Discord webhooks (collab requests, chogping announcements)

## Project Structure

```
app/
  whitelist/          # raffle platform pages (login, profile, admin, raffles)
  api/                # API routes (auth, enter, admin, feed, collab)
components/           # Navbar, RaffleCard, LiveFeed, Providers
lib/                  # db (Prisma client), auth (NextAuth config), admin (roles), twitter (follow check)
prisma/               # schema + seed
public/               # static pages: map, chogffle, chogping, chogflip + assets
contracts/            # Solidity contracts (ChogWorld, ChogRaffleV2, ChogFlip)
scripts/              # deploy scripts, keeper bot, data server
```

## Run Locally

```bash
npm install
cp .env.example .env    # fill in your own OAuth credentials
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

You need your own Discord + X OAuth apps (see `.env.example`). The static tools (`/map`, `/chogffle`, `/chogping`, `/chogflip`) read on-chain data from Robinhood Chain testnet contracts and a snapshot API.

## Environment Variables

See `.env.example` — never commit real secrets. All provider credentials are server-side only.

---

designed by [@bocilelv](https://x.com/bocilelv) · chog universe — a community build for the Chogathon
