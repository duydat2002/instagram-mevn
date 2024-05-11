<script lang="ts" setup>
import StoryList from "@/components/Molecules/Story/StoryList.vue";
import UserItem from "@/components/Molecules/User/UserItem.vue";
import PostHome from "@/components/Pages/Home/Post/PostHome.vue";
import UsersModal from "@/components/Modal/UsersModal.vue";
import Loading from "@/components/Common/Loading.vue";

import { ref, onMounted } from "vue";
import { useUserStore, useUsersModalStore } from "@/store";
import { storeToRefs } from "pinia";
import { getNewFeeds } from "@/services/post";
import { IPost, IUser } from "@/types";
import { getFriendSuggestion } from "@/services/user";

const { user } = storeToRefs(useUserStore());
const { isShow: isShowUsersModal } = storeToRefs(useUsersModalStore());
const newFeeds = ref<IPost[]>([]);
const friendSuggest = ref<IUser[]>([]);
const isLoadNewFeed = ref(false);
const start = ref(0);
const outOfPost = ref(false);
const PAGE_SIZE = 5;

const getNewFeedFetch = async () => {
  if (!outOfPost.value) {
    isLoadNewFeed.value = true;

    const data = await getNewFeeds(start.value, PAGE_SIZE);
    if (data.success) {
      const posts = data.result!.posts;
      if (posts.length > 0) {
        newFeeds.value!.push(...posts);
        start.value += PAGE_SIZE;
      } else outOfPost.value = true;
    }

    isLoadNewFeed.value = false;
  }
};

onMounted(async () => {
  await getNewFeedFetch();
  const data = await getFriendSuggestion();
  if (data.success) friendSuggest.value = data.result!.users;
});
</script>

<template>
  <div class="w-full flex min-h-screen justify-center">
    <div class="w-full max-w-[630px] mt-4">
      <StoryList class="py-2 mb-4" />
      <div v-infinite-scroll="getNewFeedFetch" class="flex flex-col items-center">
        <PostHome v-for="post in newFeeds" :key="post.id" :post="post" />
        <Loading v-if="isLoadNewFeed" />
      </div>
    </div>
    <div class="hidden min-[1160px]:flex w-[320px] ml-16 flex-col mt-9">
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
          <UserItem v-for="suggest in friendSuggest" :key="suggest.id" :user="suggest" hasTrigger>
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
