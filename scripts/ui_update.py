# UI update: bg pattern + teks header/footer semua page

# 1. Whitelist app bg
s = open('/root/whitelist/app/globals.css').read()
if 'bg-pattern' not in s:
    s += """
/* ==== background pattern (chog doodles) ==== */
body {
  background-image: url('/assets/bg-pattern.webp');
  background-size: 520px;
  background-color: #FBF3DF;
}
"""
    open('/root/whitelist/app/globals.css', 'w').write(s)
    print('globals ok')

# 2. Footer whitelist
s = open('/root/whitelist/components/Providers.tsx').read()
s = s.replace('CHOGUNIVERSE · choguniverse whitelist platform · vibecoded by @bocilelv',
              'chog whitelist platform · designed by @bocilelv')
open('/root/whitelist/components/Providers.tsx', 'w').write(s)

# 3. Navbar: CHOG UNIVERSE (dengan spasi)
s = open('/root/whitelist/components/Navbar.tsx').read()
s = s.replace('<span>CHOG</span><span className="text-pink">UNIVERSE</span>',
              '<span>CHOG</span> <span className="text-pink">UNIVERSE</span>')
open('/root/whitelist/components/Navbar.tsx', 'w').write(s)
print('navbar + footer whitelist ok')

# 4. Landing home
s = open('/root/whitelist/public/home.html').read()
s = s.replace('CHOGUNIVERSE', 'CHOG UNIVERSE')
s = s.replace('vibecoded by <a href="https://x.com/bocilelv" target="_blank" rel="noopener">@bocilelv</a>',
              'designed by <a href="https://x.com/bocilelv" target="_blank" rel="noopener">@bocilelv</a>')
s = s.replace('choguniverse — a community build for the Chogathon',
              'chog universe · a community build for the Chogathon')
open('/root/whitelist/public/home.html', 'w').write(s)
print('home ok')

# 5. Footer page statis
s = open('/root/whitelist/public/chogffle.html').read()
s = s.replace('chogffle — vibecoded by', 'chogffle · designed by')
open('/root/whitelist/public/chogffle.html', 'w').write(s)
s = open('/root/whitelist/public/chogping.html').read()
s = s.replace('chogping! — vibecoded by', 'chogping! · designed by')
open('/root/whitelist/public/chogping.html', 'w').write(s)
s = open('/root/whitelist/public/chogflip.html').read()
s = s.replace('win ×2 · house edge 5% · provably fair on-chain RNG · vibecoded by',
              'win ×2 · house edge 5% · provably fair on-chain RNG · designed by')
open('/root/whitelist/public/chogflip.html', 'w').write(s)
print('static footers ok')
