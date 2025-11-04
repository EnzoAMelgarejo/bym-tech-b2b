<template>
  <v-card height="100%" color="white" style="bottom:0px !important;">
    <v-list>
      <v-list-item prepend-icon="mdi-cart" :subtitle="$t('product.detail')" :title="$t('cart')"></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list color="white">
      <v-list-item color="white" v-for="item in itemsProductCart" :key="item.id"
        :prepend-avatar="item.img || './media/img/image-not-found.jpg'" :title="item.name" :subtitle="Number(item.price).toLocaleString('es-AR',
          {
            style:
              'currency', currency: 'ARS'
          }) + ' x ' + item.quant + ' UN = ' + (Number(item.price) * Number(item.quant)).toLocaleString('es-AR',
            {
              style:
                'currency', currency: 'ARS'
            })" value="0">
        <v-divider></v-divider>

      </v-list-item>
    </v-list>
    <v-row style="position:absolute; bottom:5%;">
      <v-col cols="6"><v-list style="margin-top: 110% !important;">
          <v-list-item v-if="itemsProductCart.length > 0" title="SUBTOTAL"></v-list-item>
          <v-list-item v-if="itemsProductCart.length > 0" title="DESCUENTOS"></v-list-item>
          <v-list-item v-if="itemsProductCart.length > 0" title="TOTAL"></v-list-item>
        </v-list></v-col>
      <v-col cols="6"><v-list style="margin-top: 110% !important;">
          <v-list-item v-if="itemsProductCart.length > 0" :title="subtotal.toLocaleString('es-AR',
            {
              style:
                'currency', currency: 'ARS'
            })"></v-list-item>
          <v-list-item v-if="itemsProductCart.length > 0" title="0.00"></v-list-item>
          <v-list-item v-if="itemsProductCart.length > 0" :title="total.toLocaleString('es-AR',
            {
              style:
                'currency', currency: 'ARS'
            })"></v-list-item>
        </v-list></v-col>
      <v-col cols="12">
        <v-list>
          <v-list-item>
            <v-row>
              <v-divider></v-divider>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-btn size="x-large" rounded="xl" variant="elevated" color="green"
                  @click="typeOrder = 'presupuesto'; question = true;" v-if="loadButtons">
                  {{ $t('generate.quote') }} </v-btn>
              </v-col>
              <v-col cols="1"></v-col>
              <v-divider></v-divider>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-btn size="x-large" rounded="xl" variant="elevated" color="blue"
                  @click="typeOrder = 'pedido'; showForm = true;" v-if="loadButtons">{{
                    $t('confirm.order') }}</v-btn>
              </v-col>
              <v-col cols="1"></v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-card>
  <v-card height="100%" color="white" v-if="showForm">
    <v-card-title class="py-8">Formulario de orden</v-card-title>
    <v-divider thickness="2px" color="black" style="opacity: initial !important;"></v-divider>
    <v-card-text class="d-flex align-center py-12">
      <v-form class="flex-grow-1">
        <v-row class="mt-12">
          <v-col cols="12" class="mt-12">
            <v-text-field label="N° Referencia" v-model="formData.orderNumber"></v-text-field>
          </v-col>
          <v-col cols="12" class="mt-12">
            <v-file-input prepend-icon="" append-inner-icon="mdi-paperclip" label="Adjuntar documento"
              v-model="formData.document"></v-file-input>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-row style="position:absolute; bottom:5%;;">

      <v-col cols="12">
        <v-list style="margin-top: 10px !important;">
          <v-list-item>
            <v-row>
              <v-col cols="6">
                <v-btn size="x-large" rounded="xl" variant="elevated" color="green" @click="showForm = false;">
                  VOLVER</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn size="x-large" rounded="xl" variant="elevated" color="blue"
                  @click="question = true; saveOrderPut()" v-if="loadButtons">CONFIRMAR</v-btn>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-card>
  <div style="height:0;margin-top: 2%;background-color: transparent;"></div>
  <v-dialog v-model="question" width="auto">
    <v-card max-width="400" prepend-icon="mdi-update" :text="'¿Desea añadir un nuevo ' + typeOrder + '?'"
      title="Confirmar">
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Aceptar" @click="saveOrderPut()"></v-btn>
        <v-btn class="ms-auto" text="Cancelar" @click="question = false;"></v-btn>
      </template>
    </v-card>
  </v-dialog>
  <v-dialog v-model="saveOrder" width="auto">
    <v-alert color="success" type="success" border closable v-model="saveOrder">
      ¡Pedido añadido con éxito!
    </v-alert>
  </v-dialog>
  <v-dialog v-model="saveQuote" width="auto">
    <v-alert color="success" type="success" border closable v-model="saveQuote">
      ¡Presupuesto añadido con éxito!
    </v-alert>
  </v-dialog>
  <v-dialog v-model="error" width="auto">
    <v-alert color="red" type="error" border closable v-model="error">
      {{ textError }}
    </v-alert>
  </v-dialog>
</template>
<script>

export default {
  name: "b2bShoppingCart",
  props: {
    itemsProductCart: {
      type: Array,
      default: {}
    }
  },
  data() {
    return {
      token: useCookie('token'),
      showForm: false,
      question: false,
      saveOrder: false,
      saveQuote: false,
      error: false,
      loadButtons: false,
    };
  },
  mounted() {
  },
  watch: {
    itemsProductCart(newVal) {
      if (newVal.length > 0) {
        this.loadButtons = true;
      }
    }
  },
  methods: {
    cartCount() {
      return this.itemsProductCart.length > 0
    },
    async saveOrderPut() {
      this.question = false;
      const { data } = await useFetch('/api/controller/order', { query: { one: 'false', type: "SHOPPING_CART" } });
      var currentUserId = this.globalState.value.userId;
      if (this.typeOrder == 'pedido') {
        this.error = true;
        this.textError = "Error de comunicación con ERP. Imposible crear el pedido de ventas."
      } else {
        if (data["_rawValue"].length > 0) {
          var firstItem = data["_rawValue"][0];
          firstItem.type = this.typeOrder == 'pedido' ? 'SALE_ORDER' : 'QUOTE';
          var item = {
            type: firstItem.type,
            number: firstItem.number,
            status: firstItem.status,
            bio: firstItem.bio,
            dueDate: firstItem.dueDate,
            deliveryDate: firstItem.deliveryDate,
            total: firstItem.total,
            document: this.formData.document,
            refNumber: this.formData.orderNumber,
            companyId: firstItem.companyId,
            userId: currentUserId,
            addressId: firstItem.addressId,
            updatedAt: firstItem.updatedAt
          }
          const todo = await $fetch('/api/controller/order', {
            method: 'POST',
            body: item,
            query: { id: firstItem.id }
          })

          if (todo) {
            this.itemsProductCart = [];
            if (this.typeOrder == 'pedido') {
              this.saveOrder = true;
            } else {
              this.saveQuote = true;
            }
          } else {
            this.error = true;
            this.textError = "Error al grabar los datos."
          }
        } else {
          this.error = true;
          this.textError = "Error al obtener datos del carrito vigente."
        }
      }
    },
  }
}

</script>