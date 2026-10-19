'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/Navbar'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Navbar />
      {children}
      <footer className="border-t-2 border-ink/10 mt-16 py-6 text-center text-xs font-bold text-ink/40">
        chog whitelist platform · designed by @bocilelv
      </footer>
      <Toaster richColors position="top-center" toastOptions={{ style: { fontWeight: 'bold' } }} />
    </SessionProvider>
  )
}
