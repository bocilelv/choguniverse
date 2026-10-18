import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const now = Date.now()
const HOUR = 3600 * 1000
const DAY = 24 * HOUR

const raffles = [
  {
    title: 'CHOG GENESIS WHITELIST',
    description: 'Whitelist spots for the CHOG Genesis mint. Follow @chog and join the Discord to enter — winners get guaranteed mint spots.',
    image: 'https://picsum.photos/seed/chog1/600/600',
    blockchain: 'MONAD',
    startDate: new Date(now - 2 * DAY),
    endDate: new Date(now + 18 * HOUR),
    totalSpots: 50,
    entriesCount: 132,
    twitterHandle1: 'chog',
    twitterHandle2: 'bocilelv',
    discordInvite1: 'https://discord.gg/chog',
  },
  {
    title: 'CHOG FRENS GIVEAWAY',
    description: 'Community giveaway for Chog frens. 10 spots, no purchase necessary. One entry per account.',
    image: 'https://picsum.photos/seed/chog2/600/600',
    blockchain: 'MONAD',
    startDate: new Date(now - 1 * DAY),
    endDate: new Date(now + 3 * DAY),
    totalSpots: 10,
    entriesCount: 64,
    twitterHandle1: 'chog',
    likePostUrl: 'https://x.com/chog/status/1',
    rtPostUrl: 'https://x.com/chog/status/1',
  },
  {
    title: 'MYSTERY CHEST DROP',
    description: '20 Mystery Chest whitelist spots. Exclusive for the Chog community — one entry per wallet.',
    image: 'https://picsum.photos/seed/chog3/600/600',
    blockchain: 'MONAD',
    startDate: new Date(now - 5 * HOUR),
    endDate: new Date(now + 7 * HOUR),
    totalSpots: 20,
    entriesCount: 210,
    twitterHandle1: 'chog',
    twitterHandle2: 'bocilelv',
    twitterHandle3: 'choguniverse',
    discordInvite1: 'https://discord.gg/chog',
    discordInvite2: 'https://discord.gg/chogfrens',
  },
  {
    title: 'CHOGFLIP SEASON 1',
    description: 'Whitelist for the Chogflip alpha season. Degens only. Flip responsibly.',
    image: 'https://picsum.photos/seed/chog4/600/600',
    blockchain: 'ROBINHOOD',
    startDate: new Date(now - 3 * DAY),
    endDate: new Date(now + 2 * DAY),
    totalSpots: 100,
    entriesCount: 351,
    twitterHandle1: 'chog',
    discordInvite1: 'https://discord.gg/chog',
  },
  {
    title: 'DEGEN NIGHT WL',
    description: 'Ended raffle — 30 whitelist spots for the Degen Night event.',
    image: 'https://picsum.photos/seed/chog5/600/600',
    blockchain: 'MONAD',
    startDate: new Date(now - 10 * DAY),
    endDate: new Date(now - 2 * DAY),
    totalSpots: 30,
    entriesCount: 187,
    twitterHandle1: 'chog',
    discordInvite1: 'https://discord.gg/chog',
  },
  {
    title: 'CHOGLIST GRAND OPENING',
    description: 'Upcoming — 100 spots celebrating the Choglist launch. Opens soon!',
    image: 'https://picsum.photos/seed/chog6/600/600',
    blockchain: 'MONAD',
    startDate: new Date(now + 1 * DAY),
    endDate: new Date(now + 8 * DAY),
    totalSpots: 100,
    entriesCount: 0,
    twitterHandle1: 'chog',
    discordInvite1: 'https://discord.gg/chog',
  },
  {
    title: 'TRENCH VIBE COLLAB WL',
    description: 'Upcoming collab whitelist with the Trench community.',
    image: 'https://picsum.photos/seed/chog7/600/600',
    blockchain: 'ROBINHOOD',
    startDate: new Date(now + 3 * DAY),
    endDate: new Date(now + 10 * DAY),
    totalSpots: 40,
    entriesCount: 0,
    twitterHandle1: 'bocilelv',
    likePostUrl: 'https://x.com/bocilelv/status/1',
  },
]

async function main() {
  await prisma.entry.deleteMany()
  await prisma.raffle.deleteMany()
  for (const r of raffles) {
    await prisma.raffle.create({
      data: {
        ...r,
        status: new Date(r.startDate) > new Date(now) ? 'UPCOMING' : new Date(r.endDate) < new Date(now) ? 'ENDED' : 'LIVE',
      },
    })
  }
  console.log(`seeded ${raffles.length} raffles`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
