<script setup lang="ts">
import ArrowBackIcon from "@icons/arrowback.svg";
import Modal from "@/components/Modal/Modal.vue";
import UButton from "@/components/UI/UButton.vue";
import UploadPost from "./UploadPost.vue";
import EditorPost from "./EditorPost.vue";
import SharePost from "./SharePost.vue";
import ConfirmPopup from "@/components/Popup/ConfirmPopup.vue";

import { ref, computed, watch, onBeforeUnmount, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useCommonStore, useCreatePostStore } from "@/store";

defineProps<{
  onClickOutside: Fn<any, any>;
}>();

const { prevTab, nextTab, resetCreatePost } = useCreatePostStore();
const { title: documentTitle } = useCommonStore();
const {
  title,
  currentTab,
  currentMediaIndex,
  removePostPopupShow,
  removeMediaPopupShow,
  isShowModal,
} = storeToRefs(useCreatePostStore());

const isClickBackFromCrop = ref(false);

const handlePrevTab = () => {
  if (currentTab.value.tab == "CropPost") {
    isClickBackFromCrop.value = true;
    removePostPopupShow.value = true;
  } else {
    isClickBackFromCrop.value = false;
    prevTab();
  }
};

const handleRemovePost = () => {
  if (isClickBackFromCrop.value) {
    removePostPopupShow.value = false;
    prevTab();
  } else {
    removePostPopupShow.value = false;
    isShowModal.value = false;
  }

  setTimeout(() => {
    resetCreatePost();
  }, 0);
};

const handleRemoveMedia = () => {
  const { deleteMedia } = useCreatePostStore();

  deleteMedia(currentMediaIndex.value);
  removeMediaPopupShow.value = false;
};

watch(currentTab, () => {
  title.value = currentTab.value.title;
});

onMounted(() => {
  resetCreatePost();
  document.title = "Tạo bài viết mới • Instagram";
});

onUnmounted(() => {
  document.title = documentTitle;
});
</script>

<template>
  <Modal isShow @click-outside="onClickOutside">
    <div
      class="flex flex-col flex-nowrap w-full h-[calc(100vh-40px)] max-h-[442px] bg-modal rounded-xl overflow-hidden select-none"
    >
      <div
        class="relative flex items-center justify-between h-[42px] border-b border-separator-modal"
      >
        <div
          v-if="currentTab.hasBack"
          class="ml-2 p-2 cursor-pointer select-none"
          @click="handlePrevTab"
        >
          <ArrowBackIcon class="text-textColor-primary fill-textColor-primary" />
        </div>
        <span
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-semibold whitespace-nowrap"
          >{{ title }}</span
        >
        <UButton v-if="currentTab.nextButton" variant="text" @click="nextTab">
          <span class="text-buttonColor-primary select-none hover:text-link">{{
            currentTab.nextButton
          }}</span>
        </UButton>
      </div>
      <div class="max-h-[400px] h-screen">
        <UploadPost v-if="currentTab.tab == 'UploadPost'" />
        <SharePost v-else-if="currentTab.tab == 'SharePost'" />
        <EditorPost v-else />
      </div>
    </div>
  </Modal>
  <ConfirmPopup
    v-if="removePostPopupShow"
    title="Bỏ bài viết?"
    desc="Nếu rời đi, bạn sẽ mất những gì vừa chỉnh sửa."
    confirmMessage="Bỏ"
    @confirm="handleRemovePost"
    @cancel="
      () => {
        removePostPopupShow = false;
      }
    "
  />
  <ConfirmPopup
    v-if="removeMediaPopupShow"
    title="Bỏ ảnh?"
    desc="Thao tác này sẽ gỡ ảnh khỏi bài viết của bạn."
    confirmMessage="Bỏ"
    @confirm="handleRemoveMedia"
    @cancel="
      () => {
        removeMediaPopupShow = false;
      }
    "
  />
</template>
