// Pre-build: flip prisma provider sqlite -> postgresql saat deploy ke Vercel
// (Vercel: DATABASE_PROVIDER=postgres + DATABASE_URL=postgresql://...)
// Lokal (VPS): ga ada env itu / sqlite -> schema dibiarkan apa adanya.
const fs = require('fs')

function readEnv() {
  try {
    const env = fs.readFileSync('.env', 'utf8')
    const m = env.match(/^DATABASE_PROVIDER\s*=\s*"?(\w+)"?/m)
    return m ? m[1] : null
  } catch { return null }
}

const provider = process.env.DATABASE_PROVIDER || readEnv()
if (provider === 'postgres' || provider === 'postgresql') {
  const path = 'prisma/schema.prisma'
  let schema = fs.readFileSync(path, 'utf8')
  if (schema.includes('provider = "sqlite"')) {
    schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"')
    fs.writeFileSync(path, schema)
    console.log('[prebuild] prisma provider -> postgresql (prod)')
  }
} else {
  console.log('[prebuild] keeping sqlite (dev)')
}
