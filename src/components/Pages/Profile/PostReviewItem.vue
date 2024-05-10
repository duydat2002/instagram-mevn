<script lang="ts" setup>
import LikeIcon from "@icons/heart-active.svg";
import CommentIcon from "@icons/comment-active.svg";
import MultipleIcon from "@icons/multiple-active.svg";
import ReelIcon from "@icons/reel-active.svg";
import PlayIcon from "@icons/play.svg";

import { computed } from "vue";
import type { IPost } from "@/types";
import { formatNumberToSuffix } from "@/helpers";
import { storeToRefs } from "pinia";
import { usePostStore } from "@/store";

const props = defineProps<{
  post: IPost;
}>();

const { postIdModal } = storeToRefs(usePostStore());

const likeCountComp = computed(() => {
  return formatNumberToSuffix(props.post.likes.length);
});

const commentCountComp = computed(() => {
  return formatNumberToSuffix(props.post.comments.length);
});

const handleClickReview = () => {
  postIdModal.value = props.post.id;
};
</script>

<template>
  <div @click="handleClickReview">
    <div class="relative group/review w-full pt-[100%] cursor-pointer overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full">
        <img class="w-full h-full object-cover" :src="post.contents[0]" :alt="post.caption" />
      </div>
      <div
        class="absolute top-0 left-0 w-full h-full flex flex-center bg-[rgba(0,0,0,0.3)] opacity-0 group-hover/review:opacity-100 transition-opacity z-10"
      >
        <div class="flex items-center mr-7">
          <LikeIcon class="w-5 h-5 text-white fill-white" />
          <span class="ml-2 text-base font-bold text-white">{{ likeCountComp }}</span>
        </div>
        <div class="flex items-center">
          <CommentIcon class="w-[18px] h-[18px] text-white fill-white" />
          <span class="ml-2 text-base font-bold text-white">{{ commentCountComp }}</span>
        </div>
      </div>
      <div v-if="post.type != 'image'" class="absolute top-2 right-2">
        <MultipleIcon v-if="post.type == 'multiple'" class="fill-white" />
        <ReelIcon v-if="post.type == 'reel'" class="fill-white" />
        <PlayIcon v-if="post.type == 'video'" class="fill-white" />
      </div>
    </div>
  </div>
</template>
