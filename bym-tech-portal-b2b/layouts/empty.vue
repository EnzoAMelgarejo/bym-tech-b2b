<template>
    <v-app>
        <div class="video-container" v-if="config.login_background.value1">
            <video autoplay loop muted style="height:100%" class="video-background">
                <source :src="config.login_background.value1" type="video/mp4" style="width:100% !important;">
            </video>
        </div>
        <v-main>
            <slot />
        </v-main>
    </v-app>
</template>

<script lang="ts">
export default {
    data() {
        return {
            config:{
                login_background:{
                    value1:undefined
                }
            }
        };
    },
    async mounted() {
        this.config = await this.getConfiguration();
    },

    methods: {
        async getConfiguration() {
            try {
                const data = await $fetch('/api/controller/configuration', {
                    method: 'GET',
                    query: { id: 0, one: 'false', keys: ['social_media', 'background'] },
                })
                return data;
            } catch (err) {
                console.error(err);
            }
        }
    }
};
</script>

<style scoped>
.video-container {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
}

.video-background {
    position: absolute;
    top: 50%;
    left: 50%;
    width: auto;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    transform: translate(-50%, -50%);
    object-fit: fill;
}
</style>
