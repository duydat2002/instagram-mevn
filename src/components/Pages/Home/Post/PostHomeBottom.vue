<script setup lang="ts">
import EmojiIcon from "@icons/emoji.svg";
import Loading from "@/components/Common/Loading.vue";
import EmojiPicker from "@/components/Common/EmojiPicker.vue";

import { IPost } from "@/types";
import { ref, onMounted } from "vue";
import { commentPost } from "@/services/comment";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store";

const { isLogged } = storeToRefs(useUserStore());

const props = defineProps<{
  post: IPost;
}>();

const commentRef = ref<HTMLTextAreaElement>();
const comment = ref("");
const hasMultipleLine = ref(false);
const loadingComment = ref(false);
const caption = ref(props.post.caption);
const emojiPickerActive = ref(false);

const handleShowAllCaption = () => {
  caption.value = props.post.caption;
  hasMultipleLine.value = false;
};

const handleInputComment = () => {
  commentRef.value!.style.height = "";
  commentRef.value!.style.height = Math.min(commentRef.value!.scrollHeight, 80) + "px";
};

const handleComment = async () => {
  if (isLogged && comment.value != "") {
    loadingComment.value = true;

    const data = await commentPost(props.post.id, comment.value);
    if (data.success) {
      props.post.comments.unshift(data.result!.comment.id);
    }

    emojiPickerActive.value = false;
    loadingComment.value = false;
    comment.value = "";
  }
};

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

onMounted(() => {
  const captionLines = props.post.caption.split("\n");

  if (captionLines.length > 1) {
    caption.value = captionLines[0];
    hasMultipleLine.value = true;
  }
});
</script>

<template>
  <div class="mt-2 inline-block">
    <div class="inline-block mr-1">
      <RouterLink :to="{ name: 'Profile', params: { username: post.author.id } }">
        <span class="text-sm font-semibold text-textColor-primary">{{ post.author.username }}</span>
      </RouterLink>
    </div>
    <span class="inline">
      <div class="inline whitespace-break-spaces">
        <span v-dompurify-html="caption" />
      </div>
      <span v-if="hasMultipleLine">
        <span class="text-sm text-textColor-primary"> ... </span>
        <span class="text-sm text-textColor-secondary cursor-pointer" @click="handleShowAllCaption"
          >xem thêm</span
        >
      </span>
    </span>
  </div>
  <div class="mt-2">
    <RouterLink
      :to="{ name: 'Post', params: { postId: post.id } }"
      class="text-sm text-textColor-secondary"
      >Xem tất cả {{ post.comments.length }} bình luận</RouterLink
    >
  </div>
  <div class="mt-2 flex items-center">
    <div class="flex-1 relative">
      <textarea
        v-model="comment"
        ref="commentRef"
        placeholder="Thêm bình luận..."
        name="comment"
        class="h-[20px] w-full resize-none leading-[18px] overflow-y-hidden"
        @input="handleInputComment"
        @keydown.enter.exact.prevent="handleComment"
      />
      <Loading v-if="loadingComment" width="16px" class="absolute top-0 left-0 w-full h-full" />
    </div>
    <button
      v-if="comment != '' && !loadingComment"
      class="flex-shrink-0 mx-2 font-semibold text-buttonColor-primary hover:text-link cursor-pointer"
      @click="handleComment"
    >
      Đăng
    </button>
    <div class="relative">
      <EmojiIcon
        width="16"
        height="16"
        class="fill-textColor-secondary cursor-pointer"
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
  </div>
</template>
