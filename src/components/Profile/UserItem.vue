<script lang="ts" setup>
import Avatar from "../Common/Avatar.vue";
import UButton from "../UI/UButton.vue";
import FollowButton from "./FollowButton.vue";

import { IUser, IFollowUser } from "@/types";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store";

defineProps<{
  user: IFollowUser;
}>();

const { user: authUser } = storeToRefs(useUserStore());
</script>

<template>
  <div class="flex items-center px-3 py-2">
    <Avatar :avatarUrl="user.avatar" width="44" class="mr-2 flex-shrink-0" />
    <div class="flex flex-col justify-center flex-1 overflow-hidden">
      <div>
        <RouterLink
          :to="{ name: 'Profile', params: { username: user.username } }"
          class="block font-semibold text-dots"
          >{{ user.username }}</RouterLink
        >
      </div>
      <span
        v-if="user.fullname"
        class="text-textColor-secondary leading-none text-dots flex-shrink-0"
        >{{ user.fullname }}</span
      >
    </div>
    <div v-if="user.id != authUser?.id" class="ml-4">
      <FollowButton :user="user" />
    </div>
  </div>
</template>
