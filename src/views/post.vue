<script setup lang="ts">
import { useCommonStore } from "@/store";
import { onMounted } from "vue";

const { setTitle } = useCommonStore();

onMounted(() => {
  setTitle("abc");
});
</script>
<template>
  <div></div>
</template>
