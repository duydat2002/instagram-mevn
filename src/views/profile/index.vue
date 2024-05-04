<script lang="ts">
import { getUserByUsername } from "@/services/user";
import { useUserStore } from "@/store";

const { setProfileUser } = useUserStore();

export default {
  beforeRouteEnter: async function (to) {
    const data = await getUserByUsername(to.params.username as string);

    to.meta.data = data;

    setProfileUser(data.result?.user || null);

    if (data.success)
      to.meta.title = data.result?.user.fullname
        ? `${data.result.user.fullname} (@${data.result.user.username}) • Instagram`
        : `@${data.result?.user.username} • Instagram`;
  },
};
</script>

<script lang="ts" setup>
import SettingIcon from "@icons/setting.svg";
import EllipsisIcon from "@icons/ellipsis.svg";
import GridIcon from "@icons/grid.svg";
import BookmarkIcon from "@icons/bookmark.svg";
import TagIcon from "@icons/user-square.svg";

import Avatar from "@/components/Common/Avatar.vue";
import NotFound from "@/views/notFound.vue";
import Footer from "@/components/Layout/Footer.vue";
import UButton from "@/components/UI/UButton.vue";

import { ref, computed, watch } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { storeToRefs } from "pinia";
import { IUser } from "@/types";
import { followUser, unfollowUser, getMutualFollowedBy } from "@/services/user";
import { formatNumberToSuffix } from "@/helpers";

const { user, profileUser } = storeToRefs(useUserStore());
const mutualFollowed = ref<IUser[]>([]);
const isLoadingFollow = ref(false);
const isFollowed = ref(false);

const isSameUser = computed(() => {
  return (user.value && user.value?.id == profileUser.value!.id) as boolean;
});

const handleClickFollow = async () => {
  if (user.value) {
    isLoadingFollow.value = true;

    const data = await followUser(user.value.id, profileUser.value!.id);
    if (data.success) {
      profileUser.value?.followers.push(user.value.id);
      isFollowed.value = true;
    }

    isLoadingFollow.value = false;
  }
};

const handleClickUnfollow = async () => {
  if (user.value) {
    isLoadingFollow.value = true;

    const data = await unfollowUser(user.value.id, profileUser.value!.id);
    if (data.success) {
      const index = profileUser.value!.followers.indexOf(user.value.id);
      if (index != -1) profileUser.value?.followers.splice(index, 1);
      isFollowed.value = false;
    }

    isLoadingFollow.value = false;
  }
};

watch(
  profileUser,
  async (current) => {
    isFollowed.value = (user.value && current?.followers.includes(user.value.id)) as boolean;

    if (user.value && current && !isSameUser.value) {
      const mutualData = await getMutualFollowedBy(current.id);
      mutualFollowed.value = mutualData.result?.users || [];
    }
  },
  { immediate: true }
);

onBeforeRouteUpdate(async (to, from, next) => {
  if (to.params.username != from.params.username) {
    const data = await getUserByUsername(to.params.username as string);

    setProfileUser(data.result?.user || null);

    if (data.success)
      to.meta.title = data.result?.user.fullname
        ? `${data.result.user.fullname} (@${data.result.user.username}) • Instagram`
        : `@${data.result?.user.username} • Instagram`;
  }
  next();
});
</script>

<template>
  <div class="flex flex-col">
    <div class="flex-grow">
      <div v-if="profileUser" class="max-w-[935px] h-full px-5 pt-[30px] mx-auto">
        <div class="general">
          <div class="flex">
            <div class="flex-[1_1_0%]">
              <Avatar :avatarUrl="profileUser.avatar" width="150" class="mx-auto" />
            </div>
            <div class="flex-[2_1_0%] not-lastchild:mb-4">
              <div class="flex gap-x-5">
                <RouterLink :to="`/${profileUser.username}`" class="text-xl">{{
                  profileUser.username
                }}</RouterLink>
                <div class="flex">
                  <UButton v-if="isSameUser" secondary>Chỉnh sửa trang cá nhân</UButton>
                  <template v-else>
                    <UButton
                      v-if="!isFollowed"
                      class=""
                      primary
                      :isLoading="isLoadingFollow"
                      @click="handleClickFollow"
                    >
                      <span>Theo dõi</span>
                    </UButton>
                    <UButton
                      v-else
                      class=""
                      secondary
                      :isLoading="isLoadingFollow"
                      @click="handleClickUnfollow"
                    >
                      <span>Đang theo dõi</span>
                      <fa class="text-xs ml-1" :icon="['fas', 'chevron-down']" />
                    </UButton>
                  </template>
                </div>
                <div class="flex flex-center cursor-pointer">
                  <SettingIcon v-if="isSameUser" />
                  <EllipsisIcon v-else />
                </div>
              </div>
              <div class="flex text-base not-lastchild:mr-10">
                <span class="">
                  <span class="font-semibold">{{
                    formatNumberToSuffix(profileUser.posts.length)
                  }}</span>
                  bài viết
                </span>
                <component
                  :is="profileUser.followers.length == 0 ? 'span' : 'RouterLink'"
                  :to="{ name: 'Followers' }"
                  class=""
                >
                  <span class="font-semibold">{{
                    formatNumberToSuffix(profileUser.followers.length)
                  }}</span>
                  người theo dõi
                </component>
                <component
                  :is="profileUser.followings.length == 0 ? 'span' : 'RouterLink'"
                  :to="{ name: 'Followings' }"
                  class=""
                >
                  Đang theo dõi
                  <span class="font-semibold">{{
                    formatNumberToSuffix(profileUser.followings.length)
                  }}</span>
                  người dùng
                </component>
              </div>
              <div class="flex flex-col gap-y-3">
                <span v-if="profileUser.fullname" class="font-semibold">{{
                  profileUser.fullname
                }}</span>
                <span v-if="profileUser.bio" class="">{{ profileUser.bio }}</span>
              </div>
              <RouterLink
                v-if="!isFollowed && mutualFollowed.length != 0"
                :to="{ name: 'MutualFollowers' }"
                class="text-xs text-textColor-secondary cursor-pointer"
              >
                Có
                <span
                  v-for="mutual in mutualFollowed.slice(0, 3)"
                  :key="mutual.id"
                  class="font-medium text-textColor-primary"
                  >{{ mutual.username }}</span
                >
                <span v-if="mutualFollowed.length > 3">
                  và {{ mutualFollowed.length - 3 }} người khác theo dõi</span
                >
                <span v-else> theo dõi</span>
              </RouterLink>
            </div>
          </div>
          <div class=""></div>
        </div>
        <div class="mt-10 border-t border-borderColor">
          <div class="flex flex-center mt-[-1px] not-lastchild:mr-[60px]">
            <RouterLink
              :to="{ name: 'Posts' }"
              class="flex flex-center h-[52px] border-t border-transparent has-[exact-link-active]:border-textColor-primary"
            >
              <GridIcon
                class="w-3 h-3 text-textColor-secondary fill-textColor-secondary parent-[.exact-link-active]:text-textColor-primary"
              />
              <span
                class="ml-[6px] text-textColor-secondary parent-[.exact-link-active]:text-textColor-primary"
                >Bài viết</span
              >
            </RouterLink>
            <RouterLink
              v-if="user?.id == profileUser.id"
              :to="{ name: 'Saved' }"
              class="flex flex-center h-[52px] border-t border-transparent has-[exact-link-active]:border-textColor-primary"
            >
              <BookmarkIcon
                class="w-3 h-3 text-textColor-secondary fill-textColor-secondary parent-[.exact-link-active]:text-textColor-primary"
              />
              <span
                class="ml-[6px] text-textColor-secondary parent-[.exact-link-active]:text-textColor-primary"
                >Đã lưu</span
              >
            </RouterLink>
            <RouterLink
              :to="{ name: 'Tagged' }"
              class="flex flex-center h-[52px] border-t border-transparent has-[exact-link-active]:border-textColor-primary"
            >
              <TagIcon
                class="w-3 h-3 text-textColor-secondary fill-textColor-secondary parent-[.exact-link-active]:text-textColor-primary"
              />
              <span
                class="ml-[6px] text-textColor-secondary parent-[.exact-link-active]:text-textColor-primary"
                >Được gắn thẻ</span
              >
            </RouterLink>
          </div>
          <RouterView></RouterView>
          <RouterView name="modal"></RouterView>
        </div>
      </div>
      <NotFound v-else />
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.general svg {
  color: var(--primary-text-color);
  fill: var(--primary-text-color);
}
</style>
