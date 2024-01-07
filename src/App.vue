<script lang="ts" setup>
import { watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import { useResize } from "./composables";
import { storeToRefs } from "pinia";
import { useResizeStore, useThemeStore, useModalStore } from "./store";
import LoadingProgress from "./components/Common/LoadingProgress.vue";

useResize();
const route = useRoute();

const { darkMode } = storeToRefs(useThemeStore());
const { screen } = storeToRefs(useResizeStore());
const { stopScroll } = storeToRefs(useModalStore());

watch(darkMode, (theme) => {
  if (theme) document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
});

watch(stopScroll, (active) => {
  document.documentElement.style.overflow = active ? "hidden" : "visible";
});
</script>

<template>
  <div
    class="has-[active-overlay]:overflow-y-scroll"
    :class="[{ 'active-overlay': stopScroll }, screen]"
  >
    <KeepAlive>
      <component :is="route.meta.layout || 'div'">
        <LoadingProgress />

        <RouterView />
      </component>
    </KeepAlive>
  </div>
</template>

<style lang="css" scoped></style>
