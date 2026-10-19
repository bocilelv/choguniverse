import { NextRequest, NextResponse } from 'next/server'

// Collab request -> Discord webhook (role ping + detail)
const WEBHOOK_URL = process.env.COLLAB_WEBHOOK_URL || ''
const ROLE_ID = process.env.COLLAB_ROLE_ID || ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = String(body.name || '').trim().slice(0, 200)
    const message = String(body.message || '').trim().slice(0, 2000)
    const contact = String(body.contact || '').trim().slice(0, 200)
    if (!name || !message || !contact) {
      return NextResponse.json({ message: 'name, message & contact are required' }, { status: 400 })
    }
    if (!WEBHOOK_URL) {
      return NextResponse.json({ message: 'collab webhook not configured' }, { status: 500 })
    }

    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `<@&${ROLE_ID}> new collab request 🔥`,
        embeds: [{
          title: '🤝 COLLAB REQUEST',
          color: 0xff5ca8,
          fields: [
            { name: 'Name', value: name, inline: false },
            { name: 'Message', value: message, inline: false },
            { name: 'Contact', value: contact, inline: false },
          ],
          footer: { text: 'choglist — collab form' },
          timestamp: new Date().toISOString(),
        }],
      }),
    })
    if (!res.ok) {
      const t = await res.text()
      return NextResponse.json({ message: 'discord webhook error: ' + t.slice(0, 120) }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: 'failed to send' }, { status: 500 })
  }
}
