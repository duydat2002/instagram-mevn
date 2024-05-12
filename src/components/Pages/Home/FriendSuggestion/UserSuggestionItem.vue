<script setup lang="ts">
import UserItem from "@/components/Molecules/User/UserItem.vue";
import UButton from "@/components/UI/UButton.vue";

import { useFollow } from "@/composables";
import { useUserStore } from "@/store";
import { IUser } from "@/types";
import { storeToRefs } from "pinia";

defineProps<{
  user: IUser;
}>();

const { isLoadingFollow, follow, unfollow } = useFollow();
const { user: authUser } = storeToRefs(useUserStore());

const handleClickFollow = async (userId: string) => {
  await follow(userId);
};

const handleClickUnfollow = async (userId: string) => {
  await unfollow(userId);
};
</script>

<template>
  <UserItem :user="user" hasTrigger>
    <UButton
      v-if="!authUser?.followings.includes(user.id)"
      :isLoading="isLoadingFollow"
      size="none"
      variant="text"
    >
      <span
        class="text-xs font-semibold ml-3 text-buttonColor-primary hover:text-link"
        @click="handleClickFollow(user.id)"
        >Theo dõi</span
      >
    </UButton>
    <UButton v-else :isLoading="isLoadingFollow" size="none" variant="text">
      <span
        class="text-xs font-semibold ml-3 text-textColor-secondary hover:opacity-60"
        @click="handleClickUnfollow(user.id)"
        >Đang theo dõi</span
      >
    </UButton>
  </UserItem>
</template>
