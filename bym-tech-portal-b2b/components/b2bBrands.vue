<script setup lang="ts">
</script>
<template>
    <div style="background-color: #dddddd height: 300px; margin-top:60px;">
        <v-row>
            <v-sheet class="mx-auto" width="80%" color="transparent">
                <v-slide-group v-model="model" class="pa-4" center-active show-arrows>
                    <v-slide-group-item v-for="item in itemsBrand" :key="item.id">
                        <v-card color="white" class="ma-4" height="150" width="150" elevation="4" v-if="(globalState.role == 'Admin' && item.status == 1) || item.status == 2 "
                            @click="this.$router.push({ path: '/filter', query: { filterJson: item.filterJson } })"
                            style="padding: 30px; padding-top: 50px;">
                            <v-img class="brand-img" :src="item.img" style="filter: grayscale(100%);"></v-img>
                        </v-card>
                    </v-slide-group-item>
                </v-slide-group>
            </v-sheet>
        </v-row>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        itemsBrand: {
            type: Array,
            default: {}
        }
    },
    data: () => ({
        model: null,
        token: useCookie('token'),
        globalState: useGlobalState(),
    }),
}
</script>