<script lang="ts" setup>
import LogoText from "@icons/logo-text.svg";
import Logo from "@icons/logo.svg";
import SearchPanel from "@/components/Layout/Nav/NavPanel/SearchPanel.vue";
import NavItem from "./NavItem.vue";
import NotificationPanel from "./NavPanel/NotificationPanel.vue";
import NavExtend from "./NavExtend.vue";
import CreatePost from "@/components/Pages/CreatePost/index.vue";

import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useResizeStore } from "@/store";
import { useNav } from "@/composables/useNav";
import { ENavTab } from "@/types";
import { useRoute } from "vue-router";
import { useCreatePostStore } from "@/store/createPost";

const route = useRoute();

const { screen } = storeToRefs(useResizeStore());
const { currentTab, isShowModal, removePostPopupShow } = storeToRefs(useCreatePostStore());
const { navs, bottomNav } = useNav();
const currentNav = ref<ENavTab>(ENavTab.Home);
const currentPanel = ref<ENavTab.Search | ENavTab.Notification | ENavTab.Bar | null>(null);

const isNarrow = computed(() => {
  if (screen.value == "mobile") return false;
  return screen.value == "tablet" || (currentPanel.value && currentPanel.value != ENavTab.Bar)
    ? true
    : false;
});

const changeTab = (nav: ENavTab) => {
  if (nav == ENavTab.CreatePost) {
    isShowModal.value = true;
  } else if (nav == ENavTab.Search || nav == ENavTab.Notification || nav == ENavTab.Bar) {
    currentPanel.value = currentPanel.value == nav ? null : nav;
  } else currentPanel.value = null;

  currentNav.value = nav;
};

const clickOutsideTab = () => {
  currentPanel.value = null;
  currentNav.value = route.matched[0].name as ENavTab;
};

const handleClickOutsideCreatePost = () => {
  if (["CropPost", "FilterPost", "CaptionPost"].includes(currentTab.value.tab))
    removePostPopupShow.value = true;
  else isShowModal.value = false;

  clickOutsideTab();
};

watch(
  route,
  (to) => {
    currentNav.value = to.matched[0].name as ENavTab;
  },
  { immediate: true }
);

watch(screen, (value) => {
  if (value == "mobile") clickOutsideTab();
});
</script>

<template>
  <div
    class="fixed z-30 top-auto tablet:top-0 left-0 bottom-0 w-full tablet:w-nav-narrow transition-[width] duration-300 desktop:w-nav-medium has-[is-narrow]:w-nav-narrow"
    :class="{ 'is-narrow': isNarrow }"
  >
    <div
      class="flex flex-col h-full p-0 bg-bgColor-primary border-t border-r-0 border-borderColor tablet:px-3 tablet:py-5 tablet:border-t-0 tablet:border-r"
    >
      <RouterLink to="/" class="px-3 py-5 mb-3 relative hidden tablet:block">
        <LogoText
          class="opacity-100 parent-[.is-narrow]:opacity-0 w-[103px] transition-opacity duration-300"
        />
        <Logo
          class="absolute top-5 bottom-0 left-3 right-0 opacity-0 parent-[.is-narrow]:opacity-100 text-textColor-primary hover:scale-105 transition-opacity duration-300"
        />
      </RouterLink>
      <div class="flex flex-row flex-grow justify-evenly tablet:justify-normal tablet:flex-col">
        <NavItem
          v-for="nav in navs"
          :key="nav.name"
          :nav="nav"
          :currentNav="currentNav"
          @changeTab="changeTab"
        />
      </div>
      <div class="relative flex-col mt-3 hidden tablet:flex">
        <NavItem
          v-for="nav in bottomNav"
          :key="nav.name"
          :nav="nav"
          :currentNav="currentNav"
          @changeTab="changeTab"
        />
        <NavExtend v-if="currentPanel == 'Bar'" v-click-outside="clickOutsideTab" />
      </div>
    </div>
    <div v-if="screen != 'mobile'" class="fixed top-0 bottom-0 left-nav-narrow -z-10">
      <Transition name="fadeRight">
        <SearchPanel
          v-if="currentPanel == 'Search'"
          @close="clickOutsideTab"
          v-click-outside="clickOutsideTab"
        />
      </Transition>
      <Transition name="fadeRight">
        <NotificationPanel
          v-if="currentPanel == 'Notification'"
          v-click-outside="clickOutsideTab"
        />
      </Transition>
    </div>
    <CreatePost v-if="isShowModal" @clickOutside="handleClickOutsideCreatePost()" />
  </div>
</template>
