<template>
    <v-toolbar color="green" dark height="40" tile>

    </v-toolbar>

    <v-container fluid style="background-color:#e3e3e3;">
        <v-row justify="end">

        </v-row>
        <v-row>
            <!-- Sidebar -->
            <v-col cols="2">
                <v-img :src="getConfiguration('logo').value1" max-width="40%" max-height="90%" class="mr-3"
                    alt="Logo"></v-img>
            </v-col>

            <v-col cols="6" class="d-flex align-center">
                <v-col>
                    <v-btn color="green" dark>{{ menuItems[activeTab] }}</v-btn>
                </v-col>

                <v-col cols="8" class="d-flex justify-end">
                    <v-btn color="orange" style="color:white !important;" class="mr-2">Incluir</v-btn>
                    <v-btn color="orange" style="color:white!important;" class="mr-2">Modificar</v-btn>
                    <v-btn color="orange" style="color:white!important;" class="mr-2">Visualizar</v-btn>
                    <v-menu>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="grey" dark v-bind="attrs" v-on="on">
                                Otras Acciones
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>Acción 1</v-list-item>
                            <v-list-item>Acción 2</v-list-item>
                            <!-- Más acciones -->
                        </v-list>
                    </v-menu>
                </v-col>
            </v-col>
            <v-col class="d-flex justify-end align-center" cols="3">
                <span class="white--text ml-4 mr-4 font-weight-bold" style="color:#666666">Administrador</span>
                <v-divider vertical></v-divider>
                <span class="white--text ml-4 mr-4 font-weight-bold" style="color:#666666">03/22/2022</span>
                <v-divider vertical></v-divider>

                <span class="white--text ml-4 font-weight-bold" style="color:#666666">Sucursal 01</span>
            </v-col>
            <v-col cols="2" class="grey lighten-4 pa-4">
                <v-card rounded min-height="1000px">
                    <v-card-title>
                        <h5 style="color:orange">PORTAL DEL CLIENTE <v-icon>mdi-account</v-icon></h5>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field dense placeholder="Buscar" append-icon="mdi-magnify" class="mt-3"></v-text-field>
                        <v-tabs active-color="orange" slider-size="12" v-model="activeTab" direction="vertical">
                            <v-tab slider-color="orange" active-color="orange" style="color:#676767;"
                                class="pb-2 text-subtitle-1 font-weight-bold" v-for="(tab, index) in menuItems" :key="index">
                                {{ tab }}
                            </v-tab>
                        </v-tabs>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Content -->
            <v-col cols="10" class="pa-4">
                <v-card width="100%" height="100%" min-height="500px">
                    <v-container fluid>
                        <!-- Barra de acciones superior -->


                        <!-- Filtros -->
                        <v-row class="d-flex align-center" style="background-color: #FFA500;">
                            <v-col cols="3">
                                <v-select density="compact" hide-details="auto" solo bg-color="white" dense
                                    :items="filterOptions" label="Filtros"></v-select>
                            </v-col>
                        </v-row>

                        <!-- Tabla de datos -->
                        <v-row>
                            <v-col cols="12">
                                <v-data-table :headers="headers" :items="items" items-per-page="20">
                                    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                                        <tr>
                                            <template v-for="column in columns" :key="column.key">
                                                <th class="custom-header">
                                                    <span class="font-weight-bold">{{ column.title }}</span>
                                                </th>
                                            </template>
                                        </tr>
                                    </template>
                                    <template v-slot:item="{ item, index }">
                                        <tr :class="index % 2 === 0 ? 'custom-row-even' : 'custom-row-odd'">
                                            <td v-for="(header, i) in headers" :key="i">
                                                {{ item[header.value] }}
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
                <!-- Add your content here -->
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            filterOptions: ["Mostrar todo", "Opción 1", "Opción 2"], // Opciones para el filtro
            headers: [
                { title: "Número", value: "numero" },
                { title: "Cliente", value: "cliente" },
                { title: "Tienda", value: "tienda" },
                { title: "Razón Social", value: "razonSocial" },
                { title: "Tda. Entrega", value: "tdaEntrega" },
                { title: "Clase", value: "clase" },
                { title: "Proc. Export.", value: "procExport" },
                { title: "Categoría", value: "categoria" },
                { title: "UF. Prest.", value: "ufPrest" },
                { title: "Cód. Editorial", value: "codEditorial" },
            ],
            items: Array(15).fill({numero:'1241294',
                 cliente:'000001',
                 tienda:'01',
                 razonSocial:'Prueba',
                 tdaEntrega:'Prueba',
                 clase:'prueba',
                 procExport:'prueba',
                 categoria:'prueba',
                 ufPrest:'prueba',
                 codEditorial:'prueba',
                }),
            activeTab: 'Vendedor Asignado',
            menuItems: [
                'Vendedor asignado',
                'Facturas pendientes de pago',
                'Cheques pendiente de cobro',
                'Pedidos pendiente de entrega',
                'Solicitar ampliación de crédito',
                'Historial de Compras',
                'Favoritos'
            ],
            keys: [
                'logo'
            ],
            configuration: [
            ],
        };
    },

    async mounted() {
        await this.loadConfiguration(this.keys)
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
    }
};
</script>

<style scoped>
.title {
    font-weight: bold;
}

.v-btn {
    font-weight: bold;
}

.custom-header {
    background-color: #00b300;
    color: white;

}

.custom-row-even {
    background-color: #e3e3e3 !important;
}
</style>