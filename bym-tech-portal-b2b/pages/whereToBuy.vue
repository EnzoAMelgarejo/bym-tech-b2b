<template>
  <v-app>
    <v-container>
      <h2 class="text-center mb-6">Donde Comprar</h2>

      <v-row>
        <v-col v-for="(direction, index) in directions" :key="index" cols="12" md="4">
          <v-card outlined theme="light">
            <v-card-title class="orange--text">{{ direction.title }}</v-card-title>
            <v-card-text>{{ direction.address }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="mt-6" theme="light">
        <v-card-text>
          <v-img src="" height="300"></v-img>
        </v-card-text>
      </v-card>

      <v-form class="mt-6 text-center">
        <h3>Formulario de contacto</h3>
        <v-row class="pa-4">
          <v-col cols="6">
            <label class="font-weight-black" for="name">Nombre</label>
            <v-text-field variant="outlined" name="nombre"></v-text-field>
          </v-col>
          <v-col cols="6">
            <label class="font-weight-black" for="email">Mail</label>
            <v-text-field variant="outlined" name="email"></v-text-field>
          </v-col>
          <v-col cols="6">
            <label class="font-weight-black" for="subject">Asunto</label>
            <v-text-field name="subject" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="6"></v-col>
          <v-col cols="6" class=" pb-0">
            <label class="font-weight-black" for="message">Mensaje</label>
            <v-textarea  name="message" variant="outlined"></v-textarea>
          </v-col>
          <!-- Tercera columna donde irá el botón -->
          <v-col cols="6" class="d-flex align-self-end justify-start">
            <v-btn color="green" dark>Enviar</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      menuItems: ['Productos', 'Donde comprar', 'Garantía', 'Formularios', 'Contacto'],
      directions: [
        { title: 'Direccion 01', address: 'PO Box 16122 Collins Street West Victoria 8007 Australia - Map' },
        { title: 'Direccion 02', address: 'PO Box 16122 Collins Street West Victoria 8007 Australia - Map' },
        { title: 'Direccion 03', address: 'PO Box 16122 Collins Street West Victoria 8007 Australia - Map' },
      ],
    }
  },
}
</script>