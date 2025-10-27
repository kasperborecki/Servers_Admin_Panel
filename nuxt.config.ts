import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],

  build: {
    transpile: ["vuetify"],
  },

  modules: [
    "@nuxtjs/i18n",
    [
      "@sidebase/nuxt-auth",
      {
        baseURL: "http://localhost:5052/",
        globalAppMiddleware: false,
        sessionRefresh: {
          enableOnWindowFocus: true,
        },
        provider: {
          type: "local",
          endpoints: {
            signIn: { path: "auth/login", method: "post" },
            getSession: { path: "auth/users/current", method: "get" },
            signOut: { path: "auth/logout", method: "get" },
            signUp: { path: "auth/register", method: "post" },
          },
          token: {
            type: "Bearer",
            signInResponseTokenPointer: "/token",
            headerName: "Authorization",
            cookieName: "auth.token",
            maxAgeInSeconds: 60 * 5,
            sameSiteAttribute: "lax",
          },
          refresh: {
            isEnabled: true,
            endpoint: {
              path: "auth/refresh-token",
              method: "post",
            },
            refreshOnlyToken: false,
            token: {
              cookieName: "auth.refresh-token",
              maxAgeInSeconds: 60 * 60 * 24 * 7,
              sameSiteAttribute: "lax",
            },
            getToken: (response: any) => response.token,
            getRefreshToken: (response: any) => response.refreshToken,
          },
        },
      },
    ],
  ],

  i18n: {
    defaultLocale: "pl",
    strategy: "prefix_except_default",
    locales: [
      { code: "pl", name: "Polski", file: "pl.json" },
      { code: "en", name: "English", file: "en.json" },
    ],
    langDir: "locales",
  },

  vite: {
    plugins: [vuetify({ autoImport: true })],
    vue: { template: { transformAssetUrls } },
  },
});
