<template>
  <v-container>
    <!-- Lista de comentarios -->
    <span class="text-h4"> Comentarios </span>

    <div v-for="(comment, index) in comments" :key="index" class="comment-box my-4">
      <div class="comment-header">
        <span class="comment-name">{{ comment.user.name }}</span>
        <span class="comment-date">{{ formatBlogDate(comment.createdAt) }}</span>
      </div>
      <div class="comment-text">{{ comment.content }}</div>
    </div>

    <!-- Formulario para agregar un comentario nuevo -->
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-text-field v-model="newComment.content" variant="outlined" label="Escribe un comentario..." :rules="[rules.required]" required
        rows="4" dense>
      
        <template #['append-inner']>
            <v-btn v-if="newComment.content" variant="elevated" theme="light" color="grey-lighten-2" class="lock-button"
            @click="addComment" icon>
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </template>
      </v-text-field>

      <!-- Mensaje de éxito -->
      <v-snackbar v-model="snackbar" :timeout="3000">
        ¡Comentario agregado exitosamente!
      </v-snackbar>
    </v-form>
  </v-container>
</template>

<script>
import { formatBlogDate } from '~/assets/utils/utils';
export default {
  props: {
    blog: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      token: useCookie('token'),
      comments: [
      ],
      newComment: {
        content: '',
      },
      valid: false,
      snackbar: false,
      rules: {
        required: (value) => !!value || "Este campo es obligatorio",
      },
    };
  },
  mounted() {
    this.getComments();
  },
  methods: {
    formatBlogDate,
    async getComments() {
      try {
        const data = await $fetch('/api/controller/comments', {
          method: 'GET',
          query: { one: 'false', blogId: this.blog.id },
          headers: {
            'Content-Type': 'application/json',
            'token': this.token
          }
        });
        this.comments = data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async addComment() {
      if (this.$refs.form.validate()) {
        const headers = {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        }
        const data = await $fetch('/api/controller/comments', {
          method: 'POST',
          body: {
            blogId: this.blog.id,
            ...this.newComment,
          },
          params: {  // Usa 'params' para los parámetros de query
            one: false,
            id: 0
          },
          headers
        })
        //cargo el usuario añadido
        this.$refs.form.reset();
        await this.getComments();
      }
    },
  },
};
</script>

<style scoped>
.comment-box {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-name {
  font-weight: bold;
  font-size: 1.1em;
}

.comment-date {
  font-size: 0.9em;
  color: #999;
}

.lock-button {
    pointer-events: auto;
    background-color: black;
    opacity: 1 !important;
    z-index: 15000 !important;
    transition: none;
}

.comment-text {
  font-size: 1em;
  line-height: 1.4em;
  color: #333;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>