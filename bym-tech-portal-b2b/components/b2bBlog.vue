<template>
  <v-container>
    <v-card color="white" class="card-blog">
      <v-card-title>
      </v-card-title>


      <v-row align="stretch" no-gutters>
        <v-col cols="12">
          <span class="text-h1 font-weight-bold">
            {{ blog.title }}

          </span>

          <div>
          </div>
        </v-col>
      </v-row>

    </v-card>
    <v-img :src="blog.img" width="100%" class="image-full-width"></v-img>
    <v-card color="white" class="card-blog">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <div v-html="blog.content"></div>
          </v-col>
        </v-row>
      </v-card-text>

    </v-card>
  </v-container>
</template>

<script lang="ts">
import 'quill/dist/quill.snow.css'; // Estilos de Quill

export default {
  props: {
    blog: {
      type: Object,
      default: () => ({})
    },
  },
  name: 'b2bBlog',
}
</script>

<style scoped>
.ql-size-huge {
  font-size: xx-large !important;
}

.ql-size-large {
  font-size: larger !important;
}

.blog-img {
  width: 100%;
  /* Asegura que el contenedor cubra todo el ancho */
  height: 100%;
  /* Ajusta la altura para que cubra completamente */
  object-fit: fill !important;
}

.blog-text {
  text-align: left;
  /* Alinea el texto a la izquierda */
}

.card-blog {
  padding: 12px !important;
  text-align: left;
  /* Asegura que todo el contenido esté alineado a la izquierda */
}

.image-full-width {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: cover;
  background-size: 100%;
  background-repeat: no-repeat;
}
</style>