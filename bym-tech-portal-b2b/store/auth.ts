import { defineStore } from 'pinia';
import { useGlobalState } from '#imports'; // Asegúrate de que la ruta sea correcta

interface UserPayloadInterface {
  username: string;
  password: string;
}
export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false,
    loading: false,
  }),
  actions: {
    async authenticateUser({ username, password }: UserPayloadInterface) {
      // useFetch from nuxt 3
      try{
        const { data, pending }: any = await useFetch('/api/controller/login', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: {
            username,
            password,
          },
          query: {
            one: false,
            email: username
          }
        });
        this.loading = pending;
        if (data.value.token) {
          const globalState = useGlobalState()
          globalState.value.userId = data.value.id;
          globalState.value.codClient = data.value.codeClient || '000001';
          //globalState.value.codClient = data.value.company[0].code || '000001';
          const token = useCookie('token'); // useCookie new hook in nuxt 3
          token.value = data?.value?.token; // set token to cookie
          this.authenticated = true; // set authenticated  state value to true
        }
      }catch(err){
        throw err
      }
      
    },
    logUserOut() {
      const token = useCookie('token'); // useCookie new hook in nuxt 3
      this.authenticated = false; // set authenticated  state value to false
      token.value = null; // clear the token cookie
    },
  },
});