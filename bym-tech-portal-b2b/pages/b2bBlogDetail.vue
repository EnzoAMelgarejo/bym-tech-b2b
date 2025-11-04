<script setup lang="ts">
import { addFavorite, getEndpoint } from '../assets/utils/utils'
import { useRoute } from 'vue-router';
const route = useRoute();
const token= useCookie('token');


const blog= await getEndpoint('/api/controller/blog',{one:'true',id:route.query.id},token);

</script>
<template v-if="blog">
    <b2bBlog :blog="blog"></b2bBlog>
    <b2bComments :blog="blog"></b2bComments>

</template>
