<script setup lang="ts">
import { addFavorite, getEndpoint } from '../assets/utils/utils'

const itemsCarousel = await getEndpoint('/api/controller/carousel?one=false&&orderField=order&orderDir=asc');
const itemsImagesGP1 = await getEndpoint('/api/controller/promotion?one=false&type=IMAGE_GROUP_1&orderField=order&orderDir=asc')

</script>
<template>
    <div>
        <!--Layout Elektron-->

        <template v-if="true">
            <b2bCarousel :itemsCarousel="itemsCarousel" />

            <v-row>
                <v-col cols="3" class="py-12 ml-12">
                    <v-list theme="light">
                        <v-list-item><v-list-item-title
                                class="font-weight-black text-center">Filtros</v-list-item-title></v-list-item>
                    </v-list>
                    <v-list theme="light">
                        <v-col v-for="(selection, i) in selectionsbrand" :key="selection.code" class="py-1 pe-0"
                            cols="auto">
                            <v-chip :disabled="loading" closable
                                @click:close="selectedbrand.splice(i, 1); refreshFilter()">
                                {{ selection.description }}
                            </v-chip>
                        </v-col>
                        <v-col v-for="(selection, i) in selections" :key="selection.code" class="py-1 pe-0" cols="auto">
                            <v-chip :disabled="loading" closable @click:close="selected.splice(i, 1); refreshFilter()">
                                {{ selection.description }}
                            </v-chip>
                        </v-col>
                        <v-col v-for="(selection, i) in selections2" :key="selection.code" class="py-1 pe-0"
                            cols="auto">
                            <v-chip :disabled="loading" closable @click:close="selected2.splice(i, 1); refreshFilter()">
                                {{ selection.description }}
                            </v-chip>
                        </v-col>
                        <v-col v-for="(selection, i) in selections3" :key="selection.code" class="py-1 pe-0"
                            cols="auto">
                            <v-chip :disabled="loading" closable @click:close="selected3.splice(i, 1); refreshFilter()">
                                {{ selection.description }}
                            </v-chip>
                        </v-col>
                        <v-col v-for="(selection, i) in selections4" :key="selection.code" class="py-1 pe-0"
                            cols="auto">
                            <v-chip :disabled="loading" closable @click:close="selected4.splice(i, 1); refreshFilter()">
                                {{ selection.description }}
                            </v-chip>
                        </v-col>
                    </v-list>
                    <v-divider></v-divider>
                    <v-expansion-panels multiple flat v-model="panel" class="mr-12">
                        <v-expansion-panel light style="background-color: white; color: currentColor;">
                            <v-expansion-panel-title class="font-weight-black text-center">{{ $t('brand')
                                }}</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-list density="compact" nav theme="light">
                                    <template v-for="itembrand in itemsBrand">
                                        <v-list-item :disabled="getDisabledButton(selectedbrand, itembrand)"
                                            @click="selectedbrand.push(itembrand); refreshFilter()"
                                            style="margin-left: 5%;">
                                            <v-list-item-title v-text="itembrand.description"
                                                class="text-grey-darken-3"></v-list-item-title>
                                        </v-list-item>
                                    </template>
                                </v-list>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                        <v-expansion-panel light style="background-color: white; color: currentColor;">
                            <v-expansion-panel-title class="font-weight-black text-center">{{ $t('filter1')
                                }}</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-list density="compact" nav theme="light">
                                    <template v-for="item1 in categorys">
                                        <v-list-item :disabled="getDisabledButton(selected, item1)"
                                            @click="selected.push(item1); refreshFilter()" style="margin-left: 5%;">
                                            <v-list-item-title v-text="item1.description"
                                                class="text-grey-darken-3"></v-list-item-title>
                                        </v-list-item>
                                    </template>
                                </v-list>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                        <v-expansion-panel light style="background-color: white; color: currentColor;">
                            <v-expansion-panel-title class="font-weight-black text-center">{{ $t('filter2')
                                }}</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-list density="compact" nav theme="light">
                                    <template v-for="item2 in itemsFilter2">
                                        <v-list-item :disabled="getDisabledButton(selected2, item2)"
                                            @click="selected2.push(item2); refreshFilter()" style="margin-left: 5%;">
                                            <v-list-item-title v-text="item2.description"
                                                class="text-grey-darken-3"></v-list-item-title>
                                        </v-list-item>
                                    </template>
                                </v-list>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                        <v-expansion-panel light style="background-color: white; color: currentColor;">
                            <v-expansion-panel-title class="font-weight-black text-center">{{ $t('filter3')
                                }}</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-list density="compact" nav theme="light">
                                    <template v-for="item3 in itemsFilter3">
                                        <v-list-item :disabled="getDisabledButton(selected3, item3)"
                                            @click="selected3.push(item3); refreshFilter()" style="margin-left: 5%;">
                                            <v-list-item-title v-text="item3.description"
                                                class="text-grey-darken-3"></v-list-item-title>
                                        </v-list-item>
                                    </template>
                                </v-list>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                        <v-expansion-panel light style="background-color: white; color: currentColor;">
                            <v-expansion-panel-title class="font-weight-black text-center">{{ $t('filter4')
                                }}</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-list density="compact" nav theme="light">
                                    <template v-for="item4 in itemsFilter4">
                                        <v-list-item :disabled="getDisabledButton(selected4, item4)"
                                            @click="selected4.push(item4); refreshFilter()" style="margin-left: 5%;">
                                            <v-list-item-title v-text="item4.description"
                                                class="text-grey-darken-3"></v-list-item-title>
                                        </v-list-item>
                                    </template>
                                </v-list>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                        <v-expansion-panel light style="background-color: white; color: currentColor;">
                            <v-expansion-panel-title class="font-weight-black text-center">{{ $t('price.range')
                                }}</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-list density="compact" nav theme="light">
                                    <v-range-slider v-model="range" :max="999999" :min="0" :step="1"
                                        @change="refreshFilter()" class="align-center" style="margin-top: 10%;"
                                        thumb-label="always" hide-details>
                                    </v-range-slider>
                                </v-list>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-container class="mt-4">
                        <span class="font-weight-black text-h5">Mas buscados</span>
                        <v-list density="compact" nav theme="light">
                            <template v-for="item in itemsMostSearched">
                                <v-list-item @click="" style="margin-left: 5%;">

                                    <v-row>
                                        <v-col cols="2">
                                            <v-avatar tile height="100%" size="100%">
                                                <v-img height="100%"
                                                    :src="item.img1 || './media/img/image-not-found.jpg'"></v-img>
                                            </v-avatar>
                                        </v-col>
                                        <v-col cols="6">
                                            <v-row>
                                                <v-col cols="12">
                                                    <span class="text-caption">{{ item.name }}</span>
                                                </v-col>
                                                <v-col cols="12">
                                                    <span class="text-subtitle-1 text-green">{{ item.price == 0 ? '-' :
                                                        Number(item.price ||
                                                            0).toLocaleString('es-AR',
                                                                {
                                                                    style:
                                                                        'currency', currency: item.coin || 'ARS'
                                                                }) }}</span>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>

                                </v-list-item>
                            </template>
                        </v-list>
                    </v-container>
                </v-col>
                <v-col cols="8">
                    <v-row>
                        <v-col cols="12">
                            <b2bImagesProm :page="'filter'" :itemsImages="itemsImagesGP1" />
                        </v-col>
                        <v-col cols="10">
                            <div style="margin-top: 20px; margin-bottom: 20px;">
                                <v-row>
                                    <v-col cols="9"></v-col>
                                    <v-col cols="3">
                                        <v-select v-model="selectOrderBy" :items="itemsOrder" item-title="title"
                                            label="Ordenar Por:" return-object @update:modelValue="refreshFilter()">
                                        </v-select>
                                    </v-col>
                                </v-row>
                            </div>

                            <v-container class="pa-1">

                                <v-item-group v-model="selection" multiple v-if="!waitFilter">
                                    <v-row>
                                        <v-col cols="12" class="text-center"
                                            style="margin-bottom: 20%;margin-top: 10% !important;"
                                            v-if="itemsProduct.length == 0">
                                            <div style="min-height: 100px; text-align: center;">
                                                <i class="mdi mdi-magnify" style="font-size: 48px; color: #888;"></i>
                                                <h3>{{ $t('no.matches.found') }}</h3>
                                                <p>{{ $t('no.matches.found.detail') }}</p>
                                            </div>
                                        </v-col>
                                        <v-col v-for="item in itemsProduct" :key="item.code" cols="12" md="4"
                                            v-if="itemsProduct.length > 0">
                                            <v-item v-slot="{ isSelected, toggle }">
                                                <b2bCardProduct :model="'Elektron'" :item="item"
                                                    style="margin: 5px !important;" />
                                            </v-item>
                                        </v-col>
                                    </v-row>
                                </v-item-group>
                                <v-row style="margin-bottom: 20%;margin-top: 10% !important;" v-else>
                                    <v-col cols="12" class="text-center">
                                        <v-progress-circular indeterminate :size="80" :width="10"
                                            color="primary"></v-progress-circular>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <div style="margin-top: 20px; margin-bottom: 20px;">
                                <!--<v-row>
                        <v-col cols="auto" style="margin-left: 44%;">
                            <v-btn size="x-large" @click="continuePagination">{{ $t("view.more") }}</v-btn>
                        </v-col>
                        <v-col cols="5"></v-col>
                    </v-row>-->
                            </div>
                            <div style="height: 620px; background-color: #efefef" v-if="!waitFilter">
                                <v-row>
                                    <v-col cols="12">
                                        <div class="title-offers-and-news">
                                            {{ $t("we.recommend.the.following.products") }}
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-sheet class="mx-auto" max-width="85%" color="transparent">
                                        <v-slide-group class="pa-4" selected-class="bg-primary" show-arrows>
                                            <v-slide-group-item v-for="item in itemsRecommended " :key="item.code">
                                                <b2bCardProduct :item="item" style="padding: 5px;" />
                                            </v-slide-group-item>
                                        </v-slide-group>
                                    </v-sheet>
                                </v-row>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>

            </v-row>
        </template>
        <!--Layout tecnolab-->
        <template v-if="false">
            <v-row>
                <v-col cols="2">
                    <v-navigation-drawer light
                        style="top: 20% !important; background-color: lightgrey; color: currentColor;height: 80vh; overflow-y: auto;z-index: 0 !important;">
                        <v-divider></v-divider>
                        <v-list>
                            <v-list-item :title="$t('filter')"></v-list-item>
                        </v-list>
                        <v-divider></v-divider>
                        <v-list>
                            <v-col v-for="(selection, i) in selectionsbrand" :key="selection.code" class="py-1 pe-0"
                                cols="auto">
                                <v-chip :disabled="loading" closable
                                    @click:close="selectedbrand.splice(i, 1); refreshFilter()">
                                    {{ selection.description }}
                                </v-chip>
                            </v-col>
                            <v-col v-for="(selection, i) in selections" :key="selection.code" class="py-1 pe-0"
                                cols="auto">
                                <v-chip :disabled="loading" closable
                                    @click:close="selected.splice(i, 1); refreshFilter()">
                                    {{ selection.description }}
                                </v-chip>
                            </v-col>
                            <v-col v-for="(selection, i) in selections2" :key="selection.code" class="py-1 pe-0"
                                cols="auto">
                                <v-chip :disabled="loading" closable
                                    @click:close="selected2.splice(i, 1); refreshFilter()">
                                    {{ selection.description }}
                                </v-chip>
                            </v-col>
                            <v-col v-for="(selection, i) in selections3" :key="selection.code" class="py-1 pe-0"
                                cols="auto">
                                <v-chip :disabled="loading" closable
                                    @click:close="selected3.splice(i, 1); refreshFilter()">
                                    {{ selection.description }}
                                </v-chip>
                            </v-col>
                            <v-col v-for="(selection, i) in selections4" :key="selection.code" class="py-1 pe-0"
                                cols="auto">
                                <v-chip :disabled="loading" closable
                                    @click:close="selected4.splice(i, 1); refreshFilter()">
                                    {{ selection.description }}
                                </v-chip>
                            </v-col>
                        </v-list>
                        <v-divider></v-divider>

                        <v-expansion-panels multiple>
                            <v-expansion-panel light style="background-color: #e4e1e1; color: currentColor;">
                                <v-expansion-panel-title>{{ $t('brand') }}</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-list density="compact" nav>
                                        <template v-for="itembrand in itemsBrand">
                                            <v-list-item :disabled="getDisabledButton(selectedbrand, itembrand)"
                                                @click="selectedbrand.push(itembrand); refreshFilter()"
                                                style="margin-left: 5%;">
                                                <v-list-item-title v-text="itembrand.description"></v-list-item-title>
                                            </v-list-item>
                                        </template>
                                    </v-list>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                            <v-expansion-panel light style="background-color: #e4e1e1; color: currentColor;">
                                <v-expansion-panel-title>{{ $t('filter1') }}</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-list density="compact" nav>
                                        <template v-for="item1 in categorys">
                                            <v-list-item :disabled="getDisabledButton(selected, item1)"
                                                @click="selected.push(item1); refreshFilter()" style="margin-left: 5%;">
                                                <v-list-item-title v-text="item1.description"></v-list-item-title>
                                            </v-list-item>
                                        </template>
                                    </v-list>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                            <v-expansion-panel light style="background-color: #e4e1e1; color: currentColor;">
                                <v-expansion-panel-title>{{ $t('filter2') }}</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-list density="compact" nav>
                                        <template v-for="item2 in itemsFilter2">
                                            <v-list-item :disabled="getDisabledButton(selected2, item2)"
                                                @click="selected2.push(item2); refreshFilter()"
                                                style="margin-left: 5%;">
                                                <v-list-item-title v-text="item2.description"></v-list-item-title>
                                            </v-list-item>
                                        </template>
                                    </v-list>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                            <v-expansion-panel light style="background-color: #e4e1e1; color: currentColor;">
                                <v-expansion-panel-title>{{ $t('filter3') }}</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-list density="compact" nav>
                                        <template v-for="item3 in itemsFilter3">
                                            <v-list-item :disabled="getDisabledButton(selected3, item3)"
                                                @click="selected3.push(item3); refreshFilter()"
                                                style="margin-left: 5%;">
                                                <v-list-item-title v-text="item3.description"></v-list-item-title>
                                            </v-list-item>
                                        </template>
                                    </v-list>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                            <v-expansion-panel light style="background-color: #e4e1e1; color: currentColor;">
                                <v-expansion-panel-title>{{ $t('filter4') }}</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-list density="compact" nav>
                                        <template v-for="item4 in itemsFilter4">
                                            <v-list-item :disabled="getDisabledButton(selected4, item4)"
                                                @click="selected4.push(item4); refreshFilter()"
                                                style="margin-left: 5%;">
                                                <v-list-item-title v-text="item4.description"></v-list-item-title>
                                            </v-list-item>
                                        </template>
                                    </v-list>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                            <v-expansion-panel light style="background-color: #e4e1e1; color: currentColor;">
                                <v-expansion-panel-title>{{ $t('price.range') }}</v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-list density="compact" nav>
                                        <v-range-slider v-model="range" :max="999999" :min="0" :step="1"
                                            @change="refreshFilter()" class="align-center" style="margin-top: 10%;"
                                            thumb-label="always" hide-details>
                                        </v-range-slider>
                                    </v-list>
                                </v-expansion-panel-text>
                            </v-expansion-panel>

                        </v-expansion-panels>

                    </v-navigation-drawer>
                </v-col>
                <v-col cols="9">
                    <div style="margin-top: 20px; margin-bottom: 20px;">
                        <v-row>
                            <v-col cols="9"></v-col>
                            <v-col cols="3">
                                <v-select v-model="selectOrderBy" :items="itemsOrder" item-title="title"
                                    label="Ordenar Por:" return-object @update:modelValue="refreshFilter()">
                                </v-select>
                            </v-col>
                        </v-row>
                    </div>
                    <v-container class="pa-1">
                        <v-item-group v-model="selection" multiple v-if="!waitFilter">
                            <v-row>
                                <v-col cols="12" class="text-center"
                                    style="margin-bottom: 20%;margin-top: 10% !important;"
                                    v-if="itemsProduct.length == 0">
                                    <div style="min-height: 100px; text-align: center;">
                                        <i class="mdi mdi-magnify" style="font-size: 48px; color: #888;"></i>
                                        <h3>{{ $t('no.matches.found') }}</h3>
                                        <p>{{ $t('no.matches.found.detail') }}</p>
                                    </div>
                                </v-col>
                                <v-col v-for="item in itemsProduct" :key="item.code" cols="12" md="3"
                                    v-if="itemsProduct.length > 0">
                                    <v-item v-slot="{ isSelected, toggle }">
                                        <b2bCardProduct :item="item" style="margin: 5px !important;" />
                                    </v-item>
                                </v-col>
                            </v-row>
                        </v-item-group>
                        <v-row style="margin-bottom: 20%;margin-top: 10% !important;" v-else>
                            <v-col cols="12" class="text-center">
                                <v-progress-circular indeterminate :size="80" :width="10"
                                    color="primary"></v-progress-circular>
                            </v-col>
                        </v-row>
                    </v-container>
                    <div style="margin-top: 20px; margin-bottom: 20px;">
                        <!--<v-row>
                        <v-col cols="auto" style="margin-left: 44%;">
                            <v-btn size="x-large" @click="continuePagination">{{ $t("view.more") }}</v-btn>
                        </v-col>
                        <v-col cols="5"></v-col>
                    </v-row>-->
                    </div>
                    <div style="height: 620px; background-color: #efefef" v-if="!waitFilter">
                        <v-row>
                            <v-col cols="12">
                                <div class="title-offers-and-news">
                                    {{ $t("we.recommend.the.following.products") }}
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-sheet class="mx-auto" max-width="85%" color="transparent">
                                <v-slide-group class="pa-4" selected-class="bg-primary" show-arrows>
                                    <v-slide-group-item v-for="item in itemsRecommended " :key="item.code">
                                        <b2bCardProduct :item="item" style="padding: 5px;" />
                                    </v-slide-group-item>
                                </v-slide-group>
                            </v-sheet>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </template>
    </div>
</template>
<script lang="ts">
export default {
    data: () => ({
        panel: [0, 1, 2, 3, 4, 5],
        model: null,
        token: useCookie('token'),
        globalState: useGlobalState(),
        itemsProduct: [],
        selectOrderBy: { title: 'Nombre Ascendente', field: "code", order: "asc" },
        itemsCategorys: [],
        itemsBrand: [],
        itemsFilter2: [],
        itemsFilter3: [],
        itemsFilter4: [],
        itemsRecommended: [],
        itemsOrder: [
            { title: 'Nombre ascendente', field: "code", order: "asc" },
            { title: 'Nombre descendente', field: "code", order: "desc" },
            { title: 'Precio más bajo primero', field: "price", order: "asc" },
            { title: 'Precio más alto primero', field: "price", order: "desc" }
        ],
        selection: [],
        loading: false,
        waitFilter: true,
        search: '',
        max: 120000,
        min: 0,
        slider: null,
        range: [0, 999999],
        selectedbrand: [],
        selected: [],
        selected2: [],
        selected3: [],
        selected4: [],
        page: 1,
        recordsPerPage: 12,
        endRecords: false,
        itemsMostSearched: []
    }),
    async created() {
        if (this.$route.query.category) {
            this.selected = [];
            this.selectedbrand = [];
            this.selected2 = [];
            this.selected3 = [];
            this.selected4 = [];
            await this.refreshSubFilter(this.$route.query);
            await this.refreshBrandFilter();
        }
        await this.getMostSearched()
        this.globalState.notifications.currentPage = 'filter';
        await this.refreshFilter();
        await this.getRecommended();
        window.addEventListener('scroll', await this.handleScroll);
    },
    async beforeUnmount() {
        window.removeEventListener('scroll', await this.handleScroll);
    },
    async updated() {
        if (this.$route.query.category) {
            this.selected = [];
            this.selectedbrand = [];
            this.selected2 = [];
            this.selected3 = [];
            this.selected4 = [];
            await this.refreshSubFilter(this.$route.query);
            await this.refreshBrandFilter();

        }
        this.refreshFilter();
        this.getRecommended();
    },
    computed: {
        categorys() {
            return this.itemsCategorys;
        },
        selectionsbrand() {
            const selections = []
            for (const selection of this.selectedbrand) {
                selections.push(selection)
            }
            return selections;
        },
        selections() {
            const selections = []
            for (const selection of this.selected) {
                selections.push(selection)
            }
            return selections;
        },
        selections2() {
            const selections = []
            for (const selection of this.selected2) {
                selections.push(selection)
            }
            return selections;
        },
        selections3() {
            const selections = []
            for (const selection of this.selected3) {
                selections.push(selection)
            }
            return selections;
        },
        selections4() {
            const selections = []
            for (const selection of this.selected4) {
                selections.push(selection)
            }
            return selections;
        },
    },
    watch: {
        selected() {
            this.search = ''
            this.refreshFilter();
        },
        'globalState.notifications.searchIndex': function () {
            this.refreshFilter();
        }
    },
    methods: {
        next() {
            this.loading = true
            setTimeout(() => {
                this.search = ''
                this.selected = []
                this.selected2 = [];
                this.selected3 = [];
                this.selected4 = [];
                this.loading = false
            }, 2000)
        },

        async handleScroll() {
            const bottomOfPage =
                window.innerHeight + window.scrollY >= (document.body.offsetHeight * 0.90);

            if (bottomOfPage) {
                if (this.endRecords == false) {
                    await this.continuePagination(); //Se comenta porque da errores.
                }
            }
        },
        async getMostSearched() {
            try {
                const filterJson = {
                    model: "PRODUCT",
                    filters: [{
                        code: 'code',
                        type: 'LIST',
                        list: []
                    }]
                }
                const headers = {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                }
                const mostSearched = await $fetch('/api/controller/productInteraction', {
                    method: 'GET',
                    params: {  // Usa 'params' para los parámetros de query
                        one: false,
                        orderField: 'clicks',
                        orderDir: 'desc'
                    },
                    headers
                })

                mostSearched.forEach((elem: any) => {
                    filterJson.filters[0].list.push(elem.code)
                })
                const { data } = await useFetch('/api/sync/product?one=false&field=code&order=asc&offset=0&rows=5', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: filterJson
                });
                this.itemsMostSearched = data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async getRecommended() {
            try {
                const { data } = await useFetch('/api/sync/product?one=false&field=code&order=asc&offset=0&rows=5' + '&client=' + this.globalState.codClient, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: {}
                });
                this.itemsRecommended = data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async refreshFilter() {
            this.page = 1;
            this.waitFilter = true;
            const filter = await this.constructFilter(this.selected, this.selected2, this.selected3, this.selected4, this.selectedbrand);
            try {
                const { data } = await useFetch('/api/sync/product?one=false&field=' + this.selectOrderBy.field + '&order=' + this.selectOrderBy.order + '&offset=' + this.page + '&rows=' + this.recordsPerPage + '&client=' + this.globalState.codClient, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: filter
                });
                this.itemsProduct = data;
                this.waitFilter = false;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            await this.refreshSubFilter();
            await this.refreshBrandFilter();
            await this.refreshSubFilter2();
            await this.refreshSubFilter3();
            await this.refreshSubFilter4();
        },
        async continuePagination() {
            this.page += 1;
            var offset = (this.page - 1) * this.recordsPerPage;
            const filter = await this.constructFilter(this.selected, this.selected2, this.selected3, this.selected4, this.selectedbrand);
            try {
                const { data } = await useFetch('/api/sync/product?one=false&field=' + this.selectOrderBy.field + '&order=' + this.selectOrderBy.order + '&offset=' + this.page + '&rows=' + this.recordsPerPage + '&client=' + this.globalState.codClient, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: filter
                });

                var addRecords = data._rawValue;


                if (addRecords.length < this.recordsPerPage && addRecords[addRecords.length - 1].code != this.itemsProduct[this.itemsProduct.length - 1].code) {
                    this.endRecords = true;
                }

                addRecords.forEach(prod => {
                    this.itemsProduct.push(prod);
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async constructFilter(categ, filter2, filter3, filter4, filterbrand) {
            var filter = {
                model: 'PRODUCT',
                filters: []
            }

            var filterRange = { code: 'price', type: 'BETWEEN', value: '', list: [this.range[0], this.range[1]] }
            filter.filters.push(filterRange);

            var filterSearch = { code: 'search', type: 'LIKE', value: this.globalState.notifications.search, list: [] }

            filter.filters.push(filterSearch);

            if (filterbrand !== null && filterbrand.length > 0) {
                var brand = { code: 'brand', type: 'LIST', value: '', list: [] }

                filterbrand.forEach(value => {
                    brand.list.push(value.code);
                });

                filter.filters.push(brand);
            }

            if (categ !== null && categ.length > 0) {
                var filterCateg = { code: 'filter1', type: 'LIST', value: '', list: [] }

                categ.forEach(value => {
                    filterCateg.list.push(value.code);
                });

                filter.filters.push(filterCateg);
            }

            if (filter2 !== null && filter2.length > 0) {
                var filterCateg = { code: 'filter2', type: 'LIST', value: '', list: [] }

                filter2.forEach(value => {
                    filterCateg.list.push(value.code);
                });

                filter.filters.push(filterCateg);
            }

            if (filter3 !== null && filter3.length > 0) {
                var filterCateg = { code: 'filter3', type: 'LIST', value: '', list: [] }

                filter3.forEach(value => {
                    filterCateg.list.push(value.code);
                });

                filter.filters.push(filterCateg);
            }

            if (filter4 !== null && filter4.length > 0) {
                var filterCateg = { code: 'filter4', type: 'LIST', value: '', list: [] }

                filter4.forEach(value => {
                    filterCateg.list.push(value.code);
                });

                filter.filters.push(filterCateg);
            }

            return filter;
        },
        getDisabledButton(selected, item) {
            return selected.some(selectedItem => selectedItem.code === item.code);
        },
        async getParams(params) {
            if (params.filterJson !== undefined || params.filterJson !== null) {
                try {
                    var filter = JSON.parse(params.filterJson);
                    filter.filters.forEach(value => {
                        switch (value.code) {
                            case 'filter1':
                                const selectedItem1 = this.itemsCategorys.find(item => item.code === value.value);
                                if (selectedItem1) {
                                    this.selected.push(selectedItem1);
                                }
                                break;
                            case 'filter2':
                                const selectedItem2 = this.itemsFilter2.find(item => item.code === value.value);
                                if (selectedItem2) {
                                    this.selected2.push(selectedItem2);
                                }
                                break;

                            case 'filter3':
                                const selectedItem3 = this.itemsFilter3.find(item => item.code === value.value);
                                if (selectedItem3) {
                                    this.selected3.push(selectedItem3);
                                }
                                break;

                            case 'filter4':
                                const selectedItem4 = this.itemsFilter4.find(item => item.code === value.value);
                                if (selectedItem4) {
                                    this.selected4.push(selectedItem4);
                                }
                                break;

                            default:
                                break;
                        }
                    });
                } catch (e) {
                    console.log("Error de parseo JSON", e)
                }
            }
            else {
                if (params.filter1 !== undefined || params.filter1 !== null) {
                    const selectedItem = this.itemsCategorys.find(item => item.code === params.filter1);

                    // Si se encontró un objeto que coincide, agrégalo a this.selected
                    if (selectedItem) {
                        this.selected.push(selectedItem);
                    } else {
                        // Manejar el caso en que no se encuentra ningún objeto que coincida
                    }
                }
                if (params.filter2 !== undefined || params.filter2 !== null) {
                    const selectedItem = this.itemsFilter2.find(item => item.code === params.filter2);

                    // Si se encontró un objeto que coincide, agrégalo a this.selected
                    if (selectedItem) {
                        this.selected2.push(selectedItem);
                    } else {
                        // Manejar el caso en que no se encuentra ningún objeto que coincida
                    }
                }
                if (params.filter3 !== undefined || params.filter3 !== null) {
                    const selectedItem = this.itemsFilter3.find(item => item.code === params.filter3);

                    // Si se encontró un objeto que coincide, agrégalo a this.selected
                    if (selectedItem) {
                        this.selected3.push(selectedItem);
                    } else {
                        // Manejar el caso en que no se encuentra ningún objeto que coincida
                    }
                }
                if (params.filter4 !== undefined || params.filter4 !== null) {
                    const selectedItem = this.itemsFilter4.find(item => item.code === params.filter4);

                    // Si se encontró un objeto que coincide, agrégalo a this.selected
                    if (selectedItem) {
                        this.selected4.push(selectedItem);
                    } else {
                        // Manejar el caso en que no se encuentra ningún objeto que coincida
                    }
                }
            }
        },
        async refreshSubFilter(params) {
            try {
                const { data } = await useFetch('/api/sync/filter1?one=false&field=code&order=asc&offset=0&rows=100', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                this.itemsCategorys = data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async refreshBrandFilter() {
            try {
                const { data } = await useFetch('/api/sync/brand?one=false&field=code&order=asc&offset=0&rows=100', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                this.itemsBrand = data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async refreshSubFilter2() {
            const filter = {
                model: 'PRODUCT',
                filters: []
            }

            var filterCateg = { code: 'father', type: 'LIST', value: '', list: [] }

            this.selected.forEach(value => {
                filterCateg.list.push(value.code);
            });

            if (this.selected.length > 0) {
                filter.filters.push(filterCateg);
            }

            try {
                const { data } = await useFetch('/api/sync/filter2?one=false&field=code&order=asc&offset=0&rows=100', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: filter
                });
                this.itemsFilter2 = data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async refreshSubFilter3() {
            const filter = {
                model: 'PRODUCT',
                filters: []
            }

            var filterCateg = { code: 'father', type: 'LIST', value: '', list: [] }

            this.selected2.forEach(value => {
                filterCateg.list.push(value.code);
            });

            if (this.selected2.length > 0) {
                filter.filters.push(filterCateg);
            }

            try {
                const { data } = await useFetch('/api/sync/filter3?one=false&field=code&order=asc&offset=0&rows=100', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: filter
                });
                this.itemsFilter3 = data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async refreshSubFilter4() {
            const filter = {
                model: 'PRODUCT',
                filters: []
            }

            var filterCateg = { code: 'father', type: 'LIST', value: '', list: [] }

            this.selected3.forEach(value => {
                filterCateg.list.push(value.code);
            });

            if (this.selected3.length > 0) {
                filter.filters.push(filterCateg);
            }

            try {
                const { data } = await useFetch('/api/sync/filter4?one=false&field=code&order=asc&offset=0&rows=100', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: filter
                });
                this.itemsFilter4 = data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
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
</style>