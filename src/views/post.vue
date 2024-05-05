<script setup lang="ts">
import Post from "@/components/Pages/Post/Post.vue";

import { useCommonStore } from "@/store";
import { onMounted } from "vue";

const { setTitle } = useCommonStore();
</script>
<template>
  <div class="flex-1 w-[calc(100%-40px)] max-w-[975px] py-6 px-5 mx-auto">
    <Post />
  </div>
</template>
