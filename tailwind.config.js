/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 ** Nuxt default: https://tailwindcss.nuxtjs.org/tailwind-config
 */
module.exports = {
  theme: {
    // See https://medium.com/@fayazara/quick-way-to-implement-darkmode-in-nuxt-js-tailwindcss-corona-virus-tracker-712d004a0846
    darkSelector: '.dark-mode',

    screens: {
      // default tailwind sizes:
      'sm': { 'min': '346px' },
      'md': { 'min': '768px' },
      'lg': { 'min': '1024px' },
      'xl': { 'min': '1280px' },
      // more:
      'sm2': { 'min': '455px' },
      'sm5': { 'min': '590px' },
      // reversed sizes:
      '-sm': { 'max': '345px' },
      '-md': { 'max': '767px' },
      '-lg': { 'max': '1023px' },
      '-xl': { 'max': '1279px' },
      // devices
      'ph': { 'max': '990px' }, // phone
      'pc': { 'min': '991px' }, // PC
    },

    extend: {
      // See https://tailwindcss.com/docs/theme#spacing
      spacing: {
        '8.5': '2.13rem',
        '11': '2.7rem',
        '14': '3.5rem',
        '15': '3.8rem',
      },

      transitionDuration: {
        'cmt': '0.19s', // (Should be equal to '--color-mode-transition-time')
      }
    },

    fontFamily: {
      // Tailwind fonts:
      'sans': ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
      'serif': ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      // Custom fonts:
      'fira-sans': ['Fira Sans', 'sans-serif'],
    }
  },

  variants: {
    // Dark mode variants:
    backgroundColor: ['dark', 'dark-hover', 'dark-group-hover', 'dark-even', 'dark-odd', 'hover', 'responsive'],
    borderColor: ['dark', 'dark-focus', 'dark-focus-within', 'hover', 'responsive'],
    textColor: ['dark', 'dark-hover', 'dark-active', 'hover', 'responsive']
  },

  plugins: [
    // https://github.com/ChanceArthur/tailwindcss-dark-mode
    require('tailwindcss-dark-mode')()
  ],

  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js',
    ],
  },
}
