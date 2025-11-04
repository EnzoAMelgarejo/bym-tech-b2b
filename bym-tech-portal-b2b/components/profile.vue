<template>
    <v-card flat color="white">
        <v-container fluid class="fill-height" style="width:100% !important">
            <v-row align="center" justify="center">
                <v-card class="elevation-0" width="80%" theme="light">
                    <v-toolbar dark flat>
                        <v-toolbar-title>Editar Perfil</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                        <v-form ref="form" lazy-validation>
                            <v-card height="20%" width="20%" elevation="0">
                                <v-img cover :src="form.photo || './media/img/image-not-found.jpg'">
                                    <v-icon @click="triggerFileInput" class="position-absolute" bottom="10" right="10"
                                        large>mdi-paperclip</v-icon>
                                </v-img>
                                <v-file-input ref="fileInput" @change="loadPhoto" style="display:none" v-model="photo"
                                    required></v-file-input>
                            </v-card>
                            <v-text-field label="Nombre" v-model="form.name" required
                                prepend-icon="mdi-account"></v-text-field>
                            <v-text-field label="E-mail" required :disabled="true" v-model="form.email"
                                prepend-icon="mdi-email"></v-text-field>
                            <v-text-field label="Contraseña" v-model="password" prepend-icon="mdi-key-variant"
                                type="password" required></v-text-field>
                            <v-select label="Compañia" :disabled="true" :items="itemsCompany" v-model="form.company.bio"
                                prepend-icon="mdi-office-building" required></v-select>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="black">
                            Cancelar
                        </v-btn>
                        <v-btn color="black" @click="putUser()">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-row>
        </v-container>
    </v-card>
    <favSnackbar ref="favSnackbarRef"></favSnackbar>
</template>

<script>
import { getEndpoint } from '../assets/utils/utils.ts'
import favSnackbar from './favSnackbar.vue';

export default {
    name: 'profile',
    components: {
        favSnackbar
    },
    data() {
        return {
            token: useCookie('token'),
            localSubject: this.subject,
            formThread: false,
            page: 1,
            itemsPerPage: 5,
            headersThreads: [
                { title: 'Asunto', key: 'subject', align: 'center' },
                { title: 'Creado', key: 'createdAt', align: 'center' },
                { title: 'Ultima Interaccion', key: 'updatedAt', align: 'center' },
                { title: 'Acciones', key: 'options', align: 'center' },
            ],
            itemsThreads: [],
            formThread: false,
            dialogThread: false,
            itemInteraction: { id: undefined, interactions: [], subject: "", userId: 0 },
            form: {
                name: '',
                email: '',
                phone: '',
                company:
                    { bio: undefined },
                photo: ''
            },
            password: undefined,
            photo: undefined,
            company: '',
            itemsCompany: []
        }
    },
    async created() {
        await this.getUsers()
        await this.getCustomers();
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click()
        },
        getEndpoint,
        loadPhoto(event) {
            const file = event.target.files[0]
            if (file) {
                this.form.photo = URL.createObjectURL(file);
            }
        },
        async getUsers() {
            //@ts-ignore
            const data = await getEndpoint('/api/controller/users', {
                orderField: 'id',
                orderDir: 'asc',
                one: 'true',
            }, this.token)
            this.form = data.value
            this.form = {
                ...data.value,
                company: {
                    bio: data.value.company.length ? data.value.company[0].bio : ''
                }
            }
        },
        async putUser() {
            try {
                let photoUrl = undefined
                if (this.photo !== undefined) {
                    try {
                        const formData = new FormData();
                        formData.append('file', this.photo);
                        photoUrl = await $fetch('/api/controller/fileUpload', {
                            method: 'POST',
                            body: formData,
                        })
                    } catch (err) {
                        console.log(err)
                    }
                }
                const data = await $fetch('/api/controller/users', {
                    method: 'POST',
                    body: {
                        name: this.form.name,
                        email: this.form.email,
                        password: undefined,
                        photo: photoUrl
                    },
                    params: {  // Usa 'params' para los parámetros de query
                        one: false,
                        id: this.form.id,
                        update: true
                    },
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    }

                })
                //snackbar
                this.$refs.favSnackbarRef.show(this.$t('edited.success'), 'green')
                //recargo la pagina
                window.location.reload()
            } catch {
                this.$refs.favSnackbarRef.show(this.$t('favorite.error'), 'red');
            }

        },
        async getCustomers() {
            try {
                const { data } = await useFetch('/api/sync/customer?one=false', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                this.itemsCompany = data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
    }
}
</script>

<style scoped>
/* Estilos opcionales para personalizar el Snackbar */
</style>
