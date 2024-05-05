<script lang="ts" setup>
import Loading from "@/components/Common/Loading.vue";
import UButton from "@/components/UI/UButton.vue";

import { ref, onMounted } from "vue";
import { useUserStore } from "@/store";
import { storeToRefs } from "pinia";
import { getSavedPosts } from "@/services/post";
import { IPost } from "@/types";
import { useRouter } from "vue-router";

const router = useRouter();

const { profileUser } = storeToRefs(useUserStore());
const isLoading = ref(false);
const posts = ref<IPost[]>([]);

const fetchPosts = async () => {
  isLoading.value = true;

  const data = await getSavedPosts();
  if (data.success) {
    posts.value = data.result!.posts.slice(0, 4);
  }

  isLoading.value = false;
};

onMounted(async () => {
  await fetchPosts();
});
</script>

<template>
  <div class="flex flex-col flex-center">
    <div class="flex items-center justify-between w-full mt-8 mb-4">
      <span class="text-xs text-textColor-secondary">Chỉ mình bạn có thể xem mục mình đã lưu</span>
      <UButton variant="text"
        ><span class="text-buttonColor-primary hover:text-buttonColor-primary-hover"
          >+ Bộ sưu tập mới</span
        ></UButton
      >
    </div>
    <div
      class="relative w-[300px] h-[300px]"
      @click="
        () => {
          router.push({ name: 'AllSavedPost' , params: { userId: profileUser!.id }});
        }
      "
    >
      <div class="flex flex-wrap">
        <div v-for="post in posts" :key="post.id" class="relative w-1/2 pt-[50%]">
          <img class="absolute top-0 left-0 w-full h-full object-cover" :src="post.contents[0]" />
        </div>
      </div>
      <div
        class="absolute flex items-end top-0 left-0 w-full h-full bg-[linear-gradient(to_top,rgba(38,38,38,.6),rgba(255,255,255,0))] hover:opacity-60 cursor-pointer"
      >
        <span class="w-full px-5 py-4 text-xl text-white text-center">Tất cả bài viết</span>
      </div>
    </div>
  </div>
</template>
