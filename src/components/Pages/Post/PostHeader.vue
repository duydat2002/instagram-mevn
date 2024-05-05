<script lang="ts" setup>
import EllipsisIcon from "@icons/ellipsis.svg";
import Avatar from "@/components/Common/Avatar.vue";
import UButton from "@/components/UI/UButton.vue";

import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { usePostStore, useUserStore } from "@/store";
import { IAction, IPost } from "@/types";
import { checkIsFollowing } from "@/services/user";

const { post } = storeToRefs(usePostStore());

const { user } = storeToRefs(useUserStore());
const isLoadingFollow = ref(false);
const unfollowPopupActive = ref(false);
const actionsPopupActive = ref(false);
const isFollow = ref(false);

const userPostActions = computed(() => {
  if (post.value!.author.id == user.value!.id)
    return [
      {
        title: "Xóa",
        classes: "font-bold text-error",
        action: () => {},
      },
      {
        title: "Chỉnh sửa",
      },
      {
        title: "Hiển thị lượt thích",
      },
      {
        title: "Tắt tính năng bình luận",
      },
      {
        title: "Chia sẻ lên...",
      },
      {
        title: "Sao chép liên kết",
      },
      {
        title: "Nhúng",
      },
      {
        title: "Hủy",
        action: () => {
          actionsPopupActive.value = false;
        },
      },
    ] as IAction[];
  else
    return [
      {
        title: "Báo cáo",
        classes: "font-bold text-error",
      },
      {
        title: "Bỏ theo dõi",
        classes: "font-bold text-error",
        action: () => {
          unfollowPopupActive.value = true;
        },
      },
      {
        title: "Thêm vào mục ưa thích",
      },
      {
        title: "Hủy",
        action: () => {
          actionsPopupActive.value = false;
        },
      },
    ] as IAction[];
});

const follow = async () => {
  if (user.value) {
    isLoadingFollow.value = true;
    isLoadingFollow.value = false;
  }
};

const unfollow = async () => {
  if (user.value) {
    unfollowPopupActive.value = false;
    isLoadingFollow.value = true;
    isLoadingFollow.value = false;
  }
};

onMounted(async () => {
  const data = await checkIsFollowing(post.value!.author.id);

  isFollow.value = !!data.result;
});
</script>

<template>
  <div class="flex items-center justify-between border-b border-borderColor">
    <div class="flex items-center p-[10px]">
      <RouterLink :to="{name: 'Profile', params: {username: user!.username}}">
        <Avatar width="32" :avatar-url="user!.avatar" />
      </RouterLink>
      <div class="ml-3 font-semibold leading-none">
        <RouterLink :to="{name: 'Profile', params: {username: user!.username}}">
          <span class="hover:opacity-60">{{ user!.username }}</span>
        </RouterLink>
        <template v-if="user && user.id != post!.author.id">
          <template v-if="isFollow">
            <span class="mx-1">•</span>
            <UButton
              secondary
              variant="text"
              class="!p-0"
              @click="
                () => {
                  unfollowPopupActive = true;
                }
              "
              :is-loading="isLoadingFollow"
              >Đang theo dõi</UButton
            >
          </template>
          <template v-else>
            <span class="mx-1">•</span>
            <UButton
              primary
              variant="text"
              class="!p-0"
              @click="follow"
              :is-loading="isLoadingFollow"
              >Theo dõi</UButton
            >
          </template>
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
  <!-- <UnfollowPopup
    v-if="unfollowPopupActive"
    :user="user!"
    :onConfirm="unfollow"
    :onCancel="
      () => {
        unfollowPopupActive = false
      }
    "
    :onClickOutside="
      () => {
        unfollowPopupActive = false
      }
    "
  />
  <ActionsPopup
    v-if="actionsPopupActive"
    :actions="userPostActions"
    :on-click-outside="
      () => {
        actionsPopupActive = false
      }
    "
  /> -->
</template>
