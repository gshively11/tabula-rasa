const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--aw-color-primary)',
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
      },
      fontFamily: {
        sans: ['var(--aw-font-sans)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aw-font-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading)', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        fadein: {
          '0%': {
            opacity: 0,
            transform: 'translate3d(0, 20px, 0)',
          },
          '100%': {
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
          },
        },
      },
      animation: {
        fadein: '1s forwards 1 fadein',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
}
