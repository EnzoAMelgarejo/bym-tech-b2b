<script setup lang="ts">
</script>
<template>
  <div>
    <div :style="{ marginRight: '2%' }" class="responsive-margin">
      <v-row>
        <v-col cols="2">
          <v-card style="background-color: lightgrey; color: currentColor; height:100% !important;">

            <v-list class="custom-list">
              <v-list-item></v-list-item>
            </v-list>
            <v-divider></v-divider>

            <v-list v-model="itemSelect" density="compact" nav class="custom-list">
              <v-list-item title="Dashboard" class="listItem-responsive" @click="itemSelect = 'Dashboard'"
                value="dashboard">
                <template v-slot:prepend>
                  <v-icon>mdi-chart-pie</v-icon>
                </template>
              </v-list-item>
              <v-list-item title="Presupuestos" class="listItem-responsive" @click="itemSelect = 'Presupuesto'"
                value="Presupuesto">
                <template v-slot:prepend>
                  <v-icon>mdi-cash</v-icon>
                </template>
              </v-list-item>
              <v-list-item title="Pedidos" class="listItem-responsive" value="Pedidos" @click="itemSelect = 'Pedidos'">
                <template v-slot:prepend>
                  <v-icon>mdi-cart</v-icon>
                </template>
              </v-list-item>
              <v-list-item class="listItem-responsive" title="Favoritos" value="Favoritos"
                @click="itemSelect = 'Favoritos';">
                <template v-slot:prepend>
                  <v-icon>mdi-heart</v-icon>
                </template>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="compact" nav class="custom-list">
              <v-list-item class="listItem-responsive" title="Mis consultas" @click="itemSelect = 'Consultas';"
                value="myrequest">
                <template v-slot:prepend>
                  <v-icon>mdi-information-outline</v-icon>
                </template>
              </v-list-item>
              <v-list-item class="listItem-responsive" title="Mi Perfil" value="myprofile"
                @click="itemSelect = 'Mi perfil';">
                <template v-slot:prepend>
                  <v-icon>mdi-account</v-icon>
                </template>
              </v-list-item>
              <v-list-item class="listItem-responsive" title="Usuarios" value="Register"
                v-if="globalState.role == 'Admin'" @click="itemSelect = 'Register';">
                <template v-slot:prepend>
                  <v-icon>mdi-account</v-icon>
                </template>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="compact" nav class="custom-list">
              <v-list-item class="listItem-responsive" title="Salir" value="logout">
                <template v-slot:prepend>
                  <v-icon>mdi-logout</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="10">
          <v-breadcrumbs :items="['Home', itemSelect]">
          </v-breadcrumbs>
          <v-card v-if="itemSelect == 'Dashboard'" flat color="white" height="1700px">
            <iframe
              :src="'http://172.27.72.24:3000/public/dashboard/a464b04e-5b23-42bb-9148-7ba47703898c?cliente=000006&loja=' + globalState.codClient + '#theme=transparent&bordered=false&titled=true&hide_parameters=cliente'"
              frameborder="0" width="100%" height="100%" allowtransparency></iframe> 
          </v-card>
          <v-dialog v-model="error" width="auto">
            <v-alert color="red" type="error" border closable v-model="error">
              {{ textError }}
            </v-alert>
          </v-dialog>
          <b2bQuoteCrud v-if="itemSelect == 'Presupuesto'" />
          <b2bOrderCrud v-if="itemSelect == 'Pedidos'" />
          <favorites v-if="itemSelect == 'Favoritos'"></favorites>
          <register v-if="itemSelect == 'Register'"></register>
          <thread v-if="itemSelect == 'Consultas'" :interactionId="interactionId"></thread>
          <profile v-if="itemSelect == 'Mi perfil'"></profile>

          <v-card
            v-if="!['Presupuesto', 'Pedidos', 'Dashboard', 'Favoritos', 'Register', 'Consultas', 'Mi perfil'].includes(itemSelect)"
            flat color="white">
            <v-row>
              <v-col cols="12" class="text-center" style="margin-bottom: 20%;margin-top: 10% !important;">
                <div style="min-height: 100px; text-align: center;">
                  <i class="mdi mdi-wrench" style="font-size: 48px; color: #888;"></i>
                  <h3>Lo sentimos, esta página no está disponible</h3>
                  <p>Estamos realizando tareas de mantenimiento para mejorar tu experiencia. Por favor, vuelve
                    a
                    intentarlo más tarde.</p>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

    </div>
    <favSnackbar ref="favSnackbarRef"></favSnackbar>
  </div>
</template>

<script lang="ts">
import { getEndpoint, getNotifications } from '../assets/utils/utils'
import favSnackbar from '~/components/favSnackbar.vue';
import favorites from '~/components/favorites.vue';
import register from '~/components/register.vue';
import thread from '~/components/thread.vue';
import profile from '~/components/thread.vue';

import { ref } from 'vue';

export default {
  components: {
    favSnackbar,
    thread,
    favorites,
    register,
    profile
  },
  name: "portal",
  data: () => ({
    model: null,
    wait: false,
    itemSelect: 'Dashboard',
    error: false,
    textError: '',
    to: [
      'University of Somewhere',
      '118 Bureaucracy Lane',
      'Cityville, CA 90210',
    ],
    from: [
      'Business Time Inc.',
      '60 Paycheck Drive',
      'Townsland, ON A1B 2CD',
      'Canada',
    ],
    interactionId: undefined,
    globalState: useGlobalState(),
    token: useCookie('token'),
    itemsProd1: [
      {
        id: 0, quant: 1, price: 1000, title: 'Pipeta Multicanal', img: 'https://www.lobov.com.ar/images/0DC6622892534392B6C4D9D01442B57.jpg', detail: 'Pipeta Multicanal Aero96, 12 Canales, volumen variable 2-20 ul', show: false, chips: [
          { id: 0, code: '0', title: 'Pipetas', color: 'lightblue' }, { id: 1, code: '1', title: 'Solo online', color: 'red' }
        ]
      },
      {
        id: 1, quant: 1, price: 1000, title: 'Pipeta Unicanal', img: 'https://www.lobov.com.ar/thumb/2717F11012E14B949E4DD7FEEF3D0300_400x400.jpg', detail: 'Pipeta Unicanal Aero96, 12 Canales, volumen variable 2-20 ul', show: false, chips: [
          { id: 0, code: '0', title: 'Pipetas', color: 'lightblue' }, { id: 1, code: '1', title: 'Solo online', color: 'red' }
        ]
      },
      {
        id: 2, quant: 1, price: 1000, title: 'Bandeja Sub-Cell', img: 'https://www.bio-rad.com/sites/default/files/styles/brc_featured_sku_275x275_def/public/webroot/web/images/lsr/products/electrophoresis/sku_view/global/170-4416_view.jpg?itok=NZQm2aqo', detail: 'Pipeta Multicanal Aero96, 12 Canales, volumen variable 2-20 ul', show: false, chips: [
          { id: 0, code: '0', title: 'Western Blot', color: 'lightblue' }, { id: 1, code: '1', title: 'Solo online', color: 'red' }, { id: 2, code: '2', title: 'Bio-Rad', color: 'red' }
        ]
      }, {
        id: 3, quant: 1, price: 1000, title: 'Bandeja Cableada Sub-Cell', img: 'https://www.onelab.com.ar/images/thumbs/0003589_cuba-sub-cell-gt-p-electroforesis-horizontal_360.jpeg', detail: 'Pipeta Multicanal Aero96, 12 Canales, volumen variable 2-20 ul', show: false, chips: [
          { id: 0, code: '0', title: 'Western Blot', color: 'lightblue' }, { id: 2, code: '2', title: 'Bio-Rad', color: 'red' }
        ]
      }],
    offerItems: [
      { id: 0, title: '0', img: 'https://perfugroupar.vtexassets.com/assets/vtex.file-manager-graphql/images/d002d280-ee32-4fd0-9ca7-4311a78e0de1___733db2083cd37a34b23b954869474b3b.png', info: '' },
      { id: 1, title: '1', img: 'https://perfugroupar.vtexassets.com/assets/vtex.file-manager-graphql/images/22f8aaf7-8a8f-4d6b-8a6d-7c5aefd47635___af83f09a1efe79163b981f04e71d705a.jpg', info: '' },
      { id: 2, title: '2', img: 'https://perfugroupar.vtexassets.com/assets/vtex.file-manager-graphql/images/925ca699-b960-4bb9-910f-2f3da582aa65___5b8ab4bfacfbb84566671d5de734d5f8.jpg', info: '' },
      { id: 3, title: '3', img: 'https://perfugroupar.vtexassets.com/assets/vtex.file-manager-graphql/images/47906bfb-2dc1-4a96-a431-1f08a0b72339___bdb7d57e3f071a7aba5987271a7bd59a.jpg', info: '' },
    ],
    itemQuo: {},
  }),
  updated() {
    if (localStorage.getItem('route')) {
      this.itemSelect = localStorage.getItem('route');
      //si redirijo a consultas traigo el id de interaccion
      this.interactionId = localStorage.getItem('interactionId');
      localStorage.removeItem('route');
      localStorage.removeItem('interactionId');

    }
  },
  computed: {
    iconSize() {
      const breakpoint = this.$vuetify.display.name;
      switch (breakpoint) {
        case 'xs':
          return 24; // Tamaño pequeño
        case 'sm':
          return 32; // Tamaño medio
        case 'md':
          return 40; // Tamaño estándar
        case 'lg':
        case 'xl':
          return 48; // Tamaño grande
        default:
          return 40; // Tamaño por defecto
      }
    },
  },
  mounted() {
    this.globalState.notifications.currentPage = 'portal';

  },
  watch: {
    'globalState.itemSelect'(newVal) {
      this.itemSelect = this.globalState.itemSelect
    },
    itemSelect(newVal) {
      if (newVal !== 'Consultas') {
        this.interactionId = undefined
      }
    }
  },
  methods: {
    printPage(data) {
      console.log(data);
    },
  },
}
</script>
<style>
.title-offers-and-news {
  text-align: center;
  margin-top: 1%;
  margin-bottom: 1%;
  font-weight: 300;
  letter-spacing: 2px;
  font-size: 30px;
}

.responsive-margin {
  margin-right: 2%;
}

@media (max-width: 599px) {
  .responsive-margin {
    margin-top: 24%;
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .responsive-margin {
    margin-top: 10%;
  }
}

@media (min-width: 960px) {
  .responsive-margin {
    margin-top: 0;
  }
}


.v-slide-group__content {
  justify-content: center;
}

.EmbedFrame-footer {
  display: none !important;
}

.custom-list {
  background-color: lightgrey !important;
  color: currentColor;
  padding: 2%;
}

.listItem-responsive {
  padding-left: 2% !important;
  padding-right: 2% !important;

}
</style>