<script lang="ts" setup>
import { onBeforeUnmount, onMounted, onUnmounted } from "vue";
import { useModalStore } from "@/store";
import { storeToRefs } from "pinia";

const emit = defineEmits(["click-outside"]);
const props = withDefaults(
  defineProps<{
    id?: string;
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
  const modal = document.querySelector("#modal > *:not(#popup)");
  const popup = document.querySelector("#popup > *");
  document.documentElement.scrollTop = scrollPosition.value;
  if (!modal || !popup) {
    stopScroll.value = false;
  }
});
</script>

<template>
  <Teleport :to="isPopup ? '#popup' : '#modal'">
    <div
      v-if="isShow"
      class="fixed top-0 left-0 right-0 bottom-0 flex flex-center"
      :class="isPopup ? 'z-50' : 'z-40'"
      :id="id"
      :style="{ background: overlayBackground }"
      v-click-inside="handleClickOutsideModal"
    >
      <div class="modal-container m-5 flex flex-center w-screen min-[500px]:w-auto">
        <Transition name="modal" appear>
          <div class="slot" v-if="$slots.default">
            <slot />
          </div>
        </Transition>
      </div>
    </div>
  </Teleport>
</template>
