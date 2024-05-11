<script setup lang="ts">
import { storeToRefs } from "pinia";
import PostHomeActions from "./PostHomeActions.vue";
import PostHomeBottom from "./PostHomeBottom.vue";
import PostHomeHeader from "./PostHomeHeader.vue";
import PostHomeSwiper from "./PostHomeSwiper.vue";
import { IPost } from "@/types";
import { useUserStore } from "@/store";
import { viewedPost } from "@/services/post";

const props = defineProps<{
  post: IPost;
}>();

const { user } = storeToRefs(useUserStore());

const handleEnter = async () => {
  if (user.value && !props.post.viewers.includes(user.value.id)) {
    const data = await viewedPost(props.post.id);
    if (data.success) props.post.viewers.push(user.value.id);
  }
};
</script>

<template>
  <div
    v-intersect="{ handle: handleEnter, options: { threshold: 0.3 } }"
    class="w-[min(470px,100vw)] pb-4 mb-4 border-b border-borderColor"
  >
    <PostHomeHeader :post="post" />
    <PostHomeSwiper :post="post" />
    <div>
      <PostHomeActions :post="post" />
      <PostHomeBottom :post="post" />
    </div>
  </div>
</template>
