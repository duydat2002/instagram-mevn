<script lang="ts" setup>
import Avatar from "@/components/Common/Avatar.vue";

import { IUser } from "@/types";
import { useSlots } from "vue";

const slots = useSlots();

defineProps<{
  user: IUser;
}>();
</script>

<template>
  <RouterLink
    :to="{ name: 'Profile', params: { username: user.username } }"
    class="flex items-center px-3 py-2 cursor-pointer"
  >
    <Avatar :avatarUrl="user.avatar" width="44" class="mr-2 flex-shrink-0" />
    <div class="flex flex-col justify-center flex-1 overflow-hidden">
      <div>
        <span class="block font-semibold text-dots">{{ user.username }}</span>
        <slot name="top" />
      </div>
      <template v-if="slots.bottom">
        <slot name="bottom" />
      </template>
      <span v-else-if="user.fullname" class="text-textColor-secondary text-dots flex-shrink-0">{{
        user.fullname
      }}</span>
    </div>
    <slot />
  </RouterLink>
</template>
