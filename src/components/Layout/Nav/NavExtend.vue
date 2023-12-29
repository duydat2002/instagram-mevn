<script lang="ts" setup>
import SettingIcon from "@icons/setting.svg";
import ClockIcon from "@icons/clock.svg";
import BookmarkIcon from "@icons/bookmark.svg";
import SunIcon from "@icons/sun.svg";
import MoonIcon from "@icons/moon.svg";
import ReportIcon from "@icons/report.svg";

import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useThemeStore } from "@/store";
import USwitchButton from "@/components/UI/USwitchButton.vue";

const router = useRouter();
const { darkMode } = storeToRefs(useThemeStore());

const tabActive = ref(false);
const mainTab = ref<Nullable<HTMLDivElement>>(null);
const secondaryTab = ref<Nullable<HTMLDivElement>>(null);

const tabHeight = computed(() => {
  if (!secondaryTab.value && !mainTab.value) return "auto";
  return tabActive.value
    ? secondaryTab.value?.clientHeight + "px"
    : mainTab.value?.clientHeight + "px";
});

const logout = () => {};
</script>

<template>
  <div
    class="absolute bottom-full left-0 w-[266px] bg-modal rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] overflow-hidden parent-[.is-narrow]:bottom-0 parent-[.is-narrow]:left-full transition-[height] duration-200"
    :class="{ active: tabActive }"
    :style="{ height: tabHeight }"
  >
    <div
      ref="mainTab"
      class="parent-[.active]:-translate-x-full transition-transform duration-200 ease-ease1"
    >
      <div class="flex flex-col p-2">
        <RouterLink to="" class="item hover:bg-hover">
          <SettingIcon />
          <span class="ml-3 leading-tight">Cài đặt</span>
        </RouterLink>
        <RouterLink to="" class="item hover:bg-hover">
          <ClockIcon />
          <span class="ml-3 leading-tight">Hoạt động của bạn</span>
        </RouterLink>
        <RouterLink to="" class="item hover:bg-hover">
          <BookmarkIcon />
          <span class="ml-3 leading-tight">Đã lưu</span>
        </RouterLink>
        <div
          class="item hover:bg-hover"
          @click="
            () => {
              tabActive = true;
            }
          "
        >
          <SunIcon v-if="!darkMode" />
          <MoonIcon v-else />
          <span class="ml-3 leading-tight">Chuyển chế độ</span>
        </div>
        <RouterLink to="" class="item hover:bg-hover">
          <ReportIcon />
          <span class="ml-3 leading-tight">Báo cáo sự cố</span>
        </RouterLink>
      </div>
      <div class="w-full h-[6px] bg-separator"></div>
      <div class="p-2">
        <div class="item hover:bg-hover">
          <span class="leading-tight">Chuyển tài khoản</span>
        </div>
      </div>
      <div class="w-full h-[1px] bg-separator"></div>
      <div class="p-2">
        <div class="item hover:bg-hover" @click="logout">
          <span class="leading-tight">Đăng xuất</span>
        </div>
      </div>
    </div>
    <div
      ref="secondaryTab"
      class="absolute top-0 left-full parent-[.active]:left-0 w-full transition-[left] duration-200 ease-ease1"
    >
      <div class="p-4 flex items-center">
        <div
          class="w-5 h-5 text-[12px] text-textColor-secondary flex flex-center mr-2 cursor-pointer"
          @click="tabActive = false"
        >
          <fa :icon="['fas', 'chevron-left']" />
        </div>
        <span class="flex-grow text-base leading-tight font-semibold">Chuyển chế độ</span>
        <div class="">
          <SunIcon v-if="!darkMode" />
          <MoonIcon v-else />
        </div>
      </div>
      <div class="w-full h-[1px] bg-separator"></div>
      <div class="p-2">
        <div
          class="flex w-full p-4 items-center hover:bg-hover rounded-lg transition-colors duration-200 cursor-pointer"
        >
          <span class="leading-tight flex-grow">Chế độ tối</span>
          <USwitchButton v-model:propValue="darkMode" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
svg {
  color: var(--primary-text-color);
  fill: var(--primary-text-color);
}

.item {
  display: flex;
  width: 100%;
  padding: 16px;
  align-items: center;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.item:active {
  opacity: 5;
}
</style>
