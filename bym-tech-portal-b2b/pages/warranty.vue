<template>
    <v-container>
        <v-card width="100%">
            <v-card-title class="text-h5">
                <div class="d-flex justify-space-between align-center ml-12 py-1 px-4 rounded"
                    style="background-color: #00c400; width: 20%; color: white; margin-left:15% !important">
                    Datos de garantía
                    <v-icon>mdi-dots-horizontal</v-icon>
                </div>
            </v-card-title>

            <v-card-text align="center">
                <div style="width:40%" class="pa-12">
                    <v-form v-model="valid" ref="form" class="text-start" lazy-validation>
                        <v-row>
                            <v-col cols="12" md="6">
                                <label class="font-weight-black text-start" for="nombre">Nombre</label>
                                <v-text-field variant="outlined" name="nombre" :rules="[ruleDefault]" required
                                    v-model="warranty.name" outlined></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <label class="font-weight-black text-start" for="lastname">Apellido</label>
                                <v-text-field variant="outlined" name="lastname" :rules="[ruleDefault]" required
                                    v-model="warranty.lastName" outlined></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="email">Email</label>
                                <v-text-field variant="outlined" name="email" required :rules="emailRules"
                                    v-model="warranty.email" outlined type="email"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="productType">Tipo de producto</label>

                                <v-select density="compact" name="productType" :rules="[ruleDefault]" required
                                    v-model="warranty.productType" :items="productType" outlined type="tel"></v-select>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="phone">Telefono</label>

                                <v-text-field variant="outlined" name="phone" required :rules="phoneRules"
                                    v-model="warranty.phone" outlined type="tel"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="dni">Nro de documento</label>

                                <v-text-field variant="outlined" name="dni" :rules="[ruleDefault]" required
                                    v-model="warranty.dni" outlined type="text"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="billNumber">Nro de factura</label>

                                <v-text-field variant="outlined" name="billNumber" required
                                    v-model="warranty.billNumber" :rules="[ruleDefault]" outlined
                                    type="text"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row justify="center">
                            <v-col cols="12" md="6">
                                <v-btn color="orange" class="text-white" width="90%" height="50px"
                                    @click="submitForm()">Adjuntar factura</v-btn>
                            </v-col>
                            <v-col cols="12" md="6" class="text-end">
                                <v-btn color="green" width="90%" height="50px" class="button is-rounded"
                                    :class="{ 'is-primary': !isCameraOpen, 'is-danger': isCameraOpen }"
                                    @click="toggleCamera">
                                    Tomar fotografia
                                </v-btn>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="ruc">RUC del lugar de compra</label>

                                <v-text-field variant="outlined" name="ruc" required :rules="[ruleDefault]"
                                    v-model="warranty.ruc" outlined type="text"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label class="font-weight-black text-start" for="serie">Numero de serie</label>

                                <v-text-field variant="outlined" name="serie" required :rules="[ruleDefault]"
                                    v-model="warranty.serialNumber" outlined type="text"></v-text-field>
                            </v-col>
                            <v-col cols="12" class="text-center">
                                <v-btn color="green" width="30%" @click="uploadForms" height="50px">Enviar</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                    <v-dialog v-model="openDialog" width="30%">
                        <v-card>
                            <template v-if="isCameraOpen">
                                <v-card-title class="pa-12">
                                    Tomar foto
                                </v-card-title>
                                <v-card-text>
                                    <div v-if="isCameraOpen" v-show="!isLoading" class="camera-box"
                                        :class="{ 'flash': isShotPhoto }">

                                        <div class="camera-shutter" :class="{ 'flash': isShotPhoto }"></div>

                                        <video v-show="!isPhotoTaken" ref="camera" :width="450" :height="337.5"
                                            autoplay></video>

                                        <canvas v-show="isPhotoTaken" id="photoTaken" ref="canvas" :width="450"
                                            :height="337.5"></canvas>
                                    </div>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn v-if="isCameraOpen && !isLoading && isPhotoTaken" color="white"
                                        style="background-color: green;" variant="outlined" class="button" @click="openDialog = false; uploadPhoto()
                                            ">
                                        Confirmar
                                    </v-btn>
                                    <v-btn variant="outlined" style="background-color: orange;"
                                        v-if="isCameraOpen && !isLoading && !isPhotoTaken" @click=takePhoto>
                                        Tomar foto
                                    </v-btn>
                                </v-card-actions>
                            </template>
                            <template v-else>
                                <v-card-title class="pa-12">
                                    Adjuntar factura
                                </v-card-title>
                                <v-card-text>
                                    <v-form>
                                        <v-file-input v-model="bill" :rules="fileRules" accept=".jpg, .jpeg, .png, .pdf"
                                            label="Factura" @change="validateFileInput"></v-file-input>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn color="white" style="background-color: green;" variant="outlined"
                                        @click="openDialog = false;" :disabled="!isFileValid">Confirmar</v-btn>
                                </v-card-actions>
                            </template>
                        </v-card>
                    </v-dialog>
                </div>
            </v-card-text>
        </v-card>
        <v-snackbar v-model="snackbarSuccess" color="green" :timeout="3000">
            ¡Garantia subida exitosamente!
        </v-snackbar>
        <v-snackbar v-model="snackbarError" color="red" :timeout="3000">
            Ocurrio un error inesperado
        </v-snackbar>
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
            snackbarSuccess: false,
            snackbarError: false,
            forms: undefined,
            formValidated: false,
            productType: [
                'Focos',
                "Enchufes",
                "ETC"
            ],
            isCameraOpen: false,
            isPhotoTaken: false,
            photo:undefined,
            isShotPhoto: false,
            isLoading: false,
            link: '#',
            warranty: {
                name: '',
                lastName: '',
                email: '',
                phone: '',
                ruc: '',
                dni: '',
                productType: '',
                billNumber: '',
                serialNumber: '',
            },
            bill: undefined,
            img: undefined,
            paises: ['Argentina', 'Brazil', 'United States', 'United Kingdom'],
            ruleDefault: value => !!value || 'El campo es obligatorio',
            emailRules: [
                v => !!v || 'El email es requerido',
                v => /.+@.+\..+/.test(v) || 'Debe ser un email válido'
            ],
            phoneRules: [
                v => !!v || 'El número de teléfono es requerido',
                v => /^\d{10}$/.test(v) || 'Debe ser un número de teléfono válido'
            ],
            fileRules: [
                file => !file || this.isValidFileType(file) || 'Tipo de archivo no permitido'
            ],
            isFileValid: false
        };
    },
    methods: {
        isValidFileType(file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            return file && allowedTypes.includes(file.type);
        },
        toggleCamera() {
            if (this.isCameraOpen) {
                this.isCameraOpen = false;
                this.isPhotoTaken = false;
                this.isShotPhoto = false;
                this.stopCameraStream();
            } else {
                this.openDialog = true;
                this.isCameraOpen = true;
                this.createCameraElement();
            }
        },

        createCameraElement() {
            this.isLoading = true;

            const constraints = (window.constraints = {
                audio: false,
                video: true
            });


            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(stream => {
                    this.isLoading = false;
                    this.$refs.camera.srcObject = stream;
                })
                .catch(error => {
                    this.isLoading = false;
                    alert("May the browser didn't support or there is some errors.");
                });
        },

        stopCameraStream() {
            let tracks = this.$refs.camera.srcObject.getTracks();

            tracks.forEach(track => {
                track.stop();
            });
        },

        takePhoto() {
            if (!this.isPhotoTaken) {
                this.isShotPhoto = true;

                const FLASH_TIMEOUT = 50;

                setTimeout(() => {
                    this.isShotPhoto = false;
                }, FLASH_TIMEOUT);
            }

            this.isPhotoTaken = !this.isPhotoTaken;

            const context = this.$refs.canvas.getContext('2d');
            context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);
        },
        validateFileInput() {

            this.isFileValid = this.bill ? this.isValidFileType(this.bill) : false;
        },
        async uploadPhoto() {
            const canvas = document.getElementById("photoTaken");

            // Verifica que el canvas existe
            if (canvas) {
                // Convierte el canvas a un Blob en formato JPEG
                await canvas.toBlob((blob) => {
                    if (blob) {
                        // Crea un archivo a partir del Blob
                        this.photo= new File([blob], "photo.jpg", { type: "image/jpeg" });
                    
                    }
                }, "image/jpeg");
   
            }
        },
        submitForm() {
            const form = this.$refs.form;
            form.validate().then(({ valid: isValid }) => {
                if (isValid) {
                    // Si la validación pasa, puedes enviar los datos
                    this.formValidated = true;
                    this.openDialog = true;
                } else {
                    this.formValidated = false
                }
            })

        },
        async uploadFile(formData) {
            try {
                const files = await $fetch('/api/controller/fileUpload', {
                    method: 'POST',
                    body: formData,
                })
                return files
            } catch (err) {
                console.log(err)
            }
        },
        downloadForms() {
            // Lógica de registro del usuario
            console.log(this.user);
        },
        async uploadForms() {
            try {
                if (this.$refs.form.validate()) {
                    const formData = new FormData();
                    const files = []
                    if (this.photo) {
                        //vacio la clave
                        formData.delete('file')
                        formData.append(`file`, this.photo);
                        this.warranty.imgPath = (await this.uploadFile(formData))[0];
                    }
                    if (this.bill) {
                        //vacio la clave
                        formData.delete('file')
                        formData.append(`file`, this.bill);
                        this.warranty.billPath = (await this.uploadFile(formData))[0];
                    }


                    const headers = {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    }
                    const result = await $fetch('/api/controller/warranty', {
                        method: 'POST',
                        body: {
                            ...this.warranty,
                        },
                        headers
                    })
                }
                this.$refs.form.reset();
                this.snackbarSuccess = true;
            } catch (err) {
                this.snackbarError = true;
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

.web-camera-container {
    margin-top: 2rem;
    margin-bottom: 2rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 500px;


    .camera-button {
        margin-bottom: 2rem;
    }

    .camera-box {
        .camera-shutter {
            opacity: 0;
            width: 450px;
            height: 337.5px;
            background-color: #fff;
            position: absolute;

            &.flash {
                opacity: 1;
            }
        }
    }

    .camera-shoot {
        margin: 1rem 0;

        button {
            height: 60px;
            width: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 100%;

            img {
                height: 35px;
                object-fit: cover;
            }
        }
    }

    .camera-loading {
        overflow: hidden;
        height: 100%;
        position: absolute;
        width: 100%;
        min-height: 150px;
        margin: 3rem 0 0 -1.2rem;

        ul {
            height: 100%;
            position: absolute;
            width: 100%;
            z-index: 999999;
            margin: 0;
        }

        .loader-circle {
            display: block;
            height: 14px;
            margin: 0 auto;
            top: 50%;
            left: 100%;
            transform: translateY(-50%);
            transform: translateX(-50%);
            position: absolute;
            width: 100%;
            padding: 0;

            li {
                display: block;
                float: left;
                width: 10px;
                height: 10px;
                line-height: 10px;
                padding: 0;
                position: relative;
                margin: 0 0 0 4px;
                background: #999;
                animation: preload 1s infinite;
                top: -50%;
                border-radius: 100%;

                &:nth-child(2) {
                    animation-delay: .2s;
                }

                &:nth-child(3) {
                    animation-delay: .4s;
                }
            }
        }
    }

    @keyframes preload {
        0% {
            opacity: 1
        }

        50% {
            opacity: .4
        }

        100% {
            opacity: 1
        }
    }
}
</style>