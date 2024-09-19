<script setup lang="ts">
import EllipsisIcon from "@icons/ellipsis.svg";
import Avatar from "@/components/Common/Avatar.vue";
import UButton from "@/components/UI/UButton.vue";

import { useUserStore } from "@/store";
import { IAction, IPost } from "@/types";
import { storeToRefs } from "pinia";
import { ref, computed } from "vue";

const props = defineProps<{
  post: IPost;
}>();

import { convertToFullDate, dateDistanceToNowMaxWeek } from "@/helpers";
import ActionsPopup from "@/components/Popup/ActionsPopup.vue";
import { useFollow, useHoverUser } from "@/composables";

const { hoverTrigger } = useHoverUser();
const { isLoadingFollow, follow, unfollow } = useFollow();

const { user } = storeToRefs(useUserStore());

const actionsPopupActive = ref(false);

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

const handleClickFollow = async () => {
  if (user.value) {
    await follow(props.post.author.id);
  }
};
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center py-[10px]">
      <RouterLink :to="{ name: 'Profile', params: { username: post.author.username } }">
        <Avatar
          width="32"
          :avatar-url="post?.author.avatar"
          @mouseenter="hoverTrigger($event, post.author.id)"
        />
      </RouterLink>
      <div class="ml-3 font-semibold leading-none">
        <RouterLink
          :to="{ name: 'Profile', params: { username: post.author.username } }"
          @mouseenter="hoverTrigger($event, post.author.id)"
        >
          <span class="hover:opacity-60">{{ post?.author.username }}</span>
        </RouterLink>
        <RouterLink
          :to="{ name: 'Post', params: { postId: post.id } }"
          class="text-sm text-textColor-secondary cursor-pointer"
          :title="convertToFullDate(post!.createdAt).toUpperCase()"
        >
          • {{ dateDistanceToNowMaxWeek(post!.createdAt, false, false) }}</RouterLink
        >
        <template v-if="!user?.followings.includes(post.author.id) && user?.id != post.author.id">
          <span class="mx-1 text-textColor-secondary">•</span>
          <UButton
            primary
            variant="text"
            class="!p-0"
            @click="handleClickFollow"
            :is-loading="isLoadingFollow"
            ><span>Theo dõi</span></UButton
          >
        </template>
      </div>
    </div>
    <div class="cursor-pointer">
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
