<template>
    <v-container>
        <v-card width="100%">
            <v-card-title class="text-h5">
                <div class="d-flex justify-space-between align-center ml-12 py-1 px-4 rounded"
                    style="background-color: #00c400; width: 20%; color: white; margin-left:15% !important">
                    Solicitud de formularios
                    <v-icon>mdi-dots-horizontal</v-icon>
                </div>
            </v-card-title>

            <v-card-text align="center">
                <div style="width:40%" class="pa-12">
                    <v-form v-model="valid" ref="form" class="text-start" lazy-validation>
                        <v-row>
                            <v-col cols="12" md="6">
                                <label class="font-weight-black text-start" for="nombre">Nombre</label>
                                <v-text-field variant="outlined" name="nombre" required v-model="user.name"
                                    outlined></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <label class="font-weight-black text-start" for="lastname">Apellido</label>
                                <v-text-field variant="outlined" name="lastname" required v-model="user.lastName"
                                    outlined></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="email">Email</label>
                                <v-text-field variant="outlined" name="email" required :rules="emailRules"
                                    v-model="user.email" outlined type="email"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="phone">Telefono</label>

                                <v-text-field variant="outlined" name="phone" required :rules="phoneRules"
                                    v-model="user.phone" outlined type="tel"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row justify="center">
                            <v-col cols="12" md="6">
                                <v-btn color="orange" class="text-white" width="90%" height="50px"
                                    @click="downloadForm()">Descarga tu formulario</v-btn>
                            </v-col>
                            <v-col cols="12" md="6" class="text-end">
                                <v-btn color="green" width="90%" @click="submitForm" height="50px">Carga tu
                                    formulario</v-btn>
                            </v-col> </v-row>
                    </v-form>
                    <v-dialog v-model="openDialog" width="30%">
                        <v-card>
                            <v-card-title class="pa-12">
                                Cargar formularios
                            </v-card-title>
                            <v-card-text>
                                <v-form>
                                    <v-file-input v-model="forms" multiple label="Formularios"></v-file-input>

                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="white" style="background-color: green;" variant="outlined"
                                    @click="uploadForms()">Confirmar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </div>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            valid: false,
            showPassword: false,
            showConfirmPassword: false,
            openDialog: false,
            token: useCookie('token'),
            forms: undefined,
            user: {
                name: '',
                lastName: '',
                email: '',
                phone: '',
            },
            paises: ['Argentina', 'Brazil', 'United States', 'United Kingdom'],

            emailRules: [
                v => !!v || 'El email es requerido',
                v => /.+@.+\..+/.test(v) || 'Debe ser un email válido'
            ],
            phoneRules: [
                v => !!v || 'El número de teléfono es requerido',
                v => /^\d{10}$/.test(v) || 'Debe ser un número de teléfono válido'
            ]
        };
    },
    methods: {
        submitForm() {
            const form = this.$refs.form;
            form.validate().then(({ valid: isValid }) => {
                if (isValid) {
                    // Si la validación pasa, puedes enviar los datos
                    this.openDialog = true
                }
            })

        },
        async uploadFile(formData) {
            const files = await $fetch('/api/controller/fileUpload', {
                method: 'POST',
                body: formData,
            })
            return files
        },
        downloadForms() {
            // Lógica de registro del usuario
            console.log(this.user);
        },
        async uploadForms() {
            try {
                const formData = new FormData();
                const files = []
                this.forms.forEach((elem) => {
                    files.push({ fileName: elem.name })
                    formData.append(`file`, elem);
                });
                const uploadedFiles = await this.uploadFile(formData);
                uploadedFiles.forEach((elem, index) => {
                    files[index].path = elem
                })
                const headers = {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                }
                const result = await $fetch('/api/controller/forms-data', {
                    method: 'POST',
                    body: {
                        ...this.user,
                        Forms_Files: {
                            create: files
                        }
                    },
                    headers
                })

            } catch (err) {
                console.log(err);
            }
        },
    },
};
</script>

<style scoped>
.v-text-field {
    margin-bottom: 16px;
}
</style>