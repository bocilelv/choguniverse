'use client'

import { useState } from 'react'

// Requirement checklist item:
// lingkaran kosong -> user klik link (direct ke X/Discord) -> jadi checkmark hijau.
// Nanti tinggal ganti onClick dengan verifikasi API beneran (X API connection_status,
// Discord guild check) tanpa ubah UI-nya.
export function ReqCheck({ href, label }: { href: string; label: React.ReactNode }) {
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex items-center gap-2.5 font-bold text-sm">
      <span className={`w-5 h-5 shrink-0 rounded-full border-2 border-ink flex items-center justify-center text-[11px] transition-colors ${checked ? 'bg-green-500 text-white' : 'bg-white'}`}>
        {checked ? '✓' : ''}
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener"
        onClick={() => setChecked(true)}
        className="underline decoration-2 underline-offset-2 hover:text-pink"
      >
        {label}
      </a>
    </div>
  )
}
