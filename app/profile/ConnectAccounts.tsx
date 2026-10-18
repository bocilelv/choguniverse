'use client'

import { signIn } from 'next-auth/react'

export function ConnectAccounts({ userId, hasDiscord, hasTwitter, discordUsername, twitterUsername }: {
  userId: string
  hasDiscord: boolean
  hasTwitter: boolean
  discordUsername?: string | null
  twitterUsername?: string | null
}) {
  // Set cookie link_to sebelum signIn -> route auth merge provider ke akun ini
  // (bukan bikin akun baru), jadi connect X ga ngapus Discord dan sebaliknya.
  const setLinkCookie = () => {
    document.cookie = `link_to=${userId};path=/;max-age=600`
  }

  return (
    <div className="mt-4 rounded-2xl border-2 border-ink bg-white p-4">
      <div className="font-black text-xs text-ink/50 uppercase mb-3">Connected accounts</div>
      <div className="grid sm:grid-cols-2 gap-3">
        {hasDiscord ? (
          <div className="flex items-center gap-3 border-2 border-ink rounded-xl px-4 py-3 bg-cream2">
            <span className="text-xl">🟣</span>
            <div className="min-w-0">
              <div className="font-black text-sm truncate">{discordUsername || 'Discord'}</div>
              <div className="text-[10px] font-bold text-green-700">CONNECTED ✓</div>
            </div>
          </div>
        ) : (
          <button onClick={() => { setLinkCookie(); signIn('discord', { callbackUrl: '/profile' }) }}
            className="flex items-center gap-3 border-2 border-ink rounded-xl px-4 py-3 bg-[#5865F2] text-white shadow-[3px_3px_0_ink] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            <span className="text-xl">🟣</span>
            <div className="text-left">
              <div className="font-black text-sm">Connect Discord</div>
              <div className="text-[10px] font-bold opacity-70">needed for Discord-gated raffles</div>
            </div>
          </button>
        )}
        {hasTwitter ? (
          <div className="flex items-center gap-3 border-2 border-ink rounded-xl px-4 py-3 bg-cream2">
            <span className="text-xl">𝕏</span>
            <div className="min-w-0">
              <div className="font-black text-sm truncate">@{twitterUsername || 'x'}</div>
              <div className="text-[10px] font-bold text-green-700">CONNECTED ✓</div>
            </div>
          </div>
        ) : (
          <button onClick={() => { setLinkCookie(); signIn('twitter', { callbackUrl: '/profile' }) }}
            className="flex items-center gap-3 border-2 border-ink rounded-xl px-4 py-3 bg-ink text-white shadow-[3px_3px_0_ink] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            <span className="text-xl">𝕏</span>
            <div className="text-left">
              <div className="font-black text-sm">Connect X</div>
              <div className="text-[10px] font-bold opacity-70">needed for follow-gated raffles</div>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
