<script setup>
import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth'; // import the auth store we just createdconst router = useRouter();

const { locale } = useI18n()


// Modificar la variable
</script>
<template>
  <v-app>
    <v-btn icon color="green" class="whatsapp-btn" :href="getConfiguration('mobile_contact').value1" target="_blank">
      <v-icon large class="contact-icon">{{ getConfiguration('mobile_contact').value2 }}</v-icon>
    </v-btn>
    <v-card v-if="$vuetify.display.mdAndUp" id="header-options" variant='flat' style="position: sticky; z-index:1;"
      class="position-sticky">
      <v-toolbar height="70px" color="headerCommon" style="position: sticky;">
        <v-row align="center">
          <v-col cols="2">
            <v-img max-height="150" max-width="250" :src="getConfiguration('logo').value1" @click="goToIndex"
              style="margin-left: 15%;"></v-img>
          </v-col>

          <v-col cols="7">
            <v-col cols="3"></v-col>
            <v-tabs v-model="currentItem" active-color="orange" slider-size="12">
              <v-tab slider-color="orange" active-color="orange" class="pb-2 text-h6 font-weight-bold"
                style="color:#676767;" v-for="item in items" :key="item.text" :value="'tab-' + item.text"
                @click="this.$router.push({ path: item.route })">
                {{ item.text }}
              </v-tab>

              <v-menu v-if="more.length">
                <template v-slot:activator="{ props }">
                  <v-btn variant="plain" rounded="0" class="align-self-center" height="100%" v-bind="props">
                    {{ $t('more') }}
                    <v-icon end>
                      mdi-menu-down
                    </v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item v-for="item in more" :key="item"
                    @click="-(item); this.$router.push({ path: '/filter', query: { filter1: item.code } })">
                    {{ item.description }}
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-tabs>
            <!--<v-col cols="1"></v-col>-->
          </v-col>
          <!--<v-col cols="1"></v-col>
          <v-col cols="1"></v-col>-->
          <v-col cols="3">
            <v-divider vertical></v-divider>
            <v-divider vertical></v-divider>
            <v-row align="center">
              <v-col cols="6">
                <v-list bg-color="white">
                  <v-list-item>
                    <template v-slot:prepend v-if="authenticated">
                      <v-btn icon class="mr-6">

                        <v-avatar>
                          <v-img :src="user.photo || './media/img/image-not-found.jpg'" alt="John"></v-img>
                        </v-avatar>
                        <v-menu activator="parent">
                          <v-list>
                            <v-list-item :prepend-icon="item.icon" :title="item.title"
                              @click="redirectList('portal', item.option)" v-for="(item, index) in itemsAvatar"
                              :key="index" :value="index">
                            </v-list-item>
                            <v-list-item :prepend-icon="'mdi-logout'" :title="'Salir'" @click="logout()">
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-btn>

                    </template>
                    <template v-slot:prepend v-if="!authenticated">
                      <v-btn icon class="mr-6" @click="openLogin=true">

                        <v-avatar>
                          <v-icon color="green" >mdi-account</v-icon>
                        </v-avatar>
                      </v-btn>

                    </template>
                    <v-list-item-title class="text-h6">
                      {{ $t('my.account') }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="2">
                <v-badge color="red"
                  @click="this.$router.push({ path: '/shoppingCart', query: { userId: this.globalState.userId } })"
                  v-model="cartCount" :content="cartStore.shopping_cart" style="top:15px;margin-top: 5%;" elevation="0">
                  <v-icon large color="green" style="font-size:52px">mdi-cart</v-icon>
                </v-badge>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-row>
              <v-col cols="6"></v-col>
              <v-col cols="4">
                <v-text-field v-model="globalState.notifications.search" @keyup.enter="searchProduct"  v-if="showSearch" variant='filled'
                  :placeholder="$t('what.are.you.looking.for')" append-icon="mdi-find-replace"
                  clearable></v-text-field></v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-toolbar>
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
    <v-dialog v-model="formThread" max-width="500px" max-height="500px">
      <v-card prepend-icon="mdi-message" title="Consulta" color="primary">
        <v-container>
          <v-form>
            <v-text-field label="Asunto" v-model="formDataThread.subject"></v-text-field>
            <v-select bg-color="white" v-model="formDataThread.type" theme="light" variant="outlined"
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
    <v-system-bar v-if="$vuetify.display.smAndDown" dark color="headerInfo" text-align="center" id="information-nav"
      style="height:10% !important">
      <v-row>
        <v-col cols="12">
        </v-col>
        <v-col cols="12">
        </v-col>
        <v-col cols="12">

          <!--<v-btn color="btnPage" id="btnPage" variant="plain">
              {{ $t('branchs') }}
            </v-btn>
            <v-btn color="btnPage" id="btnPage" variant="plain">
              {{ $t('contact') }}
            </v-btn>
            <v-btn color="btnSubscribe" id="btnSubscribe" variant="elevated" prepend-icon="mdi-email">
              {{ $t('subscribe') }}
            </v-btn>
          -->
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" style="text-align: center;  z-index:21000 !important; padding-bottom:0px !important">{{
          getConfiguration('head_info_text').value1
        }}</v-col>
        <v-toolbar flat color="white" class="py-2" style="background-color:white !important;margin-top:0px !important">
          <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
          <v-text-field variant="solo" density="compact" color="white" theme="light" v-if="showSearch"
            v-model="globalState.notifications.search" @keyup.enter="searchProduct"
            :placeholder="$t('what.are.you.looking.for')" append-inner-icon="mdi-magnify" clearable hide-details dense
            solo flat></v-text-field>
        </v-toolbar>
      </v-row>

    </v-system-bar>
    <v-btn v-if="$vuetify.display.smAndDown" icon color="white" class="fixed-badge"
      @click="refreshShoppingCart(); dialog = !dialog;">
      <v-badge color="red" v-model="cartCount" :content="cartStore.shopping_cart">
        <v-icon large>mdi-cart</v-icon>
      </v-badge>
    </v-btn>
    <v-navigation-drawer color="white" v-if="$vuetify.display.smAndDown" v-model="drawer">
      <v-divider vertical></v-divider>
      <v-list>
        <v-list-item style="margin-top: 55%; margin-left: 1%;" @click="handleNotification(
          { viewed: 'S' },
          undefined, true, 'THREAD', { 'token': token }
        ); globalState.notifications.notifications = 0;">
          <v-badge v-model="globalNotif" color="red" :content="globalState.notifications.notifications" top:15px>
            <v-icon large>mdi-bell</v-icon>
          </v-badge>
          <v-menu bottom right activator="parent" style="z-index: 100000;">
            <v-list max-height="300px" max-width="600px" class="custom-scrollbar"><!-- Limite de 8 elementos-->
              <v-list-item color="white" v-for="(item, index) in notifications.slice(0, 8)" :key="index" :value="index"
                prepend-icon="mdi-message-alert" :title="item.operation_type"
                @click="redirectList('portal', 'Consultas', item)">
              </v-list-item>
              <!-- Boton al final para ver todos -->
              <v-list-item color="white" :title="'Ver todos'" :prepend-icon="'mdi-arrow-right-bold'"
                @click="redirectList('portal', 'Consultas')">
              </v-list-item>
            </v-list>
          </v-menu>
          {{ $t('notifications') }}

        </v-list-item>
        <v-list-item style="margin-top: 5%; margin-left: 1%; overflow:auto" @click="getFavorites(); handleNotification(
          {},
          undefined, true, 'FAVORITE', { 'token': token }, undefined, 'DELETE'
        ); globalState.notifications.favorite = 0;">
          <v-badge v-model="favNotif" color="red" :content="globalState.notifications.favorite" top:15px>
            <v-icon large>mdi-heart</v-icon>
          </v-badge>
          <v-menu bottom right activator="parent">
            <v-list max-height="300px" max-width="300px" class="custom-scrollbar"><!-- Limite de favoritos-->
              <v-list-item color="white" v-for="(item, index) in itemsFavorites.slice(0, 6)" :key="index"
                :value="index">
                <v-list-item color="white"
                  @click="this.$router.push({ path: '/detail', query: { code: item.productCode } })"
                  :prepend-avatar="item.img1 || './media/img/image-not-found.jpg'" :title="item.productName"
                  :subtitle="item.bio || 'Detalle no disponible'">
                </v-list-item>
              </v-list-item>
              <!-- Boton al final para ver todos -->
              <v-list-item color="white" :title="'Ver todos'" :prepend-icon="'mdi-arrow-right-bold'"
                @click="redirectList('portal', 'Favoritos')">
              </v-list-item>
            </v-list>
          </v-menu>
          {{ $t('favorites') }}
        </v-list-item>
        <v-list-item style="margin-top: 5%; margin-left: 1%;">
          <v-icon>mdi-account</v-icon>
          <v-menu activator="parent">
            <v-list theme="light" color="white">
              <v-list-item :prepend-icon="item.icon" :title="item.title" @click="redirectList('portal', item.option)"
                v-for="(item, index) in itemsAvatar" :key="index" :value="index">
              </v-list-item>
              <v-list-item :prepend-icon="'mdi-logout'" :title="'Salir'" @click="logout()">
              </v-list-item>
            </v-list>
          </v-menu>
          {{ $t('profile') }}
        </v-list-item>
        <v-list-item>
          <v-expansion-panels multiple color="black" theme="dark">
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('categories') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list>
                  <v-list-item v-for="item in items" :key="item.code" :value="'tab-' + item.code"
                    @click="this.$router.push({ path: '/filter', query: { filter1: item.code } })">
                    {{ item.description }}
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <slot />
    <template v-if="true"><v-footer class="bg-white pt-8 pb-4" style="border-top: 0.5px solid rgba(0, 0, 0, 0.2)">
        <v-container>
          <v-row>
            <!-- Contacto -->
            <v-col cols="12" md="3">
              <h4><strong>Contacto</strong></h4>
              <p>
                PO Box 16122 Collins Street West <br />
                Victoria 8007 Australia – Map <br />
                +61 3 8376 6284
              </p>
              <v-row class="mt-2">
                <v-col cols="auto">
                  <v-icon color="blue darken-1">mdi-facebook</v-icon>
                </v-col>
                <v-col cols="auto">
                  <v-icon color="light-blue darken-1">mdi-twitter</v-icon>
                </v-col>
                <v-col cols="auto">
                  <v-icon color="red">mdi-youtube</v-icon>
                </v-col>
                <v-col cols="auto">
                  <v-icon color="black">mdi-instagram</v-icon>
                </v-col>
              </v-row>
            </v-col>

            <!-- Catálogo -->
            <v-col cols="12" md="3">
              <h4><strong>Catálogo</strong></h4>
              <v-list dense theme="light">
                <v-list-item>Donde comprar</v-list-item>
                <v-list-item>Garantía</v-list-item>
                <v-list-item>Formularios</v-list-item>
                <v-list-item>Blog</v-list-item>
              </v-list>
            </v-col>

            <!-- Nosotros -->
            <v-col cols="12" md="3">
              <v-list dense theme="light">

                <v-list-item>Nuestra historia</v-list-item>
                <v-list-item>Trabaja con nosotros</v-list-item>
              </v-list>
            </v-col>

            <!-- Newsletter -->
            <v-col cols="12" md="3">
              <h4><strong>Newsletter</strong></h4>
              <v-text-field placeholder="Enter your email"></v-text-field>
              <v-row>
                <v-col cols="auto">
                  <img src="/visa-logo.png" alt="Visa" width="50" />
                </v-col>
                <v-col cols="auto">
                  <img src="/mastercard-logo.png" alt="Mastercard" width="50" />
                </v-col>
                <v-col cols="auto">
                  <img src="/cirrus-logo.png" alt="Cirrus" width="50" />
                </v-col>
                <v-col cols="auto">
                  <img src="/american-express-logo.png" alt="American Express" width="50" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </template>
    <template v-if="false">
      <v-footer class="bg-dark text-center d-flex flex-column">
        <v-row>
          <v-col class="pt-0">
            <v-col class="pl-8">
              <v-row>
                <v-col cols="12">
                  <p class="pt-6 text-lg text-blue-500">
                    <strong>Oficina Central:&nbsp;</strong> Estomba 964 | C1427COV | Buenos Aires |
                    Argentina | Tel. 54-11 4859-5300 |
                    <a href="mailto:atencionalcliente@tecnolab.com.ar">atencionalcliente@tecnolab.com.ar</a>
                  </p>
                </v-col>
              </v-row>
              <v-row class="mt-8" dense>
                <v-col cols="12" md="6" lg="2" class="text-lg text-white">
                  <v-list style="background-color: #bababa00 !important;">
                    <v-list-item class="font-bold text-blue-500 lg:mb-4">Institucional</v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/institucional?institucional=">Acerca
                        de nosotros</a></v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/institucional?institucional=">Política
                        de Calidad</a></v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/institucional?institucional=mision">Misión,
                        Visión y Valores</a></v-list-item>
                    <v-list-item><a
                        href="mailto:compliance@tecnolab.com.ar?subject=Denuncia relacionada con el Programa de Integridad">Programa
                        de Integridad</a></v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/institucional?institucional=#rrh">Trabajar en
                        Tecnolab</a></v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12" md="6" lg="2" class="text-lg text-white">
                  <v-list style="background-color: #bababa00 !important;">
                    <v-list-item class="font-bold text-blue-500 lg:mb-4">Productos</v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/productos/kits">Kits</a></v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/productos/equipamiento">Equipamiento</a></v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/productos/reactivos">Reactivos</a></v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/productos/pipetas-y-descartables">Pipetas y
                        Descartables</a></v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/productos/accesorios">Accesorios</a></v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/productos/primers">Primers y
                        Sondas</a></v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/productos/catalogos">Catálogos</a></v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12" md="6" lg="2">
                  <v-list style="background-color: #bababa00 !important;">
                    <v-list-item class="font-bold text-blue-500 lg:mb-4"><a
                        href="https://tecnolab.com.ar/ofertas">Ofertas</a></v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12" md="6" lg="2" class="text-lg text-white">
                  <v-list style="background-color: #bababa00 !important;">
                    <v-list-item class="font-bold text-blue-500 lg:mb-4">Novedades</v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/novedades/lanzamientos">Lanzamientos</a></v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/novedades/destacados">Destacados</a></v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/novedades/articulos">Artículos de
                        interés</a></v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12" md="6" lg="2" class="text-lg text-white">
                  <v-list style="background-color: #bababa00 !important;">
                    <v-list-item class="font-bold text-blue-500 lg:mb-4">Eventos</v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/eventos">Webinars</a></v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/eventos">Expos &
                        Congresos</a></v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12" md="6" lg="2" class="text-lg text-white">
                  <v-list style="background-color: #bababa00 !important;">
                    <v-list-item class="font-bold text-blue-500 lg:mb-4">Asistencia</v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/asistencia/soporte-tecnico">Servicio
                        técnico</a></v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/asistencia/contacto">Contacto
                        comercial</a></v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/asistencia/asesoramiento">Asesoramiento
                        científico</a></v-list-item>
                    <v-list-item><a href="https://tecnolab.com.ar/asistencia/presupuesto">Presupuestos</a></v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <div>
          {{ new Date().getFullYear() }} — <strong> Tecnolab</strong>
        </div>
      </v-footer>
    </template>
    <b2bLoginDialog v-if="openLogin"></b2bLoginDialog>
  </v-app>
</template>
<script>
import { getEndpoint, handleNotification, getNotifications, createPDF } from '~/assets/utils/utils';
import { useAuthStore } from '~/store/auth'; // import the auth store we just createdconst router = useRouter();
import { useShoppingCartStore } from '~/store/notifications';

export default {
  data: () => ({
    dialog: false,
    question: false,
    saveOrder: false,
    saveQuote: false,
    showForm: false,
    cartStore: useShoppingCartStore(),
    favNotifications: 0,
    typeOrder: 'pedido',
    router: useRouter(),
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
    error: false,
    textError: '',
    logUserOut: useAuthStore(), // use authenticateUser action from  auth store
    authenticated: storeToRefs(useAuthStore()).authenticated, // make authenticated state reactive with storeToRefs
    itemsAvatar: [{ title: 'Mi Perfil', icon: 'mdi-account', option: 'Mi perfil' },
    { title: 'Dashboard', icon: 'mdi-chart-pie', option: 'Dashboard' },
    { title: 'Mis Consultas', icon: 'mdi-message', option: 'Consultas' }
    ],
    currentItem: null,
    items: [{ text: 'Productos', route: '/filter' }, { text: 'Blogs', route: '/blogs' }, { text: 'Donde comprar', route: '/whereToBuy' }, { text: 'Garantía', route: '/warranty' }, { text: 'Formularios', route: '/formsRequest' }, { text: 'Contacto', route: '/contact' }],
    more: [],
    text: 'Texto de atención para el usuario. Por ejemplo ENVÍO GRATIS en todas las compras mayores a $ 50.000,00.',
    textInformationNav: "",
    itemsProductCart: [],
    globalState: useGlobalState(),
    itemsProd1: [
      {
        id: 0, quant: 1, title: 'Pipeta Multicanal', img: 'https://www.lobov.com.ar/images/0DC6622892534392B6C4D9D01442B57.jpg', detail: 'Pipeta Multicanal Aero96, 12 Canales, volumen variable 2-20 ul', show: false, chips: [
          { id: 0, code: '0', title: 'Pipetas', color: 'lightblue' }, { id: 1, code: '1', title: 'Solo online', color: 'red' }
        ]
      },
      {
        id: 1, quant: 1, title: 'Pipeta Unicanal', img: 'https://www.lobov.com.ar/thumb/2717F11012E14B949E4DD7FEEF3D0300_400x400.jpg', detail: 'Pipeta Unicanal Aero96, 12 Canales, volumen variable 2-20 ul', show: false, chips: [
          { id: 0, code: '0', title: 'Pipetas', color: 'lightblue' }, { id: 1, code: '1', title: 'Solo online', color: 'red' }
        ]
      },
      {
        id: 2, quant: 1, title: 'Bandeja Sub-Cell', img: 'https://www.bio-rad.com/sites/default/files/styles/brc_featured_sku_275x275_def/public/webroot/web/images/lsr/products/electrophoresis/sku_view/global/170-4416_view.jpg?itok=NZQm2aqo', detail: 'Pipeta Multicanal Aero96, 12 Canales, volumen variable 2-20 ul', show: false, chips: [
          { id: 0, code: '0', title: 'Western Blot', color: 'lightblue' }, { id: 1, code: '1', title: 'Solo online', color: 'red' }, { id: 2, code: '2', title: 'Bio-Rad', color: 'red' }
        ]
      }, {
        id: 3, quant: 1, title: 'Bandeja Cableada Sub-Cell', img: 'https://www.onelab.com.ar/images/thumbs/0003589_cuba-sub-cell-gt-p-electroforesis-horizontal_360.jpeg', detail: 'Pipeta Multicanal Aero96, 12 Canales, volumen variable 2-20 ul', show: false, chips: [
          { id: 0, code: '0', title: 'Western Blot', color: 'lightblue' }, { id: 2, code: '2', title: 'Bio-Rad', color: 'red' }
        ]
      },
    ],
    formThread: false,
    formDataThread: {
      subject: undefined,
      message: undefined,
      type: undefined,
    },
    total: 0,
    subtotal: 0,
    user: {
      photo: ''
    },
    openLogin:false,
    drawer: false,
    itemsFavorites: [],
    token: useCookie('token'),
    notifications: [],
    threads: false,
    keys: [
      'head_info_text', 'head_lang_test', 'logo', 'mobile_contact'
    ],
    configuration: [
    ],
  }),
  computed: {
    showSearch(){
      const routesToShowComponent = ['/filter', '/']
      return routesToShowComponent.includes(this.$route.path)
    },
    favNotif() {
      return this.globalState.notifications.favorite > 0
    },
    cartCount() {
      return this.cartStore.shopping_cart > 0
    },
    globalNotif() {

      return this.globalState.notifications.notifications > 0
    },
    isPortalRoute() {
      // Verifica si la ruta actual es '/portal'
      return this.$route.path === '/portal';
    }
  },
  async created() {
    await this.loadConfiguration(this.keys)
    await this.getFavorites()
    await this.getAllNotifications();
    //await this.getCategorys();
    await this.refreshShoppingCart();
    await this.getFilter2();
    await this.getFilter3();
    await this.getFilter4();
    //await this.getUsers();
  },
  methods: {
    async loadConfiguration(values) {
      var key = { key: '', value1: '', value2: '', value3: '', active: true };
      try {
        const data = await $fetch('/api/controller/configuration', {
          method: 'GET',
          query: { id: 0, one: 'false', keys: values },
        })
        data.keys.forEach(elem => {
          values.forEach(value => {
            if (elem.key == value) {
              this.configuration.push(elem);
            }
          });
        });
        for (let property in data) {
          this.configuration.push({ key: property, value1: data[property].value1 });
        }
      } catch (err) {
        console.error(err);
      }
      return key;
    },
    getConfiguration(key) {
      var r = {};
      this.configuration.forEach(elem => {
        if (elem.key == key) {
          r = elem;
        }
      });
      return r;
    },
    createPDF,
    searchProduct() {
      this.globalState.notifications.searchIndex += 1;
      if (this.globalState.notifications.currentPage !== 'filter') {
        this.$router.push('/filter');
      }
    },
    logout() {
      this.logUserOut.logUserOut();
      window.location.reload();
    },
    addItem(item) {
      const removed = this.items.splice(0, 1)
      this.items.push(
        ...this.more.splice(this.more.indexOf(item), 1),
      )
      this.more.push(...removed)
      this.$nextTick(() => { this.currentItem = 'tab-' + item.title })
    },
    async refreshShoppingCart() {
      try {
        const { data } = await useFetch('/api/controller/order', { query: { one: 'false', type: "SHOPPING_CART" }, headers: { 'token': this.token } });
        if (data["_rawValue"].length > 0) {
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
    async getUsers() {
      //@ts-ignore
      const data = await $fetch('/api/controller/users', {
        query: {
          orderField: 'id',
          orderDir: 'asc',
          one: 'true'
        }, headers: { 'token': this.token }
      })
      this.user = data
      this.globalState.role = data.role

    },
    async handlePdf(presupuesto, items) {
      let customer = await this.getCustomer()
      await createPDF(presupuesto, items, customer[0], true)
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
    async getCategorys() {
      try {
        const { data } = await useFetch('/api/sync/filter1?one=false&field=code&order=asc&offset=0&rows=100', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        this.items = data;
        this.globalState.notifications.category = data;
        if (this.items.length >= 6) {
          var itemsNew = [];
          for (let index = 0; index < this.items.length; index++) {
            if (index < 6) {
              itemsNew.push(this.items[index]);
            } else {
              this.more.push(this.items[index]);
            }
          }
          this.items = itemsNew;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async getFilter2() {
      try {
        const { data } = await useFetch('/api/sync/filter2?one=false&field=code&order=asc&offset=0&rows=100', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        this.globalState.notifications.filter2 = data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async getFilter3() {
      try {
        const { data } = await useFetch('/api/sync/filter3?one=false&field=code&order=asc&offset=0&rows=100', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        this.globalState.notifications.filter3 = data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async getFilter4() {
      try {
        const { data } = await useFetch('/api/sync/filter4?one=false&field=code&order=asc&offset=0&rows=100', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        this.globalState.notifications.filter4 = data;
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
    goToIndex() {
      window.location.href = '/';
    },
    async getFavorites() {
      //@ts-ignore
      try {
        const data = await $fetch('/api/controller/favorite', {
          method: 'GET',
          params: {  // Usa 'params' para los parámetros de query
            one: 'false',
            orderField: 'productCode',
            orderDir: 'asc',
          },
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            // Puedes agregar más headers aquí
          }
        })

        this.itemsFavorites = data
      } catch (err) {
        console.log(err);
      }
    },
    async getAllNotifications() {
      try {
        this.notifications = await getNotifications(this.token, 'THREAD')
        this.globalState.notifications.favorite = (await getNotifications(this.token, 'FAVORITE')).length
        this.globalState.notifications.notifications = (await getNotifications(this.token, 'THREAD', 'N')).length
      } catch (err) {
        console.log(err);
      }
    }, handleNotification,
    getNotifications,
    async redirectList(route, itemList, thread) {
      localStorage.setItem('route', itemList);
      this.globalState.itemSelect = itemList
      //si estoy redirigiendo a las consultas, cuardo el objeto en el globalstate para cargarlo luego
      if (thread) {
        localStorage.setItem('interactionId', thread.threadId);
      }
      this.$router.push('/' + route);
    }
  }
}
</script>

<style>
.nav-mdAndUp {
  height: 100% !important;
  top: 0px !important;
  width: 364;
}


#information-nav {
  height: 5% !important;
}

#header-options {
  top: 0% !important;
}

#nav-categories {
  height: 65px !important;
  top: 0px !important;
  position: absolute;
}

#toolbar-categories .v-toolbar__content {
  height: 0px !important;
}

#toolbar-categories {
  background-color: transparent !important;
  color: #e5e7eb;
}

#btnSubscribe {
  top: 10% !important;
}

#btnPage {
  top: 10% !important;
}

.fixed-badge {
  position: fixed;
  bottom: 5%;
  /* Ajusta el valor según sea necesario */
  right: 6%;
  /* Ajusta el valor según sea necesario */
  z-index: 1000;
  /* Asegúrate de que el badge esté encima de otros elementos */
}

.v-tab--selected {
  color: orange !important;
}

.contact-icon {
  font-size: 42px !important;
}

.custom-scrollbar {
  height: 200px;
  overflow-y: scroll;
  border: 1px solid #ccc;
  background-color: white !important;
  color: #333 !important;
}

/* Estilos generales para la scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

/* Estilo para la pista de la scrollbar */
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f0f0f0;
  /* Color de fondo de la pista */
  border-radius: 10px;
  /* Bordes redondeados */
}

/* Estilo para el pulgar de la scrollbar */
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #333;
  /* Color del pulgar */
  border-radius: 10px;
  /* Bordes redondeados */
  border: 3px solid #f0f0f0;
  /* Espacio alrededor del pulgar */
}

/* Estilo para el pulgar al pasar el mouse */
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
  /* Color del pulgar al pasar el mouse */
}

/* Estilo para el pulgar al estar activo (al hacer clic) */
.custom-scrollbar::-webkit-scrollbar-thumb:active {
  background: #777;
  /* Color del pulgar al hacer clic */
}

.whatsapp-btn {
  position: fixed;
  bottom: 16px;
  /* Espacio desde el borde inferior */
  right: 26px;
  /* Espacio desde el borde izquierdo */
  z-index: 1000;
  /* Asegúrate de que esté encima de otros elementos */
}
</style>
