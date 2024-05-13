<script setup lang="ts">
import UserItemSkeleton from "@/components/Skeleton/UserItemSkeleton.vue";
import UserItem from "@/components/Molecules/User/UserItem.vue";
import FollowButton from "@/components/Molecules/User/FollowButton.vue";

import { ref, onMounted } from "vue";
import { IUser } from "@/types";
import { getFriendSuggestion } from "@/services/user";

const friendSuggest = ref<IUser[]>();

onMounted(async () => {
  const data = await getFriendSuggestion(30);
  if (data.success) friendSuggest.value = data.result!.users;
});
</script>

<template>
  <div class="flex pt-[60px] flex-col w-full max-w-[600px] mx-auto">
    <div>
      <span class="text-base font-semibold text-textColor-primary p-4">Gợi ý</span>
    </div>
    <div class="flex flex-col mt-2">
      <UserItemSkeleton v-if="!friendSuggest" v-for="i in 5" :key="i" />
      <UserItem v-for="suggest in friendSuggest" :key="suggest.id" :user="suggest" hasTrigger>
        <FollowButton :user="suggest" />
      </UserItem>
    </div>
  </div>
</template>
