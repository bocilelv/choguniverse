/** @type {import('next').NextConfig} */
const nextConfig = {
  // URL bersih tanpa .html — /map, /chogffle, /chogping, /chogflip
  async rewrites() {
    return [
      { source: '/home', destination: '/home.html' },
      { source: '/map', destination: '/map.html' },
      { source: '/chogffle', destination: '/chogffle.html' },
      { source: '/chogping', destination: '/chogping.html' },
      { source: '/chogflip', destination: '/chogflip.html' },
      { source: '/api/mapfeed/:path*', destination: 'http://5.175.211.234:8902/api/:path*' },
      { source: '/api/mapfeed', destination: 'http://5.175.211.234:8902/api/feed' },
      { source: '/api/mapfeed/state', destination: 'http://5.175.211.234:8902/api/state' },
    ]
  },
  // file .html asli di-redirect ke versi bersih biar ga dobel index
  async redirects() {
    return [
      { source: '/home.html', destination: '/home', permanent: true },
      { source: '/map.html', destination: '/map', permanent: true },
      { source: '/chogffle.html', destination: '/chogffle', permanent: true },
      { source: '/chogping.html', destination: '/chogping', permanent: true },
      { source: '/chogflip.html', destination: '/chogflip', permanent: true },
    ]
  },
}

module.exports = nextConfig
