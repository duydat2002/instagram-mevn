<script lang="ts" setup>
import Loading from "@/components/Common/Loading.vue";
import UButton from "@/components/UI/UButton.vue";

import { ref, watch, onBeforeMount } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { useUserStore } from "@/store";
import { storeToRefs } from "pinia";
import { getPostsByAuthor } from "@/services/post";

const { user, profileUser } = storeToRefs(useUserStore());
const isLoading = ref(false);
const post = ref<any>();

const fetchPosts = async () => {
  isLoading.value = true;

  const data = await getPostsByAuthor(profileUser.value?.id || "");

  console.log(data);

  isLoading.value = false;
};

onBeforeRouteUpdate(async () => {
  await fetchPosts();
});

onBeforeMount(async () => {
  await fetchPosts();
});
</script>

<template>
  <div class="">
    <Loading v-if="isLoading" class="mt-10" />
    <template v-else>
      <div class="flex flex-center">
        <div class="w-full max-w-[350px] mx-11 my-[60px] flex flex-col flex-center text-center">
          <img src="@/assets/images/CameraCircle.png" />
          <template v-if="true">
            <span class="my-6 text-3xl font-extrabold">Chia sẻ ảnh</span>
            <span class="mb-6"
              >Khi bạn chia sẻ ảnh, ảnh sẽ xuất hiện trên trang cá nhân của bạn.</span
            >
            <UButton variant="text">Chia sẻ ảnh đầu tiên của bạn</UButton>
          </template>
          <span v-else class="my-6 text-3xl font-extrabold">Chưa có bài viết</span>
        </div>
      </div>
    </template>
  </div>
</template>
