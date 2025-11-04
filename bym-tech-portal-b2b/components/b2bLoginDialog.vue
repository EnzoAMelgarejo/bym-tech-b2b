<template>
    <v-dialog v-model="dialog" max-width="600px">
        <v-card color="#DEDEDE" class="pb-12" width="100%">
            <v-card-title class="text-h5 d-flex justify-center align-center py-12">
                <div class="mx-auto" style="width: 80%; color: white;">
                    <div class="d-flex justify-space-between align-center py-2 px-4 rounded"
                        style="background-color: #00c400; width: 50%; color: white; ">
                        Mi cuenta
                        <v-icon>mdi-dots-horizontal</v-icon>
                    </div>
                </div>
            </v-card-title>
            <div class="divider"></div>

            <v-card-text align="center">
                <v-form @submit.prevent="submitLogin" style="width:80%" class="text-start">
                    <label class="font-weight-black text-start" for="user">Usuario o mail</label>

                    <v-text-field class="custom-text-field" v-model="loginBody.username" type="email" name="user"
                        variant="outlined" required clearable />
                    <label class="font-weight-black" for="password">Contraseña</label>

                    <v-text-field v-model="loginBody.password" class="custom-text-field" variant="outlined"
                        name="password" type="password" required :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="togglePassword" />
                    <v-container>
                        <v-row align="center">
                            <v-checkbox v-model="remember" label="Guardar contraseña">
                                <template v-slot:label>
                                    <div class="d-flex align-center">
                                        Guardar contraseña
                                        <v-spacer></v-spacer>
                                        <a href="" target="_self" class="text-subtitle-1 text-grey-darken-3 pl-6">
                                            ¿Olvidaste
                                            tu
                                            contraseña?</a>
                                    </div>
                                </template>
                            </v-checkbox>
                        </v-row>
                    </v-container>
                    <span v-if="loginError" class="text-red">{{ $t('login.error') }}</span>
                    <v-btn color="#00c400" flat class="mr-2 pa-2" width="100%" height="50px" @click="login(loginBody)">
                        Ingresar
                    </v-btn>
                    <v-row>
                        <v-col cols="12" class="text-center">
                            <a href="/register" target="_self"
                                class="text-subtitle-1  text-grey-darken-3">Registrarse</a>
                        </v-col>
                    </v-row>
                </v-form>

                <div class="divider my-4">Ó</div>
                <v-row>
                    <v-col cols="12">
                        <v-btn variant="block" color="black" class="mb-2" @click="loginWithFacebook">
                            Continuar con Facebook
                        </v-btn>
                    </v-col>
                    <v-col cols="12">
                        <v-btn variant="block" color="black" @click="loginWithGmail">
                            Continuar con Gmail
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { useAuthStore } from '~/store/auth';
export default {

    data() {
        return {
            loginError: false,
            loginBody: {
                username: ref(''),
                password: ref('')
            },
            showPassword: false,
            remember: false,
            dialog: true,
            router: useRouter(),
            authenticated: storeToRefs(useAuthStore()).authenticated,
            authenticateUser: useAuthStore().authenticateUser,
        };
    },
    created() {
    },
    methods: {
        async login(body) {
            try {
                await this.authenticateUser(body);
                // redirect to homepage if user is authenticated
                if (this.authenticated) {
                    window.location.reload();
                } else {
                    this.loginError = true
                }
            } catch (err) {
                this.loginError = true
            }
        },
        togglePassword() {
            this.showPassword = !this.showPassword;
        },
        submitLogin() {
            // Aquí iría la lógica para enviar el login a la API
            this.$emit("close-dialog"); // Cierra el diálogo una vez que el login se procesa
        },
        loginWithFacebook() {
            // Lógica para login con Facebook
            console.log("Login con Facebook");
        },
        loginWithGmail() {
            // Lógica para login con Gmail
            console.log("Login con Gmail");
        }
    }
};
</script>

<style scoped>
.divider {
    display: flex;
    align-items: center;
    text-align: center;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    border-bottom: 3px solid #ffffff;
}

.divider:not(:empty)::before {
    margin-right: 0.5em;
}

.divider:not(:empty)::after {
    margin-left: 0.5em;
}

.my-4 {
    margin: 1.5rem 0;
}

.custom-text-field .v-input__control {
    background-color: white !important;
    /* Cambia el fondo a blanco */
}

.custom-text-field .v-input__slot {
    border: 1px solid #1976d2;
    /* Mantiene el color del outline */
}
</style>