<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify';

const { smAndDown } = useDisplay();

const getImageSrc = (item) => {
    // Detecta si es móvil o pantalla grande
    return smAndDown.value ? item.imgMobile : item.img;
};

const getHeight = (item) => {
    // Detecta si es móvil o pantalla grande
    return smAndDown.value ? '500px' : '680px';
};

const navigate = (path, query) => {
    if (query) {
        // Si hay un query, lo agregamos a la ruta
        useRouter().push({ path, query });
    } else {
        useRouter().push({ path });
    }
};

const globalState = useGlobalState();
</script>
<template>
    <v-carousel show-arrows="hover" cycle :height="getHeight()" hide-delimiter-background>
        <template v-slot:prev="{ props }">
            <v-icon color="black" size="85" @click="props.onClick">mdi-chevron-left</v-icon>
        </template>
        <template v-slot:next="{ props }">
            <v-icon color="black"  size="85" @click="props.onClick">mdi-chevron-right</v-icon>
        </template>
        <v-carousel-item v-for="(item, i) in itemsCarousel" :key="i" :src="getImageSrc(item)" cover>

            <v-container fill-height
                v-if="item.title.trim() != '' && item.bio.trim() != '' && ((globalState.role == 'Admin' && item.status == 1) || item.status == 2)">
                <v-row class="white--text mx-auto" style="margin-top: 10%">
                    <v-col cols="1"></v-col>
                    <v-col cols="4" class="white--text text-left">
                        <span>
                            <p class="animated fadeInUp display-3" style="font-size: 150%;">
                            <h2><b>{{ item.title }}</b></h2>
                            </p>
                        </span>
                    </v-col>
                    <v-col cols="7"></v-col>
                </v-row>
                <v-row class="white--text mx-auto" style="">
                    <v-col cols="1"></v-col>
                    <v-col cols="6" class="white--text text-left">
                        <v-sheet color="btnFavorite" height="100%" style="opacity: 0.5;">
                            <span>
                                <p class="animated fadeInUp delay-1s display-2" style="font-size: 150%; padding: 10px;">
                                    {{ item.bio }}
                                </p>
                            </span>
                        </v-sheet>
                    </v-col>
                    <v-col cols="5"></v-col>
                </v-row>
                <v-row class="white--text mx-auto" style="">
                    <v-col cols="1"></v-col>
                    <v-col cols="4" class="white--text text-left">
                        <span>
                            <p class="animated fadeInUp delay-1s display-1"> <v-btn color="btnQuote" variant="tonal"
                                    density="default" width="200%" v-if="item.link != ''"
                                    style="margin-top: 5% !important; font-size: 120%;"
                                    @click="this.$router.push({ path: item.link })">
                                    {{ 'Más información' }}
                                </v-btn>
                                <v-btn color="btnFavorite" variant="tonal" density="default" width="130%"
                                    v-if="item.link == ''" style="margin-top: 5% !important;"
                                    @click="this.$router.push({ path: '/filter', query: { filterJson: item.filterJson } })">
                                    {{ 'Más información' }}
                                </v-btn>
                            </p>
                        </span>
                        <br>
                    </v-col>
                    <v-col cols="7"></v-col>
                </v-row>
            </v-container>
            <v-container fill-height
                v-if="item.title.trim() == '' || item.bio.trim() == '' && ((globalState.role == 'Admin' && item.status == 1) || item.status == 2)">
                <v-row class="white--text mx-auto" style="margin-top: 10%">
                    <v-col cols="1"></v-col>
                    <v-col cols="4" class="white--text text-left">
                    </v-col>
                    <v-col cols="7"></v-col>
                </v-row>
                <v-row class="white--text mx-auto" style="">
                    <v-col cols="1"></v-col>
                    <v-col cols="6" class="white--text text-left">
                    </v-col>
                    <v-col cols="5"></v-col>
                </v-row>
                <v-row class="white--text mx-auto" style="">
                    <v-col cols="1"></v-col>
                    <v-col cols="4" class="white--text text-left">
                        <span>
                            <p class="animated fadeInUp delay-1s display-1">
                                <v-btn color="btnFavorite" variant="tonal" density="default" width="130%"
                                    v-if="item.link == ''" style="margin-top: 15% !important;"
                                    @click="this.$router.push({ path: '/filter', query: { filterJson: item.filterJson } })">
                                    {{ 'Encuentralos aquí' }}
                                </v-btn>
                            </p>
                        </span>
                        <br>
                    </v-col>
                    <v-col cols="7"></v-col>
                </v-row>
            </v-container>
        </v-carousel-item>
    </v-carousel>
</template>
<script lang="ts">
export default {
    props: {
        itemsCarousel: {
            type: Array,
            default: {}
        }
    }
}
</script>
<style>
.animated {
    -webkit-animation-duration: 2s;
    animation-duration: 2s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}

.animated.delay-1s {
    -webkit-animation-delay: 1s;
    animation-delay: 1s;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        -webkit-transform: translate3d(0, 100%, 0);
        transform: translate3d(0, 100%, 0);
    }

    to {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
    }
}

.fadeInUp {
    -webkit-animation-name: fadeInUp;
    animation-name: fadeInUp;
}
</style>