<script lang="ts" setup>
import StoryList from "@/components/Molecules/Story/StoryList.vue";
import UserItem from "@/components/Molecules/User/UserItem.vue";
import PostHome from "@/components/Pages/Home/Post/PostHome.vue";
import UsersModal from "@/components/Modal/UsersModal.vue";
import Loading from "@/components/Common/Loading.vue";
import FriendSuggestion from "@/components/Pages/Home/FriendSuggestion/index.vue";
import PostSkeleton from "@/components/Skeleton/PostSkeleton.vue";
import HomeHeader from "@/components/Pages/Home/HomeHeader.vue";

import { ref, onBeforeMount } from "vue";
import { useUserStore, useUsersModalStore } from "@/store";
import { storeToRefs } from "pinia";
import { getNewFeeds } from "@/services/post";
import { IPost } from "@/types";

const { user } = storeToRefs(useUserStore());
const { isShow: isShowUsersModal } = storeToRefs(useUsersModalStore());

const newFeeds = ref<IPost[]>([]);
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

onBeforeMount(async () => {
  await getNewFeedFetch();
});
</script>

<template>
  <HomeHeader />
  <div class="w-full mt-[60px] min-[768px]:mt-0 flex min-h-screen justify-center">
    <div class="w-full max-w-[630px] mt-4">
      <StoryList class="py-2 mb-4" />
      <div v-if="newFeeds.length == 0" class="flex flex-col items-center">
        <PostSkeleton v-for="i in 5" :key="i" />
      </div>
      <div v-else v-infinite-scroll="getNewFeedFetch" class="flex flex-col items-center">
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
      <FriendSuggestion />
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
