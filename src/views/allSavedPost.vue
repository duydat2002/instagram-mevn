<script setup lang="ts">
import BackIcon from "@icons/back.svg";
import PostReviewItem from "@/components/Pages/Profile/PostReviewItem.vue";
import Loading from "@/components/Common/Loading.vue";
import UButton from "@/components/UI/UButton.vue";

import { ref, onMounted } from "vue";
import { getSavedPosts } from "@/services/post";
import { IPost } from "@/types";
import { useRoute, useRouter } from "vue-router";
import Footer from "@/components/Layout/Footer.vue";

defineProps({});

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const posts = ref<IPost[]>([]);

const fetchPosts = async () => {
  isLoading.value = true;

  const data = await getSavedPosts();
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
  <div class="w-full max-w-[935px] h-full px-5 pt-[30px] mx-auto">
    <Loading v-if="isLoading" class="mt-10" />
    <div v-else class="mt-6 flex flex-col">
      <div
        class="flex items-center text-textColor-secondary cursor-pointer"
        @click="
          () => {
            router.push({ name: 'Saved' });
          }
        "
      >
        <BackIcon class="w-[18px] h-[18px] fill-textColor-secondary" />
        <span class="ml-1 text-sm">Đã lưu</span>
      </div>
      <div class="flex-1">
        <span class="ml-5 my-2 block w-full text-xl text-textColor-primary">Tất cả bài viết</span>
        <div class="flex flex-wrap min-h-[300px]">
          <PostReviewItem
            class="w-1/3 px-[2px] mb-1"
            v-if="posts.length > 0"
            v-for="post in posts"
            :key="post.id"
            :post="post"
          />
          <div v-else class="flex-1 flex flex-center">
            <div class="w-full max-w-[350px] mx-11 my-[60px] flex flex-col flex-center text-center">
              <img src="@/assets/images/BookmarkCircle.png" />
              <span class="my-4 text-3xl font-extrabold">Bắt đầu lưu</span>
              <span class="mb-4">Lưu ảnh và video vào bộ sưu tập của bạn.</span>
              <UButton variant="text" primary>Thêm vào bộ sưu tập</UButton>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>
