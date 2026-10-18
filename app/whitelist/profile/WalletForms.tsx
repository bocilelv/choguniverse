'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const FIELDS = [
  { key: 'evmAddress', label: 'EVM (ETH / MON / RH)', ph: '0x…', prefix: '⬡' },
  { key: 'suiAddress', label: 'SUI', ph: '0x…sui', prefix: '💧' },
  { key: 'btcAddress', label: 'BTC', ph: 'bc1…', prefix: '₿' },
  { key: 'injAddress', label: 'INJ', ph: 'inj1…', prefix: '🛰' },
] as const

export function WalletForms({ evmAddress, suiAddress, btcAddress, injAddress }: {
  evmAddress?: string | null; suiAddress?: string | null; btcAddress?: string | null; injAddress?: string | null
}) {
  const [vals, setVals] = useState<Record<string, string>>({
    evmAddress: evmAddress || '', suiAddress: suiAddress || '', btcAddress: btcAddress || '', injAddress: injAddress || '',
  })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vals),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'save failed')
      toast.success('Wallets saved ✓')
      router.refresh()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-4 rounded-2xl border-2 border-ink bg-white p-4">
      <div className="font-black text-xs text-ink/50 uppercase mb-3">Your wallets</div>
      <div className="grid sm:grid-cols-2 gap-3">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="font-black text-[11px] text-ink/60">{f.prefix} {f.label}</span>
            <input
              value={vals[f.key]}
              onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })}
              placeholder={f.ph}
              className="mt-1 w-full font-bold text-sm border-2 border-ink rounded-xl px-3 py-2.5 bg-cream2 focus:outline-none focus:bg-white"
            />
          </label>
        ))}
      </div>
      <button onClick={save} disabled={saving}
        className="mt-3 w-full sm:w-auto font-black text-xs bg-pink text-white border-2 border-ink rounded-xl px-6 py-2.5 shadow-[3px_3px_0_ink] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50">
        {saving ? 'SAVING…' : 'SAVE WALLETS'}
      </button>
    </div>
  )
}
