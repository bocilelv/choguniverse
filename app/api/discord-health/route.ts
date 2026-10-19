import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Temporary sanitized diagnostic: validates Discord credentials from Vercel.
// Never returns the client secret or access token.
export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID || ''
  const clientSecret = process.env.DISCORD_CLIENT_SECRET || ''

  if (!clientId || !clientSecret) {
    return NextResponse.json({ ok: false, stage: 'env', error: 'missing_credentials' }, { status: 500 })
  }

  try {
    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId.trim(),
        client_secret: clientSecret.trim(),
        grant_type: 'client_credentials',
        scope: 'applications.commands.update',
      }),
      cache: 'no-store',
    })
    const text = await response.text()
    let payload: any = {}
    try { payload = JSON.parse(text) } catch { payload = { raw: text.slice(0, 80) } }

    return NextResponse.json({
      ok: response.ok && Boolean(payload.access_token),
      stage: 'token',
      status: response.status,
      error: payload.error || null,
      description: payload.error_description || payload.message || payload.raw || null,
      clientIdMatches: clientId.trim() === '1561239192225452094',
      secretLength: clientSecret.trim().length,
    }, { status: response.ok ? 200 : 502 })
  } catch (error: any) {
    return NextResponse.json({ ok: false, stage: 'network', error: error?.message || 'request_failed' }, { status: 502 })
  }
}
