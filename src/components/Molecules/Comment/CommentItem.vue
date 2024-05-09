<script lang="ts" setup>
import EllipsisIcon from "@icons/ellipsis.svg";
import LikeIcon from "@icons/heart.svg";
import LikeActiveIcon from "@icons/heart-active.svg";
import Avatar from "@/components/Common/Avatar.vue";

import { ref } from "vue";
import { storeToRefs } from "pinia";
import { usePostStore, useUserStore, useUsersModalStore } from "@/store";
import { dateDistanceToNowMaxWeek, convertToFullDate, convertTagUser } from "@/helpers";
import type { IComment, IReply, IUser } from "@/types";
import { getLikedUsersOfComment, likeComment, unlikeComment } from "@/services/comment";

const props = defineProps<{
  comment: IComment | IReply;
}>();

const { setReply } = usePostStore();

const { user } = storeToRefs(useUserStore());
const { removeComment, removeCommentPopup, reportCommentPopup, removeCommentRef } = storeToRefs(
  usePostStore()
);
const { isShow, title, users: usersLiked } = storeToRefs(useUsersModalStore());
const isLoadingLike = ref(false);
const item = ref<HTMLDivElement>();

const handleClickLikeCount = async () => {
  isShow.value = true;
  title.value = "Lượt thích";
  const data = await getLikedUsersOfComment(props.comment.id);
  if (data.success) {
    usersLiked.value = data.result!.users;
  }
};

const handleReply = () => {
  let commentId = props.comment.id; // comment is Comment
  // comment is Reply
  if ("comment" in props.comment) commentId = props.comment.comment;
  setReply(commentId, props.comment.author.username);
};

const handleLike = async () => {
  isLoadingLike.value = true;

  const data = await likeComment(props.comment.id);
  if (data.success) {
    props.comment.likes.push(user.value!.id);
  }

  isLoadingLike.value = false;
};

const handleUnlike = async () => {
  isLoadingLike.value = true;

  const data = await unlikeComment(props.comment.id);
  if (data.success) {
    props.comment.likes = props.comment.likes.filter((l) => l != user.value!.id);
  }

  isLoadingLike.value = false;
};

const handleClickEllipsis = (commentId: string) => {
  if (user.value?.id == props.comment.author.id) {
    removeCommentPopup.value = true;
    removeComment.value = commentId;
    removeCommentRef.value = item.value!;
  } else {
    reportCommentPopup.value = true;
  }
};
</script>

<template>
  <div ref="item" class="flex items-center group/comment mb-4 mt-2">
    <div class="">
      <Avatar width="32" :avatar-url="comment.author.avatar" />
    </div>
    <div class="flex flex-grow flex-col ml-3 mt-[2px]">
      <div class="">
        <RouterLink :to="{ name: 'Profile', params: { username: comment.author.username } }">
          <span class="font-semibold mr-1">{{ comment.author.username }}</span>
        </RouterLink>
        <div class="inline items-center whitespace-break-spaces">
          <span class="leading-tight" v-dompurify-html="convertTagUser(comment.content)"></span>
        </div>
      </div>
      <div class="flex flex-wrap items-center mt-1 text-xs text-textColor-secondary">
        <span
          class="mr-3 cursor-pointer"
          :title="convertToFullDate(comment.createdAt).toUpperCase()"
          >{{ dateDistanceToNowMaxWeek(comment.createdAt, false, false) }}</span
        >
        <span
          v-if="comment.likes.length > 0"
          class="font-semibold mr-3 cursor-pointer"
          @click="handleClickLikeCount"
          >{{ comment.likes.length }} lượt thích</span
        >
        <span class="font-semibold mr-5 cursor-pointer" @click="handleReply">Trả lời</span>
        <div class="relative w-4 h-4 invisible group-hover/comment:visible cursor-pointer">
          <EllipsisIcon
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-textColor-secondary fill-textColor-secondary"
            @click="handleClickEllipsis(comment.id)"
          />
        </div>
      </div>
    </div>
    <div class="ml-1 cursor-pointer">
      <LikeIcon
        v-if="!comment.likes.includes(user?.id ?? '')"
        @click="handleLike"
        class="w-4 hover:opacity-60 animate-[0.45s_like-button-animation_ease-in-out]"
        :class="isLoadingLike ? 'pointer-events-none' : 'pointer-events-auto'"
      />
      <LikeActiveIcon
        v-else
        @click="handleUnlike"
        class="w-4 fill-error animate-[0.45s_like-button-animation_ease-in-out]"
        :class="isLoadingLike ? 'pointer-events-none' : 'pointer-events-auto'"
      />
    </div>
  </div>
</template>
