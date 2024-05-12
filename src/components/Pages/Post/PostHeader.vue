<script lang="ts" setup>
import EllipsisIcon from "@icons/ellipsis.svg";
import Avatar from "@/components/Common/Avatar.vue";
import UButton from "@/components/UI/UButton.vue";
import ConfirmPopup from "@/components/Popup/ConfirmPopup.vue";
import ActionsPopup from "@/components/Popup/ActionsPopup.vue";

import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { usePostStore, useUserStore } from "@/store";
import { IAction } from "@/types";
import { deletePost } from "@/services/post";
import { useRouter } from "vue-router";
import { useFollow, useHoverUser } from "@/composables";

const { hoverTrigger } = useHoverUser();

const router = useRouter();
const { isLoadingFollow, follow, unfollow } = useFollow();

const { post, updatePostModal } = storeToRefs(usePostStore());
const { user } = storeToRefs(useUserStore());
const deletePopupActive = ref(false);
const unfollowPopupActive = ref(false);
const actionsPopupActive = ref(false);

const userPostActions = computed(() => {
  if (post.value!.author.id == user.value?.id)
    return [
      {
        title: "Xóa",
        classes: "font-bold text-error",
        action: () => {
          deletePopupActive.value = true;
        },
      },
      {
        title: "Chỉnh sửa",
        action: () => {
          updatePostModal.value = true;
        },
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
        title: "Giới thiệu về tài khoản này",
      },
    ] as IAction[];
});

const handleClickFollow = async () => {
  if (user.value) {
    await follow(post.value!.author.id);
  }
};

const handleClickUnfollow = async () => {
  if (user.value) {
    unfollowPopupActive.value = false;
    await unfollow(post.value!.author.id);
  }
};

const handleDeletePost = async () => {
  deletePopupActive.value = false;
  const data = await deletePost(post.value!.id);
  if (data.success) router.push({ name: "Profile", params: { username: user.value?.username } });
};
</script>

<template>
  <div class="flex items-center justify-between border-b border-borderColor">
    <div class="flex items-center p-[10px]">
      <RouterLink :to="{ name: 'Profile', params: { username: post?.author.username } }">
        <Avatar
          width="32"
          :avatar-url="post?.author.avatar"
          @mouseenter="hoverTrigger($event, post!.author.id)"
        />
      </RouterLink>
      <div class="ml-3 font-semibold leading-none">
        <RouterLink
          :to="{ name: 'Profile', params: { username: post?.author.username } }"
          @mouseenter="hoverTrigger($event, post!.author.id)"
        >
          <span class="hover:opacity-60">{{ post?.author.username }}</span>
        </RouterLink>
        <template v-if="user && user.id != post!.author.id">
          <template v-if="user.followings.includes(post!.author.id)">
            <span class="mx-1">•</span>
            <UButton
              secondary
              variant="text"
              class="!p-0 text-textColor-primary"
              @click="
                () => {
                  unfollowPopupActive = true;
                }
              "
              :is-loading="isLoadingFollow"
              ><span>Đang theo dõi</span></UButton
            >
          </template>
          <template v-else>
            <span class="mx-1">•</span>
            <UButton
              primary
              variant="text"
              class="!p-0"
              @click="handleClickFollow"
              :is-loading="isLoadingFollow"
              ><span>Theo dõi</span></UButton
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
  <ConfirmPopup
    v-if="unfollowPopupActive"
    confirm-message="Bỏ theo dõi"
    @confirm="handleClickUnfollow"
    @cancel="
      () => {
        unfollowPopupActive = false;
      }
    "
  >
    <div class="flex flex-col flex-center">
      <Avatar width="90" :avatar-url="post?.author.avatar" />
      <span class="text-center mt-6"
        >Nếu đổi ý, bạn sẽ phải yêu cầu theo dõi lại @{{ post?.author.username }}.</span
      >
    </div>
  </ConfirmPopup>
  <ConfirmPopup
    v-if="deletePopupActive"
    title="Xóa bài viết?"
    desc="Bạn có chắc chắn muốn xóa bài viết này không?"
    confirm-message="Xóa"
    @confirm="handleDeletePost"
    @cancel="
      () => {
        deletePopupActive = false;
      }
    "
  />
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
