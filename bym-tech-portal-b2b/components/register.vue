<template>
    <v-card flat color="white">
        <template v-slot:text>
            <v-row align="center">
                <v-col cols="11">
                    <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" variant="outlined"
                        hide-details single-line></v-text-field>
                </v-col>
                <v-col cols="1" class="d-flex align-center justify-center">
                    <v-btn size="large" color="blue"
                        @click="formUserAdd = formDataUser; formUser = true"><v-icon>mdi-plus</v-icon></v-btn>
                </v-col>
            </v-row>
        </template>

        <v-data-table class="elevation-1" theme="light" height="400pt" width="80%" :items="itemsUsers"
            :headers="headersUsers" :items-per-page="itemsPerPage" :page="page">
            <template v-slot:item.createdAt="{ item }">
                {{ item.createdAt.split('T')[0] }}
            </template>
            <template v-slot:item.updatedAt="{ item }">
                {{ "Hace " + timeSince(item.updatedAt) }}
            </template>
            <template v-slot:item.options="{ item }">

                <v-btn icon elevation="1">
                    <v-icon size="large" @click="formUser = true; view = true; formUserAdd=item">
                        mdi-eye
                    </v-icon>
                </v-btn>
                <v-btn icon elevation="1">
                    <v-icon size="large" @click="view = false; edit = true; formUserAdd = item; formUser = true;">
                        mdi-pencil
                    </v-icon>
                </v-btn>

                <v-btn icon elevation="1">
                    <v-icon color="red" size="large" @click="deleteId = item.id; deleteDialog = true;">
                        mdi-delete
                    </v-icon>
                </v-btn>

            </template>
            <template v-slot:bottom>
                <div class="text-center pt-2">
                    <v-pagination v-model="page" :length="pageCount(itemsUsers, itemsPerPage)"></v-pagination>
                </div>
            </template>
        </v-data-table>
    </v-card>
    <v-dialog v-model="deleteDialog" width="auto">
        <v-card max-width="400" prepend-icon="mdi-update" :text="'¿Desea eliminar el usuario?'" title="Confirmar">
            <template v-slot:actions>
                <v-btn class="ms-auto" text="Aceptar" @click="deleteUser(deleteId)"></v-btn>
                <v-btn class="ms-auto" text="Cancelar" @click="deleteDialog = false;"></v-btn>
            </template>
        </v-card>
    </v-dialog>
    <v-dialog v-model="formUser" width="60%">
        <v-card prepend-icon="mdi-account" title="Añadir usuario" color="primary">
            <v-container>
                <v-form :disabled="view">
                    <v-card height="20%" width="20%" elevation="0">
                        <v-img cover :src="formUserAdd.photo || './media/img/image-not-found.jpg'">
                            <v-icon @click="triggerFileInput" class="position-absolute" bottom="10" right="10" large
                                color="grey">mdi-paperclip</v-icon>
                        </v-img>
                        <v-file-input ref="fileInput" @change="loadPhoto" style="display:none" v-model="photo"
                            required></v-file-input>
                    </v-card>
                    <v-row>

                        <v-col cols="4">
                            <v-text-field label="Nombre" v-model="formUserAdd.name"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field label="Email" type="email" :disabled="!editMail && edit"
                                v-model="formUserAdd.email"></v-text-field>
                        </v-col>
                        <v-col v-if="edit" cols="1" class="d-flex align-center">
                            <v-icon @click="editMail = !editMail">mdi-pencil</v-icon>
                        </v-col>
                        <v-col cols="4">
                            <v-select bg-color="white" theme="light" :label="$t('register.role.label')"
                                v-model="formUserAdd.role" :items="['Admin', 'Comprador']"></v-select>
                        </v-col>
                        <v-col cols="2">
                            <v-text-field :disabled="!editPass && edit" label="Contraseña" type="password"
                                v-model="password"></v-text-field>
                        </v-col>
                        <v-col v-if="edit" cols="2" class="d-flex align-center">
                            <v-icon @click="editPass = !editPass">mdi-pencil</v-icon>
                        </v-col>
                        <v-col cols="4">
                            <v-autocomplete bg-color="white" theme="light" label="Compañia" :items="itemsCompany"
                                item-title="bio" return-object item-text="bio" @update:modelValue="editCompany = true;"
                                v-model="company.bio"></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>
            <template v-slot:actions>
                <v-btn class="ms-auto" text="Cancelar" @click="formUser = false;"></v-btn>
                <v-btn class="ms-auto" text="Grabar" :disabled="view"
                    @click="edit ? putUser() : postUsers(formUserAdd)"></v-btn>
            </template>
        </v-card>
    </v-dialog>
    <favSnackbar ref="favSnackbarRef"></favSnackbar>
</template>
<script lang="ts">
import { pageCount, getEndpoint, timeSince } from '~/assets/utils/utils'; // Asegúrate de que esta ruta sea correcta
import favSnackbar from './favSnackbar.vue';

export default {
    name: "register",
    components: {
        favSnackbar
    },
    data() {
        return {
            deleteDialog: false,
            token: useCookie('token'),
            itemsUsers: [],
            headersUsers: [
                { title: 'Nombre', key: 'name', align: 'left' },
                { title: 'Rol', key: 'role', align: 'center' },
                { title: 'E-mail', key: 'email', align: 'left' },
                { title: 'Fecha de creacion', key: 'createdAt', align: 'center' },
                { title: 'Fecha de actualizacion', key: 'updatedAt', align: 'center' },
                { title: 'Acciones', key: 'options', align: 'center' },
            ],
            edit: false,
            formUser: false,
            formDataUser: {
                name: undefined,
                role: undefined,
                company: [{
                    bio: undefined
                }],
                photo: '',
                id: 0,
                password: undefined,
                email: undefined
            },
            formUserAdd: {
                name: undefined,
                role: undefined,
                company: [{
                    bio: undefined
                }],
                photo: '',
                id: 0,
                password: undefined,
                email: undefined
            },
            editPass: false,
            page: 1,
            itemsPerPage: 5,
            itemsCompany: [],
            company: {
                bio: ''
            },
            deleteId: 0,
            view: false,
            photo: undefined,
            password: '',
            editMail: false,
            editCompany: false,
        };
    },
    watch: {
        formUserAdd(newVal) {
            this.company = { ...(newVal.company[0] ?? { bio: '' }) }
        }
    },
    methods: {
        timeSince,
        triggerFileInput() {
            this.$refs.fileInput.click()
        },
        loadPhoto(event) {
            const file = event.target.files[0]
            if (file) {
                this.formUserAdd.photo = URL.createObjectURL(file);
            }
        },
        pageCount,
        async deleteUser(id: number) {
            try {
                const deleted = await $fetch('/api/controller/users', {
                    method: 'DELETE',
                    body: {
                        id: id
                    },
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    }
                })
                await this.getUsers()
                this.deleteDialog = false
            } catch (e) {
                console.log(e)
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
                        name: this.formUserAdd.name,
                        email: this.editMail ? this.formUserAdd.email : undefined,
                        role: this.formUserAdd.role,
                        password: this.editPass ? this.password : undefined,
                        photo: photoUrl
                    },
                    params: {  // Usa 'params' para los parámetros de query
                        one: false,
                        id: this.formUserAdd.id,
                        update: true
                    },
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    }
                })
                if (this.editCompany) {
                    try {
                        const companyId = this.formUserAdd.company[0]?.id
                        const updateCompany = await $fetch('/api/controller/company', {
                            method: 'POST',
                            body: {
                                ...this.company.bio,
                                userId: this.formUserAdd.id,
                                state: undefined
                            },
                            query: {
                                id: companyId,
                                one: companyId ? true : false
                            },
                            headers: {
                                'Authorization': `Bearer ${this.token}`,
                                'Content-Type': 'application/json',
                            }
                        })
                    } catch (err) {
                        console.log(err)
                    }
                }
                //snackbar
                this.editCompany = false;
                this.$refs.favSnackbarRef.show(this.$t('edited.success'), 'green')
                this.edit = false
                this.formUser = false
            } catch (err) {
                console.log(err)
                this.$refs.favSnackbarRef.show(this.$t('favorite.error'), 'red');
            }
        },
        async getUsers() {

            try {
                //@ts-ignore
                this.itemsUsers = await getEndpoint('/api/controller/users', {
                    orderField: 'id',
                    orderDir: 'asc',
                    one: 'false'
                }, this.token)
            } catch (err) {
                console.log(err)
            }
        },
        async postUsers(formDataUser) {
            try {
                formDataUser.company = {
                    create: [
                        {
                            //@ts-ignore
                            email: this.company.bio.email,
                            //@ts-ignore
                            code: this.company.bio.code,
                            //@ts-ignore
                            img: this.company.bio.img,
                            //@ts-ignore
                            bio: this.company.bio.bio,
                        }
                    ]
                }
                const data = await $fetch('/api/controller/users', {
                    method: 'POST',
                    body: {
                        ...formDataUser,
                        id: undefined,
                        password: this.password
                    },
                    query: {
                        one: false,
                        id: 0
                    },
                    headers:{
                        'token':this.token
                    }
                })
                //cargo el usuario añadido
                this.itemsUsers.push(reactive(data));

                this.formUser = false;
                this.formDataUser = {
                    name: undefined,
                    role: undefined,
                    company: [{
                        bio: undefined
                    }],
                    photo: '',
                    id: 0,
                    password: undefined,
                    email: undefined
                },
                    this.password = undefined

                //snackbar
                this.$refs.favSnackbarRef.show(this.$t('add.sucess'), 'green');
            } catch (err) {
                console.log(err)
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

    },
    mounted() {
        this.getUsers();
        this.getCustomers()
    }
};

</script>