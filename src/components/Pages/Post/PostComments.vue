<script lang="ts" setup>
import Comment from "@/components/Molecules/Comment/Comment.vue";
import Avatar from "@/components/Common/Avatar.vue";
import Loading from "@/components/Common/Loading.vue";
import ConfirmPopUpOnlyBtn from "@/components/Popup/ConfirmPopUpOnlyBtn.vue";

import { ref, watch } from "vue";
import { deleteComment, getPostComments } from "@/services/comment";
import { convertTagUser, convertToFullDate, dateDistanceToNowMaxWeek } from "@/helpers";
import { storeToRefs } from "pinia";
import { usePostStore } from "@/store";

const { deleteComment: deleteCommentStore } = usePostStore();
const { post, comments, removeComment, removeCommentPopup, reportCommentPopup } = storeToRefs(
  usePostStore()
);

const isLoading = ref(true);

const handleDeleteComment = async () => {
  if (removeComment.value) {
    const data = await deleteComment(removeComment.value);
    if (data.success) deleteCommentStore(removeComment.value);
  }
};

watch(
  post,
  async () => {
    const data = await getPostComments(post.value!.id);

    if (data.success) {
      comments.value = data.result!.comments;
    }
    isLoading.value = false;
  },
  { immediate: true }
);
</script>

<template>
  <div class="relative flex-grow border-b border-borderColor h-[200px] min-[736px]:h-auto">
    <div
      class="absolute top-0 left-0 w-full h-full flex flex-col p-[10px] no-scrollbar overflow-y-scroll"
    >
      <div class="flex pt-2 pb-4">
        <Avatar width="32" :avatar-url="post!.author.avatar" />
        <div class="flex flex-grow flex-col ml-3 mt-[2px]">
          <div class="">
            <RouterLink :to="{ name: 'Profile', params: { username: post!.author.username } }">
              <span class="font-semibold mr-1">{{ post!.author.username }}</span>
            </RouterLink>
            <div class="inline-flex items-center">
              <span class="leading-tight" v-html="convertTagUser(post!.caption)"></span>
            </div>
          </div>
          <span
            class="text-xs text-textColor-secondary cursor-pointer"
            :title="convertToFullDate(post!.createdAt).toUpperCase()"
            >{{ dateDistanceToNowMaxWeek(post!.createdAt, false, false) }}</span
          >
        </div>
      </div>
      <Loading v-if="isLoading" class="mt-10" />
      <Comment v-else v-for="comment in comments" :key="comment.id" :comment="comment" />
    </div>
  </div>
  <ConfirmPopUpOnlyBtn
    v-if="removeCommentPopup"
    confirm-message="Xóa"
    @confirm="handleDeleteComment"
    @cancel="
      () => {
        removeCommentPopup = false;
      }
    "
  />
  <ConfirmPopUpOnlyBtn
    v-if="reportCommentPopup"
    confirm-message="Báo cáo"
    @cancel="
      () => {
        reportCommentPopup = false;
      }
    "
  />
</template>
