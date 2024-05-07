<script setup lang="ts">
import Post from "@/components/Pages/Post/Post.vue";
import PostReviewItem from "@/components/Pages/Profile/PostReviewItem.vue";
import { getOtherPostsByAuthor } from "@/services/post";

import { usePostStore, useUserStore } from "@/store";
import { IPost } from "@/types";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const { post } = storeToRefs(usePostStore());
const { user } = storeToRefs(useUserStore());
const otherPosts = ref<IPost[]>([]);

watch(
  post,
  async (newPost) => {
    if (newPost) {
      const data = await getOtherPostsByAuthor(newPost.id, newPost.author.id);
      if (data.success) otherPosts.value = data.result!.posts;
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="flex-1 w-[calc(100%-40px)] max-w-[975px] py-6 px-5 mx-auto">
    <Post />
    <div v-if="user?.id != post?.author.id" class="mt-12 pt-9 border-t border-borderColor">
      <div class="mb-5 text-textColor-secondary font-semibold">
        Thêm các bài viết từ
        <RouterLink
          :to="{ name: 'Profile', params: { username: post?.author?.username ?? ' ' } }"
          class="text-textColor-primary hover:opacity-60"
          >{{ post?.author?.username }}</RouterLink
        >
      </div>
      <div class="flex flex-wrap -mx-[2px]">
        <PostReviewItem
          class="w-1/3 px-[2px] mb-1"
          v-for="post in otherPosts"
          :key="post.id"
          :post="post"
        />
      </div>
    </div>
  </div>
</template>
