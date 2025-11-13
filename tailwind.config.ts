import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'telegram-bg': '#000000',
        'telegram-card': '#0a0a0a',
        'telegram-text': '#ffffff',
        'telegram-secondary': '#8e8e93',
        'telegram-accent': '#007aff',
      },
    },
  },
  plugins: [],
  important: true,
}
export default config



