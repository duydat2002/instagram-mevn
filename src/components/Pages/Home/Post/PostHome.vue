<script setup lang="ts">
import PostHomeActions from "./PostHomeActions.vue";
import PostHomeBottom from "./PostHomeBottom.vue";
import PostHomeHeader from "./PostHomeHeader.vue";
import PostHomeSwiper from "./PostHomeSwiper.vue";
import { IPost } from "@/types";

defineProps<{
  post: IPost;
}>();
</script>

<template>
  <div class="w-[min(470px,100vw)]">
    <PostHomeHeader :post="post" />
    <PostHomeSwiper :post="post" />
    <div>
      <PostHomeActions :post="post" />
      <PostHomeBottom :post="post" />
    </div>
  </div>
</template>
