<script lang="ts" setup>
import Loading from "@/components/Common/Loading.vue";
import UButton from "@/components/UI/UButton.vue";
import PostReviewItem from "@/components/Pages/Profile/PostReviewItem.vue";

import { ref, onMounted } from "vue";
import { useCreatePostStore, useUserStore } from "@/store";
import { storeToRefs } from "pinia";
import { getPostsByAuthor } from "@/services/post";
import { IPost } from "@/types";

const { user, profileUser } = storeToRefs(useUserStore());
const { isShowModal: showCreatePostModal } = storeToRefs(useCreatePostStore());
const isLoading = ref(false);
const posts = ref<IPost[]>([]);

const fetchPosts = async () => {
  isLoading.value = true;

  const data = await getPostsByAuthor(profileUser.value!.id);
  if (data.success) {
    posts.value = data.result!.posts;
  }

  isLoading.value = false;
};

onMounted(async () => {
  await fetchPosts();
});
</script>

<template>
  <div class="">
    <Loading v-if="isLoading" class="mt-10" />
    <div v-else-if="posts.length > 0" class="flex flex-wrap">
      <PostReviewItem
        class="w-1/3 px-[2px] mb-1"
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>
    <div v-else class="flex flex-center">
      <div class="w-full max-w-[350px] mx-11 my-[60px] flex flex-col flex-center text-center">
        <img src="@/assets/images/CameraCircle.png" />
        <template v-if="user?.id == profileUser?.id">
          <span class="my-6 text-3xl font-extrabold">Chia sẻ ảnh</span>
          <span class="mb-6"
            >Khi bạn chia sẻ ảnh, ảnh sẽ xuất hiện trên trang cá nhân của bạn.</span
          >
          <UButton
            variant="text"
            @click="
              () => {
                showCreatePostModal = true;
              }
            "
            >Chia sẻ ảnh đầu tiên của bạn</UButton
          >
        </template>
        <span v-else class="my-6 text-3xl font-extrabold">Chưa có bài viết</span>
      </div>
    </div>
  </div>
</template>
