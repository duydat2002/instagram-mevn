<script lang="ts" setup>
import UButton from "@/components/UI/UButton.vue";

import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store";
import { followUser, unfollowUser } from "@/services/user";
import { IFollowUser } from "@/types";

const props = defineProps<{
  user: IFollowUser;
}>();

const { user: authUser } = storeToRefs(useUserStore());
const isLoadingFollow = ref(false);
const isFollowed = ref(props.user.isFollowed);

const handleClickFollow = async () => {
  if (authUser.value) {
    isLoadingFollow.value = true;

    const data = await followUser(authUser.value.id, props.user.id);
    if (data.success) {
      props.user.followers.push(authUser.value.id);
      isFollowed.value = true;
    }

    isLoadingFollow.value = false;
  }
};

const handleClickUnfollow = async () => {
  if (authUser.value) {
    isLoadingFollow.value = true;

    const data = await unfollowUser(authUser.value.id, props.user.id);
    if (data.success) {
      const index = props.user.followers.indexOf(authUser.value.id);
      if (index != -1) props.user.followers.splice(index, 1);
      isFollowed.value = false;
    }

    isLoadingFollow.value = false;
  }
};
</script>

<template>
  <UButton
    v-if="!isFollowed"
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
