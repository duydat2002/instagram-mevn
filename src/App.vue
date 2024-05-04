<script lang="ts" setup>
import { onMounted, watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import { useResize } from "./composables";
import { storeToRefs } from "pinia";
import {
  useResizeStore,
  useThemeStore,
  useModalStore,
  useLoadingStore,
  useCommonStore,
} from "./store";
import LoadingProgress from "./components/Common/LoadingProgress.vue";

useResize();
const route = useRoute();

const { darkMode } = storeToRefs(useThemeStore());
const { screen } = storeToRefs(useResizeStore());
const { stopScroll } = storeToRefs(useModalStore());
const { title } = storeToRefs(useCommonStore());

watch(
  darkMode,
  (theme) => {
    if (theme) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  },
  { immediate: true }
);

watch(stopScroll, (active) => {
  document.documentElement.style.overflow = active ? "hidden" : "visible";
});

watch(title, (title) => {
  document.title = title;
});

onMounted(() => {
  document.querySelector("#splash")?.classList.add("hidden");
});
</script>

<template>
  <div class="" :class="[screen]">
    <KeepAlive>
      <component :is="route.meta.layout || 'div'">
        <LoadingProgress />

        <RouterView />
      </component>
    </KeepAlive>
  </div>
</template>
