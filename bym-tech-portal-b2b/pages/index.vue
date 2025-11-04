<script setup lang="ts">
import { addFavorite, getEndpoint } from '../assets/utils/utils'

const itemsCarousel = await getEndpoint('/api/controller/carousel?one=false&&orderField=order&orderDir=asc');
const itemsBrand = await getEndpoint('/api/controller/brand?one=false&&orderField=order&orderDir=asc');
const itemsFeature = await getEndpoint('/api/controller/feature');
const itemsOnlyClickGP1 = await getEndpoint('/api/controller/promotion?one=false&type=ONLY_CLICK_GROUP_1&orderField=order&orderDir=asc')
const itemsPromotions = await getEndpoint('/api/controller/promotion?one=false&type=COMMERCIAL&orderField=order&orderDir=asc')
const itemsImagesGP1 = await getEndpoint('/api/controller/promotion?one=false&type=IMAGE_GROUP_1&orderField=order&orderDir=asc')
const itemsImagesGP2 = await getEndpoint('/api/controller/promotion?one=false&type=IMAGE_GROUP_2&orderField=order&orderDir=asc')
const itemsOnlyClickGP2 = await getEndpoint('/api/controller/promotion?one=false&type=ONLY_CLICK_GROUP_2&orderField=order&orderDir=asc')



</script>

<template>
    <div>
        <b2bCarousel :itemsCarousel="itemsCarousel" />
        <b2bFeature :itemsFeature />
        <b2bImagesProm :itemsImages="itemsImagesGP1"/>
        <b2bPromotions :itemsPromotions />
        <b2bOnlyClickButtons :itemsOnlyClick="itemsOnlyClickGP1" />
        <b2bImagesProm :itemsImages="itemsImagesGP2"/>
        <b2bOnlyClick :itemsOnlyClick="itemsOnlyClickGP2" />
    </div>
</template>
<script lang="ts">
import favSnackbar from '~/components/favSnackbar.vue';
import { ref } from 'vue';
import { getNotifications } from '../assets/utils/utils';

export default {
    data: () => ({
        components: {
            favSnackbar
        },
        token: useCookie('token'),
        model: null,
        globalState: useGlobalState(),
        triggerSnackbar: false,
    }),
    mounted() {
        this.globalState.notifications.currentPage = 'index';
    },
    methods: {
        async getFavorites() {
            //@ts-ignore
            try {//
                const data = await useFetch('/api/controller/favorite', {
                    method: 'GET', query: {
                        one: 'false', orderField: 'productCode',
                        orderDir: 'asc',
                    },
                    headers: { 'token': this.token }
                })
                this.itemsFavorites = data
            } catch (err) {
                console.log(err);
            }
        }
    },
}
</script>
<style>
.title-offers-and-news {
    text-align: center;
    margin-top: 1%;
    margin-bottom: 1%;
    font-weight: 300;
    letter-spacing: 2px;
    font-size: 30px;
}

.v-slide-group__content {
    justify-content: center;
}

.brand-img {
    transition: transform 0.3s ease, color 0.3s ease;
}

.brand-img:hover {
    transform: scale(1.4);
    filter: initial !important;
}

a {
    color: white;
    /* Reemplaza #your-color por el color que desees */
}
</style>