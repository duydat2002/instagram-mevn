<script setup lang="ts">
import CommentItem from "./CommentItem.vue";
import Loading from "@/components/Common/Loading.vue";

import { ref } from "vue";
import { IComment, IReply } from "@/types";
import { getCommentReplies } from "@/services/comment";

const props = defineProps<{
  comment: IComment;
}>();

const replies = ref<IReply[]>([]);
const loadingReply = ref(false);
const isShowReply = ref(false);

const toggleReplies = async () => {
  isShowReply.value = !isShowReply.value;
  if (isShowReply.value) {
    loadingReply.value = true;
    const data = await getCommentReplies(props.comment.id);

    if (data.success) {
      replies.value = data.result!.replies;
    }
    loadingReply.value = false;
  }
};
</script>
<template>
  <div class="">
    <CommentItem :comment="comment" />
    <div v-if="comment.replies.length > 0" class="ml-[54px]">
      <div class="flex items-center cursor-pointer" @click="toggleReplies">
        <div class="inline-block w-6 h-[1px] bg-textColor-secondary align-middle mr-4"></div>
        <span class="text-xs text-textColor-secondary font-semibold"
          >Xem câu trả lời ({{ comment.replies.length }})</span
        >
        <Loading v-if="loadingReply" class="ml-2" width="16px" />
      </div>
      <div v-if="isShowReply" class="mt-3">
        <CommentItem v-for="reply in replies" :key="reply.id" :comment="reply" />
      </div>
    </div>
  </div>
</template>
