// stores/counter.js
import { defineStore } from 'pinia';

export const useShoppingCartStore = defineStore('shopping_cart', {
  state: () => ({
    shopping_cart: 0
  }),
  actions: {
    setCart(value) {
        this.shopping_cart = value;
    },
    increment() {
      this.shopping_cart++;
    },
    decrement() {
      this.shopping_cart--;
    }
  }
});