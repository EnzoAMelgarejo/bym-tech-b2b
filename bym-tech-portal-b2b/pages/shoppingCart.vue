<template>
    <!-- Header with the cart title -->
    <v-container>
        <v-row>
            <v-col>
                <v-btn color="green" dark>
                    Carrito de compra <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
            </v-col>
        </v-row>

        <!-- Product List and Total Summary -->
        <v-row class="mt-12">
            <!-- Product list -->
            <v-col cols="8">
                <v-card theme="light" v-for="(product, index) in itemsProductCart" :key="product.id" class="mb-4">
                    <v-row align="center">
                        <!-- Placeholder for product image -->
                        <v-col cols="2">
                            <v-img :src="product.img" height="100"></v-img>
                        </v-col>

                        <!-- Product name and controls -->
                        <v-col cols="6">
                            <p class="font-weight-black">{{ product.name }}</p>
                        </v-col>

                        <!-- Quantity controls -->
                        <v-col cols="2" class="d-flex align-center">
                            <v-icon @click="decreaseQuantity(index)">mdi-minus</v-icon>
                            <span class="px-4">{{ product.quant }}</span>
                            <v-icon @click="increaseQuantity(index)">mdi-plus</v-icon>
                        </v-col>

                        <!-- Price and delete button -->
                        <v-col cols="2" class="d-flex justify-end align-center">
                            <v-row>
                                <v-col cols="6">
                                    <span>${{ product.price }}</span>
                                </v-col>
                                <v-col cols="4">
                                    <v-icon class="" style="  font-size: 34px !important;" @click="removeProduct(product.id)"
                                        color="red">mdi-close</v-icon>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <!-- Total summary and checkout -->
            <v-col cols="3">
                <v-card class="pa-4" theme="light" outlined>
                    <p class="text-h4 mb-4 text-center font-weight-black">Total</p>
                    <v-row>
                        <v-col cols="6" class="py-6">Subtotal</v-col>
                        <v-col cols="6" class="text-right">${{ subtotal }}</v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <p>Calculo de envío</p>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="País" v-model="shipping.country"></v-text-field>
                            <v-text-field label="Ciudad" v-model="shipping.city"></v-text-field>
                            <v-text-field label="Código postal" v-model="shipping.postalCode"></v-text-field>
                            <v-btn block color="black" class="white--text" @click="calculateTotal">
                                Actualizar Total
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-row class="py-6">
                        <v-col cols="6" class="text-h6">Total</v-col>
                        <v-col cols="6" class="text-right text-h4 font-weight-black">${{ total }}</v-col>
                    </v-row>
                    <v-btn block color="#E4AF4C" @click="saveOrderPut()" class="py-8 text-white font-weight-black">
                        Proceder a la compra
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            itemsProductCart: [
            ],
            shipping: {
                country: "",
                city: "",
                postalCode: "",
            },
            subtotal: 300,
            total: 300,
            token: useCookie('token')
        };
    },
    mounted() {
        this.refreshShoppingCart();
    },
    methods: {
        increaseQuantity(index) {
            this.itemsProductCart[index].quant++;
            this.updateSubtotal();
        },
        decreaseQuantity(index) {
            if (this.itemsProductCart[index].quant > 1) {
                this.itemsProductCart[index].quant--;
                this.updateSubtotal();
            }
        },
        async removeProduct(id) {
            await this.deleteItem(id)
            await this.refreshShoppingCart();
            this.updateSubtotal();
        },
        updateSubtotal() {
            this.subtotal = this.itemsProductCart.reduce(
                (acc, product) => acc + product.price * product.quant,
                0
            );
            this.total = this.subtotal; // Include shipping calculations here if needed
        },
        calculateTotal() {
            // Add shipping logic here if needed
            this.total = this.subtotal;
        },
        async deleteItem(index) {
            try {
                const todo = await $fetch('/api/controller/itemsOrder', {
                    method: 'DELETE',
                    body: {
                        id:index
                    },
                    headers: {
                        'token': this.token
                    }
                })
                this.cartStore.increment()
                if (!todo) {
                    this.error = true;
                    this.textError = "Error al grabar los datos del carrito."
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }

        },
        async saveOrderPut() {
            this.question = false;
            const { data } = await useFetch('/api/controller/order', { query: { one: 'false', type: "SHOPPING_CART" }, headers: { 'token': this.token } });
            var currentUserId = this.globalState.userId;
            var bodyOrderExternal = {}

            if (data["_rawValue"].length > 0) {
                var firstItem = data["_rawValue"][0];
                firstItem.type = this.typeOrder == 'pedido' ? 'SALE_ORDER' : 'QUOTE';
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

                if (this.typeOrder == 'pedido') {
                    bodyOrderExternal = await this.saveOrderExternal();
                }
                var item = {
                    type: firstItem.type,
                    number: bodyOrderExternal.NroPedidoVenta ? bodyOrderExternal.NroPedidoVenta : firstItem.number,
                    status: firstItem.status,
                    bio: firstItem.bio,
                    dueDate: firstItem.dueDate,
                    deliveryDate: firstItem.deliveryDate,
                    total: this.total,
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
                    this.refreshShoppingCart();
                    this.dialog = false
                    if (this.typeOrder == 'pedido') {
                        this.saveOrder = true;
                        this.itemsProductCart = [];
                    } else {
                        this.saveQuote = true;
                        this.itemsProductCart = [];
                    }
                    await this.handlePdf(firstItem, firstItem.itemsOrder)
                } else {
                    this.error = true;
                    this.textError = "Error al grabar los datos."
                }
            } else {
                this.error = true;
                this.textError = "Error al obtener datos del carrito vigente."
            }
        },
        async saveOrderExternal() {
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

            this.itemsProductCart.forEach(product => {
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
        async refreshShoppingCart() {
            try {
                const { data } = await useFetch('/api/controller/order', { query: { one: 'false', type: "SHOPPING_CART" }, headers: { 'token': this.token } });
                if (data["_rawValue"]?.length > 0) {
                    this.itemsProductCart = data["_rawValue"][0].itemsOrder;
                    this.total = 0;

                    for (let index = 0; index < this.itemsProductCart.length; index++) {
                        const item = this.itemsProductCart[index];
                        this.total += Number(item.price) * Number(item.quant);
                    }

                    this.subtotal = this.total;
                } else {
                    var item = {
                        type: 'SHOPPING_CART',
                        number: '',
                        status: 'ACTIVE',
                        bio: '',
                        dueDate: new Date(),
                        deliveryDate: new Date(),
                        refNumber: this.formData.orderNumber,
                        document: '',
                        total: 0,
                        companyId: 1,
                        userId: 1,
                        addressId: 1,
                        updatedAt: new Date()
                    }
                    const todo = await $fetch('/api/controller/order', {
                        method: 'POST',
                        body: item,
                        query: { id: 0, one: 'false' },
                        headers: {
                            'token': this.token
                        }
                    })

                    if (todo) {
                        this.total = 0;
                        this.subtotal = this.total;
                    } else {
                        this.error = true;
                        this.textError = "Error al grabar los datos."
                    }
                }
                this.cartStore.shopping_cart = this.itemsProductCart.length

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
    },
};
</script>
<style scoped>
.v-card--variant-elevated {
    box-shadow: initial !important;
}
</style>