<script setup lang="ts">
import Modal from "./Modal.vue";
import PostHeader from "@/components/Pages/Post/PostHeader.vue";
import PostComments from "@/components/Pages/Post/PostComments.vue";
import PostActions from "@/components/Pages/Post/PostActions.vue";
import CommentInput from "@/components/Pages/Post/CommentInput.vue";
import PostSwiper from "@/components/Pages/Post/PostSwiper.vue";

import { watch } from "vue";
import { storeToRefs } from "pinia";
import { usePostStore, useResizeStore, useUserStore } from "@/store";
import { getPostById, viewedPost } from "@/services/post";
import { useRouter } from "vue-router";

const { postIdModal, post } = storeToRefs(usePostStore());
const { screen } = storeToRefs(useResizeStore());
const { user } = storeToRefs(useUserStore());

const router = useRouter();

const hanldeCancel = () => {
  postIdModal.value = null;
  router.back();
};

watch(
  postIdModal,
  async () => {
    if (postIdModal.value) {
      post.value = null;
      const data = await getPostById(postIdModal.value);
      if (data.success) {
        post.value = data.result!.post;
        history.pushState({}, "", `/p/${post.value.id}`);

        if (user.value && !post.value.viewers.includes(user.value.id)) {
          const data = await viewedPost(post.value.id);
          if (data.success) post.value.viewers.push(user.value.id);
        }
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <Modal :isShow="!!postIdModal" @clickOutside="hanldeCancel">
    <div
      v-if="post"
      class="flex flex-col max-h-full min-[768px]:max-h-[450px] min-[1160px]:max-h-max h-[calc(100vh-40px)] min-[736px]:flex-row max-w-[calc(100vw-128px)] mx-auto box-content bg-bgColor-primary rounded-lg border border-borderColor overflow-x-hidden overflow-y-auto"
    >
      <div
        v-if="screen != 'mobile'"
        class="bg-black h-full aspect-square"
        :style="{ aspectRatio: post.ratio }"
      >
        <div class="">
          <PostSwiper />
        </div>
      </div>
      <div
        class="flex flex-col w-[400px] min-h-[450px] min-[1160px]:w-[500px] flex-shrink-0 border-l-0 min-[736px]:border-l border-borderColor box-content"
      >
        <PostHeader />
        <PostComments v-if="screen != 'mobile'" />
        <PostSwiper v-else />
        <PostActions />
        <CommentInput />
      </div>
    </div>
  </Modal>
</template>
