<script lang="ts" setup>
import StoryList from "@/components/Molecules/Story/StoryList.vue";
import UserItem from "@/components/Molecules/User/UserItem.vue";
import PostHome from "@/components/Pages/Home/Post/PostHome.vue";
import UsersModal from "@/components/Modal/UsersModal.vue";

import { ref, onMounted } from "vue";
import { useUserStore, useUsersModalStore } from "@/store";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { getPostsIsFollow } from "@/services/post";
import { IPost } from "@/types";

const router = useRouter();
const { user } = storeToRefs(useUserStore());
const { isShow: isShowUsersModal } = storeToRefs(useUsersModalStore());
const newFeeds = ref<IPost[]>();

const handleLogout = async () => {
  const { logout } = useUserStore();

  await logout();
  router.go(0);
};

onMounted(async () => {
  const data = await getPostsIsFollow();
  if (data.success) {
    newFeeds.value = data.result!.posts;
  }
});
</script>

<template>
  <div class="flex-1 flex min-h-screen justify-center">
    <div class="w-full max-w-[630px] mt-4">
      <StoryList class="py-2 mb-4" />
      <div class="flex flex-col items-center">
        <PostHome v-for="post in newFeeds" :key="post.id" :post="post" />
      </div>
    </div>
    <div class="w-[320px] ml-16 flex flex-col mt-9">
      <UserItem :user="user!">
        <span class="text-xs font-semibold ml-3 text-buttonColor-primary hover:text-link"
          >Chuyển</span
        >
      </UserItem>
      <div class="flex flex-col mt-6">
        <div class="flex w-full px-4 items-center justify-between">
          <span class="text-sm font-semibold text-textColor-secondary">Gợi ý cho bạn</span>
          <RouterLink to="/" class="text-xs font-semibold text-textColor-primary hover:opacity-60"
            >Xem tất cả</RouterLink
          >
        </div>
        <div class="flex flex-col">
          <UserItem v-for="i in 5" :key="i" :user="user!">
            <span class="text-xs font-semibold ml-3 text-buttonColor-primary hover:text-link"
              >Theo dõi</span
            >
          </UserItem>
        </div>
      </div>
    </div>
  </div>
  <UsersModal
    v-if="isShowUsersModal"
    @cancel="
      () => {
        isShowUsersModal = false;
      }
    "
  />
</template>

<style>
.navigations > div {
  margin-bottom: 12px;
}
</style>
