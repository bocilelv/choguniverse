'use client'

import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function EnterButton({ raffleId, ended, upcoming }: { raffleId: string; ended: boolean; upcoming?: boolean }) {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [ticket, setTicket] = useState<number | null>(null)
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

  if (ticket !== null) {
    return (
      <div className="rounded-2xl border-2 border-ink bg-green-100 p-4 text-center">
        <div className="font-black text-sm text-green-800">✓ ENTERED — GOOD LUCK!</div>
        <div className="mt-1 font-black text-2xl text-green-900">TICKET #{ticket}</div>
        <p className="text-[11px] font-bold text-ink/50 mt-1">saved in your profile — screenshot it 📸</p>
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
      if (!res.ok) {
        if (data.needsWallet) {
          toast.error(data.message)
          setTimeout(() => { window.location.href = '/profile' }, 1200)
          return
        }
        throw new Error(data.message || 'failed to enter')
      }
      setTicket(data.ticketNumber)
      toast.success(`Entered! Your ticket: #${data.ticketNumber} 🎫`)
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
