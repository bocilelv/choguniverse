// Seed users + entries (nomor tiket) biar live feed & koleksi tiket langsung hidup
const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

const USERS = [
  { email: 'degen1@chog.local', name: 'degenkid', twitterId: '900000000000000001', twitterUsername: 'degenkid' },
  { email: 'whale2@chog.local', name: 'chogwhale', twitterId: '900000000000000002', twitterUsername: 'chogwhale' },
  { email: 'fren3@chog.local', name: 'chogfren', twitterId: '900000000000000003', twitterUsername: 'chogfren' },
  { email: 'alpha4@chog.local', name: 'alphachog', twitterId: '900000000000000004', twitterUsername: 'alphachog' },
  { email: 'miner5@chog.local', name: 'monminerr', twitterId: '900000000000000005', twitterUsername: 'monminerr' },
  { email: 'six6@chog.local', name: 'solswitcher', twitterId: '900000000000000006', twitterUsername: 'solswitcher' },
]

async function main() {
  for (const u of USERS) {
    await p.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, evmAddress: u.email.startsWith('degen') ? '0x' + u.twitterId.slice(-40).padStart(40, 'a') : null },
    })
  }
  const users = await p.user.findMany({ where: { email: { endsWith: '@chog.local' } } })
  const raffles = await p.raffle.findMany({ orderBy: { createdAt: 'asc' } })

  await p.entry.deleteMany({ where: { user: { email: { contains: '@chog.local', not: 'bocilcs11' } } } })
  // reset entriesCount ke 0 dulu biar konsisten, lalu entry ulang
  for (const r of raffles) await p.raffle.update({ where: { id: r.id }, data: { entriesCount: 0 } })

  let total = 0
  const minsAgo = (m) => new Date(Date.now() - m * 60000)
  const plan = [
    { r: 0, n: 6 }, { r: 1, n: 5 }, { r: 2, n: 6 }, { r: 3, n: 6 }, { r: 4, n: 5 },
  ]
  for (const { r, n } of plan) {
    if (!raffles[r]) continue
    let ticket = 0
    for (let i = 0; i < n; i++) {
      const u = users[(r + i) % users.length]
      ticket++
      await p.entry.create({
        data: {
          userId: u.id, raffleId: raffles[r].id, ticketNumber: ticket,
          isValid: true, createdAt: minsAgo(2 + i * 3),
        },
      })
      total++
    }
    await p.raffle.update({ where: { id: raffles[r].id }, data: { entriesCount: ticket } })
  }
  console.log(`seeded ${total} entries from ${users.length} dummy users`)
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
