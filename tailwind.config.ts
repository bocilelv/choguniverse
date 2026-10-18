import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#EFE6CE',
        cream2: '#F7F0DD',
        ink: '#2B2118',
        pink: '#EC2F7A',
        gold: '#F2C14E',
        purple: '#7B5FC7',
      },
      boxShadow: {
        brut: '4px 4px 0 #2B2118',
      },
    },
  },
  plugins: [],
}
export default config
