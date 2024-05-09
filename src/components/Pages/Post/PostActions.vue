<script lang="ts" setup>
import LikeIcon from "@icons/heart.svg";
import LikeActiveIcon from "@icons/heart-active.svg";
import CommentIcon from "@icons/comment.svg";
import SendIcon from "@icons/send.svg";
import BookmarkIcon from "@icons/bookmark.svg";
import BookmarkActiveIcon from "@icons/bookmark-active.svg";

import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { dateDistanceToNow, convertToFullDate } from "@/helpers";
import { usePostStore, useUserStore, useUsersModalStore } from "@/store";
import { getLikedUsersOfPost, likePost, savePost, unlikePost, unsavePost } from "@/services/post";

const { user } = storeToRefs(useUserStore());
const { post, commentRef } = storeToRefs(usePostStore());
const { isShow, title, users: usersLiked } = storeToRefs(useUsersModalStore());

const isLoadingLike = ref(false);
const isLoadingSave = ref(false);

const handleLikePost = async () => {
  isLoadingLike.value = true;

  const data = await likePost(post.value!.id);
  if (data.success) user.value?.liked_posts.push(post.value!.id);

  isLoadingLike.value = false;
};

const handleUnlikePost = async () => {
  isLoadingLike.value = true;

  const data = await unlikePost(post.value!.id);
  if (data.success)
    user.value!.liked_posts = user.value!.liked_posts.filter((p) => p != post.value!.id);

  isLoadingLike.value = false;
};

const handleSavePost = async () => {
  isLoadingSave.value = true;

  const data = await savePost(post.value!.id);
  if (data.success) user.value?.saved_posts.push(post.value!.id);

  isLoadingSave.value = false;
};

const handleUnsavePost = async () => {
  isLoadingSave.value = true;

  const data = await unsavePost(post.value!.id);
  if (data.success)
    user.value!.saved_posts = user.value!.saved_posts.filter((p) => p != post.value!.id);

  isLoadingSave.value = false;
};

const commentIconClick = () => {
  commentRef.value?.focus();
};

const showLikedUsers = async () => {
  if (post.value!.likes.length > 0) {
    isShow.value = true;
    title.value = "Lượt thích";
    const data = await getLikedUsersOfPost(post.value!.id);
    if (data.success) {
      usersLiked.value = data.result!.users;
    }
  }
};
</script>

<template>
  <div class="flex flex-col border-b border-borderColor">
    <div class="flex justify-between px-[10px] py-[6px]">
      <div class="flex">
        <div class="p-2 cursor-pointer select-none">
          <LikeIcon
            v-if="!user?.liked_posts.includes(post!.id)"
            class="w-6 animate-[0.45s_like-button-animation_ease-in-out]"
            :class="isLoadingLike ? 'pointer-events-none' : 'pointer-events-auto'"
            @click="handleLikePost"
          />
          <LikeActiveIcon
            v-else
            class="w-6 text-error fill-error animate-[0.45s_like-button-animation_ease-in-out]"
            :class="isLoadingLike ? 'pointer-events-none' : 'pointer-events-auto'"
            @click="handleUnlikePost"
          />
        </div>
        <div class="p-2 cursor-pointer select-none">
          <CommentIcon @click="commentIconClick" />
        </div>
        <div class="p-2 cursor-pointer select-none">
          <SendIcon />
        </div>
      </div>
      <div class="p-2 cursor-pointer select-none">
        <BookmarkIcon
          v-if="!user?.saved_posts.includes(post!.id)"
          class="w-6 h-6"
          :class="isLoadingSave ? 'pointer-events-none' : 'pointer-events-auto'"
          @click="handleSavePost"
        />
        <BookmarkActiveIcon
          v-else
          class="w-6 h-6"
          :class="isLoadingSave ? 'pointer-events-none' : 'pointer-events-auto'"
          @click="handleUnsavePost"
        />
      </div>
    </div>
    <div class="flex flex-col px-4 mb-4">
      <span class="text-sm font-semibold cursor-pointer" @click="showLikedUsers"
        >{{ post!.likes.length.toLocaleString("en-US").replace(",", ".") }} lượt thích</span
      >
      <span
        class="text-[10px] uppercase text-textColor-secondary"
        :title="convertToFullDate(post!.createdAt).toUpperCase()"
        >{{ dateDistanceToNow(post!.createdAt) }}</span
      >
    </div>
  </div>
</template>
