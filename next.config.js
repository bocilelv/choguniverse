/** @type {import('next').NextConfig} */
const nextConfig = {
  // URL bersih tanpa .html — /map, /chogffle, /chogping, /chogflip
  async rewrites() {
    return [
      { source: '/map', destination: '/map.html' },
      { source: '/chogffle', destination: '/chogffle.html' },
      { source: '/chogping', destination: '/chogping.html' },
      { source: '/chogflip', destination: '/chogflip.html' },
      { source: '/api/mapfeed/:path*', destination: 'http://5.175.211.234:8902/api/:path*' },
      { source: '/api/mapfeed', destination: 'http://5.175.211.234:8902/api/feed' },
    ]
  },
  // file .html asli di-redirect ke versi bersih biar ga dobel index
  async redirects() {
    return [
      { source: '/map.html', destination: '/map', permanent: true },
      { source: '/chogffle.html', destination: '/chogffle', permanent: true },
      { source: '/chogping.html', destination: '/chogping', permanent: true },
      { source: '/chogflip.html', destination: '/chogflip', permanent: true },
    ]
  },
}

module.exports = nextConfig
