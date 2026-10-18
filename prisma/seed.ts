import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const IMAGES = [
  'https://opensea.mypinata.cloud/ipfs/bafybeicf2nmnrbiqhfrqfbgas3wdshiqmdxbsj4ipfffhqdfrzg2m3wecu',
  'https://opensea.mypinata.cloud/ipfs/bafybeiavsg5q4v3jshjdfgdqrffmn3gdm3vj5dqlcfhajkldk5zvfwlkuq',
  'https://opensea.mypinata.cloud/ipfs/bafybeigwpfkwaih4blrv2l4hjki4rne7rfr4f7ilqcxfjek3vqzjwlcxnu',
  'https://opensea.mypinata.cloud/ipfs/bafybeibml5xsbytcvcepfhcexsmny47pytqvskheqjrrgzyxhgdjfhpmce',
  'https://opensea.mypinata.cloud/ipfs/bafybeicf2nmnrbiqhfrqfbgas3wdshiqmdxbsj4ipfffhqdfrzg2m3weeu',
]

async function main() {
  const now = Date.now()
  const day = 86400000
  const raffles = [
    { title: 'CHOG GENESIS WHITELIST', description: '50 whitelist spots for the CHOG Genesis mint. Follow @ChogNFT and join the Discord to enter. Winners drawn by on-chain RNG.', hours: 26, spots: 50, entries: 132, chain: 'MONAD' },
    { title: 'CHOG FRENS GIVEAWAY', description: '100 spots for CHOG FRENS mint on Monad. Guaranteed whitelist for all winners.', hours: 5 * 24, spots: 100, entries: 45, chain: 'MONAD' },
    { title: 'MYSTERY CHEST DROP', description: '20 Mystery Chest whitelist spots. Exclusive for the Chog community — one entry per wallet.', hours: 8, spots: 20, entries: 210, chain: 'MONAD' },
    { title: 'CHOGFFLE SEASON 1', description: '10 golden tickets to the first Chogffle season — priority whitelist + featured raffle slot.', hours: 12, spots: 10, entries: 68, chain: 'RH' },
    { title: 'DEGEN NIGHT RAFFLE', description: 'Chogping x Whitelist collab — 33 spots, announced live in Discord with a Chogping.', hours: -2, spots: 33, entries: 33, chain: 'MONAD' },
  ]
  for (let i = 0; i < raffles.length; i++) {
    const r = raffles[i]
    await prisma.raffle.create({
      data: {
        title: r.title,
        description: r.description,
        image: IMAGES[i % IMAGES.length],
        endDate: new Date(now + r.hours * 3600000),
        totalSpots: r.spots,
        entriesCount: r.entries,
        blockchain: r.chain,
        status: r.hours < 0 ? 'ENDED' : 'LIVE',
      },
    })
  }
  console.log('seeded', raffles.length, 'raffles')
}

main().finally(() => prisma.$disconnect())
