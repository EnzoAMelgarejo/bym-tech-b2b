<script setup>
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
const { smAndDown, xs, sm, md, lg } = useDisplay();

const getSmAndDown = () => {
    return smAndDown.value || xs.value;
};

</script>
<template>
    <div>
        <v-dialog v-model="save" width="auto">
            <v-alert color="success" type="success" border closable v-model="save">
                {{ $t('product.add.sucess') }}
            </v-alert>
        </v-dialog>
        <v-dialog v-model="error" width="auto">
            <v-alert color="red" type="error" border closable v-model="error">
                {{ textError }}
            </v-alert>
        </v-dialog>
        <v-row style="margin-top: 2% !important;" v-if="!waitProduct">
            <v-col cols="1" xs="1" sm="1" md="1" lg="1" xl="1"></v-col>
            <v-col cols="10" xs="10" sm="10" md="5" lg="5" xl="5">
                <b2bImagesDetail :itemProdImg="itemProdImg" />
            </v-col>
            <v-col cols="0" xs="1" sm="1" md="0" lg="0" xl="0"></v-col>
            <v-col cols="1" xs="1" sm="1" md="0" lg="0" xl="0" v-if="getSmAndDown()"></v-col>
            <v-col cols="10" xs="10" sm="10" md="4" lg="4" xl="4">
                <v-row>
                    <v-col cols="12">
                        <div class="title-product">
                            {{ itemProd.name || 'Not found name' }}
                        </div>
                        <div class="title-product-detail">
                            {{ itemProd.bio || 'Not found bio' }}
                        </div>
                        <v-row>
                            <v-col cols="4">
                                <v-btn color="btnMyOrders" style="margin-top: 5%" rounded="xl" variant="elevated"
                                    @click="generateReport" prepend-icon="mdi-cloud-download"><strong>{{
                                        'Documentación'
                                    }}</strong></v-btn>
                            </v-col>
                            <v-col cols="6">
                                <heartFavorite :item="itemProd" style="margin-top: 0%"></heartFavorite>
                            </v-col>
                        </v-row>

                        <div class="price-product" style="margin-top: 5% !important;">
                            {{ Number(itemProd.price || 0).toLocaleString('es-AR',
                                {
                                    style:
                                        'currency', currency: itemProd.coin
                                }) }}
                        </div>

                        <v-divider></v-divider>
                        <div style="margin-top: 2% !important;">
                            <v-chip color="blue" variant="flat" size="small" style="margin-left: 5px !important;"
                                v-if="filter1 != null">
                                {{ filter1 }}
                            </v-chip>
                            <v-chip color="red" variant="flat" size="small" style="margin-left: 5px !important;"
                                v-if="filter2 != null">
                                {{ filter2 }}
                            </v-chip>
                            <v-chip color="yellow" variant="flat" size="small" style="margin-left: 5px !important;"
                                v-if="filter3 != null">
                                {{ filter3 }}
                            </v-chip>
                            <v-chip color="green" variant="flat" size="small" style="margin-left: 5px !important;"
                                v-if="filter4 != null">
                                {{ filter4 }}
                            </v-chip>
                        </div>
                        <div style="margin-top: 5% !important;">
                            <v-text-field v-model="number" append-icon="mdi-plus" prepend-icon="mdi-minus" type="number"
                                hint="Cantidad" label="Cantidad" name="input-10-1" counter @click:append="number += 1;"
                                @click:prepend="number -= 1;"></v-text-field>
                        </div>
                        <v-divider></v-divider>
                        <div style="margin-top: 20px; margin-bottom: 20px;">
                            <v-row>
                                <v-col cols="5" v-if="itemProd.price > 0">
                                    <v-btn size="x-large" rounded="xl" style="width: 80%;" @click="saveProduct()">{{
                                        $t('buy') }}</v-btn>
                                </v-col>
                                <v-col cols="5" v-if="itemProd.price <= 0">
                                    <v-btn size="x-large" rounded="xl" style="width: 100%;"
                                        @click=" formDataThread.subject = 'Presupuesto: ' + itemProd.code; formDataThread.type = 'Solicitud de Presupuesto'; formDataThread.message = 'Solicito presupuesto sobre el producto [' + itemProd.code + '] - de nombre ' + itemProd.name; formThread = true;">{{
                                            'Presupuesto' }}</v-btn>
                                </v-col>
                                <v-col cols="1"></v-col>
                                <v-col cols="1">
                                    <!-- <heartFavorite :item="itemProd"></heartFavorite>-->
                                </v-col>
                                <!--<v-col cols="1">
                                    <v-btn color="btnFavorite" icon="mdi-share-variant" variant="plain" size="x-large">
                                    </v-btn>
                                </v-col>-->
                                <!--<v-col cols="1">
                                    <v-btn color="btnFavorite" icon="mdi-cloud-download" variant="plain" size="x-large"
                                        @click="generateReport">
                                    </v-btn>
                                </v-col>-->

                            </v-row>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row v-if="!waitProduct">
            <v-col cols="2"></v-col>
            <v-col cols="8">
                <v-tabs v-model="tab" align-tabs="title">
                    <v-tab v-for="item in items" :key="item" :value="item">
                        {{ item.title }}
                    </v-tab>
                </v-tabs>
                <v-window v-model="tab">
                    <v-window-item v-for="item in items" :key="item" :value="item">
                        <v-card flat>
                            <div v-html="item.text" class="title-product-feature"
                                style="padding-top: 10px; padding-left: 30px;"></div>
                        </v-card>
                    </v-window-item>
                </v-window>
            </v-col>
        </v-row>
        <v-row style="margin-bottom: 20%;margin-top: 10% !important;" v-if="waitProduct">
            <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate :size="80" :width="10" color="primary"></v-progress-circular>
            </v-col>
        </v-row>
        <div style="height: 620px; background-color: #efefef" v-if="globalState.role !== 'Admin'">
            <v-row>
                <v-col cols="12">
                    <div class="title-offers-and-news">
                        {{ $t('other.customer') }}
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-sheet class="mx-auto" max-width="85%" color="transparent">
                    <v-slide-group class="pa-4" selected-class="bg-primary" show-arrows>
                        <v-slide-group-item v-for="item in itemsRecommended " :key="item.code">
                            <b2bCardProduct :item="item" />
                        </v-slide-group-item>
                    </v-slide-group>
                </v-sheet>
            </v-row>
        </div>
        <div style="height: 620px; background-color: #efefef" v-if="globalState.role == 'Admin'">
            <v-row>
                <v-col cols="12">
                    <div class="title-offers-and-news">
                        {{ 'Imagenes' }}
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-sheet class="mx-auto" max-width="85%" color="transparent">
                    <v-slide-group class="pa-4" selected-class="bg-primary" show-arrows>
                        <v-slide-group-item>
                            <v-card class="elevation-0" width="300px" theme="light">
                                <v-toolbar dark flat>
                                    <v-toolbar-title>Imagen 1</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                                <v-card-text>
                                    <v-img cover :src="this.itemProd.img1 || './media/img/image-not-found.jpg'">
                                        <v-icon @click="triggerFileInput('fileInput1')" class="position-absolute"
                                            bottom="10" right="10" large>mdi-paperclip</v-icon>
                                    </v-img>
                                    <v-file-input ref="fileInput1" @change="loadPhoto($event, 'img1')"
                                        style="display:none" v-model="img1" required></v-file-input>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="black" @click="putImage(1, img1)">
                                        Guardar
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-slide-group-item>
                        <v-slide-group-item>
                            <v-card class="elevation-0" width="300px" theme="light">
                                <v-toolbar dark flat>
                                    <v-toolbar-title>Imagen 2</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                                <v-card-text>
                                    <v-img cover :src="this.itemProd.img2 || './media/img/image-not-found.jpg'">
                                        <v-icon @click="triggerFileInput('fileInput2')" class="position-absolute"
                                            bottom="10" right="10" large>mdi-paperclip</v-icon>
                                    </v-img>
                                    <v-file-input ref="fileInput2" @change="loadPhoto($event, 'img2')"
                                        style="display:none" v-model="img2" required></v-file-input>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="black" @click="putImage(2, img2)">
                                        Guardar
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-slide-group-item>
                        <v-slide-group-item>
                            <v-card class="elevation-0" width="300px" theme="light">
                                <v-toolbar dark flat>
                                    <v-toolbar-title>Imagen 3</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                                <v-card-text>
                                    <v-img cover :src="this.itemProd.img3 || './media/img/image-not-found.jpg'">
                                        <v-icon @click="triggerFileInput('fileInput3')" class="position-absolute"
                                            bottom="10" right="10" large>mdi-paperclip</v-icon>
                                    </v-img>
                                    <v-file-input ref="fileInput3" @change="loadPhoto($event, 'img3')"
                                        style="display:none" v-model="img3" required></v-file-input>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="black" @click="putImage(3, img3)">
                                        Guardar
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-slide-group-item>
                        <v-slide-group-item>
                            <v-card class="elevation-0" width="300px" theme="light">
                                <v-toolbar dark flat>
                                    <v-toolbar-title>Imagen 4</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                                <v-card-text>
                                    <v-img cover :src="this.itemProd.img4 || './media/img/image-not-found.jpg'">
                                        <v-icon @click="triggerFileInput('fileInput4')" class="position-absolute"
                                            bottom="10" right="10" large>mdi-paperclip</v-icon>
                                    </v-img>
                                    <v-file-input ref="fileInput4" @change="loadPhoto($event, 'img4')"
                                        style="display:none" v-model="img4" required></v-file-input>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="black" @click="putImage(4, img4)">
                                        Guardar
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-slide-group-item>
                    </v-slide-group>
                </v-sheet>
            </v-row>
        </div>
    </div>
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
                <v-btn class="ms-auto" text="Cancelar" @click="formThread = false;"></v-btn>
                <v-btn class="ms-auto" text="Grabar" @click="postThread(formDataThread)"></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>
<script>
import heartFavorite from '/components/heartFavorite.vue'
import { useShoppingCartStore } from '~/store/notifications';

export default {
    data: () => ({
        model: null,
        selection: null,
        tab: null,
        cartStore: useShoppingCartStore(),
        globalState: useGlobalState(),
        items: [
        ],
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo velit odio. Ut ac augue dapibus libero fermentum viverra nec ac felis. Fusce consectetur, ex quis mollis auctor, sapien justo faucibus sapien, et tempus mi dui vel sapien. Etiam bibendum viverra leo vitae ornare. Mauris neque risus, porta vitae venenatis in, scelerisque at arcu. Donec sit amet consequat leo, lacinia rutrum ipsum. Curabitur vel fringilla tortor. Proin gravida nec odio ut bibendum. Vivamus malesuada enim quis felis viverra fringilla. Vivamus ultricies ligula id ante luctus, in tincidunt odio suscipit. Cras et augue ac sapien commodo iaculis eu non tellus. Nullam ullamcorper bibendum nibh at viverra. Duis commodo congue pellentesque. Proin vel metus est.',
        number: 1,
        save: false,
        waitProduct: false,
        id: 0,
        itemProd: {},
        itemProdImg: [],
        error: false,
        code: "",
        textError: '',
        chips: [],
        itemsRecommended: [],
        formThread: false,
        formDataThread: {
            subject: undefined,
            message: undefined,
            type: undefined,
        },
        token: useCookie('token'),
        filter1: '',
        filter2: '',
        filter3: '',
        filter4: '',
        img1: undefined,
        img2: undefined,
        img3: undefined,
        img4: undefined,
    }),
    async created() {
        this.globalState.notifications.currentPage = 'detail';

        if (this.$route.query.id) {
            this.id = this.$route.query.id;
        }
        if (this.$route.query.code) {
            this.code = this.$route.query.code;
        }
        await this.getProduct();
        this.filter1 = await this.getCategory(this.itemProd.filter1);
        this.filter2 = await this.getFilter2(this.itemProd.filter2);
        this.filter3 = await this.getFilter3(this.itemProd.filter3);
        this.filter4 = await this.getFilter4(this.itemProd.filter4);
    },
    methods: {
        triggerFileInput(property) {
            this.$refs[property].click()
        },
        loadPhoto(event, property) {
            const file = event.target.files[0]
            if (file) {
                this.itemProd[property] = URL.createObjectURL(file);
            }
        },
        async putImage(index, img) {
            try {
                let photoUrl = undefined
                if (img !== undefined) {
                    try {
                        const formData = new FormData();
                        formData.append('file', img);
                        photoUrl = await $fetch('/api/controller/fileUpload', {
                            method: 'POST',
                            body: formData,
                        })
                    } catch (err) {
                        console.log(err)
                    }
                }
                const data = await $fetch('/api/sync/images', {
                    method: 'POST',
                    body: {
                        index: index,
                        code: this.itemProd.code,
                        image: photoUrl
                    },
                    params: {  // Usa 'params' para los parámetros de query
                    },
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    }

                })
                //snackbar
                //this.$refs.favSnackbarRef.show(this.$t('edited.success'), 'green')
                //recargo la pagina
                window.location.reload()
            } catch {
                //this.$refs.favSnackbarRef.show(this.$t('favorite.error'), 'red');
            }

        },
        async getCategory(value) {
            const selectedItem = this.globalState.notifications.category.find(item => item.code === value);
            return selectedItem ? selectedItem.description : null;
        },
        async getFilter2(value) {
            const selectedItem = this.globalState.notifications.filter2.find(item => item.code === value);
            return selectedItem ? selectedItem.description : null;
        },
        async getFilter3(value) {
            const selectedItem = this.globalState.notifications.filter3.find(item => item.code === value);
            return selectedItem ? selectedItem.description : null;
        },
        async getFilter4(value) {
            const selectedItem = this.globalState.notifications.filter4.find(item => item.code === value);
            return selectedItem ? selectedItem.description : null;
        },
        async getProduct() {
            this.waitProduct = true;
            try {
                const filter = await this.constructFilter(this.code, null);
                const { data } = await useFetch('/api/sync/product?one=false&field=code&order=asc&offset=0&rows=1' + '&client=' + this.globalState.codClient, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: filter
                });
                this.itemProd = data._rawValue[0];
                this.itemProdImg = [];
                this.itemProdImg.push(this.itemProd.img1 || './media/img/image-not-found.jpg');
                if (this.itemProd.img2 != '') {
                    this.itemProdImg.push(this.itemProd.img2 || './media/img/image-not-found.jpg');
                }
                if (this.itemProd.img3 != '') {
                    this.itemProdImg.push(this.itemProd.img3 || './media/img/image-not-found.jpg');
                }
                if (this.itemProd.img4 != '') {
                    this.itemProdImg.push(this.itemProd.img4 || './media/img/image-not-found.jpg');
                }
                if (this.itemProd.img5 != '') {
                    this.itemProdImg.push(this.itemProd.img5 || './media/img/image-not-found.jpg');
                }
                this.items = [
                    { title: this.$t('feature'), text: this.itemProd.feature || this.$t('feature.not.found') }
                ];

            } catch (error) {
                console.error('Error fetching data:', error);
            }


            this.waitProduct = false;

            const arrayRecommend = [this.itemProd.filter1];

            const filterRecommend = await this.constructFilter(this.itemProd.code, arrayRecommend);
            try {
                const { data } = await useFetch('/api/sync/product?one=false&field=code&order=asc&offset=0&rows=5' + '&client=' + this.globalState.codClient, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: filterRecommend
                });
                this.itemsRecommended = data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async constructFilter(code, categ) {
            var filter = {
                model: 'PRODUCT',
                filters: []
            }

            if (categ !== null && categ.length > 0) {
                var filterCateg = { code: 'filter1', type: 'LIST', value: '', list: [] }

                categ.forEach(value => {
                    filterCateg.list.push(value);
                });

                filter.filters.push(filterCateg);

                var filterCode = { code: 'code', type: 'NOT_EQUALS', value: code, list: [] }
                filter.filters.push(filterCode);

            } else {
                var filterCateg = { code: 'code', type: 'EQUALS', value: code, list: [] }
                filter.filters.push(filterCateg);
            }
            return filter;
        },
        async saveProduct() {
            try {
                if (this.number > 0) {
                    const { data } = await useFetch('/api/controller/order', { query: { one: 'false', type: "SHOPPING_CART" }, headers: { 'token': this.token } });

                    if (data["_rawValue"].length > 0) {
                        const firstItem = data["_rawValue"][0];
                        const todo = await $fetch('/api/controller/itemsOrder', {
                            method: 'POST',
                            body: {
                                "code": this.itemProd.code,
                                "img": this.itemProd.img1,
                                "name": this.itemProd.name,
                                "quant": this.number.toString(),
                                "price": this.itemProd.price.toString(),
                                "total": (this.number * Number(this.itemProd.price)).toString(),
                                "updatedAt": "2024-05-02T00:00:00.000Z",
                                Order: {
                                    connect: {
                                        id: firstItem.id
                                    }
                                }
                            },
                            headers: {
                                'token': this.token
                            }
                        })
                        this.cartStore.increment()
                        if (todo) {
                            this.save = true;
                        } else {
                            this.error = true;
                            this.textError = "Error al grabar los datos del carrito."
                        }
                    } else {
                        this.error = true;
                        this.textError = "Error al obtener datos del carrito actual."
                    }
                } else {
                    this.error = true;
                    this.textError = "Para agregar el producto al carrito se deben seleccionar 1 o más unidades."
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
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
        async generateReport() {
            try {
                const response = await fetch(`/api/sync/files?code=` + this.itemProd.code, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (data.status === 201 && data.files) {
                    // Crear un enlace temporal para descargar el archivo ZIP
                    const link = document.createElement('a');
                    link.href = `data:application/zip;base64,${data.files}`;
                    link.setAttribute('download', 'files.zip');

                    // Simular un clic en el enlace para iniciar la descarga
                    document.body.appendChild(link);
                    link.click();

                    // Eliminar el enlace temporal del DOM
                    document.body.removeChild(link);
                } else {
                    console.error('Error:', data.response);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    },
}
</script>
<style>
.title-product {
    text-align: left;
    margin-top: 1%;
    margin-bottom: 1%;
    letter-spacing: 2px;
    font-size: 30px;
    font-weight: bold;
}

.title-product-detail {
    text-align: left;
    margin-top: 1%;
    margin-bottom: 1%;
    font-weight: 300;
    letter-spacing: 2px;
    font-size: 24px;
}

.title-product-feature {
    text-align: left;
    margin-top: 1%;
    margin-bottom: 1%;
    font-weight: 300;
    letter-spacing: 2px;
    font-size: 12px;
}

.price-product {
    text-align: left;
    margin-top: 1%;
    margin-bottom: 1%;
    font-weight: 300;
    letter-spacing: 2px;
    font-size: 24px;
    color: grey;
}

.title-offers-and-news {
    text-align: center;
    margin-top: 1%;
    margin-bottom: 1%;
    font-weight: 300;
    letter-spacing: 2px;
    font-size: 30px;
}



.v-slide-group__content {
    justify-content: center;
}
</style>