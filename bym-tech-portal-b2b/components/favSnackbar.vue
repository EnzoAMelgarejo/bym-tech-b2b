<template>
    <v-snackbar v-model="showSnackbar" :color="color" :timeout="2000">
        {{ message }}
        <template v-slot:action="{ attrs }">
            <v-btn color="white" text v-bind="attrs" @click="showSnackbar = false">Cerrar</v-btn>
        </template>
    </v-snackbar>
</template>

<script>
export default {
    name: "favSnackbar",
    data() {
        return {
            showSnackbar: false,
            message:"",
            color:"",
        };
    },
    methods: {
        show(message,color) {
            this.showSnackbar = true;
            this.message=message
            this.color=color
        },
    },
};
</script>

<style scoped>
/* Estilos opcionales para personalizar el Snackbar */
</style>
