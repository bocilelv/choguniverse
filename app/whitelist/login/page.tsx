'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🐴</div>
      <h1 className="font-black text-3xl">JOIN THE<br /><span className="text-pink">CHOGUNIVERSE</span></h1>
      <p className="mt-3 font-bold text-sm text-ink/60">login to enter whitelist raffles</p>
      <div className="mt-8 space-y-3">
        <button
          onClick={() => signIn('discord', { callbackUrl: '/whitelist/profile' })}
          className="w-full font-black text-sm bg-[#5865F2] text-white border-2 border-ink rounded-xl px-6 py-4 shadow-[4px_4px_0_ink] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          CONTINUE WITH DISCORD
        </button>
        <button
          onClick={() => signIn('twitter', { callbackUrl: '/whitelist/profile' })}
          className="w-full font-black text-sm bg-ink text-white border-2 border-ink rounded-xl px-6 py-4 shadow-[4px_4px_0_ink] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          𝕏 CONTINUE WITH X
        </button>
      </div>
      <p className="mt-6 text-[11px] font-bold text-ink/40">your session is stored securely · we never post on your behalf</p>
    </main>
  )
}
