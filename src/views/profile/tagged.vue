<script lang="ts" setup>
import Loading from "@/components/Common/Loading.vue";

import { ref, onMounted } from "vue";
import { useUserStore } from "@/store";
import { storeToRefs } from "pinia";
import { getTaggedPostsByUserId } from "@/services/post";
import { IPost } from "@/types";
import PostReviewItem from "@/components/Pages/Profile/PostReviewItem.vue";

const { profileUser } = storeToRefs(useUserStore());
const isLoading = ref(false);
const posts = ref<IPost[]>([]);

const fetchPosts = async () => {
  isLoading.value = true;

  const data = await getTaggedPostsByUserId(profileUser.value!.id);
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
        <img src="@/assets/images/UserCircle.png" />
        <span class="my-6 text-3xl font-extrabold">Ảnh có mặt bạn</span>
        <span class="text-center"
          >Khi mọi người gắn thẻ bạn trong ảnh, ảnh sẽ xuất hiện tại đây.</span
        >
      </div>
    </div>
  </div>
</template>
