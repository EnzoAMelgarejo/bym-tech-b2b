<template>
    <v-card flat color="white">
        <template v-slot:text>
            <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" variant="outlined"
                hide-details single-line></v-text-field>
        </template>
        <v-data-table class="elevation-1" theme="light" height="400pt" width="80%" :headers="headers" :items="items"
            :search="search" :items-per-page="itemsPerPage" :page="page">
            <template v-slot:item.serie="{ item }">
                {{ 'APV' }}
            </template>
            <template v-slot:item.id="{ item }">
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

                <v-btn icon elevation="1">
                    <v-icon size="large" @click="itemQuo = item; dialogView = true;">
                        mdi-eye
                    </v-icon>
                </v-btn>

                <v-btn icon elevation="1">
                    <v-icon size="large" @click="handlePdf(item, itemQuo.itemsOrder)">
                        mdi-download
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
</template>

<script>
import { pageCount, createPDF } from '~/assets/utils/utils'; // Asegúrate de que esta ruta sea correcta

export default {
    name: 'b2bOrderCrud',
    data() {
        return {
            itemQuo: {},
            search: '',
            page: 1,
            token: useCookie('token'),
            itemsPerPage: 5,
            dialogView: false,
            headers: [
                { title: 'Serie', key: 'serie', align: 'center' },
                { title: 'Numero', key: 'id', align: 'center' },
                { title: 'Pedido', key: 'number', align: 'center' },
                { title: 'Estado', key: 'status', align: 'center' },
                { title: 'Fecha', key: 'createdAt', align: 'center' },
                { title: 'Items', key: 'items', align: 'center' },
                { title: 'Valor Total', key: 'total', align: 'center' },
                { title: 'Vencimiento', key: 'dueDate', align: 'center' },
                { title: 'Acciones', key: 'options', align: 'center' },
            ],
            items: [],
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
        await this.refreshFilter('SALE_ORDER')
    },
    methods: {
        pageCount,
        async handlePdf(presupuesto, items) {
            let customer = await this.getCustomer()
            createPDF(presupuesto, items, customer[0])
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
        getTotalItems(item) {
            let total = 0;
            var itemsProductCart = item.itemsOrder;

            total = itemsProductCart.length;

            return total;
        },
        generateOrder() {
            this.error = true;
            this.textError = 'Error de comunicación con ERP. Imposible crear el pedido de ventas.'
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
