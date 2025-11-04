import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const defaultTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#ffffff',
    secondary: '#000000',
    error: '#000000',
    info: '#000000',
    success: '#000000',
    warning: '#000000',
    headerInfo: '#000000',
    btnSubscribe: '#007aff',
    headerCommon: '#ffffff',
    btnConsult: '#007aff',
    btnMyOrders: '#007aff',
    btnNews: '#007aff',
    headerCategories: '#000000',
    bodyCategories: '#e5e7eb',
    btnFavorite: '#007aff',
    btnQuote: '#007aff',
  }
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'defaultTheme',
      themes: {
        defaultTheme,
      }
    }
  })
  app.vueApp.use(vuetify)
})
