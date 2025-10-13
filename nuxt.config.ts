import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  build: {
    transpile: ['vuetify'],
  },
  modules: ["@nuxtjs/i18n"],
  i18n: {
    defaultLocale: "pl",
    strategy: "prefix_except_default",
    locales: [
      { code: "pl", name: "Polish", file: "pl.json" },
      { code: "en", name: "English", file: "en.json" }
    ],
    langDir: "locales"
  },
  vite: {
    plugins: [vuetify({ autoImport: true })],
    vue: { template: { transformAssetUrls } }
  },
   nitro: {
    devProxy: {
      '/api': {
        target: 'https://localhost:44313',
        changeOrigin: true,
        secure: false
      }
    }
  }
})