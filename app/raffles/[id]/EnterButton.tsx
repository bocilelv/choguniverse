'use client'

import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function EnterButton({ raffleId, ended, upcoming }: { raffleId: string; ended: boolean; upcoming?: boolean }) {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  if (status === 'loading') return <button disabled className="w-full font-black text-sm border-2 border-ink rounded-xl px-6 py-3.5 bg-cream2 text-ink/40">…</button>

  if (upcoming) {
    return (
      <button disabled className="w-full font-black text-sm border-2 border-ink rounded-xl px-6 py-3.5 bg-gold text-ink/60">
        NOT STARTED YET
      </button>
    )
  }

  if (!session) {
    return (
      <button onClick={() => signIn('twitter', { callbackUrl: window.location.href })}
        className="w-full font-black text-sm border-2 border-ink rounded-xl px-6 py-3.5 bg-pink text-white shadow-[4px_4px_0_ink] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
        LOGIN TO ENTER
      </button>
    )
  }

  if (done) {
    return (
      <div className="w-full font-black text-sm border-2 border-ink rounded-xl px-6 py-3.5 bg-green-100 text-green-800 text-center">
        ✓ ENTERED — GOOD LUCK!
      </div>
    )
  }

  const enter = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/enter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raffleId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'failed to enter')
      setDone(true)
      toast.success('Entered the raffle! 🐴 good luck')
      router.refresh()
    } catch (e: any) {
      toast.error(e.message || 'failed to enter')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={enter} disabled={loading || ended}
      className={`w-full font-black text-sm border-2 border-ink rounded-xl px-6 py-3.5 shadow-[4px_4px_0_ink] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all ${ended ? 'bg-ink/10 text-ink/40 shadow-none' : 'bg-pink text-white'}`}>
      {loading ? 'ENTERING…' : ended ? 'RAFFLE ENDED' : 'ENTER RAFFLE →'}
    </button>
  )
}
