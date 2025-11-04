<script setup lang="ts">
</script>
<template>
    <v-card dark class="ma-4" height="540" :width="model == 'Tecnolab' ? '300' : '360'" elevation="4"
        style="background-color: white;" @click="saveProductInteraction">
        <heartFavorite :item="item" :layout="'Elektron'"></heartFavorite>

        <v-chip color="yellow" variant="flat" style="position:absolute;top:200px;right:190px;z-index:3"
            v-if="item.quant == 0">
            {{ $t('out.of.stock') }}
        </v-chip>
        <v-img cover height="250" :src="item.img1 || './media/img/image-not-found.jpg'"
            @click="this.$router.push({ path: '/detail', query: { id: item.id, code: item.code } })">
        </v-img>
        <div :style="'height: 10px;  text-align: center;' + 'background-color: lightgreen;'">
        </div>
        <div style="height: 25px;  text-align: center; background-color: #dddddd;">
            <p style="text-align:center; color: #444444;">{{ item.filter1 }}
            </p>
        </div>
        <v-card-item style="background-color: white; color: #444444;">
            <v-card-title>
                <h2 class="text-h5" style="text-align: center;">
                    {{ item.name || $t('name.not.found') }}
                </h2>
                <v-spacer></v-spacer>
                <p style="text-align: center; font-size: 70%;" color="#888888">
                <ul>
                    <li> {{ $t('code') + ' : ' + (item.code || $t('detail.not.found')) }} </li>
                    <li> {{ $t('brand') + ' : ' + item.brandName }} </li>
                </ul>
                </p>
                <div style="text-align: center;margin-top: 5px;">
                    <span class="text-h5">{{ item.price == 0 ? '-' : Number(item.price ||
                        0).toLocaleString('es-AR',
                            {
                                style:
                                    'currency', currency: item.coin || 'ARS'
                            }) }}</span>
                </div>
            </v-card-title>
            <v-rating v-model="rating" :stars="5" @click.stop="postProductRating" :value="rating" background-color="green" color="green"
                size="40"></v-rating>
        </v-card-item>

        <v-card-actions class="" style="justify-content: center; margin-top: -10px; background-color: white;">

            <v-btn color="btnFavorite" variant="tonal" density="default" width="90%"
                v-if="item.price > 0 && globalState.role != 'Admin'"
                @click="this.$router.push({ path: '/detail', query: { id: item.id, code: item.code } })">
                {{ $t('buy') }}
            </v-btn>
            <v-btn color="white" style="background-color: #ec8414;" variant="outlined" rounded="0" density="default"
                height="50px" width="60%" v-if="globalState.role == 'Admin'"
                @click="this.$router.push({ path: '/detail', query: { id: item.id, code: item.code } })">
                {{ 'Comprar' }}
            </v-btn>
            <v-btn color="btnQuote" variant="tonal" density="default" width="90%"
                v-if="item.price <= 0 && globalState.role != 'Admin'"
                @click="; formDataThread.subject = 'Presupuesto: ' + item.code; formDataThread.type = 'Solicitud de Presupuesto'; formDataThread.message = 'Solicito presupuesto sobre el producto [' + item.code + '] - de nombre ' + item.name; formThread = true;">
                {{ 'Solicitar Presupuesto' }}
            </v-btn>
        </v-card-actions>
    </v-card>

    <v-dialog v-model="formThread" max-width="500px" max-height="500px">
        <v-card prepend-icon="mdi-message" title="Consulta" color="primary">
            <v-container>
                <v-form>
                    <v-text-field label="Asunto" v-model="formDataThread.subject"></v-text-field>
                    <v-select bg-color="white" v-model="formDataThread.type" theme="light" variant="outlined" disabled
                        :items="['Solicitud de Presupuesto', 'Especificaciones', 'Metodos de pago', 'Envios', 'Garantía', 'Otros']"></v-select>
                    <v-textarea label="Nueva Respuesta" v-model="formDataThread.message"></v-textarea>
                </v-form>
            </v-container>
            <template v-slot:actions>
                <v-btn class="ms-auto" text="Cancelar" @click="formThread = false"></v-btn>
                <v-btn class="ms-auto" text="Grabar" @click="postThread(formDataThread)"></v-btn>
            </template>
        </v-card>
    </v-dialog>

</template>

<script lang="ts">
import heartFavorite from '/components/heartFavorite.vue'
import { useAuthStore } from '~/store/auth'; // import the auth store we just createdconst router = useRouter();

export default {

    props: {
        item: {
            type: Object,
            default: {}
        },
        model: {
            type: String,
            default: 'Tecnolab'
        }
    },
    data: () => ({
        globalState: useGlobalState(),
        filter1: '',
        filter3: '',
        rating: 0,
        formThread: false,
        formDataThread: {
            subject: undefined,
            message: undefined,
            type: undefined,
        },
        token: useCookie('token'),
    }),

    async created() {
        this.filter1 = await this.getCategory(this.item.filter1);
        this.filter3 = await this.getFilter3(this.item.filter3);
        await this.getProductRating();

    },
    methods: {
        async getProductRating() {
            try{
            const headers = {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            }
            const rating = await $fetch('/api/controller/productRating', {
                method: 'GET',
                params: {  // Usa 'params' para los parámetros de query
                    one: false,
                    code:this.item.code
                },
                headers
            })
            this.rating=rating[0]?._avg.rating;
        }catch(err){
            console.log(err)
        }

        },

        async postProductRating() {
            const headers = {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            }
            const rating = await $fetch('/api/controller/productRating', {
                method: 'POST',
                params: {  // Usa 'params' para los parámetros de query
                    one: false,
                },
                body:{
                    code:this.item.code,
                    rating:this.rating
                },
                headers
            })

        },
        async saveProductInteraction() {
            try {
                const headers = {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                }
                const data = await $fetch('/api/controller/productInteraction', {
                    method: 'POST',
                    body: {
                        code: this.item.code,
                        clicks: {
                            increment: 1
                        }
                    },
                    params: {  // Usa 'params' para los parámetros de query
                        one: false
                    },
                    headers
                })
            } catch (err) {
                console.log(err);
            }
        },
        async getCategory(value) {
            const selectedItem = this.globalState.notifications.category.find(item => item.code === value);
            return selectedItem ? selectedItem.description : this.$t('category.not.found');
        },
        async getFilter3(value) {
            const selectedItem = this.globalState.notifications.filter3.find(item => item.code === value);
            return selectedItem ? selectedItem.description : this.$t('detail.not.found');
        },
        async postThread(formData) {
            try {
                const headers = {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                }
                const data = await $fetch('/api/controller/threads', {
                    method: 'POST',
                    body: {
                        ...formData,
                    },
                    params: {  // Usa 'params' para los parámetros de query
                        one: false,
                        id: 0
                    },
                    headers
                })
                //cargo el usuario añadido
                this.formDataThread = { subject: undefined, message: undefined };
                this.formThread = false;
                //snackbar
            } catch (err) {
                console.log(err);
            }
        },
    },
}
</script>