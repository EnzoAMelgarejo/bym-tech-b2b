<script setup lang="ts">
</script>
<template>
    <div :style="' background-color: ' + itemSlot.backgroundColor + ';'">
        <v-row v-if="itemSlot.class.includes('TITLE')">
            <v-col cols="12">
                <div class="title-offers-and-news" :style="'color:' + itemSlot.color + ' !important;'">
                    {{ itemSlot.title }} <v-icon v-if="itemSlot.class.includes('ICON')"
                        :style="'margin-bottom: 5px;color:' + itemSlot.color + ';'">{{ itemSlot.icon }}</v-icon>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="4" xs="10" sm="10" md="4" lg="4" xl="4"
                v-if="itemSlot.class.includes('VIDEO') && itemSlot.class.includes('LEFT')">
                <div style="margin-top: 2%;">
                    <iframe width="95%" height="470" style="border-radius: 15px;" :src="itemSlot.link"
                        :title="itemSlot.title" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen></iframe>
                </div>
            </v-col>
            <v-col cols="4" xs="10" sm="10" md="4" lg="4" xl="4"
                v-if="itemSlot.class.includes('IMAGE') && itemSlot.class.includes('LEFT')">
                <v-img width="100%" height="470" style="border-radius: 15px; margin-top: 20px;" :src="itemSlot.img" />
            </v-col>
            <v-col cols="6" xs="10" sm="10" md="6" lg="6" xl="6"
                v-if="itemSlot.class.includes('IMAGE') || itemSlot.class.includes('VIDEO')">
                <v-sheet class="mx-auto" max-width="90%" color="transparent" style="top: 5%;">
                    <v-slide-group class="pa-4" selected-class="bg-primary" show-arrows>
                        <v-slide-group-item v-for="item in itemsProduct " :key="item.code">
                            <b2bCardProduct :item="item" />
                        </v-slide-group-item>
                    </v-slide-group>
                </v-sheet>
            </v-col>
            <v-col cols="10" v-if="!itemSlot.class.includes('IMAGE') && !itemSlot.class.includes('VIDEO')">
                <v-sheet class="mx-auto" max-width="90%" color="transparent" style="top: 5%;">
                    <v-slide-group class="pa-4" selected-class="bg-primary" show-arrows>
                        <v-slide-group-item v-for="item in itemsProduct " :key="item.code">
                            <b2bCardProduct :item="item" />
                        </v-slide-group-item>
                    </v-slide-group>
                </v-sheet>
            </v-col>
            <v-col cols="4" xs="10" sm="10" md="4" lg="4" xl="4"
                v-if="itemSlot.class.includes('VIDEO') && itemSlot.class.includes('RIGHT')">
                <div style="margin-top: 2%;">
                    <iframe width="80%" height="470" style="border-radius: 15px;" :src="itemSlot.link"
                        :title="itemSlot.title" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen></iframe>
                </div>
            </v-col>
            <v-col cols="4" xs="10" sm="10" md="4" lg="4" xl="4"
                v-if="itemSlot.class.includes('IMAGE') && itemSlot.class.includes('RIGHT')">
                <v-img width="100%" height="470" style="border-radius: 15px; margin-top: 20px; background-size: cover;"
                    cover :src="itemSlot.img" />
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        itemSlot: {
            type: Object,
            default: {}
        }
    },
    data: () => ({
        token: useCookie('token'),
        model: null,
        model1: null,
        model2: null,
        globalState: useGlobalState(),
        itemsProduct: [],
    }),
    async created() {
        try {
            var filter = JSON.parse(this.itemSlot.filterJson);
            var field = filter.field || 'code';
            var order = filter.order || 'asc';
            await this.getProducts(filter, this.itemSlot.size, field, order)
        } catch (error) {
            console.error('Error parse json data:', error);
        }
    },
    methods: {
        async getProducts(filter, size, field, order) {
            try {
                const { data } = await useFetch('/api/sync/product?one=false&field=' + field + '&order=' + order + '&offset=0&rows=' + size + '&client=' + this.globalState.codClient || '000001', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: filter
                });
                this.itemsProduct = data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
    },
}
</script>