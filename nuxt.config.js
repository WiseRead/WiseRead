export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: (titleChunk) => {
      return titleChunk ? `WiseRead | ${titleChunk}` : 'WiseRead - Online/Offline Comic Reader'
    },
    title: '', // (inserted to titleTemplate in home page)
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Read Online/Offline comic with WiseRead web reader' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/var.css',
    '~/assets/css/fonts.scss',
    '~/assets/css/layouts.scss',
    '~/assets/css/transition.scss',
    '~/assets/css/page.scss',
  ],

  purgeCSS: {
    // purgeCSS auto removes unused css. since we are adding dark selector classes
    // manually, we need to whitelist them
    whitelist: ['dark-mode'],
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/on-startup.client.js',
    '~/plugins/comic-source.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://github.com/nuxt-community/svg-module
    '@nuxtjs/svg',
    // https://color-mode.nuxtjs.org
    '@nuxtjs/color-mode'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://vue-scrollto.netlify.app/
    ['vue-scrollto/nuxt', { duration: 300 }],
    // https://github.com/justintaddei/v-wave
    ['v-wave/nuxt'],
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    icon: {
      fileName: 'favicon.png'
    },
    manifest: {
      lang: 'en',
      name: 'WiseRead',
      short_name: 'WiseRead',
      description: 'Online/Offline web comic reader',
    },
    workbox: {
      // See https://github.com/nuxt-community/pwa-module/issues/176#issuecomment-739556901
      clientsClaim: false
    }
  },

  router: {
    // If available, add the name of the repo to the router.base
    // See https://nuxtjs.org/faq/github-pages
    base: process.env.NUXT_ROUTER_BASE || ''
  },

  // Value of this object is accessible from both client and server using $config
  // See https://nuxtjs.org/guide/runtime-config
  publicRuntimeConfig: {
    LAST_COMMIT_SHA: process.env.LAST_COMMIT_SHA,
    IS_BETA: process.env.IS_BETA || false,
  },

  generate: {
    // Set fallback to true when using static host, for direct access to dynamic routes,
    // and for custom '404.html' instead of the default '200.html'.
    // See https://nuxtjs.org/guide/routing/#spa-fallback
    // See https://stackoverflow.com/questions/50973576/nuxtjs-spa-dynamic-routes-generate-404-after-prod-deployment
    fallback: true,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
