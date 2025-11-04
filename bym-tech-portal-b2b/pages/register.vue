<template>
    <v-container>
        <v-card width="100%">
            <v-card-title class="text-h5" >
                <div class="d-flex justify-space-between align-center ml-12 py-1 px-4 rounded"
                        style="background-color: #00c400; width: 20%; color: white; margin-left:15% !important">
                        Registro de usuario
                        <v-icon>mdi-dots-horizontal</v-icon>
                    </div></v-card-title>
            
            <v-card-text align="center">
                <div style="width:40%" class="pa-12">
                    <v-form class="text-start">
                        <v-row>
                            <v-col cols="12" md="6">
                                <label class="font-weight-black text-start" for="nombre">Nombre</label>
                                <v-text-field variant="outlined" name="nombre" v-model="user.nombre" outlined></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <label class="font-weight-black text-start" for="lastname">Apellido</label>
                                <v-text-field variant="outlined" name="lastname" v-model="user.apellido" outlined></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="email">Email</label>
                                <v-text-field variant="outlined" name="email" v-model="user.email" outlined type="email"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="phone">Telefono</label>

                                <v-text-field variant="outlined"  name="phone" v-model="user.telefono" outlined
                                    type="tel"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="country">Pais</label>
                                <v-select label="País" v-model="user.pais" name="country" :items="paises" outlined></v-select>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="address">Direccion</label>

                                <v-text-field variant="outlined" name="address" v-model="user.direccion" outlined></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="cp">Codigo postal</label>

                                <v-text-field variant="outlined" name="cp" v-model="user.codigoPostal" outlined></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="businessName">Nombre de empresa</label>

                                <v-text-field variant="outlined" name="businessName" v-model="user.nombreEmpresa"
                                    outlined></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="legalName">Razon social</label>
                                <v-text-field variant="outlined" name="legalName" v-model="user.razonSocial" outlined></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="anualEarn">Ingresos anuales registrados</label>

                                <v-text-field variant="outlined" name="anualEarn" label="Ingresos anuales registrados" v-model="user.ingresosAnuales"
                                    outlined type="number"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <label class="font-weight-black text-start" for="password">Generacion de contraseña</label>
                                <v-text-field variant="outlined" name="password" v-model="user.password" outlined
                                    :type="showPassword ? 'text' : 'password'" append-icon="mdi-eye"
                                    @click:append="showPassword = !showPassword"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <label class="font-weight-black" for="confirmPass">Confirmar contraseña</label>
                                <v-text-field variant="outlined" name="confirmPass" v-model="user.confirmPassword" outlined
                                    :type="showConfirmPassword ? 'text' : 'password'" append-icon="mdi-eye"
                                    @click:append="showConfirmPassword = !showConfirmPassword"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row justify="center">
                            <v-btn color="green" @click="registerUser">Registrar usuario</v-btn>
                        </v-row>
                    </v-form>
                </div>
            </v-card-text>
    </v-card>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            showPassword: false,
            showConfirmPassword: false,
            user: {
                nombre: '',
                apellido: '',
                email: '',
                telefono: '',
                pais: '',
                direccion: '',
                codigoPostal: '',
                nombreEmpresa: '',
                razonSocial: '',
                ingresosAnuales: '',
                password: '',
                confirmPassword: '',
            },
            paises: ['Argentina', 'Brazil', 'United States', 'United Kingdom'],
        };
    },
    methods: {
        registerUser() {
            // Lógica de registro del usuario
            console.log(this.user);
        },
    },
};
</script>

<style scoped>
.v-text-field {
    margin-bottom: 16px;
}
</style>