import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { initialDump } from './plugins/initialDump';
export default defineNuxtConfig({
  hooks: {
    async 'nitro:init'(nitro) {
      await initialDump()
    }
  },
  devServer: {
    host: '0.0.0.0', // Para que escuche en todas las interfaces de red
    port: 3000,      // Puedes cambiar el puerto si es necesario
  },

  devtools: { enabled: true },

  build: {
    transpile: ['vuetify'],
  },

  runtimeConfig: {
    public: {
      layout: process.env.LAYOUT
    }
  },
  serverMiddleware: [
    (req, res, next) => {

      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3002');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') {
        return res.end(); // Termina las solicitudes preflight
      }
      next();
    }
  ],
  routeRules: {
    '/api/controller/loginRequired': { middleware: 'auth' }, // Aplica el middleware solo en rutas dentro de logged
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'portal',   // Nombre de ruta
        path: '/portal',  // Path de la ruta
        component: resolve(__dirname, 'pages/portal.vue')
      });
    },
  },

  pages: true,

  app: {
    head: {
      titleTemplate: "%s",
      title: "eCommerce B2B",
      htmlAttrs: {
        lang: "es",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { hid: "description", name: "description", content: "" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  css: [
    "~/assets/scss/main.scss"
  ],

  components: true,

  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  googleFonts: {
    families: {
      'Poppins': true,
      download: true,
      inject: true
    }
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  i18n: {
    locales: ['es', 'en', 'pt'],
    defaultLocale: 'es',
    vueI18n: './plugins/i18n.config.ts' // if you are using custom path, default 
  },

  compatibilityDate: '2024-07-30',
})