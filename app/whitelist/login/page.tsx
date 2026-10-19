'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-12 text-center">
      <div className="rounded-3xl border-2 border-ink bg-white p-6 shadow-[6px_6px_0_ink]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/login-art.webp" alt="chog lock globe" className="w-40 h-40 mx-auto rounded-2xl border-2 border-ink object-cover" />
        <h1 className="font-black text-3xl mt-5">JOIN THE<br /><span className="text-pink">CHOG UNIVERSE</span></h1>
        <p className="mt-3 font-bold text-sm text-ink/60">login to enter whitelist raffles</p>
        <div className="mt-6 space-y-3">
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
            CONTINUE WITH X
          </button>
        </div>
      </div>
      <p className="mt-5 text-[11px] font-bold text-ink/40">your session is stored securely · we never post on your behalf</p>
    </main>
  )
}
