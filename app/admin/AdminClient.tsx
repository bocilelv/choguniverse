'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Entry = {
  id: string; isWinner: boolean; isValid: boolean; name: string | null; email: string
  twitter?: string | null; discord?: string | null
  evm?: string | null; sui?: string | null; btc?: string | null; inj?: string | null
}

type Raffle = {
  id: string; title: string; description: string | null; image: string; blockchain: string
  startDate: string; endDate: string; totalSpots: number; entriesCount: number
  twitterHandle1: string; twitterHandle2: string | null; twitterHandle3: string | null
  discordInvite1: string | null; discordInvite2: string | null
  likePostUrl: string | null; rtPostUrl: string | null; walletChain: string | null
  status: string; createdAt: string; entries: Entry[]
}

const EMPTY_FORM = {
  title: '', description: '', image: 'https://picsum.photos/seed/newchog/600/600',
  blockchain: 'MONAD', endDate: '', totalSpots: '100',
  twitterHandle1: '', twitterHandle2: '', twitterHandle3: '',
  discordInvite1: '', discordInvite2: '', likePostUrl: '', rtPostUrl: '', walletChain: 'EVM',
}

function toLocalInput(iso: string) {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

export function AdminClient({ raffles }: { raffles: Raffle[] }) {
  const router = useRouter()
  const [tab, setTab] = useState<'list' | 'create'>('list')
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [editId, setEditId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const setF = (k: string, v: any) => setForm({ ...form, [k]: v })

  const submit = async () => {
    if (!form.title || !form.endDate) return toast.error('title & end date wajib')
    if (!form.twitterHandle1.trim()) return toast.error('minimal 1 follow requirement (handle #1) wajib diisi')
    setBusy(true)
    try {
      const payload = {
        ...form,
        endDate: new Date(form.endDate).toISOString(),
        // optional fields: string kosong -> null
        twitterHandle2: form.twitterHandle2.trim() || null,
        twitterHandle3: form.twitterHandle3.trim() || null,
        discordInvite1: form.discordInvite1.trim() || null,
        discordInvite2: form.discordInvite2.trim() || null,
        likePostUrl: form.likePostUrl.trim() || null,
        rtPostUrl: form.rtPostUrl.trim() || null,
        walletChain: form.walletChain === 'NONE' ? null : form.walletChain,
      }
      const res = await fetch(editId ? `/api/admin/raffles/${editId}` : '/api/admin/raffles', {
        method: editId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'failed')
      toast.success(editId ? 'Raffle updated ✓' : 'Raffle created ✓')
      setForm({ ...EMPTY_FORM }); setEditId(null); setTab('list')
      router.refresh()
    } catch (e: any) { toast.error(e.message) } finally { setBusy(false) }
  }

  const del = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? Semua entries ikut kehapus.`)) return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/raffles/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error((await res.json()).message)
      toast.success('Raffle deleted')
      router.refresh()
    } catch (e: any) { toast.error(e.message) } finally { setBusy(false) }
  }

  const pick = async (id: string, title: string) => {
    if (!confirm(`Pick winners for "${title}"? (acak dari entri valid)`)) return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/raffles/${id}/winners`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      toast.success(`🏆 ${data.winners.length} winners picked!`)
      router.refresh()
    } catch (e: any) { toast.error(e.message) } finally { setBusy(false) }
  }

  const startEdit = (r: Raffle) => {
    setEditId(r.id); setTab('create')
    setForm({
      title: r.title, description: r.description || '', image: r.image, blockchain: r.blockchain,
      endDate: toLocalInput(r.endDate), totalSpots: String(r.totalSpots),
      twitterHandle1: r.twitterHandle1 || '', twitterHandle2: r.twitterHandle2 || '',
      twitterHandle3: r.twitterHandle3 || '', discordInvite1: r.discordInvite1 || '',
      discordInvite2: r.discordInvite2 || '', likePostUrl: r.likePostUrl || '',
      rtPostUrl: r.rtPostUrl || '', walletChain: r.walletChain || 'NONE',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-black text-2xl">ADMIN</h1>

      <div className="flex gap-2 mt-4 mb-6">
        <button onClick={() => { setTab('list'); setEditId(null) }}
          className={`font-black text-xs px-4 py-2 rounded-xl border-2 border-ink ${tab === 'list' ? 'bg-ink text-cream' : 'bg-white'}`}>
          RAFFLES ({raffles.length})
        </button>
        <button onClick={() => { setTab('create'); setEditId(null); setForm({ ...EMPTY_FORM }) }}
          className={`font-black text-xs px-4 py-2 rounded-xl border-2 border-ink ${tab === 'create' ? 'bg-ink text-cream' : 'bg-white'}`}>
          + NEW RAFFLE
        </button>
      </div>

      {tab === 'list' && (
        <div className="space-y-3">
          {raffles.map((r) => {
            const now = Date.now()
            const live = new Date(r.startDate).getTime() <= now && new Date(r.endDate).getTime() > now
            const winners = r.entries.filter((e) => e.isWinner)
            return (
              <div key={r.id} className="rounded-2xl border-2 border-ink bg-white overflow-hidden shadow-[4px_4px_0_ink]">
                <div className="flex items-center gap-3 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image} alt="" className="w-14 h-14 rounded-xl border-2 border-ink object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="font-black text-sm truncate">{r.title}</div>
                    <div className="text-[11px] font-bold text-ink/50">
                      {r.entriesCount} entries · {r.totalSpots} spots · {r.blockchain} · ends {new Date(r.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded border-2 border-ink ${live ? 'bg-pink text-white' : 'bg-cream2'}`}>
                    {live ? 'LIVE' : new Date(r.endDate).getTime() <= now ? 'ENDED' : 'SOON'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 px-3 pb-3">
                  <button onClick={() => startEdit(r)} className="font-black text-[11px] px-3 py-1.5 rounded-lg border-2 border-ink bg-gold">EDIT</button>
                  <button onClick={() => del(r.id, r.title)} className="font-black text-[11px] px-3 py-1.5 rounded-lg border-2 border-ink bg-white">DELETE</button>
                  <button onClick={() => pick(r.id, r.title)} className="font-black text-[11px] px-3 py-1.5 rounded-lg border-2 border-ink bg-ink text-white">🏆 PICK WINNERS</button>
                  <button onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    className="font-black text-[11px] px-3 py-1.5 rounded-lg border-2 border-ink bg-cream2">
                    {expanded === r.id ? 'HIDE' : `PARTICIPANTS (${r.entries.length})`}
                  </button>
                </div>

                {expanded === r.id && (
                  <div className="border-t-2 border-ink/15 bg-cream2 p-3">
                    {r.entries.length === 0 && <div className="text-xs font-bold text-ink/40 p-2">no participants yet</div>}
                    {r.entries.map((e) => (
                      <div key={e.id} className="flex items-center gap-2 py-1.5 border-b border-ink/10 last:border-0 text-xs font-bold">
                        <span className="w-5">{e.isWinner ? '🏆' : e.isValid ? '✅' : '❌'}</span>
                        <span className="font-black">{e.twitter ? '@' + e.twitter : e.discord || e.name || e.email.slice(0, 16)}</span>
                        {e.evm && <span className="text-ink/50 truncate max-w-[140px]">⬡ {e.evm}</span>}
                        {e.sui && <span className="text-ink/50 truncate max-w-[140px]">💧 {e.sui}</span>}
                        {e.btc && <span className="text-ink/50 truncate max-w-[140px]">₿ {e.btc}</span>}
                        {e.inj && <span className="text-ink/50 truncate max-w-[140px]">🛰 {e.inj}</span>}
                      </div>
                    ))}
                    {winners.length > 0 && (
                      <div className="mt-2 text-[11px] font-black text-green-700">
                        {winners.length} winner{winners.length > 1 ? 's' : ''} marked 🏆
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'create' && (
        <div className="rounded-2xl border-2 border-ink bg-white p-5 shadow-[4px_4px_0_ink]">
          <h2 className="font-black text-lg mb-4">{editId ? '✏️ EDIT RAFFLE' : '➕ NEW RAFFLE'}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block sm:col-span-2">
              <span className="font-black text-[11px] text-ink/60">Title *</span>
              <input value={form.title} onChange={(e) => setF('title', e.target.value)}
                className="mt-1 w-full font-bold text-sm border-2 border-ink rounded-xl px-3 py-2.5 bg-cream2 focus:outline-none focus:bg-white" />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-black text-[11px] text-ink/60">Description</span>
              <textarea value={form.description} onChange={(e) => setF('description', e.target.value)} rows={2}
                className="mt-1 w-full font-bold text-sm border-2 border-ink rounded-xl px-3 py-2.5 bg-cream2 focus:outline-none focus:bg-white" />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-black text-[11px] text-ink/60">Image URL</span>
              <input value={form.image} onChange={(e) => setF('image', e.target.value)}
                className="mt-1 w-full font-bold text-sm border-2 border-ink rounded-xl px-3 py-2.5 bg-cream2 focus:outline-none focus:bg-white" />
            </label>
            <label className="block">
              <span className="font-black text-[11px] text-ink/60">End date *</span>
              <input type="datetime-local" value={form.endDate} onChange={(e) => setF('endDate', e.target.value)}
                className="mt-1 w-full font-bold text-sm border-2 border-ink rounded-xl px-3 py-2.5 bg-cream2 focus:outline-none focus:bg-white" />
            </label>
            <label className="block">
              <span className="font-black text-[11px] text-ink/60">Total spots</span>
              <input type="number" value={form.totalSpots} onChange={(e) => setF('totalSpots', e.target.value)}
                className="mt-1 w-full font-bold text-sm border-2 border-ink rounded-xl px-3 py-2.5 bg-cream2 focus:outline-none focus:bg-white" />
            </label>
            <label className="block">
              <span className="font-black text-[11px] text-ink/60">Blockchain</span>
              <select value={form.blockchain} onChange={(e) => setF('blockchain', e.target.value)}
                className="mt-1 w-full font-bold text-sm border-2 border-ink rounded-xl px-3 py-2.5 bg-cream2 focus:outline-none focus:bg-white">
                <option>MONAD</option><option>ROBINHOOD</option><option>SUI</option><option>INJ</option><option>BTC</option>
              </select>
            </label>
          </div>

          {/* REQUIREMENTS */}
          <div className="mt-5 rounded-2xl border-2 border-ink bg-cream2 p-4">
            <div className="font-black text-xs text-ink/50 uppercase mb-3">Requirements</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="font-black text-[11px] text-ink/60">Follow X handle #1 *</span>
                <input value={form.twitterHandle1} onChange={(e) => setF('twitterHandle1', e.target.value.replace(/^@/, ''))} placeholder="chog"
                  className="mt-1 w-full font-bold text-sm border-2 border-ink rounded-xl px-3 py-2.5 bg-white focus:outline-none" />
              </label>
              <label className="block">
                <span className="font-black text-[11px] text-ink/60">Follow X handle #2 (optional)</span>
                <input value={form.twitterHandle2} onChange={(e) => setF('twitterHandle2', e.target.value.replace(/^@/, ''))} placeholder="bocilelv"
                  className="mt-1 w-full font-bold text-sm border-2 border-ink rounded-xl px-3 py-2.5 bg-white focus:outline-none" />
              </label>
              <label className="block">
                <span className="font-black text-[11px] text-ink/60">Follow X handle #3 (optional)</span>
                <input value={form.twitterHandle3} onChange={(e) => setF('twitterHandle3', e.target.value.replace(/^@/, ''))} placeholder="choguniverse"
                  className="mt-1 w-full font-bold text-sm border-2 border-ink rounded-xl px-3 py-2.5 bg-white focus:outline-none" />
              </label>
              <label className="block">
                <span className="font-black text-[11px] text-ink/60">Discord invite URL #1 (optional)</span>
                <input value={form.discordInvite1} onChange={(e) => setF('discordInvite1', e.target.value)} placeholder="https://discord.gg/chog"
                  className="mt-1 w-full font-bold text-sm border-2 border-ink rounded-xl px-3 py-2.5 bg-white focus:outline-none" />
              </label>
              <label className="block">
                <span className="font-black text-[11px] text-ink/60">Discord invite URL #2 (optional)</span>
                <input value={form.discordInvite2} onChange={(e) => setF('discordInvite2', e.target.value)} placeholder="https://discord.gg/chogfrens"
                  className="mt-1 w-full font-bold text-sm border-2 border-ink rounded-xl px-3 py-2.5 bg-white focus:outline-none" />
              </label>
              <label className="block">
                <span className="font-black text-[11px] text-ink/60">Like this post (optional)</span>
                <input value={form.likePostUrl} onChange={(e) => setF('likePostUrl', e.target.value)} placeholder="https://x.com/chog/status/…"
                  className="mt-1 w-full font-bold text-sm border-2 border-ink rounded-xl px-3 py-2.5 bg-white focus:outline-none" />
              </label>
              <label className="block">
                <span className="font-black text-[11px] text-ink/60">RT this post (optional)</span>
                <input value={form.rtPostUrl} onChange={(e) => setF('rtPostUrl', e.target.value)} placeholder="https://x.com/chog/status/…"
                  className="mt-1 w-full font-bold text-sm border-2 border-ink rounded-xl px-3 py-2.5 bg-white focus:outline-none" />
              </label>
            </div>
            <label className="block mt-3">
              <span className="font-black text-[11px] text-ink/60">Required wallet (untuk kirim hadiah)</span>
              <select value={form.walletChain} onChange={(e) => setF('walletChain', e.target.value)}
                className="mt-1 w-full sm:w-72 font-bold text-sm border-2 border-ink rounded-xl px-3 py-2.5 bg-white focus:outline-none">
                <option value="EVM">EVM (ETH / MON / Robinhood)</option>
                <option value="SUI">SUI</option>
                <option value="BTC">BTC</option>
                <option value="INJ">INJ</option>
                <option value="NONE">Tidak wajib wallet</option>
              </select>
            </label>
            <p className="mt-2 text-[11px] font-bold text-ink/40">minimal handle #1 wajib; sisanya optional — peserta harus paste wallet sesuai chain yang dipilih sebelum bisa entry</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={submit} disabled={busy}
              className="font-black text-sm bg-pink text-white border-2 border-ink rounded-xl px-6 py-3 shadow-[3px_3px_0_ink] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50">
              {busy ? 'SAVING…' : editId ? 'SAVE CHANGES' : 'CREATE RAFFLE'}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setForm({ ...EMPTY_FORM }) }}
                className="font-black text-sm border-2 border-ink rounded-xl px-6 py-3 bg-white">
                CANCEL
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
