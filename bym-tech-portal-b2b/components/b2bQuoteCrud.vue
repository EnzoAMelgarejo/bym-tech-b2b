<template>
    <v-card flat color="white">
        <template v-slot:text>
            <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" variant="outlined"
                hide-details single-line></v-text-field>
        </template>
        <v-data-table class="elevation-1" theme="light" height="400pt" width="80%" :headers="headers" :items="items"
            :search="search" :items-per-page="itemsPerPage" :page="page">
            <template v-slot:item.serie="{ item }">
                {{ 'APR' }}
            </template>
            <template v-slot:item.number="{ item }">
                {{ `0001-${String(item.id).padStart(8, '0')}` }}
            </template>
            <template v-slot:item.items="{ item }">
                {{ getTotalItems(item) }}
            </template>
            <template v-slot:item.total="{ item }">
                {{ getTotal(item) }}
            </template>
            <template v-slot:item.createdAt="{ item }">
                {{ item.createdAt.split('T')[0] }}
            </template>
            <template v-slot:item.dueDate="{ item }">
                {{ item.dueDate.split('T')[0] }}
            </template>
            <template v-slot:item.status="{ item }">
                <div>
                    <v-chip :color="item.status == 'ACTIVE' ? 'blue' : item.status == 'FINISHED' ? 'green' : 'red'"
                        :text="item.status" size="large" label></v-chip>
                </div>
            </template>
            <template v-slot:item.options="{ item }">

                <v-btn icon elevation="1"  @click="itemQuo = item; dialogView = true;">
                    <v-icon size="large">
                        mdi-eye
                    </v-icon>
                </v-btn>


                <v-btn icon elevation="1" v-if="!loadingFile[item.id]" @click="loadingFile[item.id] = true; handlePdf(item, itemQuo.itemsOrder)">
                    <v-icon size="large">
                        mdi-download
                    </v-icon>
                </v-btn>
                <v-progress-circular indeterminate v-if="loadingFile[item.id]"></v-progress-circular>

                <v-btn :disabled="item.status !== 'ACTIVE'" icon elevation="1" @click="itemQuo = item; generateOrder()">
                    <v-icon size="large">
                        mdi-file-check
                    </v-icon>
                </v-btn>

            </template>
            <template v-slot:bottom>
                <div class="text-center pt-2">
                    <v-pagination v-model="page" :length="pageCount(items, itemsPerPage)"></v-pagination>
                </div>
            </template>
        </v-data-table>
    </v-card>
    <v-dialog v-model="showForm" width="500px" height="">
        <v-card height="100%" color="white">
            <v-card-title class="py-8">{{ $t('order.form') }}</v-card-title>
            <v-divider thickness="2px" color="black" style="opacity: initial !important;"></v-divider>
            <v-card-text class="d-flex align-center py-12">
                <v-form class="flex-grow-1">
                    <v-row class="mt-12">
                        <v-col cols="12" class="mt-12">
                            <v-text-field :label="$t('reference.order')" v-model="formData.orderNumber"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="mt-12">
                            <v-file-input accept=".pdf, .doc, .jpeg, jpg" :rules="rules" prepend-icon=""
                                append-inner-icon="mdi-paperclip" :label="$t('attach.document')"
                                v-model="formData.document" @change="validateFile"></v-file-input>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-btn size="x-large" rounded="xl" variant="elevated" color="green"
                                @click="showForm = false;">
                                {{ $t('return') }}</v-btn>
                        </v-col>
                        <v-col cols="6">
                            <v-btn size="x-large" rounded="xl" variant="elevated" color="blue"
                                @click="saveOrderPut(itemQuo)">{{
                                    $t('confirm') }}</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialogView" width="500px" height="">
        <v-card prepend-icon="mdi-cash" dark :title="itemSelect">
            <v-card-text>
                <v-row dense>
                    <v-col cols="6">
                        {{ 'Doc. : ' + `0001-${String(itemQuo.id).padStart(8, '0')}` }}
                    </v-col>

                    <v-col cols="6">
                        {{ 'Fecha: ' + itemQuo.createdAt.split('T')[0] }}
                    </v-col>

                    <v-col cols="6">
                        {{ 'Vencimiento: ' + itemQuo.dueDate.split('T')[0] }}

                    </v-col>

                    <v-col cols="6">
                        {{ 'Total: ' + getTotal(itemQuo) }}
                    </v-col>
                    <v-divider></v-divider>
                    <v-col cols="12">
                        <v-list>
                            <v-list-item v-for="item in itemQuo.itemsOrder" :key="item.id"
                                :prepend-avatar="item.img || './media/img/image-not-found.jpg'" :title="item.name"
                                :subtitle="Number(item.price).toLocaleString('es-AR',
                                    {
                                        style:
                                            'currency', currency: 'ARS'
                                    }) + ' x ' + item.quant + ' UN = ' + (Number(item.price) * Number(item.quant)).toLocaleString('es-AR',
                                        {
                                            style:
                                                'currency', currency: 'ARS'
                                        })" value="0">
                            </v-list-item>
                        </v-list>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Cerrar" variant="plain" @click="dialogView = false;"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="saveOrder" width="auto">
        <v-alert color="success" type="success" border closable v-model="saveOrder">
            ¡Pedido añadido con éxito!
        </v-alert>
    </v-dialog>
</template>

<script>
import { pageCount, createPDF } from '~/assets/utils/utils'; // Asegúrate de que esta ruta sea correcta

export default {
    name: 'b2bQuoteCrud',
    data() {
        return {
            itemQuo: {},
            search: '',
            page: 1,
            token: useCookie('token'),
            itemsPerPage: 5,
            dialogView: false,
            headers: [
                { text: 'Serie', value: 'serie', align: 'center' },
                { text: 'Numero', value: 'number', align: 'center' },
                { text: 'Estado', value: 'status', align: 'center' },
                { text: 'Fecha', value: 'createdAt', align: 'center' },
                { text: 'Items', value: 'items', align: 'center' },
                { text: 'Valor Total', value: 'total', align: 'center' },
                { text: 'Vencimiento', value: 'dueDate', align: 'center' },
                { text: 'Acciones', value: 'options', align: 'center' },
            ],
            items: [],
            loadingFile: {},
            showForm: false,
            saveOrder: false,
            globalState: useGlobalState(),
            rules: [
                value => {
                    // Check if no file or an empty value is provided
                    if (!value || !value.length) return true;

                    // Check file size
                    //if (value[0].size > 2000000) return 'Avatar size should be less than 2 MB!';

                    // Check file type
                    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
                    const fileExtension = fileName.split('.').pop().toLowerCase();
                    if (!allowedTypes.includes(fileExtension)) return 'Extension de archivo no admitida!';

                    return true; // Valid file
                },
            ],
            formData: {
                orderNumber: '',
                document: '',
            },
        }
    },
    watch: {
        dialog(newVal) {
            this.localDialog = newVal
        },
        localDialog(newVal) {
            this.$emit('update:dialog', newVal)
        }
    },
    async created() {
        await this.refreshFilter('QUOTE')
    },
    methods: {
        timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        pageCount,
        async handlePdf(presupuesto, items) {
            let customer = await this.getCustomer()
            await this.timeout(4000)
            await createPDF(presupuesto, items, customer[0])
            this.loadingFile[presupuesto.id] = undefined
        },
        validateFile(event) {
            const fileInput = event.target;
            const file = fileInput.files[0];

            if (file) {
                // Check file size


                // Check file extension
                const allowedTypes = ['png', 'jpeg', 'pdf'];
                const fileName = file.name;
                const fileExtension = fileName.split('.').pop().toLowerCase();

                if (!allowedTypes.includes(fileExtension)) {
                    this.formData.document = ''; // Clear the input
                    return alert('Extension de archivo no admitida!');
                }
            }
        },
        getTotal(item) {
            let total = 0;
            var itemsProductCart = item.itemsOrder;

            for (let index = 0; index < itemsProductCart.length; index++) {
                const item = itemsProductCart[index];
                total += Number(item.price) * Number(item.quant);
            }

            return total.toLocaleString('es-AR',
                {
                    style:
                        'currency', currency: 'ARS'
                });
        },
        async getTotal2(item) {
            let total = 0;
            var itemsProductCart = item.itemsOrder;

            for (let index = 0; index < itemsProductCart.length; index++) {
                const item = itemsProductCart[index];
                total += Number(item.price) * Number(item.quant);
            }

            return total;
        },
        getTotalItems(item) {
            let total = 0;
            var itemsProductCart = item.itemsOrder;

            total = itemsProductCart.length;

            return total;
        },
        generateOrder() {
            this.showForm = true;
        },
        async saveOrderPut(data) {
            var currentUserId = this.globalState.userId;
            var bodyOrderExternal = {}

            var firstItem = data;
            firstItem.type = 'SALE_ORDER';
            var documentUrl = ''
            if (this.formData.document !== '') {
                try {
                    const formData = new FormData();
                    formData.append('file', this.formData.document);
                    documentUrl = await $fetch('/api/controller/fileUpload', {
                        method: 'POST',
                        body: formData,
                    })
                } catch (err) {
                    console.error(err)
                }
            }

            bodyOrderExternal = await this.saveOrderExternal(data);

            var item = {
                type: firstItem.type,
                number: bodyOrderExternal.NroPedidoVenta ? bodyOrderExternal.NroPedidoVenta : firstItem.number,
                status: firstItem.status,
                bio: firstItem.bio,
                dueDate: firstItem.dueDate,
                deliveryDate: firstItem.deliveryDate,
                total: await this.getTotal2(data),
                document: documentUrl,
                refNumber: this.formData.orderNumber,
                companyId: firstItem.companyId,
                userId: currentUserId,
                addressId: firstItem.addressId,
                updatedAt: firstItem.updatedAt
            }
            const todo = await $fetch('/api/controller/order', {
                method: 'POST',
                body: item,
                query: { id: firstItem.id },
                headers: { 'token': this.token }
            })
            if (todo) {
                this.showForm = false;
                this.saveOrder = true;
                await this.refreshFilter('QUOTE');
                await this.handlePdf(firstItem, firstItem.itemsOrder)
            } else {
                this.error = true;
                this.textError = "Error al grabar los datos."
            }
        },
        async saveOrderExternal(item) {
            var itemsProductCart = item.itemsOrder;
            var bodyOrder =
            {
                "Cliente": this.globalState.codClient || '000003',
                "Tienda": "01",
                "CondPago": "001",
                "Obs": this.formData.orderNumber,
                "Modalidad": "OTROS",
                "DocGer": "1",
                "Moneda": 1,
                "Items": [
                ]
            };

            itemsProductCart.forEach(product => {
                var item = {
                    "Producto": product.code,
                    "Cantidad": Number(product.quant),
                    "Precio": Number(product.price),
                    "TipoSalida": "502"
                };

                bodyOrder["Items"].push(item);
            });


            const sync = await $fetch('/api/sync/createorder', {
                method: 'POST',
                body: bodyOrder,
                query: {},
                headers: { 'token': this.token }
            })

            var response = sync.body ? sync.body : sync;
            if (sync.body) {
                var resp = JSON.stringify(sync.body).slice(1, -1).replace(/\\/g, '');;
                const parts = resp.split('}{').map((part, index, arr) => {
                    if (index === 0) return part + '}';
                    if (index === arr.length - 1) return '{' + part;
                    return '{' + part + '}';
                });

                try {
                    const secondObject = JSON.parse(parts[1]);
                    // Acceder a NroPedidoVenta
                    const nroPedidoVenta = secondObject.NroPedidoVenta;

                    response = secondObject;

                } catch (error) {
                    console.error('Error al parsear JSON:', error);
                }
            }

            return response;
        },
        async refreshFilter(typeOrder) {
            this.waitOrder = true;
            try {
                const { data } = await useFetch('/api/controller/order', { query: { one: 'false', type: typeOrder }, headers: { 'token': this.token } });
                this.items = data;
                this.itemQuo = this.items[0];
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            this.waitOrder = false;
        },
        async getCustomer() {
            try {
                const data = await $fetch('/api/sync/customer?one=true', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': this.token
                    }
                });
                return data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }
}
</script>

<style scoped>
/* Estilos opcionales para personalizar el Snackbar */
</style>
