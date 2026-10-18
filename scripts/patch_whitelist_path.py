# Patch links + config untuk struktur /whitelist
import re

# 1. Navbar: link internal -> /whitelist/...
s = open('/root/whitelist/components/Navbar.tsx').read()
s = s.replace("{ href: '/raffles', label: 'Raffles' },", "{ href: '/whitelist/raffles', label: 'Raffles' },")
s = s.replace("{ href: '/profile', label: 'Profile' },", "{ href: '/whitelist/profile', label: 'Profile' },")
s = s.replace("{ href: '/admin', label: 'Admin' },", "{ href: '/whitelist/admin', label: 'Admin' },")
s = s.replace('href="/login"', 'href="/whitelist/login"')
s = s.replace('href="/profile"', 'href="/whitelist/profile"')
open('/root/whitelist/components/Navbar.tsx', 'w').write(s)

# 2. Login page: callbackUrl
s = open('/root/whitelist/app/whitelist/login/page.tsx').read()
s = s.replace("callbackUrl: '/profile'", "callbackUrl: '/whitelist/profile'")
open('/root/whitelist/app/whitelist/login/page.tsx', 'w').write(s)

# 3. Profile page + ConnectAccounts
s = open('/root/whitelist/app/whitelist/profile/page.tsx').read()
s = s.replace('href="/login"', 'href="/whitelist/login"')
s = s.replace('href="/raffles"', 'href="/whitelist/raffles"')
open('/root/whitelist/app/whitelist/profile/page.tsx', 'w').write(s)
s = open('/root/whitelist/app/whitelist/profile/ConnectAccounts.tsx').read()
s = s.replace("callbackUrl: '/profile'", "callbackUrl: '/whitelist/profile'")
open('/root/whitelist/app/whitelist/profile/ConnectAccounts.tsx', 'w').write(s)

# 4. Raffle detail back link -> /whitelist
s = open('/root/whitelist/app/whitelist/raffles/[id]/page.tsx').read()
s = s.replace('<a href="/" className="inline-block font-black text-xs mb-4 hover:text-pink">← BACK</a>',
              '<a href="/whitelist" className="inline-block font-black text-xs mb-4 hover:text-pink">← BACK</a>')
open('/root/whitelist/app/whitelist/raffles/[id]/page.tsx', 'w').write(s)

# 5. home.html: pill WHITELIST -> /whitelist
s = open('/root/whitelist/public/home.html').read()
s = s.replace('<a class="util" href="/">', '<a class="util" href="/whitelist">')
s = s.replace('href="/" target="_blank" rel="noopener"', 'href="/whitelist" target="_blank" rel="noopener"')
open('/root/whitelist/public/home.html', 'w').write(s)

# 6. next.config: '/' -> home.html + redirect path lama
nc = open('/root/whitelist/next.config.js').read()
old = """    return [
      { source: '/home', destination: '/home.html' },"""
new = """    return [
      { source: '/', destination: '/home.html' },
      { source: '/home', destination: '/home.html' },"""
assert old in nc, 'rewrite anchor'
nc = nc.replace(old, new)
old_d = """  async redirects() {
    return ["""
new_d = """  async redirects() {
    return [
      { source: '/raffles', destination: '/whitelist/raffles', permanent: true },
      { source: '/raffles/:path*', destination: '/whitelist/raffles/:path*', permanent: true },
      { source: '/profile', destination: '/whitelist/profile', permanent: true },
      { source: '/admin', destination: '/whitelist/admin', permanent: true },
      { source: '/login', destination: '/whitelist/login', permanent: true },
      { source: '/collab', destination: '/whitelist/collab', permanent: true },"""
assert old_d in nc, 'redirect anchor'
nc = nc.replace(old_d, new_d)
open('/root/whitelist/next.config.js', 'w').write(nc)
print('all links + config patched')
