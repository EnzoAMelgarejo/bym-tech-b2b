<script setup lang="ts">
import { getEndpoint } from '../assets/utils/utils.ts'
</script>
<template>
    <v-card flat color="white" class="px-12 py-2">
        <v-container class="pa-1">
            <v-item-group v-model="selection" multiple v-if="!waitFilter">
                <v-row>
                    <v-col cols="12" class="text-center" style="margin-bottom: 20%;margin-top: 10% !important;"
                        v-if="itemsFavorites.length == 0">
                        <div style="min-height: 100px; text-align: center;">
                            <i class="mdi mdi-magnify" style="font-size: 48px; color: #888;"></i>
                            <h3>No encontramos coincidencias</h3>
                            <p>Intenta ajustar tus términos de búsqueda o filtros. A veces, términos menos
                                específicos o
                                consultas más amplias pueden ayudarte a encontrar lo que estás buscando.</p>
                        </div>
                    </v-col>
                    <v-col v-for="item in itemsProduct" :key="item.id" cols="12" md="3"
                        v-if="itemsFavorites.length > 0">
                        <v-item v-slot="{ isSelected, toggle }">
                            <v-card dark class="ma-4" height="460"  width="90%" elevation="4"
                                style="background-color: white; text-align: center;">
                                <heartFavorite :item="item" @favorite-clicked="getFavorites"></heartFavorite>
                                <v-img class="mx-auto" cover height="250" width="100%" :src="item.img1 || './media/img/image-not-found.jpg'"
                                    @click="this.$router.push({ path: '/detail', query: { id: item.id, code: item.code } })">
                                </v-img>
                                <div :style="'height: 10px;  text-align: center;' + 'background-color: lightblue;'">
                                </div>
                                <div style="height: 25px;  text-align: center; background-color: #dddddd;">
                                    <p style="text-align:center; color: #444444;">{{ item.filter1 }}
                                    </p>
                                </div>
                                <v-card-item class="mx-auto" style="background-color: white; color: #444444;">
                                    <v-card-title style="text-align: center;">
                                        <h2 class="text-h5" style="text-align: center;">
                                            {{ item.name || $t('name.not.found') }}
                                        </h2>
                                        <v-spacer></v-spacer>
                                        <p style="text-align: center; font-size: 70%;" color="#888888">
                                        <ul>
                                            <li> {{ $t('code') + ' : ' + (item.code || $t('detail.not.found')) }} </li>
                                            <li> {{ $t('filter3') + ' : ' + item.filter3 }} </li>
                                        </ul>
                                        </p>
                                        <div style="text-align: center;margin-top: 5px;">
                                            <span class="text-h5">{{ item.price == 0 ? '-' : Number(item.price ||
                                                0).toLocaleString('es-AR',
                                                    {
                                                        style:
                                                            'currency', currency: 'ARS'
                                                    }) }}</span>
                                        </div>
                                    </v-card-title>
                                </v-card-item>
                                <v-card-actions
                                    style="justify-content: center; margin-top: -10px; background-color: white;">
                                    <v-btn color="btnFavorite" variant="tonal" density="default" width="90%"
                                        v-if="item.price > 0"
                                        @click="this.$router.push({ path: '/detail', query: { id: item.id, code: item.code } })">
                                        {{ $t('buy') }}
                                    </v-btn>
                                    <v-btn color="btnQuote" variant="tonal" density="default" width="90%"
                                        v-if="item.price <= 0"
                                        @click="; formDataThread.subject = 'Presupuesto: ' + item.code; formDataThread.type = 'Solicitud de Presupuesto'; formDataThread.message = 'Solicito presupuesto sobre el producto [' + item.code + '] - de nombre ' + item.name; formThread = true;">
                                        {{ 'Solicitar Presupuesto' }}
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-item>
                    </v-col></v-row>
            </v-item-group>
        </v-container></v-card>
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

export default {
    name: "favorites",
    data() {
        return {
            items: [],
            token: useCookie('token'),
            itemsFavorites: [],
            globalState: useGlobalState(),
            headersFav: [
                { title: 'Codigo', key: 'productCode', align: 'center' },
                { title: 'Descripcion', key: 'productBio', align: 'center' },
                { title: 'Imagen', key: 'productImg', align: 'center' },
                { title: 'Acciones', key: 'options', align: 'center' },
            ],
            dialogImage: false,
            itemsProduct: [],
            formThread: false,
            formDataThread: {
                subject: undefined,
                message: undefined,
                type: undefined,
            },
            filter1: '',
            filter3: '',
            selection: [],
        };
    },
    methods: {
        show(message, color) {
            this.showSnackbar = true;
            this.message = message
            this.color = color
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
        async getFavorites() {
            const filterJson = {
                model: "PRODUCT",
                filters: [
                    {
                        code: "code",
                        type: "LIST",
                        list: []
                    }
                ]
            }
            //@ts-ignore
            this.itemsFavorites = await getEndpoint('/api/controller/favorite', {
                orderField: 'productCode',
                orderDir: 'asc',
                one: 'false'
            }, this.token)

            this.itemsFavorites.map((elem: any) => {
                filterJson.filters[0].list.push(elem.productCode)
            })
            var field = filterJson.field || 'code';
            var order = filterJson.order || 'asc';
            await this.getProducts(filterJson, field, order)
        },
        async getProducts(filter, field, order) {
            try {
                let { data } = await useFetch('/api/sync/product?one=false&field=' + field + '&order=' + order + '&client=' + this.globalState.codClient || '000001', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: filter
                });
                if (data["_rawValue"].length > 0) {
                    data = data["_rawValue"]
                    // Filtrar los objetos para eliminar duplicados basados en el código
                    const uniqueData = [];
                    const seenCodes = new Set();


                    for (const item of data) {
                        if (!seenCodes.has(item.code)) {
                            uniqueData.push(item);
                            seenCodes.add(item.code);
                        }
                    }
                    this.itemsProduct = uniqueData;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
    },
    async created() {
        await this.getFavorites();
    }
};

</script>