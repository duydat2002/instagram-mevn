<script lang="ts" setup>
import MediafileIcon from "@icons/mediafile.svg";
import ExclamationIcon from "@icons/exclamation.svg";
import UButton from "@/components/UI/UButton.vue";

import { ref } from "vue";
import { useCreatePostStore } from "@/store";

const { setTitle, uploadMedias } = useCreatePostStore();

const isError = ref(false);
const fileErrorName = ref("");

const getInputFiles = (event: Event) => {
  isError.value = false;
  const files = (event.target as HTMLInputElement).files;

  if (files) {
    const fileArr = Array.from(files!);
    for (const index in fileArr) {
      if (fileArr[index].size < 1024 * 5 || !fileArr[index].type.includes("image")) {
        isError.value = true;
        fileErrorName.value = fileArr[index].name;
        setTitle("Không thể tải file lên");
        break;
      }
    }
    if (!isError.value) uploadMedias(files);
  }
};

const handleDragOver = (event: Event) => {
  event.preventDefault();
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isError.value = false;
  const files = event.dataTransfer?.files;

  if (files) {
    const fileArr = Array.from(files!);
    for (const index in fileArr) {
      if (fileArr[index].size < 1024 * 5) {
        isError.value = true;
        fileErrorName.value = fileArr[index].name;
        setTitle("Không thể tải file lên");
        break;
      }
    }
    if (!isError.value) uploadMedias(files);
  }
};
</script>

<template>
  <div
    class="w-[400px] h-full p-6 flex flex-col flex-center"
    @dragover="handleDragOver($event)"
    @drop="handleDrop($event)"
  >
    <MediafileIcon v-if="!isError" class="text-textColor-primary" />
    <ExclamationIcon v-else class="text-textColor-primary" />
    <span class="text-xl mt-[10px]">Kéo ảnh và video vào đây</span>
    <span v-if="isError" class="text-sm text-textColor-secondary text-center mt-1">
      <span class="font-semibold">{{ fileErrorName }}</span>
      quá nhỏ. Để tiếp tục, hãy chọn file có kích thước từ 5 KB trở lên
    </span>
    <UButton primary class="mt-5">
      <span>Chọn từ máy tính</span>
      <input
        ref="inputFiles"
        accept="image/*"
        type="file"
        class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        multiple
        @change="getInputFiles($event)"
      />
    </UButton>
  </div>
</template>
