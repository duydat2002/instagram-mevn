<script setup lang="ts">
import EllipsisIcon from "@icons/ellipsis.svg";
import Avatar from "@/components/Common/Avatar.vue";
import UButton from "@/components/UI/UButton.vue";

import { followUser, unfollowUser } from "@/services/user";
import { useUserStore } from "@/store";
import { IAction, IPost } from "@/types";
import { storeToRefs } from "pinia";
import { ref, computed, onMounted } from "vue";

const props = defineProps<{
  post: IPost;
}>();

import { convertToFullDate, dateDistanceToNowMaxWeek } from "@/helpers";
import ActionsPopup from "@/components/Popup/ActionsPopup.vue";

const { user } = storeToRefs(useUserStore());

const isLoadingFollow = ref(false);
const actionsPopupActive = ref(false);
const isFollow = ref(user.value!.followings.includes(props.post.author.id));

const userPostActions = computed(() => {
  const actions = [
    {
      title: "Báo cáo",
      classes: "font-bold text-error",
    },
    {
      title: "Thêm vào mục ưa thích",
    },
    {
      title: "Đi đến bài viết",
    },
    {
      title: "Sao chép liên kết",
    },
    {
      title: "Nhúng",
    },
    {
      title: "Giới thiệu về tài khoản này",
    },
  ] as IAction[];

  return actions;
});

const follow = async () => {
  if (user.value) {
    isLoadingFollow.value = true;
    const data = await followUser(user.value.id, props.post.author.id);
    if (data.success) isFollow.value = true;

    isLoadingFollow.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center p-[10px]">
      <RouterLink :to="{ name: 'Profile', params: { username: post?.author.username } }">
        <Avatar width="32" :avatar-url="post?.author.avatar" />
      </RouterLink>
      <div class="ml-3 font-semibold leading-none">
        <RouterLink :to="{ name: 'Profile', params: { username: post?.author.username } }">
          <span class="hover:opacity-60">{{ post?.author.username }}</span>
        </RouterLink>
        <span
          class="text-sm text-textColor-secondary cursor-pointer"
          :title="convertToFullDate(post!.createdAt).toUpperCase()"
        >
          • {{ dateDistanceToNowMaxWeek(post!.createdAt, false, false) }}</span
        >
        <template v-if="!isFollow">
          <span class="mx-1 text-textColor-secondary">•</span>
          <UButton primary variant="text" class="!p-0" @click="follow" :is-loading="isLoadingFollow"
            ><span>Theo dõi</span></UButton
          >
        </template>
      </div>
    </div>
    <div class="p-2 cursor-pointer">
      <EllipsisIcon
        @click="
          () => {
            actionsPopupActive = true;
          }
        "
      />
    </div>
  </div>
  <ActionsPopup
    v-if="actionsPopupActive"
    :actions="userPostActions"
    @cancel="
      () => {
        actionsPopupActive = false;
      }
    "
  />
</template>
