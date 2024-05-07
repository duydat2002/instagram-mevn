<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useCreatePostStore } from "@/store";
import { canvasToFile, getDynamicImage } from "@/helpers";
import { createPost } from "@/services/post";

const { resetCreatePost } = useCreatePostStore();

const { title, medias, caption, cropperSize } = storeToRefs(useCreatePostStore());
const isUploadding = ref(true);

const gifStyle = computed(() => {
  return {
    backgroundImage: `url(${getDynamicImage(isUploadding.value ? "Loading.gif" : "Done.gif")})`,
  };
});

const createPostData = async () => {
  const formData = new FormData();

  const files: File[] = await Promise.all(
    medias.value.map(async (media, index) => canvasToFile(media.canvas, `media-${index}`))
  );

  let type = "image";
  if (files && files.length > 1) {
    type = "multiple";
  } else {
    type = "image";
  }

  const ratio = cropperSize.value.width / cropperSize.value.height;

  files.forEach((file) => {
    formData.append("contents", file);
  });
  formData.append("caption", caption.value);
  formData.append("type", type);
  formData.append("ratio", ratio.toString());

  return formData;
};

onMounted(async () => {
  title.value = "Đang chia sẻ";

  const formData = await createPostData();
  const data = await createPost(formData);

  isUploadding.value = false;
  title.value = "Đã chia sẻ bài viết";
});

onBeforeUnmount(() => {
  resetCreatePost();
});
</script>

<template>
  <div class="flex flex-col flex-center h-full w-[400px]">
    <div class="w-[96px] h-[96px] bg-cover bg-center bg-no-repeat" :style="gifStyle"></div>
    <p
      class="my-4 text-xl text-textColor-primary"
      :class="[!isUploadding ? 'opacity-100' : 'opacity-0']"
    >
      Đã chia sẻ bài viết của bạn.
    </p>
  </div>
</template>
