<script lang="ts" setup>
import LoadingIcon from "@icons/loading.svg";

withDefaults(
  defineProps<{
    width?: string;
    color?: string;
  }>(),
  {
    width: "32px",
    color: "currentColor",
  }
);
</script>

<template>
  <div class="flex flex-center">
    <div class="animate-spin">
      <LoadingIcon :style="{ width: width, height: width, fill: color }" />
    </div>
  </div>
</template>
