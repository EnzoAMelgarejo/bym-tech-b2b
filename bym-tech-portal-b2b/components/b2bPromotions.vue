<script setup lang="ts">
</script>
<template>
    <div>
        <div v-for="item in itemsPromotions " :key="item.id">
            <b2bPromotionCard :itemSlot="item" v-if="(globalState.role == 'Admin' && item.status == 1) || item.status == 2 " />
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        itemsPromotions: {
            type: Array,
            default: {}
        }
    },
    data: () => ({
        token: useCookie('token'),
        globalState: useGlobalState(),
    }),
    methods: {
    },
}
</script>