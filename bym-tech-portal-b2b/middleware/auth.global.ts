// middleware/auth.js
import { useAuthStore } from '~/store/auth'; // import the auth store we just created

const validateLogged=async(token:any)=>{
    const logged= await $fetch('/api/controller/validate', {
      method: 'GET',
      headers: {'Authorization':`Bearer ${token}`}
  })
   return logged
}
export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig()
  const { authenticated } = storeToRefs(useAuthStore());
  const token = useCookie('token');
  if (token.value) {
    try{
      await validateLogged(token.value);
      authenticated.value = true;
    }catch{
      authenticated.value = false;
    }
  }
  if (authenticated.value) {
    // Si está autenticado y trata de acceder a la página de login, redirige a home
    if (to.name === 'login___es') {
      return navigateTo('/');
    }
    // Si no, permite la navegación normalmente
    return;
  } else if(config.public.layout!=='Elektron') {
     //Si no está autenticado y no está en la página de login, redirige a login
    if (to.name !== 'login___es') {
      return navigateTo('/login');
    }
    // Si está en la página de login, permite la navegación normalmente
    return;
  }
});