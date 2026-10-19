from PIL import Image

def process(name, out):
    im = Image.open(f'/tmp/choglock/{name}').convert('RGBA')
    w, h = im.size
    px = im.load()
    def is_whiteish(p):
        r, g, b, a = p
        return a > 200 and r > 235 and g > 228 and b > 200
    # 1) bikin semua pixel white/cream jadi transparan (buang kotak dalam art)
    data = []
    for y in range(h):
        for x in range(w):
            p = px[x, y]
            if is_whiteish(p):
                data.append((x, y))
    for x, y in data:
        px[x, y] = (0, 0, 0, 0)
    # 2) crop bounding box konten opaque
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    im.save(f'/root/whitelist/public/assets/{out}.webp', 'WEBP', quality=85, method=6)
    print(out, 'saved', im.size, '- whiteish removed:', len(data))

process('LOGIN PAGE.webp', 'login-art')
process('profile page.webp', 'profile-art')
