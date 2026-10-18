'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

const LINKS = [
  { href: '/whitelist/profile', label: 'Profile' },
  { href: '/whitelist/admin', label: 'Admin' },
]

export function Navbar() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-ink bg-cream/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
        <a href="/home" className="flex items-center gap-2 font-black text-base sm:text-lg shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/chog-logo.webp" alt="chog" className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2 border-ink object-cover" />
          <span>CHOG</span><span className="text-pink">UNIVERSE</span>
        </a>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}
              className="font-bold text-sm px-3 py-1.5 rounded-lg hover:bg-cream2 transition-colors">
              {l.label}
            </a>
          ))}
          {status === 'loading' ? null : session ? (
            <div className="flex items-center gap-2 ml-2 pl-3 border-l-2 border-ink/15">
              <a href="/whitelist/profile" className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={session.user?.image || ''} alt="" className="w-8 h-8 rounded-full border-2 border-ink object-cover" />
                <span className="font-black text-sm max-w-[120px] truncate">{session.user?.name}</span>
              </a>
              <button onClick={() => signOut({ callbackUrl: '/' })}
                className="font-bold text-xs px-2.5 py-1.5 rounded-lg border-2 border-ink bg-white hover:bg-pink hover:text-white transition-colors">
                LOGOUT
              </button>
            </div>
          ) : (
            <a href="/whitelist/login"
              className="ml-2 font-black text-sm bg-pink text-white border-2 border-ink rounded-xl px-4 py-2 shadow-[3px_3px_0_ink] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
              LOGIN
            </a>
          )}
        </div>

        {/* Burger (mobile) */}
        <button aria-label="menu" onClick={() => setOpen(!open)}
          className="sm:hidden w-10 h-10 flex items-center justify-center rounded-lg border-2 border-ink bg-white text-xl font-black">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t-2 border-ink bg-cream px-3 py-3 flex flex-col gap-2">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="font-black text-sm px-4 py-3 rounded-xl border-2 border-ink bg-white">
              {l.label}
            </a>
          ))}
          {session ? (
            <>
              <a href="/whitelist/profile" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-ink bg-cream2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={session.user?.image || ''} alt="" className="w-9 h-9 rounded-full border-2 border-ink object-cover" />
                <span className="font-black text-sm truncate">{session.user?.name}</span>
              </a>
              <button onClick={() => signOut({ callbackUrl: '/' })}
                className="font-black text-sm px-4 py-3 rounded-xl border-2 border-ink bg-ink text-white">
                LOGOUT
              </button>
            </>
          ) : (
            <a href="/whitelist/login" onClick={() => setOpen(false)}
              className="text-center font-black text-sm px-4 py-3 rounded-xl border-2 border-ink bg-pink text-white">
              LOGIN
            </a>
          )}
        </div>
      )}
    </nav>
  )
}
