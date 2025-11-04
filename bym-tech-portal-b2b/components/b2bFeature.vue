<script setup lang="ts">
</script>
<template>
    <div style="height: 120px; background-color: #dddddd">
        <v-row>
            <v-col cols="3"></v-col>
            <v-col cols="1" v-for="item in itemsFeature" :key="item.id">
                <div
                    style="width: 100px; justify-content: center; text-align: center;margin-left: 20%;margin-right: 20%;">
                    <div>
                        <div class=" ml0 mr0 pl0 pr0 flex flex-column h-100 w-100">
                            <div class="vtex-flex-layout-0-x-flexColChild pb0" style="height: 30%;"><a :href="item.url"
                                    title="" rel="" class="vtex-store-components-3-x-imageElementLink"><img title=""
                                        sizes="" srcset="" :src="item.img" alt=""
                                        class="vtex-store-components-3-x-imageElement" loading="eager"
                                        crossorigin="anonymous" style="height: 33px;"></a></div>
                            <div class="vtex-flex-layout-0-x-flexColChild pb0" style="height: 30%; font-size: 14px;">
                                <div class="flex tl items-start justify-start t-body c-on-base">
                                    <div class="">
                                        <p class="">
                                            {{ item.title }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="pb0" style="height: 30%; font-size: 12px;">
                                <div class="items-start justify-start t-body c-on-base">
                                    <div>
                                        <p>
                                            {{ item.bio }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </v-col>
            <v-col cols="3"></v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        itemsFeature: {
            type: Array,
            default: {}
        }
    }
}
</script>