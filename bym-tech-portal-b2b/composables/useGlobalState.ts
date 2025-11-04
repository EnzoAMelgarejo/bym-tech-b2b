import { useState } from 'nuxt/app'

export const useGlobalState = () => useState('globalKey', () => ({
  // Define aquí tus variables globales
  notifications: {
    favorite: 0,
    notifications: 0,
    shopping_cart: 0,
    search: '',
    searchIndex: 0,
    currentPage: 'index',
    category: [],
    filter2: [],
    filter3: [],
    filter4: [],
  },
  itemSelect:'Mi Perfil',
  userId: 0,
  codClient: '',
  role:'',
}))