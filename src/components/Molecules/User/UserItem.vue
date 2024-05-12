<script lang="ts" setup>
import Avatar from "@/components/Common/Avatar.vue";
import { useHoverUser } from "@/composables";

import { IUser } from "@/types";
import { useSlots } from "vue";

const slots = useSlots();

const { hoverTrigger } = useHoverUser();

const props = defineProps<{
  user: IUser;
  hasTrigger?: boolean;
}>();

const handleTrigger = (event: Event) => {
  if (props.hasTrigger) hoverTrigger(event, props.user.id);
};
</script>

<template>
  <div class="flex items-center px-4 py-2 cursor-pointer">
    <RouterLink :to="{ name: 'Profile', params: { username: user.username } }">
      <Avatar
        :hasStory="Math.random() > 0.5"
        :avatarUrl="user.avatar"
        width="44"
        class="-ml-1 mr-2 flex-shrink-0"
        @mouseenter="handleTrigger($event)"
      />
    </RouterLink>
    <div class="flex flex-col justify-center flex-1 overflow-hidden">
      <div>
        <RouterLink
          :to="{ name: 'Profile', params: { username: user.username } }"
          class="inline font-semibold text-dots"
          @mouseenter="handleTrigger($event)"
          >{{ user.username }}</RouterLink
        >
        <slot name="top" />
      </div>
      <template v-if="slots.bottom">
        <slot name="bottom" />
      </template>
      <div v-else-if="user.fullname">
        <span class="text-textColor-secondary text-dots flex-shrink-0">{{ user.fullname }}</span>
      </div>
    </div>
    <slot />
  </div>
</template>
