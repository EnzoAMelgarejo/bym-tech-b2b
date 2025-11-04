<template>
    <v-card flat color="white">
        <template v-slot:text>
            <v-row align="center">
                <v-col cols="9">
                    <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" variant="outlined"
                        hide-details single-line></v-text-field>
                </v-col>
                <v-col cols="3">
                    <!-- Botón y menú de opciones -->
                    <v-row>
                        <v-col :cols="$vuetify.display.smAndDown?'12':'8'" :class="$vuetify.display.smAndDown?'py-0':''" >
                            <v-btn-toggle  height="48px"
                                color="blue" class="ml-2" style="background-color:''">
                                <v-btn v-if="$vuetify.display.mdAndUp" size="large" color="primary" @click="filterStatus = 'Cualquiera'">{{
                                    $vuetify.display.mdAndUp ? filterStatus : undefined
                                    }}
                                </v-btn>

                                <v-menu activator="parent">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="py-0 mb-0" size="large" v-bind="attrs" v-on="on" icon>
                                            <v-icon>mdi-menu-down</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="filterStatus = 'Cualquiera'">
                                            <v-list-item-title>Cualquiera</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="filterStatus = 'Abierto'">
                                            <v-list-item-title>Abierto</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="filterStatus = 'Cerrado'">
                                            <v-list-item-title>Cerrado</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </v-btn-toggle>
                        </v-col>
                        <v-col :cols="$vuetify.display.smAndDown?'12':'4'">
                            <v-btn size="large" min-width="0" height="48px" color="blue" class="ml-2"
                                @click="formThread = true"><v-icon>mdi-plus</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </template>

        <v-data-table class="elevation-1" theme="light" height="400pt" width="80%" :items="itemsThreads"
            :headers="headersThreads" :search="search" :items-per-page="itemsPerPage" :page="page">
            <template v-slot:item.updatedAt="{ item }">
                {{ lastInteraction(item.interactions) }}
            </template>
            <template v-slot:item.createdAt="{ item }">
                {{ formatDate(new Date(item.createdAt)) }}
            </template>

            <template v-slot:item.status="{ item }">
                <div>
                    <v-chip :color="item.status == 'ABIERTO' ? 'green' : 'red'" :text="item.status" size="large"
                        label></v-chip>
                </div>
            </template>
            <template v-slot:item.options="{ item }">

                <v-btn icon elevation="1">
                    <v-icon size="large" @click="itemInteraction = item; dialogThread = true; getInteractions()">
                        mdi-eye
                    </v-icon>
                </v-btn>
            </template>
            <template v-slot:bottom>
                <div class="text-center pt-2">
                    <v-pagination v-model="page" :length="pageCount(itemsThreads, itemsPerPage)"></v-pagination>
                </div>
            </template>
        </v-data-table>
    </v-card>
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
    <v-dialog v-model="dialogThread" @change="response = false" :max-width="$vuetify.display.smAndDown ? '100%' : '80%'"
        :min-width="$vuetify.display.smAndDown ? '100%' : '80%'"
        :style="{ paddingRight: '0px', height: '100vh' }">
        <v-card color="primary" height="100%" class="pa-0">
            <v-row v-if="$vuetify.display.smAndDown">
                <v-col cols=6>
                    <v-btn icon flat color="white" elevation="0" :ripple="false">
                        <v-icon class="ma-2">mdi-dots-horizontal</v-icon>
                        <v-menu activator="parent" :close-on-content-click="false" :close-on-click="false">
                            <v-card color="grey-lighten-2" height="100%" width="100%" :elevation="1"
                                style="border-left:1px solid black; border-radius:4px; ">

                                <v-card-title c> <v-icon>mdi-message</v-icon>
                                    {{ 'CONSULTA N° #' + itemInteraction.id }}</v-card-title>
                                <v-list density="comfortable" bg-color="grey-lighten-2" class=" full-height-list">
                                    <v-list-item prepend-icon="mdi-tag" title="Tipo" :subtitle="itemInteraction.type"
                                        class="text-subtitle-1 full-height-item"></v-list-item>
                                    <v-list-item prepend-icon="mdi-message-plus" title="Ultima Interaccion"
                                        :subtitle="lastInteraction(itemInteraction.interactions)"
                                        class="full-height-item"></v-list-item>

                                    <v-list-item prepend-icon="mdi-account-alert" title="Representante"
                                        :subtitle="lastRep" class="full-height-item"></v-list-item>

                                    <v-list-item prepend-icon="mdi-checkbox-marked-circle-outline" title="Estado"
                                        class="full-height-item"></v-list-item>

                                    <v-form style="width: 50%;" class="full-height-item">
                                        <v-select v-model="itemInteraction.status" bg-color="grey-lighten-2"
                                            :items="['ABIERTO', 'CERRADO']" :item-title="'Estado'" variant="outlined"
                                            class="ml-12 custom-select" :list-props="{ bgColor: 'grey-lighten-2' }">
                                            <template #item="{ props }">
                                                <v-list-item bg-color="grey-lighten-2" v-bind="props" />
                                            </template>
                                        </v-select>
                                    </v-form>

                                    <v-list-item prepend-icon="mdi-message-processing-outline" title="Detalle"
                                        class="full-height-item"></v-list-item>

                                    <v-list class="ma-auto full-height-item" style="width: 90%;"
                                        bg-color="grey-lighten-2">
                                        <v-list-item :style="{ backgroundColor: 'rgba(183, 183, 183, 0.5)' }"
                                            width="100%" variant="outlined pa-4" class="border-2 border-grey"
                                            rounded="lg">
                                            <p>{{ itemInteraction.interactions[0].message }}</p>
                                        </v-list-item>
                                    </v-list>

                                </v-list>
                                <div class="d-flex justify-end" style="margin-top:30% !important">
                                    <v-btn class="mr-12 mt-0" style="margin-bottom:16px !important" @click="putThread()"
                                        color="green-darken-1">
                                        Guardar </v-btn>
                                </div>
                            </v-card>
                        </v-menu>
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <v-icon @click="dialogThread = false" class="ma-2 float-right" float="right">mdi-close</v-icon>
                </v-col>
            </v-row>
            <v-container class="pa-0"
                style="margin:0px !important; height:100% !important; max-width:100% !important; box-sizing: inherit; max-height:100% !important">
                <v-row style="height:100% !important" class="pa-0 ma-0">
                    <!-- Left Column -->
                    <v-col :cols="$vuetify.display.mdAndUp ? '8' : '12'" style="height:100% !important">
                        <v-row style="height:100% !important">
                            <v-col cols="12" style="height:100% !important">
                                <v-card color="primary" elevation="0" height="100%">
                                    <div class="list-container" height="100%">
                                        <v-list min-height="100%"
                                            style="background-color:white !important; color:black !important; overflow-y:auto;">
                                            <v-list-item min-height="100%">
                                                <v-list
                                                    style="background-color:white !important; color:black !important;">
                                                    <v-timeline v-if="$vuetify.display.mdAndUp" class="pa-4" side="end"
                                                        align="start" density="compact" line-color="black">
                                                        <v-timeline-item
                                                            v-for="(item, i) in itemInteraction.interactions" :key="i"
                                                            dot-color="black">
                                                            <v-list-item
                                                                :style="{ backgroundColor: item.userId == user.id ? 'rgba(183, 183, 183, 0.5)' : 'white' }"
                                                                width="100%" variant="outlined"
                                                                class="border-2 border-grey" rounded="lg">

                                                                <div class="questrial font-weight-bold"
                                                                    style="font-size: 14px">
                                                                    <v-avatar>
                                                                        <img src="https://i.pravatar.cc/1000"
                                                                            alt="John">
                                                                    </v-avatar>
                                                                    {{ item.userId == user.id ? 'Yo' :
                                                                        item.user.name
                                                                    }}
                                                                    <span class="font-weight-medium grey--text ml-2">{{
                                                                        'hace ' + timeSince(item.createdAt)
                                                                    }}</span>
                                                                </div>
                                                                <p>{{ item.message }}</p>
                                                            </v-list-item>
                                                        </v-timeline-item>
                                                    </v-timeline>
                                                    <v-list-item v-if="$vuetify.display.smAndDown"
                                                        v-for="(item, i) in itemInteraction.interactions" :key="i"
                                                        dot-color="black"
                                                        :style="{ backgroundColor: item.userId == user.id ? 'rgba(183, 183, 183, 0.5)' : 'white' }"
                                                        width="100%" variant="outlined" class="border-2 border-grey"
                                                        rounded="lg">

                                                        <div class="questrial font-weight-bold" style="font-size: 14px">
                                                            <v-avatar>
                                                                <img src="https://i.pravatar.cc/1000" alt="John">
                                                            </v-avatar>
                                                            {{ item.userId == user.id ? 'Yo' :
                                                                item.user.name
                                                            }}
                                                            <span class="font-weight-medium grey--text ml-2">{{
                                                                'hace ' + timeSince(item.createdAt)
                                                                }}</span>
                                                        </div>
                                                        <p>{{ item.message }}</p>
                                                    </v-list-item>
                                                </v-list>
                                            </v-list-item>
                                        </v-list>
                                    </div>
                                    <div class="d-flex align-center">
                                        <v-text-field class="special flex-grow-1" variant="outlined" id="newInteraction"
                                            :disabled="!response" placeholder="Responder" type="text"
                                            v-model="newInteraction">
                                            <template #['append-inner']>
                                                <v-btn variant="elevated" color="red" icon v-if="response"
                                                    @click="response = false;" class="lock-button">
                                                    <v-icon>mdi-close-thick</v-icon>
                                                </v-btn>
                                                <v-btn v-if="response" variant="elevated" theme="light"
                                                    color="grey-lighten-2" class="lock-button"
                                                    @click="postInteraction(itemInteraction)" icon>
                                                    <v-icon>mdi-send</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-text-field>
                                        <v-btn v-if="!response" color="black" variant="elevated" icon height="50px"
                                            class="lock-button opacity-1 align-self-stretch" @click="response = true">
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                    <!-- Right Column -->
                    <v-col v-if="$vuetify.display.mdAndUp" cols="4"
                        style="padding:0px; display: flex; flex-direction: column; height: 100%;">
                        <v-card color="grey-lighten-2" height="100%" width="100%" :elevation="0"
                            style="border-left:1px solid black; border-radius:0px; ">

                            <v-card-title c> <v-icon>mdi-message</v-icon>
                                {{ 'CONSULTA N° #' + itemInteraction.id }}</v-card-title>
                            <v-list density="comfortable" bg-color="grey-lighten-2" class=" full-height-list">
                                <v-list-item prepend-icon="mdi-tag" title="Tipo" :subtitle="itemInteraction.type"
                                    class="text-subtitle-1 full-height-item"></v-list-item>
                                <v-list-item prepend-icon="mdi-message-plus" title="Ultima Interaccion"
                                    :subtitle="lastInteraction(itemInteraction.interactions)"
                                    class="full-height-item"></v-list-item>

                                <v-list-item prepend-icon="mdi-account-alert" title="Representante" :subtitle="lastRep"
                                    class="full-height-item"></v-list-item>

                                <v-list-item prepend-icon="mdi-checkbox-marked-circle-outline" title="Estado"
                                    class="full-height-item"></v-list-item>

                                <v-form style="width: 50%;" class="full-height-item">
                                    <v-select v-model="itemInteraction.status" bg-color="grey-lighten-2"
                                        :items="['ABIERTO', 'CERRADO']" :item-title="'Estado'" variant="outlined"
                                        class="ml-12 custom-select" :list-props="{ bgColor: 'grey-lighten-2' }">
                                        <template #item="{ props }">
                                            <v-list-item bg-color="grey-lighten-2" v-bind="props" />
                                        </template>
                                    </v-select>
                                </v-form>

                                <v-list-item prepend-icon="mdi-message-processing-outline" title="Detalle"
                                    class="full-height-item"></v-list-item>

                                <v-list class="ma-auto full-height-item" style="width: 90%;" bg-color="grey-lighten-2">
                                    <v-list-item :style="{ backgroundColor: 'rgba(183, 183, 183, 0.5)' }" width="100%"
                                        variant="outlined pa-4" class="border-2 border-grey" rounded="lg">
                                        <p>{{ itemInteraction.interactions[0].message }}</p>
                                    </v-list-item>
                                </v-list>

                            </v-list>
                            <div class="d-flex justify-end" style="margin-top:30% !important">
                                <v-btn class="mr-12 mt-0" style="margin-bottom:16px !important" @click="putThread()"
                                    color="green-darken-1">
                                    Guardar </v-btn>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
    <favSnackbar ref="favSnackbarRef"></favSnackbar>
</template>

<script>
import { pageCount, timeSince, handleNotification, formatDate, getNotifications, sendMail } from '~/assets/utils/utils'; // Asegúrate de que esta ruta sea correcta
import favSnackbar from './favSnackbar.vue';


export default {
    props: {
        interactionId: {
            type: Number,
            default: undefined,
        }
    },
    name: 'thread',
    data() {
        return {
            token: useCookie('token'),
            localDialog: this.dialog,
            localSubject: this.subject,
            formThread: false,
            page: 1,
            itemsPerPage: 5,
            headersThreads: [
                { title: 'Asunto', key: 'subject', align: 'left' },
                { title: 'Creado', key: 'createdAt', align: 'center' },
                { title: 'Ultima Interaccion', key: 'updatedAt', align: 'center' },
                { title: 'Estado', key: 'status', align: 'center' },
                { title: 'Acciones', key: 'options', align: 'center' },
            ],
            itemsThreads: [],
            newInteraction: '',
            formThread: false,
            dialogThread: false,
            itemInteraction: { id: undefined, interactions: [], subject: "", userId: 0 },
            lastRep: '',
            formDataThread: {
                subject: undefined,
                message: undefined,
                type: 'Especificaciones'
            },
            response: false,
            filterStatus: 'Cualquiera',
            user: undefined,
            search: undefined,
            globalState: useGlobalState(),
        }
    },
    watch: {
        dialogThread(newVal) {
            this.response = false
        },
        localDialog(newVal) {
            this.$emit('update:dialog', newVal)
        },
        async filterStatus(newVal) {
            this.itemsThreads = await this.getThread()
        },
        async search(newVal) {
            this.itemsThreads = await this.getThread()
        }
    },
    async mounted() {
        this.user = await this.getUser()
        if (this.interactionId) {
            this.itemInteraction = await this.getThread(this.interactionId)
            this.dialogThread = true;
        }
        this.itemsThreads = await this.getThread()

    },

    methods: {
        lastInteraction(interactions) {
            if (interactions.length) {
                return timeSince(interactions[interactions.length - 1].updatedAt)
            } else {
                return
            }
        },
        sendMail,
        formatDate,
        timeSince,
        pageCount,
        async postInteraction(formDataInteraction, ind) {
            try {
                formDataInteraction = {
                    message: this.newInteraction,
                    thread: {
                        connect: { id: formDataInteraction.id }
                    }
                }
                const headers = {
                    'token': this.token
                }
                const data = await $fetch('/api/controller/interactions', {
                    method: 'POST',
                    body: {
                        ...formDataInteraction,
                    },
                    query: {
                        one: false,
                        id: 0,
                    },
                    headers
                })
                //cargo el usuario añadido
                const seenUserIds = new Set();
                const usersNotifications = this.itemInteraction.interactions.filter(value => {
                    if (value.userId != this.user.id && !seenUserIds.has(value.userId)) {
                        seenUserIds.add(value.userId);
                        return true;
                    }
                    return false;
                });
                usersNotifications.forEach(async (elem) => {
                    this.handleNotification({ threadId: this.itemInteraction.id, userId: elem.user.id, type: 'THREAD', operation_type: `Tienes una nueva respuesta en CONSULTA #${this.itemInteraction.id}` },
                        0, false, 'THREAD', headers, undefined, undefined)
                    await sendMail({
                        to: elem.user.email,
                        type: "INTERACTION",
                        subject: this.itemInteraction.subject,
                        ticketNumber: this.itemInteraction.id,
                        username: this.lastRep,
                        message: this.newInteraction
                    })
                })


                this.globalState.notifications.notifications = (await getNotifications(this.token, 'THREAD')).length
                this.itemInteraction.interactions.push(reactive(data));
                this.response = false
                this.newInteraction = '';
                //snackbar
                this.$refs.favSnackbarRef.show(this.$t('add.sucess'), 'green');
            } catch (err) {
                this.$refs.favSnackbarRef.show(this.$t('favorite.error'), 'red');
                console.log(err);
            }
        },
        async postThread(formData) {
            try {
                formData.subject = "#" + this.user.company[0].bio + ": " + formData.subject
                const data = await $fetch('/api/controller/threads', {
                    method: 'POST',
                    body: {
                        ...formData,
                    },
                    params: {  // Usa 'params' para los parámetros de query
                        one: false,
                        id: 0
                    },
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    }

                })
                const usersAdmin = await this.getUser(false)
                const usersMail = usersAdmin.map((elem) => (elem.email));
                //cargo el usuario añadido
                await sendMail({
                    to: usersMail,
                    type: "THREAD",
                    subject: formData.subject,
                    ticketNumber: data.id,
                    username: this.user.name,
                    message: formData.message
                })
                this.itemsThreads = await this.getThread()
                this.formDataThread = { subject: undefined, message: undefined, type: undefined };
                this.formThread = false;
                //snackbar
                this.$refs.favSnackbarRef.show(this.$t('add.sucess'), 'green');

            } catch {
                this.$refs.favSnackbarRef.show(this.$t('favorite.error'), 'red');
            }
        },
        async putThread() {
            try {
                const data = await $fetch('/api/controller/threads', {
                    method: 'PUT',
                    body: {
                        status: this.itemInteraction.status,
                        subject: this.itemInteraction.subject,
                        type: this.itemInteraction.type
                    },
                    params: {  // Usa 'params' para los parámetros de query
                        one: true,
                        id: this.itemInteraction.id
                    },
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    }

                })
                //snackbar
                this.$refs.favSnackbarRef.show(this.$t('modify.success'), 'green');
            } catch {
                this.$refs.favSnackbarRef.show(this.$t('favorite.error'), 'red');
            }
        },

        async getThread(id) {
            const data = await $fetch('/api/controller/threads', {
                method: 'GET',
                query: {  // Usa 'params' para los parámetros de query
                    one: id ? 'true' : 'false',
                    id: id,
                    status: this.filterStatus,
                    search: this.search
                },
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                }
            })
            //snackbar
            return data;
        },
        async getInteractions() {
            try {
                const data = await $fetch('/api/controller/interactions', {
                    method: 'GET',
                    params: {  // Usa 'params' para los parámetros de query
                        one: 'false',
                        orderField: 'id',
                        orderDir: 'desc',
                        threadId: this.itemInteraction.id
                    },
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    }
                })
                //cargo el usuario añadido
                this.lastRep = data[0].user.name;
                return data
                //snackbar
            } catch (err) {
                console.log(err);
            }

        },
        getNotifications,
        handleNotification,
        async getUser(unique = true) {
            const data = await $fetch('/api/controller/users', {
                method: 'GET',
                params: {  // Usa 'params' para los parámetros de query
                    one: unique ? 'true' : 'false',
                    unique: unique,
                    role: unique ? undefined : 'Admin'
                },
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                }
            })
            //cargo el usuario añadido
            return data;
            //snackbar
        }
    }
}
</script>

<style scoped>
:deep(.v-timeline-item__body) {
    width: 100% !important;
}

:deep(.v-card) {
    height: 100% !important;
    max-height: 100% !important;
}

.v-dialog :deep(.v-overlay__content) {
    height: 100% !important;
    z-index: 10003 !important;
}

:deep(.v-avatar) {
    margin-right: 8px;
}

.list-container {
    height: 70vh;
    overflow-y: auto;
}

.align-self-stretch {
    align-self: stretch;
}


.v-select :deep(.v-field) {
    background-color: rgb(0, 0, 0);
    color: white;
}



.special.v-text-field.v-input--is-disabled {
    pointer-events: initial;
}



:deep(.v-input__control) {
    z-index: 10005 !important;
}

.full-height-list {
    display: flex;
    flex-direction: column;
    height: 70%;
}

.full-height-item {
    flex: 1;
    display: flex;
    align-items: center;
    /* Optional: Centers the content of the item vertically */
}

.full-height-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    /* Ensure no overflow */
}

.lock-button {
    pointer-events: auto;
    background-color: black;
    opacity: 1 !important;
    z-index: 15000 !important;
    transition: none;
}

.v-input--disabled .lock-button {
    background-color: black !important;
    /* Ajusta el color de fondo del botón según sea necesario */
    opacity: 1;
}

.v-text-field--is-disabled .lock-button {
    opacity: 1 !important;
    /* Asegura que el botón mantenga su opacidad cuando el v-text-field está deshabilitado */
    background-color: black !important;
    /* Ajusta el color de fondo del botón según sea necesario */
    color: white !important;
    /* Ajusta el color del texto del botón según sea necesario */
}
</style>
