<script setup lang="ts">
</script>
<template>
    <v-row style="margin-top: 10px;">
        <v-col v-if="page=='index'" cols="1"></v-col>
        <v-col  cols="10">
            <v-row>
                <template v-for="(image, imgIdx) in itemsImages" :key="imgIdx">
                    <v-col :cols="image.size">
                        <v-img :src="image.img" height="100%" v-if="(globalState.role == 'Admin' && image.status == 1) || image.status == 2 "
                            style="border-radius: 5px;" cover></v-img>
                    </v-col>
                </template>
            </v-row>
        </v-col>
        <v-col v-if="page=='index'" cols="1"></v-col>
    </v-row>
</template>

<script lang="ts">
export default {
    props: {
        itemsImages: {
            type: Array,
            default: {}
        },
        page:{
            type: String,
            default: 'index'
        }
    },
    data: () => ({
        token: useCookie('token'),
        globalState: useGlobalState(),
    }),
}
</script>