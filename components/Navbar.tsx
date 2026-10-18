'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export function Navbar() {
  const { data: session } = useSession()
  const [menu, setMenu] = useState(false)
  return (
    <nav className="border-b-2 border-ink bg-cream sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg border-2 border-ink bg-purple flex items-center justify-center text-lg">🐴</span>
          <span className="font-black text-lg tracking-tight">CHOG<span className="text-pink">LIST</span></span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <Link href="/raffles" className="hidden sm:inline-block font-bold text-sm px-3 py-2 hover:text-pink">Raffles</Link>
          <Link href="/profile" className="hidden sm:inline-block font-bold text-sm px-3 py-2 hover:text-pink">Profile</Link>
          <Link href="/admin" className="hidden sm:inline-block font-bold text-sm px-3 py-2 hover:text-pink">Admin</Link>
          {session?.user ? (
            <div className="relative">
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 border-2 border-ink rounded-full pl-1 pr-3 py-1 bg-white shadow-[2px_2px_0_ink]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={session.user.image || '/placeholder.svg'} alt="" className="w-7 h-7 rounded-full border border-ink object-cover" />
                <span className="font-bold text-xs max-w-[90px] truncate">{session.user.name || 'chog'}</span>
                <span className="text-[10px]">▾</span>
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-44 bg-white border-2 border-ink rounded-xl shadow-[4px_4px_0_ink] overflow-hidden">
                  <Link href="/profile" className="block px-4 py-2.5 font-bold text-sm hover:bg-gold" onClick={() => setMenu(false)}>Profile</Link>
                  <button onClick={() => signOut()} className="block w-full text-left px-4 py-2.5 font-bold text-sm hover:bg-gold">Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="font-black text-xs bg-pink text-white border-2 border-ink rounded-xl px-4 py-2 shadow-[3px_3px_0_ink] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
