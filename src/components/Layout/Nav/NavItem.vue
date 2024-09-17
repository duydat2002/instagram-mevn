<script lang="ts" setup>
import Avatar from "@/components/Common/Avatar.vue";

import { useChatStore, useUserStore } from "@/store";
import { INav, INavTab } from "@/types";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";

const emit = defineEmits(["changeTab"]);
const props = defineProps<{
  nav: INav;
  currentNav: INavTab;
}>();

const route = useRoute();
const { user } = storeToRefs(useUserStore());
const { unreadConversation } = storeToRefs(useChatStore());

const handleChangeTab = (nav: INavTab) => {
  emit("changeTab", nav);
};

const disableNavHasExtend = computed(() => {
  if (props.nav.hasExtend && props.currentNav == props.nav.name) return "pointer-events-none";
  else return "";
});
</script>

<template>
  <component
    :is="nav.path ? 'RouterLink' : 'div'"
    :to="nav.path"
    class="relative nav-item group/nav-item flex items-center p-3 my-0 tablet:my-[2px] rounded-lg cursor-pointer tablet:hover:bg-hover transition-colors duration-300 select-none"
    :class="[{ active: currentNav == nav.name }]"
  >
    <div
      class="absolute top-0 left-0 w-full h-full z-10"
      :class="disableNavHasExtend"
      @click="handleChangeTab(nav.name)"
    ></div>
    <div class="relative">
      <component
        v-if="nav.name != 'Profile'"
        :is="currentNav == nav.name ? nav.iconActive : nav.icon"
        class="w-6 flex-shrink-0 group-hover/nav-item:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-6 h-6 relative flex-shrink-0">
        <Avatar
          :avatarUrl="user?.avatar"
          class="absolute-center"
          :class="{
            'shadow-[inset_0_0_0_2px_#000]':
              currentNav == 'Profile' && route.params.username == user?.username,
          }"
          width="26"
        />
      </div>
      <div
        v-if="nav.name == 'Messenger' && unreadConversation > 0"
        class="badge absolute -top-1 -right-2 flex flex-center w-5 h-5 rounded-full bg-badge border-2 border-white"
      >
        <span class="text-xs text-white">{{ unreadConversation }}</span>
      </div>
    </div>
    <span
      class="hidden desktop:block parent-[.is-narrow]:hidden min-w-max pl-4 text-base text-textColor-primary parent-[.active]:font-bold"
      >{{ nav.title }}</span
    >
    <div class="tooltip">
      <div class="tooltip-content">{{ nav.title }}</div>
    </div>
  </component>
</template>

<style scoped>
.tooltip {
  margin-left: 18px;
  display: flex;
  align-items: center;
  position: absolute;
  left: 100%;
  width: max-content;
  border-radius: 8px;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.0975);
  transform: scale(0.3);
  opacity: 0;
  visibility: hidden;
  transition: all 0.1s 0s;
  pointer-events: none;
  z-index: 100;
}

.is-narrow .nav-item:hover .tooltip {
  transform: scale(1);
  opacity: 1;
  visibility: visible;
  transition: all 0.3s cubic-bezier(0.09, 0.8, 0.52, 1.34) 1s;
}

.tooltip-content {
  padding: 8px 12px;
  color: var(--primary-text-color);
  background: var(--tooltip-bg-color);
  border-radius: 8px;
}

.tooltip-content::after {
  content: "";
  width: 20px;
  height: 20px;
  position: absolute;
  top: 50%;
  right: 100%;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.0975);
  transform: translate(15px, -50%) rotateZ(45deg);
  background: inherit;
  border-radius: 2px;
  z-index: -1;
}
</style>
