<template>
    <template v-if="layout=='Tecnolab'">
        <v-btn color="green" style="position:absolute;top:10px;right:10px;z-index:3" @click="handleFav(item)"
            :icon="item.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'" variant="plain" size="x-large">
        </v-btn>
    </template>
    <template v-else>
        <v-btn color="green" style="position:absolute;bottom:75px;right:10px;z-index:3" @click="handleFav(item)"
            :icon="item.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'" variant="plain" size="x-large">
        </v-btn>
    </template>
    <favSnackbar ref="favSnackbarRef"></favSnackbar>
</template>

<script lang="ts">
import { addFavorite, getNotifications } from '../assets/utils/utils.ts'
import { ref } from 'vue';
import favSnackbar from '/components/favSnackbar.vue'
export default {
    name: "heartFavorite",
    components: {
        favSnackbar
    },
    props: {
        item: {
            type: Object,
            default: {}
        },
        layout: {
            type: String,
            default: 'Tecnolab'
        }
    },
    data() {
        return {
            token: useCookie('token'),
            globalState: useGlobalState(),
        };
    },
    async created() {
        await this.getFavoriteById()
    },
    async updated() {
        await this.getFavoriteById()

    },
    methods: {
        addFavorite,
        async getFavoriteById() {
            try {

                const data = await $fetch('/api/controller/favorite', {
                    method: 'GET',
                    query: {
                        one: 'false',
                        productCode: this.item.code,
                        orderField: 'productCode',
                        orderDir: 'asc'
                    },
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    }
                })
                this.item.isFavorite = data.length ? true : false;
            } catch (err) {
                console.log(err)
            }
        },
        async getFavorites() {
            //@ts-ignore
            try {
                const data = await $fetch('/api/controller/favorite', {
                    method: 'GET',
                    params: {  // Usa 'params' para los parámetros de query
                        one: 'false',
                        orderField: 'productCode',
                        orderDir: 'asc',
                    },
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                        // Puedes agregar más headers aquí
                    }
                })

                return data
            } catch (err) {
                console.log(err);
            }
        },


        async handleFav(item: any) {
            try {
                this.$emit('favorite-clicked');
                await addFavorite(item, { 'token': this.token });
                if (item.isFavorite) {
                    this.$refs.favSnackbarRef.show(this.$t('favorite.sucess'), 'green');
                } else {
                    this.$refs.favSnackbarRef.show(this.$t('favorite.remove'), 'red');
                }
                this.globalState.notifications.favorite = (await getNotifications(this.token, 'FAVORITE')).length
            } catch (err) {
                this.$refs.favSnackbarRef.show(this.$t('favorite.error'), 'red');
                console.error(err);
            }
        },
    }
};

</script>

<style scoped></style>