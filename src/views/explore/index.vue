<script setup lang="ts">
import Loading from "@/components/Common/Loading.vue";
import PostReviewItem from "@/components/Pages/Profile/PostReviewItem.vue";
import Footer from "@/components/Layout/Footer.vue";

import { ref, onMounted } from "vue";
import { getExplores } from "@/services/post";
import { IPost } from "@/types";

const explores = ref<IPost[]>([]);
const isLoadExplores = ref(false);
const start = ref(0);
const outOfPost = ref(false);
const PAGE_SIZE = 9;

const getExploresFetch = async () => {
  if (!outOfPost.value) {
    isLoadExplores.value = true;

    const data = await getExplores(start.value, PAGE_SIZE);
    if (data.success) {
      const posts = data.result!.posts;
      if (posts.length > 0) {
        explores.value!.push(...posts);
        start.value += PAGE_SIZE;
      } else outOfPost.value = true;
    }

    isLoadExplores.value = false;
  }
};

onMounted(async () => {
  await getExploresFetch();
});
</script>

<template>
  <div class="w-full">
    <div v-infinite-scroll="getExploresFetch" class="flex w-full flex-wrap -mx-[2px]">
      <PostReviewItem class="w-1/3 p-[2px]" v-for="post in explores" :key="post.id" :post="post" />
    </div>
    <Loading v-if="isLoadExplores" class="mt-5" />
    <Footer class="mb-0 mt-20" />
  </div>
</template>
