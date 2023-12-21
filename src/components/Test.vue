<script lang="ts" setup>
import { useThemeStore } from "@/store/theme";

const { darkMode } = useThemeStore();
</script>

<template>
  <div class="flex flex-col">
    <span>Cac</span>
    <span>{{ darkMode ? "dark" : "light" }}</span>
  </div>
</template>
