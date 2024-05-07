<script setup lang="ts">
import PostHeader from "./PostHeader.vue";
import PostSwiper from "./PostSwiper.vue";
import PostComments from "./PostComments.vue";
import PostActions from "./PostActions.vue";
import CommentInput from "./CommentInput.vue";
import UpdatePost from "@/components/Pages/CreatePost/UpdatePost.vue";

import { computed, onBeforeMount } from "vue";
import { getPostById } from "@/services/post";
import { useRoute } from "vue-router";
import { useCommonStore, usePostStore } from "@/store";
import { storeToRefs } from "pinia";

const { setTitle } = useCommonStore();

const route = useRoute();
const { post, updatePostModal } = storeToRefs(usePostStore());

const postContainerWidth = computed(() => {
  if (post.value!.ratio >= 1) {
    return { maxWidth: "935px" };
  } else {
    const widthTemp = 600 * post.value!.ratio + 335;
    return { maxWidth: Math.max(widthTemp, 480) + "px" };
  }
});

onBeforeMount(async () => {
  post.value = null;
  const data = await getPostById(route.params.postId as string);

  if (data.success) {
    post.value = data.result!.post;
    setTitle(post.value.caption != "" ? post.value.caption : "Instagram");
  }
});
</script>

<template>
  <div v-if="post" class="mx-auto" :style="postContainerWidth">
    <div
      class="flex flex-col min-[736px]:flex-row w-full mx-auto min-h-[480px] max-h-none min-[736px]:max-h-[600px] box-content border border-borderColor"
    >
      <div class="flex-grow flex items-center overflow-hidden">
        <PostSwiper />
      </div>
      <div
        class="flex flex-col w-full min-[736px]:w-[335px] flex-shrink-0 border-l-0 min-[736px]:border-l border-borderColor"
      >
        <PostHeader />
        <PostComments />
        <PostActions />
        <CommentInput v-if="true" />
        <div v-else class="py-2 px-4 text-textColor-secondary">
          <RouterLink :to="{ name: 'Login' }" class="text-buttonColor-primary hover:text-link"
            >Đăng nhập</RouterLink
          >
          <span> để thích hoặc bình luận.</span>
        </div>
      </div>
    </div>
    <UpdatePost
      v-if="updatePostModal"
      @cancel="
        () => {
          updatePostModal = false;
        }
      "
    />
  </div>
</template>
