<script lang="ts" setup>
import UButton from "@/components/UI/UButton.vue";

import { storeToRefs } from "pinia";
import { useUserStore } from "@/store";
import { IFollowUser } from "@/types";
import { useFollow } from "@/composables";

const props = defineProps<{
  user: IFollowUser;
}>();

const { isLoadingFollow, follow, unfollow } = useFollow();

const { user: authUser } = storeToRefs(useUserStore());

const handleClickFollow = async () => {
  await follow(props.user.id, () => {
    props.user.followers.push(props.user.id);
  });
};

const handleClickUnfollow = async () => {
  await unfollow(props.user.id, () => {
    const index = props.user.followers.indexOf(props.user.id);
    if (index != -1) props.user.followers.splice(index, 1);
  });
};
</script>

<template>
  <UButton
    v-if="!authUser?.followings.includes(user.id)"
    class=""
    primary
    :isLoading="isLoadingFollow"
    @click="handleClickFollow"
  >
    <span>Theo dõi</span>
  </UButton>
  <UButton v-else class="" secondary :isLoading="isLoadingFollow" @click="handleClickUnfollow">
    <span>Đang theo dõi</span>
  </UButton>
</template>
