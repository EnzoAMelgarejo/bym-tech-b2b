// data/posts.js
import { environment } from "@/configuration/environment";

const baseUrl =`${environment.SERVER_URL}/api/controller/blog`;
const params = new URLSearchParams({
  one: 'false',
});

// Construir la URL con los parámetros de consulta
const url = `${baseUrl}?${params.toString()}`;
console.log(url);
export const posts = fetch(url, {

  
  method: 'GET',
  headers: {
      'Content-Type': 'application/json',
  }
}) //
.then(response => {
  if (!response.ok) {
      throw new Error('Error en la solicitud');
  }
  return response.json();
})
.then(data => {
})
.catch(error => {
  console.error('Hubo un problema con la solicitud fetch:', error.message, error);
});

console.log(posts,"<--post")