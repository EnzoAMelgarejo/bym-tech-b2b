<script setup lang="ts">
</script>
<template>
    <v-card class="mx-auto" style="background-color: white;">
        <v-row>
            <v-col cols="2">
                <v-container style="background-color: white;">
                    <v-item-group v-model="selection" multiple>
                        <v-row>
                            <v-col v-for="(item, i) in itemProdImg" :key="i" cols="12" md="12">
                                <v-item v-slot="{ isSelected, toggle }">
                                    <v-img :src="item" max-height="100%" max-width="300px" cover @click="toggle; changeCarouselSlide(i);">
                                    </v-img>
                                </v-item>
                            </v-col>
                        </v-row>
                    </v-item-group>
                </v-container>
            </v-col>
            <v-col cols="10">
                <v-carousel show-arrows="hover" style="background-color: white;" v-model="currentSlide">
                    <v-carousel-item style="background-color: white;" max-height="500px" max-width="750px"
                        v-for="(item, i) in itemProdImg" :key="i" :src="item" cover></v-carousel-item>
                </v-carousel>
            </v-col>
        </v-row>
    </v-card>
</template>

<script lang="ts">
export default {
    props: {
        itemProdImg: {
            type: Array,
            default: {}
        }
    },
    data: () => ({
        currentSlide: 0,
    }),
    methods: {
        changeCarouselSlide(index) {
            this.currentSlide = index;
        },
    },
}
</script>