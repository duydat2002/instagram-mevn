<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    avatars: string[];
    size?: "normal" | "small";
  }>(),
  {
    size: "normal",
  }
);

const sizes = computed(() =>
  props.size == "normal"
    ? {
        parent: "56px",
        child: "40px",
      }
    : {
        parent: "44px",
        child: "32px",
      }
);
</script>

<template>
  <div class="relative" :style="{ width: sizes.parent, height: sizes.parent }">
    <div
      class="absolute top-0 left-0 rounded-full overflow-hidden"
      :style="{ width: sizes.child, height: sizes.child }"
    >
      <img :src="avatars[0]" />
    </div>
    <div
      class="absolute bottom-0 right-0 rounded-full overflow-hidden"
      :style="{ width: sizes.child, height: sizes.child }"
    >
      <img :src="avatars[1]" />
    </div>
  </div>
</template>
