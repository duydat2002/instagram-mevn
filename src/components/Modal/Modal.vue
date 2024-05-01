<script lang="ts" setup>
import { onBeforeUnmount, onMounted, onUnmounted } from "vue";
import { useModalStore } from "@/store";
import { storeToRefs } from "pinia";

const emit = defineEmits(["click-outside"]);
const props = withDefaults(
  defineProps<{
    isPopup?: boolean;
    isShow?: boolean;
    overlayBackground?: string;
  }>(),
  {
    isPopup: false,
    isShow: true,
    overlayBackground: "#0000004d",
  }
);

const { scrollPosition, stopScroll } = storeToRefs(useModalStore());

const handleClickOutsideModal = () => {
  emit("click-outside");
};

onMounted(() => {
  if (props.isShow) {
    scrollPosition.value = document.documentElement.scrollTop;
    stopScroll.value = true;
  }
});

onBeforeUnmount(() => {
  if (!document.querySelector("#popup > *")) {
    stopScroll.value = false;
  }
  document.documentElement.scrollTop = scrollPosition.value;
});
</script>

<template>
  <Teleport :to="isPopup ? '#popup' : '#modal'">
    <div
      v-if="isShow"
      class="fixed top-0 left-0 right-0 bottom-0 flex flex-center"
      :class="isPopup ? 'z-50' : 'z-40'"
      :style="{ background: overlayBackground }"
      v-click-inside="handleClickOutsideModal"
    >
      <div class="m-5 flex flex-center w-screen min-[500px]:w-auto">
        <slot />
      </div>
    </div>
  </Teleport>
</template>
