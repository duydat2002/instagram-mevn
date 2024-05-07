<script lang="ts" setup>
import Modal from "@/components/Modal/Modal.vue";
import { IAction } from "@/types";

const emit = defineEmits(["cancel"]);
defineProps<{
  actions?: IAction[];
}>();

const onClickAction = (action?: () => void) => {
  if (action) action();
  emit("cancel");
};

const onCancel = () => {
  emit("cancel");
};
</script>

<template>
  <Modal isPopup isShow @click-outside="onCancel">
    <div class="w-screen max-w-[400px] bg-modal rounded-xl text-center overflow-hidden">
      <div
        v-for="(action, index) in actions"
        :key="index"
        class="p-3 border-b border-separator-modal active:bg-[#0000001a] cursor-pointer select-none"
        :class="[action.classes]"
        @click="onClickAction(action.action)"
      >
        <span>{{ action.title }}</span>
      </div>
      <div class="p-3 active:bg-[#0000001a] cursor-pointer select-none" @click="onCancel">
        <span>Hủy</span>
      </div>
    </div>
  </Modal>
</template>
