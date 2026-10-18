'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function CollabPage() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async () => {
    if (!name.trim() || !message.trim() || !contact.trim()) {
      return toast.error('name, message & contact — all required')
    }
    setSending(true)
    try {
      const res = await fetch('/api/collab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, contact }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'failed to send')
      setDone(true)
      toast.success('Collab request sent! We will reach out 🔥')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🤝</div>
        <h1 className="font-black text-2xl">REQUEST SENT!</h1>
        <p className="mt-2 font-bold text-sm text-ink/60">we got your collab pitch — check your DMs / mentions soon</p>
        <a href="/home" className="inline-block mt-6 font-black text-sm bg-pink text-white border-2 border-ink rounded-xl px-6 py-3 shadow-[4px_4px_0_ink]">← BACK TO CHOGUNIVERSE</a>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <div className="rounded-3xl border-2 border-ink bg-white p-6 shadow-[6px_6px_0_ink]">
        <h1 className="font-black text-2xl">REQUEST COLLAB</h1>
        <p className="mt-1 font-bold text-sm text-ink/60">Pitch a collab. Tell us about the project and how to reach you.</p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="font-black text-xs text-ink/60 uppercase">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project or your name"
              className="mt-1.5 w-full font-bold text-sm border-2 border-ink rounded-xl px-3.5 py-3 bg-cream2 focus:outline-none focus:bg-white" />
          </label>
          <label className="block">
            <span className="font-black text-xs text-ink/60 uppercase">Message</span>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="What the collab is, spots offered, timing"
              className="mt-1.5 w-full font-bold text-sm border-2 border-ink rounded-xl px-3.5 py-3 bg-cream2 focus:outline-none focus:bg-white resize-none" />
          </label>
          <label className="block">
            <span className="font-black text-xs text-ink/60 uppercase">Contact</span>
            <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Discord handle, X, email - however you want us to reply"
              className="mt-1.5 w-full font-bold text-sm border-2 border-ink rounded-xl px-3.5 py-3 bg-cream2 focus:outline-none focus:bg-white" />
          </label>
        </div>

        <button onClick={submit} disabled={sending}
          className="mt-5 w-full font-black text-sm bg-[#5865F2] text-white border-2 border-ink rounded-xl px-6 py-3.5 shadow-[4px_4px_0_ink] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50">
          {sending ? 'SENDING…' : 'SUBMIT'}
        </button>
      </div>
    </main>
  )
}
