<template>
    <v-app>

        <v-container>
            <v-dialog v-model="openDialog" width="70%" @after-enter="initQuill">
                <v-card color="white">
                    <v-card-title class="font-weight-black text-h2 px-12 py-4">{{ (dialogEdit ? 'Editar' : 'Crear') +
                        'blog'}}</v-card-title>
                    <v-card-text>
                        <v-row width="100%">
                            <v-col cols='12'>

                                <v-form ref="form" v-model="valid" background-color="white">
                                    <v-combobox v-model="formData.categoryId" bg-color="white" theme="light"
                                        item-color="orange" color="white" item-title="name" item-value="id"
                                        :items="categories" label="Categoria" :return-object="false"></v-combobox>
                                    <v-img cover :src="blogPhoto || './media/img/image-not-found.jpg'">
                                        <!--<v-icon @click="triggerFileInput" class="position-absolute" bottom="10"
                                            right="10" large>mdi-paperclip</v-icon>-->
                                    </v-img>
                                    <v-file-input @change="loadPhoto" v-model="formData.img" label="Subir Imagen"
                                        :rules="[v => !!v || 'La imagen es obligatoria']" accept="image/*"
                                        prepend-icon="mdi-camera"></v-file-input>
                                    <!-- Título del Blog -->
                                    <v-text-field v-model="formData.title" label="Título"
                                        :rules="[v => !!v || 'El título es obligatorio']" required></v-text-field>

                                    <!-- Bio -->
                                    <v-textarea v-model="formData.bio" label="Descripción corta"
                                        :rules="[v => !!v || 'La descripción es obligatoria']" required></v-textarea>

                                    <!-- Quill Editor -->

                                    <!-- Imagen -->
                                    <div ref="editor" class="quill-editor"></div>
                                    <v-snackbar v-model="snackbar" color="green" :timeout="3000">
                                        ¡Blog creado exitosamente!
                                    </v-snackbar>
                                </v-form>

                            </v-col>

                        </v-row>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn color="white" style="background-color:red" @click="openDialog = false;">
                            Cancelar
                        </v-btn>
                        <v-btn color="white" style="background-color:green" @click="createPost">
                            Crear blog
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            <v-row v-if="!blog">
                <v-row>
                    <v-col cols="2">
                        <v-card color="green" width="90%">
                            <v-card-text class="text-h5 justify-space-between">Blog
                                <v-icon class="mr-0">mdi-dots-horizontal</v-icon>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="10">
                        <v-btn height="100%" color="orange" class="text-h5 text-white"
                            v-if="globalState.role == 'Admin'" @click="openDialog = true;">
                            <template v-slot:append>
                                <v-icon>mdi-plus</v-icon>
                            </template>
                            Crear blog
                        </v-btn>
                    </v-col>

                    <v-col cols="8">
                        <v-col v-for="post in posts" :key="post.id" cols="12">
                            <v-card color="white" class="text-start pa-0" variant='flat'>
                                <v-img :src="post.img" class="ml-0 pl-0 image-container" width="80%" max-height="600px"
                                    @click="this.$router.push({ path: '/b2bBlogDetail', query: { id: post.id } })">
                                    <div class="overlay">
                                        <v-btn icon color="black">
                                            <v-icon @click="editBlog(post)" x-large class="edit-icon" color="white">
                                                mdi-pencil
                                            </v-icon>
                                        </v-btn>
                                    </div>
                                </v-img>
                                <span class="text-yellow-darken-3 text-subtitle-1 mr-5">{{ `Por ${post.user.name}`
                                    }}</span>
                                <span class="text-subtitle-1 text-grey mr-5">{{ formatBlogDate(post.createdAt) }}</span>
                                <v-icon class="text-grey">mdi-comment</v-icon>
                                <span class="text-grey">{{ post.comments.length }}</span>
                                <v-card-title class="text-h4 font-weight-bold text-start px-0">{{ post.title
                                    }}</v-card-title>
                                <v-card-text class="text-start pa-0">{{ post.bio }}</v-card-text>
                            </v-card>
                        </v-col>
                    </v-col>
                    <v-col cols="2">
                        <v-card theme="light">
                            <v-card-title>
                                <span class="text-h6 font-weight-bold">
                                    Buscar por categoria
                                </span>
                            </v-card-title>
                            <v-card-text>
                                <v-list>
                                    <v-list-item v-for="category in categories" :key="category.id"
                                        :title="category.name" @click="selectItem(category.id)"
                                        :class="{ 'selected-item': selectedCategories.includes(category.id) }"
                                        transition="fade-transition">
                                    </v-list-item>
                                </v-list>

                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>


            </v-row> </v-container>
    </v-app>
</template>

<script type="setup">
import 'quill/dist/quill.snow.css'; // Estilos de Quill
import b2bBlog from '~/components/b2bBlog.vue';
import b2bComments from '~/components/b2bComments.vue';
import { formatBlogDate } from '~/assets/utils/utils';


export default {
    components: {
        b2bBlog,
        b2bComments
    },
    name: 'blogs',
    data() {
        return {
            overlay: true,
            selectedCategories: [], // Para almacenar la categoría seleccionada
            openDialog: false,
            editCategory: false,
            selectedCategory: 0,
            categoryName: '',
            token: useCookie('token'),
            activeTab: 0,
            blog: undefined,
            globalState: useGlobalState(),
            openDialog: false,
            categories: [],
            posts: [],
            valid: true,
            snackbar: false,
            formData: {
                title: '',
                bio: '',
                content: '',
                img: '',
                categoryId: null
            },
            dialogEdit: false,
            blogPhoto: '',
            itemsFontSize: [
                '8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72'
            ],
            quill: null, // Para instanciar Quill
        };
    },
    mounted() {
        this.getBlogs();
        this.getCategories()
    },
    methods: {
        loadPhoto(event) {
            const file = event.target.files[0]
            if (file) {
                this.blogPhoto = URL.createObjectURL(file);
            }
        },
        async getCategories() {
            try {
                const data = await $fetch('/api/controller/blog-category', {
                    method: 'GET',
                    query: { one: 'false' },
                    headers: {
                        'Content-Type': 'application/json',
                        'token': this.token
                    }
                });
                this.categories = data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async createCategory() {
            const headers = {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            }
            const data = await useFetch('/api/controller/blog-category', {
                method: 'POST',
                body: {
                    name: this.categoryName
                },
                params: {  // Usa 'params' para los parámetros de query
                    one: false,
                    id: 0
                },
                headers
            })
        },
        async getBlogs(categories = undefined) {
            try {
                const data = await $fetch('/api/controller/blog', {
                    method: 'GET',
                    query: { one: 'false', categories: categories },
                    headers: {
                        'Content-Type': 'application/json',
                        'token': this.token
                    }
                });
                this.posts = data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async initQuill() {
            const Quill = (await import('quill')).default;
            this.quill = new Quill(this.$refs.editor, {
                theme: 'snow', // Tema de Quill
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ 'size': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['link', 'image']
                    ]
                }
            });
            this.quill.root.innerHTML = this.formData.content

            // Vincular el contenido con el formData
            this.quill.on('text-change', () => {
                this.formData.content = this.quill.root.innerHTML; // Actualizar el contenido en formData
            });
        },
        validate() {
            console.log(this.formData.content)
        },
        async deletePost(id) {
            const headers = {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            }
            const data = await $fetch('/api/controller/blog', {
                method: 'DELETE',
                params: {  // Usa 'params' para los parámetros de query
                    one: false,
                    id: id
                },
                headers
            })
            await this.getBlogs();
        },
        async uploadImage(formData) {
            const files = await $fetch('/api/controller/fileUpload', {
                method: 'POST',
                body: formData,
            })
            return files
        },
        formatBlogDate,
        replaceImages(urls) {
            /*
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = this.formData.content;
                let imgElements = tempDiv.getElementsByTagName('img');
                for (let i = 0; i < imgElements.length; i++) {
                    if (i < urls.length) { // Asegurarse de que haya suficientes URLs
                        imgElements[i].src = urls[i];
                    }
                }
                this.formData.content = tempDiv.innerHTML
            */
        },
        async createPost() {
            try {
                if (this.$refs.form.validate()) {
                    const imageDataArray = this.extractBase64Images(this.formData.content);
                    const formData = new FormData();

                    // Imagenes del content
                    imageDataArray.forEach((base64Image, index) => {
                        const blob = this.base64ToBlob(base64Image);
                        formData.append(`file`, blob, `image_${index}.png`);
                    });
                    const imagesUploaded = await this.uploadImage(formData)
                    formData.set(`file`, this.formData.img, `image_body_${new Date()}.png`)
                    this.formData.img = (await this.uploadImage(formData))[0]

                    this.replaceImages(imagesUploaded);
                    const headers = {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    }
                    const data = await $fetch('/api/controller/blog', {
                        method: 'POST',
                        body: {
                            ...this.formData,
                        },
                        params: {  // Usa 'params' para los parámetros de query
                            one: false,
                            id: 0
                        },
                        headers
                    })
                    //cargo el usuario añadido
                    this.$refs.form.reset();
                    this.quill.root.innerHTML = ''
                    this.snackbar = true;

                    //snackbar
                    await this.getBlogs();

                }

            } catch (err) {
                console.log(err);
            }
        },
        extractBase64Images(html) {
            const imgRegex = /<img[^>]+src="([^">]+)"/g;
            const base64Images = [];
            let match;

            while ((match = imgRegex.exec(html)) !== null) {
                base64Images.push(match[1]);
            }

            return base64Images;
        },

        base64ToBlob(base64) {
            const byteString = atob(base64.split(',')[1]);
            const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);

            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ab], { type: mimeString });
        },
        editBlog(blog) {
            this.blogPhoto = blog.img
            this.formData = {
                ...blog
            }
            this.dialogEdit = true;
            this.openDialog = true;
        },
        async selectItem(category) {
            if (!this.selectedCategories.includes(category)) {
                this.selectedCategories.push(category);
            } else {
                this.selectedCategories.splice(this.selectedCategories.indexOf(category), 1)
            }
            await this.getBlogs(this.selectedCategories)
        },
    },
};
</script>

<style scoped>
.text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7) !important;
    /* Sombra negra */
}

.quill-editor {
    height: 150px;
    border: 1px solid #ccc;
    padding: 10px;
}

.full-width {
    width: 100% !important;
}

.full-height {
    height: 100% !important;
}

/* Color de fondo y estilos para el header de la lista */
.list-header {
    font-weight: bold;
    background-color: #f5f5f5;
}


.image-container {
    position: relative;
}

.overlay {
    position: absolute;
    top: 10;
    margin-right: 20px !important;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: end;
    align-items: start;
    padding: 25px !important;
}

.edit-icon {
    font-size: 42px !important
}

/* Estilo para los ítems de la lista cuando están seleccionados */
.selected-category {
    background-color: #e0f7fa;
    /* Color de fondo para la selección */
    border-left: 4px solid #45bb00;
    /* Indicador visual de selección */
}

.selected-item {
    border-right: 5px solid green;
    /* Borde verde para el elemento seleccionado */
    background-color: #f0f0f0;
    /* Color de fondo opcional al seleccionar */
}

/* Efecto hover sobre los ítems de la lista */
.list-item-hover:hover {
    background-color: #f0f0f0;
    cursor: pointer;
}

/* Ícono de agregar categoría personalizado */
.add-icon {
    cursor: pointer;
    color: #00acc1;
}

.add-icon:hover {
    color: #007c91;
    /* Cambia de color cuando se pasa el mouse */
}

.fade-transition {
    transition: opacity 0.3s ease;
}

.v-list-item--active {
    background-color: #f0f0f0;
    /* Color de fondo al seleccionar */
    border-left: 4px solid #45bb00;

}
</style>