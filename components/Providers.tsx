'use client'

import { SessionProvider } from 'next-auth/react'
import { Navbar } from '@/components/Navbar'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-cream text-ink">
        <Navbar />
        {children}
        <footer className="border-t-2 border-ink py-4 text-center text-xs font-bold text-ink/50">
          CHOG<span className="text-pink">LIST</span> · choguniverse whitelist platform · vibecoded by @bocilelv
        </footer>
      </div>
    </SessionProvider>
  )
}
