import { NextResponse } from 'next/server'

// Whitelist entry notification -> Discord webhook (ping collab manager role)
const WEBHOOK_URL = process.env.WHITELIST_WEBHOOK_URL || ''
const ROLE_ID = process.env.WHITELIST_PING_ROLE_ID || ''

export async function notifyEntry(details: {
  user: string
  userImage?: string | null
  raffle: string
  ticket: number
  entriesCount: number
  totalSpots: number
}) {
  if (!WEBHOOK_URL) return
  try {
    const content = ROLE_ID
      ? `<@&${ROLE_ID}> new whitelist entry 🔥`
      : '🔥 new whitelist entry'
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        embeds: [{
          title: '🎫 NEW WHITELIST ENTRY',
          color: 0xff5ca8,
          thumbnail: details.userImage ? { url: details.userImage } : undefined,
          fields: [
            { name: 'User', value: details.user, inline: true },
            { name: 'Ticket', value: `#${details.ticket}`, inline: true },
            { name: 'Raffle', value: details.raffle, inline: false },
            { name: 'Progress', value: `${details.entriesCount}/${details.totalSpots} entries`, inline: false },
          ],
          footer: { text: 'choguniverse — whitelist platform' },
          timestamp: new Date().toISOString(),
        }],
      }),
    })
  } catch (e) {
    console.error('entry notify err', e)
  }
}
