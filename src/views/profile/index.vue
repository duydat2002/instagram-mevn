<script lang="ts">
import { getUserByUsername } from "@/services/user";
import { useUserStore } from "@/store";

export default {
  beforeRouteEnter: async function (to) {
    const data = await getUserByUsername(to.params.username as string);

    to.meta.data = data;
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

import { type PropType, ref, computed, watch, onBeforeMount } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { storeToRefs } from "pinia";
import { IServerData, IUser } from "@/types";
import { followUser, unfollowUser, getMutualFollowedBy } from "@/services/user";
import { formatNumberToSuffix } from "@/helpers";

const props = defineProps({
  data: {
    type: Object as PropType<IServerData<{ user: IUser }>>,
  },
});

const route = useRoute();

const { user } = storeToRefs(useUserStore());
const currentUser = ref<Nullable<IUser>>(props.data?.result?.user || null);
const mutualFollowed = ref<IUser[]>([]);
const isLoadingFollow = ref(false);
const isFollowed = ref(false);

const isSameUser = computed(() => {
  return (user.value && user.value?.id == currentUser.value!.id) as boolean;
});
const threeMutual = computed(() => mutualFollowed?.value.slice(0, 3));

const handleClickFollow = async () => {
  if (user.value) {
    isLoadingFollow.value = true;

    const data = await followUser(user.value.id, currentUser.value!.id);
    if (data.success) {
      currentUser.value?.followers.push(user.value.id);
      isFollowed.value = true;
    }

    isLoadingFollow.value = false;
  }
};

const handleClickUnfollow = async () => {
  if (user.value) {
    isLoadingFollow.value = true;

    const data = await unfollowUser(user.value.id, currentUser.value!.id);
    if (data.success) {
      const index = currentUser.value!.followers.indexOf(user.value.id);
      if (index != -1) currentUser.value?.followers.splice(index, 1);
      isFollowed.value = false;
    }

    isLoadingFollow.value = false;
  }
};

watch(
  currentUser,
  async (current) => {
    isFollowed.value = (user.value && current?.followers.includes(user.value.id)) as boolean;

    if (user.value && current && !isSameUser.value) {
      const mutualData = await getMutualFollowedBy(current.id, user.value.id);
      mutualFollowed.value = mutualData.result?.mutual || [];
      console.log("mutualData", mutualFollowed.value);
    }
  },
  { immediate: true }
);

onBeforeRouteUpdate(async (to, _from, next) => {
  const data = await getUserByUsername(to.params.username as string);

  currentUser.value = data.result?.user || null;

  if (data.success)
    to.meta.title = data.result?.user.fullname
      ? `${data.result.user.fullname} (@${data.result.user.username}) • Instagram`
      : `@${data.result?.user.username} • Instagram`;

  next();
});
</script>

<template>
  <div class="flex flex-col">
    <div class="flex-grow">
      <div v-if="currentUser" class="max-w-[935px] h-full px-5 pt-[30px] mx-auto">
        <div class="general">
          <div class="flex">
            <div class="flex-[1_1_0%]">
              <Avatar :avatarUrl="currentUser.avatar" width="150" class="mx-auto" />
            </div>
            <div class="flex-[2_1_0%] not-lastchild:mb-4">
              <div class="flex gap-x-5">
                <RouterLink :to="`/${currentUser.username}`" class="text-xl">{{
                  currentUser.username
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
                    formatNumberToSuffix(currentUser.posts.length)
                  }}</span>
                  bài viết
                </span>
                <component
                  :is="currentUser.followers.length == 0 ? 'span' : 'RouterLink'"
                  to="/"
                  class=""
                >
                  <span class="font-semibold">{{
                    formatNumberToSuffix(currentUser.followers.length)
                  }}</span>
                  người theo dõi
                </component>
                <component
                  :is="currentUser.followings.length == 0 ? 'span' : 'RouterLink'"
                  to="/"
                  class=""
                >
                  Đang theo dõi
                  <span class="font-semibold">{{
                    formatNumberToSuffix(currentUser.followings.length)
                  }}</span>
                  người dùng
                </component>
              </div>
              <div class="flex flex-col gap-y-3">
                <span v-if="currentUser.fullname" class="font-semibold">{{
                  currentUser.fullname
                }}</span>
                <span v-if="currentUser.bio" class="">{{ currentUser.bio }}</span>
              </div>
              <span
                v-if="mutualFollowed.length != 0"
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
              </span>
            </div>
          </div>
          <div class=""></div>
        </div>
        <div class="mt-10 border-t border-borderColor">
          <div class="flex flex-center mt-[-1px] not-lastchild:mr-[60px]">
            <RouterLink
              :to="{ name: 'Posts' }"
              class="flex flex-center h-[52px] border-t border-transparent has-[exact-link-active]:border-black"
            >
              <GridIcon
                class="w-3 h-3 text-textColor-secondary fill-textColor-secondary parent-[.exact-link-active]:text-textColor-primary parent-[.exact-link-active]:fill-textColor-primary"
              />
              <span
                class="ml-[6px] text-textColor-secondary parent-[.exact-link-active]:text-textColor-primary"
                >Bài viết</span
              >
            </RouterLink>
            <RouterLink
              :to="{ name: 'Saved' }"
              class="flex flex-center h-[52px] border-t border-transparent has-[exact-link-active]:border-black"
            >
              <BookmarkIcon
                class="w-3 h-3 text-textColor-secondary fill-textColor-secondary parent-[.exact-link-active]:text-textColor-primary parent-[.exact-link-active]:fill-textColor-primary"
              />
              <span
                class="ml-[6px] text-textColor-secondary parent-[.exact-link-active]:text-textColor-primary"
                >Đã lưu</span
              >
            </RouterLink>
            <RouterLink
              :to="{ name: 'Tagged' }"
              class="flex flex-center h-[52px] border-t border-transparent has-[exact-link-active]:border-black"
            >
              <TagIcon
                class="w-3 h-3 text-textColor-secondary fill-textColor-secondary parent-[.exact-link-active]:text-textColor-primary parent-[.exact-link-active]:fill-textColor-primary"
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
