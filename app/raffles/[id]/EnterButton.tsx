'use client'

import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'

export function EnterButton({ raffleId, ended }: { raffleId: string; ended: boolean }) {
  const { data: session } = useSession()
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function enter() {
    if (!session?.user) { signIn(); return }
    setState('loading')
    try {
      const res = await fetch('/api/enter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raffleId }),
      })
      const j = await res.json()
      if (res.ok) { setState('done'); setMsg(j.message) }
      else { setState('error'); setMsg(j.message || 'failed') }
    } catch { setState('error'); setMsg('network error') }
  }

  if (ended) {
    return <button disabled className="w-full font-black text-sm border-2 border-ink rounded-xl px-6 py-3 bg-ink/10 text-ink/40">RAFFLE ENDED</button>
  }
  if (state === 'done') {
    return <div className="w-full text-center font-black text-sm border-2 border-ink rounded-xl px-6 py-3 bg-gold">{msg || "You're in! 🎟️"}</div>
  }
  return (
    <div>
      <button
        onClick={enter}
        disabled={state === 'loading'}
        className="w-full font-black text-sm bg-pink text-white border-2 border-ink rounded-xl px-6 py-3 shadow-[4px_4px_0_ink] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
      >
        {state === 'loading' ? 'ENTERING…' : session?.user ? 'ENTER RAFFLE 🎟️' : 'LOGIN TO ENTER'}
      </button>
      {state === 'error' && <p className="mt-2 text-xs font-bold text-pink text-center">{msg}</p>}
    </div>
  )
}
