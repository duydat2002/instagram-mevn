<script setup lang="ts">
import EmojiIcon from "@icons/emoji.svg";
import Loading from "@/components/Common/Loading.vue";

import { ref } from "vue";
import EmojiPicker from "@/components/Common/EmojiPicker.vue";
import { storeToRefs } from "pinia";
import { usePostStore, useUserStore } from "@/store";
import { commentPost, replyComment } from "@/services/comment";

const { addComment, addReply } = usePostStore();
const { isLogged } = storeToRefs(useUserStore());
const { post, replyTo, comment, commentRef } = storeToRefs(usePostStore());

const emojiPickerActive = ref(false);
const loadingComment = ref(false);

const handleClickEmoji = (emoji: string) => {
  if (commentRef.value) {
    commentRef.value.setRangeText(
      emoji,
      commentRef.value.selectionStart!,
      commentRef.value.selectionEnd!,
      "end"
    );
    comment.value = commentRef.value.value;
    commentRef.value.focus();
  }
};

const handleInputComment = () => {
  commentRef.value!.style.height = "";
  commentRef.value!.style.height = Math.min(commentRef.value!.scrollHeight, 80) + "px";
};

const handleComment = async () => {
  if (isLogged && comment.value != "") {
    loadingComment.value = true;

    let data;
    if (!replyTo.value) {
      data = await commentPost(post.value!.id, comment.value);
      if (data.success) addComment(data.result!.comment);
    } else {
      data = await replyComment(replyTo.value, comment.value);
      if (data.success) addReply(data.result!.reply);
    }

    emojiPickerActive.value = false;
    loadingComment.value = false;
    comment.value = "";
    replyTo.value = null;
  }
};
</script>
<template>
  <div
    v-if="isLogged"
    class="flex items-center pr-2 py-[6px]"
    v-click-outside="
      () => {
        emojiPickerActive = false;
      }
    "
  >
    <div class="relative px-4 py-2">
      <EmojiIcon
        width="24"
        height="24"
        class="cursor-pointer"
        @click="
          () => {
            emojiPickerActive = !emojiPickerActive;
          }
        "
      />
      <EmojiPicker
        v-if="emojiPickerActive"
        class="absolute left-0 min-[380px]:left-4 min-[380px]:w-[315px] bottom-full mb-[7px]"
        @clicked="handleClickEmoji"
      />
    </div>
    <div class="flex-grow flex relative">
      <textarea
        v-model="comment"
        ref="commentRef"
        placeholder="Thêm bình luận..."
        class="h-[20px] w-full resize-none leading-[18px] overflow-y-hidden"
        @input="handleInputComment"
        @keydown.enter.exact.prevent="handleComment"
      />
      <Loading v-if="loadingComment" width="16px" class="absolute top-0 left-0 w-full h-full" />
    </div>
    <button
      class="flex-shrink-0 p-2 font-semibold text-buttonColor-primary hover:text-link disabled:opacity-40 disabled:hover:text-buttonColor-primary disabled:cursor-default cursor-pointer"
      :disabled="comment == ''"
      @click="handleComment"
    >
      Đăng
    </button>
  </div>
  <div v-else class="py-2 px-4 text-textColor-secondary">
    <RouterLink :to="{ name: 'Login' }" class="text-buttonColor-primary hover:text-link"
      >Đăng nhập</RouterLink
    >
    <span> để thích hoặc bình luận.</span>
  </div>
</template>
