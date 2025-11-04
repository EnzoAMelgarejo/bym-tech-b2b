<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
const { smAndDown, sm, md, lg } = useDisplay();

const getCardWidth = () => {
    return smAndDown.value ? '300px' : '300px';
};


const getSmAndDown = () => {
    return smAndDown.value;
};

</script>
<template>
    <v-row>
        <v-col cols="12">
            <div class="title-offers-and-news" v-if="itemsOnlyClick.length > 0">
                {{ textOnlyClick.value1 }}
            </div>
        </v-col>
    </v-row>
    <v-sheet class="mx-auto my-4" max-width="80%" color="transparent">
        <v-btn v-for="item in itemsOnlyClick" class="ma-2" color="green" @click="handleClick(item);"
            append-icon="mdi-dots-horizontal">
            {{ item.title }}
        </v-btn>

        <v-expand-transition>
            <v-sheet v-if="modelOnlyClick && itemsOnlyDetail.length > 0" class="mx-auto" max-width="85%"
                color="transparent">
                <v-slide-group v-model="modelOnlyClick" class="pa-4" selected-class="bg-primary" show-arrows>
                    <v-slide-group-item v-for="item in itemsOnlyDetail" :key="item.code">
                        <v-card  theme="light" width="100%" @click="filterCategory(item.code)">
                            <v-img class="rounded-circle" :src="item.img" max-height="200px"></v-img>
                            <v-card-text class="d-flex justify-center font-weight-bold text-h6">
                                {{ item.name }}
                            </v-card-text>
                        </v-card>
                    </v-slide-group-item>
                </v-slide-group>
            </v-sheet>
        </v-expand-transition>
    </v-sheet>
</template>

<script lang="ts">
export default {
    props: {
        itemsOnlyClick: {
            type: Array,
            default: {}
        }
    },
    data: () => ({
        token: useCookie('token'),
        modelOnlyClick: false,
        globalState: useGlobalState(),
        itemsOnlyDetail: [],
        textOnlyClick: {},
    }),
    async created() {
        this.textOnlyClick = await this.getConfiguration('only_click_text');
    },
    methods: {
        async getConfiguration(value) {
            var key = { key: '', value1: '', value2: '', value3: '', active: true };
            try {
                const data = await $fetch('/api/controller/configuration', {
                    method: 'GET',
                    query: { id: 0, one: 'false', keys: ['only_click_text'] },
                })

                if (data.keys[0]) {
                    if (data.keys[0].key == value) {
                        key = data.keys[0];
                    }
                }
            } catch (err) {
                console.error(err);
            }

            return key;
        },
        async handleClick() {
            try {
                await this.getOnlyClickCategories();
                this.modelOnlyClick = !this.modelOnlyClick;
            }
            catch (error) {
                console.error('Error parse json data:', error);
            }
        },

        async getOnlyClickCategories() {
            try {
                const { data } = await useFetch('/api/controller/category', {
                    method: 'GET',
                    query: {
                        one: false
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                this.itemsOnlyDetail = data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        filterCategory(code) {
            const filterJson = {
                "model": "product",
                "field": "category",
                "order": "desc",
                "filters": [
                    {
                        "code": "category",
                        "type": "EQUALS",
                        "value": code,
                        "list": []
                    }
                ]
            }
            this.$router.push({ path: '/filter', query: { filterJson:filterJson } })
        }
    }
}
</script>