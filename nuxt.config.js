export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'zuraaa.com',
    htmlAttrs: {
      lang: 'pt-br'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/colors.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/fontawesome'
  ],

  fontawesome: {
    icons: {
      brands: [
        'faDiscord'
      ],
      solid: [
        'faLink'
      ]
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'http://localhost:3000/api',
    headers: {
      'Content-Type': 'application/json'
    }
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.ZURAAACOM_API_URL
    }
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.ZURAAACOM_API_URL_LOCAL
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  server: {
    port: process.env.ZURAAACOM_PORT ?? 8000,
    host: process.env.ZURAAACOM_HOST ?? '0.0.0.0'
  },

  env: {
    apiUrl: process.env.ZURAAACOM_API_URL ?? 'http://localhost:3000/api',
    apiUrlLocal: process.env.ZURAAACOM_API_URL_LOCAL ?? 'http://localhost:3000/api'
  }
}
