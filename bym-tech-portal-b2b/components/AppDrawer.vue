<template>
  <div>
    <v-system-bar dark color="primary"  mix-height="40px" height="40px" text-align="center" id="information-nav">
      <v-row>
        <v-col cols="2"></v-col>
        <v-col cols="8" style="text-align: center; margin-top: 0.3%;">{{ textInformationNav }}</v-col>
        <v-col cols="2"><v-btn color="primary" depressed><v-icon left>
              mdi-email
            </v-icon>
            {{ $t('subscribe') }}
          </v-btn></v-col>
      </v-row>
    </v-system-bar>
    <v-card color="grey lighten-4" height="140px">
      <v-toolbar height="70px">
        <v-row>
          <v-col cols="2">
            <v-img max-height="150" max-width="250" src="https://perfugroupar.myvtex.com/arquivos/logopigmento.png"
              style="margin-top: 2%; margin-left='1%';"></v-img>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="4">
            <v-text-field placeholder="¿Qué estas buscando?" append-outer-icon="mdi-find-replace" style="margin-top: 2%"
              clearable></v-text-field>
          </v-col>
          <v-col cols="1"></v-col>
          <v-col cols="1"> <v-btn color="primary" style="margin-top: 10%" depressed>
              <v-icon left>
                mdi-information
              </v-icon>
              Consultas
            </v-btn></v-col>
          <v-col cols="2">
            <v-divider vertical></v-divider>
            <v-btn icon style="margin-top: -15%">
              <v-icon large>mdi-bell</v-icon>
            </v-btn>
            <v-btn icon style="margin-top: -15%">
              <v-icon large>mdi-cart</v-icon>
            </v-btn>
            <v-divider vertical></v-divider>
            <v-avatar style="margin-top: -15%;margin-left: 4%;">
              <img
                src="https://c0.klipartz.com/pngpicture/340/946/gratis-png-avatar-usuario-computadora-iconos-desarrollador-de-software-avatar-thumbnail.png"
                alt="John">
            </v-avatar>
          </v-col>
        </v-row>
      </v-toolbar>
      <v-system-bar dark color="primary" mix-height="70px" height="70px" text-align="center">
        <v-row align="center" justify="space-around">
          <v-col cols="2"></v-col>
          <v-col cols="8">
            <v-row align="center" justify="space-around">
              <v-btn rounded>
                NOVEDOSO
              </v-btn>
              <v-btn rounded>
                Categoría 1
              </v-btn>
              <v-btn rounded>
                Categoría 2
              </v-btn>
              <v-btn rounded>
                Categoría 3
              </v-btn>
              <v-btn rounded>
                Categoría 4
              </v-btn>
              <v-btn rounded>
                Categoría 5
              </v-btn>
              <v-btn rounded>
                Categoría 6
              </v-btn>
              <v-btn rounded>
                Categoría 7
              </v-btn>
              <v-btn rounded>
                Categoría 8
              </v-btn>
              <v-btn rounded>
                Otras Categorías
              </v-btn>
            </v-row>
          </v-col>
          <v-col cols="2"></v-col>
        </v-row>
      </v-system-bar>
      <v-container>
      </v-container>
    </v-card>
  </div>
</template>
<script>
import loginModal from "@/components/loginModal.vue";

export default {
  name: "App",
  data() {
    return {
      sidebar: false,
      drawer: false,
      displayOptions: false,
      abmMenu: [
        {
          title: "Maestro de Productos",
          path: "/productsAbm",
          icon: "product",
        },
        {
          title: "Maestro de Blogs",
          path: "/blogsAbm",
          icon: "blogs",
        },
      ],
      menuItems: [
        { title: "Home", path: "/home", icon: "home" },
        { title: "Sign Up", path: "/signup", icon: "face" },
        { title: "Sign In", path: "/signin", icon: "lock_open" },
      ],
      token: false,
      navItems: [
        { href: "/filter", name: "Productos" },
        { href: "/blog", name: "Blog" },
        { href: "/whereBuy", name: "Donde Comprar" },
        { href: "/DatosGarantia", name: "Garantia" },
        { href: "/SolicitudFormulario", name: "Formularios" },
        { href: "/clientPortal", name: "Portal del cliente" },
      ],
      loginCard: false,
      email: "",
      password: "",
      show1: false,
      textInformationNav: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent cursus nec sem id malesuada. Curabitur lacinia sem et turpis euismod, eget elementum ex pretium."
    };
  },
  created: function () {
    this.validate();
  },
  methods: {
    changePage(path) {
      location.href = path;
    },
  },
  computed: {
  },
};
</script>
<style>
.divider {
  background-color: white !important;
  border-color: white !important;
}

.navItem {
  font-family: "Poppins", sans-serif;
  font-size: normal;
  position: relative;
  color: #666666 !important;
  font-weight: bold;
  letter-spacing: 0.4px;
  text-decoration: none;
  padding: 20px;
}

.menuIcon .v-icon {
  font-size: 55px !important;
}

.image-icon {
  background-color: white !important;
}

.iconColor .v-input__icon .mdi-eye::before,
.mdi-eye-off::before {
  color: #666666 !important;
}

.cardDialog {
  border-radius: 2px !important;
}

.navApp {
  position: fixed !important;
  z-index: 6 !important;
  right: 2% !important;
}

.navItem:hover {
  color: #ff9c2a !important;
}

.btnContainer {
  width: 50% !important;
}

.forgot {
  font-size: 12px !important;
  text-align: right !important;
  margin-left: 10% !important;
}

.v-application .loginLabel a {
  color: black !important;
}

.loginLabel {
  font-family: "ubuntu", sans-serif;
  font-size: medium;
  color: black !important;
  font-weight: bold !important;
  font-size: 14px !important;
}

.loginLabel .a {
  font-family: "Poppins", sans-serif;
  font-size: medium;
  color: black !important;
  font-weight: bold !important;
  font-size: 14px !important;
}

.navItem::before {
  content: "";
  position: absolute;
  display: block;
  width: 100%;
  height: 2px;
  bottom: 0;
  left: 0;
  color: #ff9c2a !important;
  background-color: #ff9c2a;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.navItem:link {
  color: #666666;
}

.password {
  font-size: 12px !important;
  text-align: right !important;
  margin-right: 0px !important;
  color: black !important;
}

.register {
  text-decoration: underline;
  color: #5c6e6e !important;
}

.loginButton {
  font-family: "ubuntu", sans-serif;
  font-size: medium;
  color: black;
  text-transform: unset !important;
  font-size: 14px !important;
}

.navItem:hover::before {
  color: #666666;
  transform: scaleX(1);
}

.login {
  background-color: #dedede !important;
  border-radius: 5px !important;
}

.loginInput {
  background-color: white;
}
</style>
