<template>
    <v-container class="login-container d-flex align-center">

        <v-row style="height:80%">
            <v-col :cols="$vuetify.display.smAndDown ? '12' : '6'" md="6" class="login-form">
                <v-card color="white" class="pa-10" width="100%" height="100%">
                    <div class="text-center mb-4">
                        <v-img :src="config.logo.value1" max-height="100" contain></v-img>
                    </div>
                    <v-card-title class="headline text-h4 pa-6">Hola, <br> <span class="welcome-title">{{ $t('welcome')
                            }}</span></v-card-title>
                    <v-form>
                        <v-text-field label="Correo electronico" v-model="loginBody.username" prepend-icon="mdi-email"
                            type="email"></v-text-field>
                        <v-text-field label="Contraseña" v-model="loginBody.password" prepend-icon="mdi-lock"
                            type="password"></v-text-field>
                        <span v-if="loginError" class="text-red">{{ $t('login.error') }}</span>
                        <v-col cols="12" class="d-flex justify-center">
                            <v-btn color="#15789a" width="80%" @click="login(loginBody)">Iniciar Sesion</v-btn>
                        </v-col>
                    </v-form>
                    <v-divider class="my-4"></v-divider>
                    <div class="d-flex justify-center">
                        <span style="margin: 10px; margin-top: 20px">Siguenos!</span>
                        <v-btn icon v-for="links in config.social_media" :key="links.id" target="_blank"
                            :href="links.value1" style="margin: 10px;">
                            <v-icon>{{ links.value2 }}</v-icon>
                        </v-btn>
                    </div>
                </v-card>
            </v-col>
            <v-col v-if="$vuetify.display.mdAndUp" cols="6" md="6" class="login-image"
                :style="{ backgroundImage: 'url(' + config.login_image.value1 + ')' }">
            </v-col>
        </v-row>
    </v-container>

</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth'; // import the auth store we just created

definePageMeta({
    layout: 'empty',
    theme: 'light'
});
const router = useRouter();
</script>
<script lang="ts">
export default {
    name: "login",
    data() {
        return {
            loginError: false,
            loginBody: {
                username: ref(''),
                password: ref('')
            },
            config: {
                social_media: [{
                    id: 0,
                    value1: '',
                    value2: ''
                }],
                logo: {
                    value1: ''
                },
                login_image: '',
            },
            router: useRouter(),
            authenticated: storeToRefs(useAuthStore()).authenticated,
            authenticateUser: useAuthStore().authenticateUser,
        };
    },
    async mounted() {
        this.config = await this.getConfiguration()
    },
    methods: {
        async login(body: any) {
            try {
                await this.authenticateUser(body);
                // redirect to homepage if user is authenticated
                if (this.authenticated) {
                    this.router.push('/');
                } else {
                    this.loginError = true
                }
            } catch (err) {
                this.loginError = true
            }
        },
        async getConfiguration() {
            try {
                const data = await $fetch('/api/controller/configuration', {
                    method: 'GET',
                    query: { id: 0, one: 'false', keys: ['social_media', 'background'] },
                })
                return data
            } catch (err) {
                this.loginError = true
            }
        }
    },
};

</script>

<style scoped>
.login-container {
    height: 100vh;
    background-color: transparent;

}

.login-form {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    padding: 0px;
}

.background-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
}

.login-image {
    background-size: cover;
    background-position: center;
    z-index: 1;
}

.welcome-title {
    font-weight: bolder;
}
</style>