<script setup lang="ts">
import UserItemSkeleton from "@/components/Skeleton/UserItemSkeleton.vue";
import UserSuggestionItem from "./UserSuggestionItem.vue";

import { ref, onMounted } from "vue";
import { getFriendSuggestion } from "@/services/user";
import { IUser } from "@/types";

const friendSuggest = ref<IUser[]>();

onMounted(async () => {
  const data = await getFriendSuggestion();
  if (data.success) friendSuggest.value = data.result!.users;
});
</script>

<template>
  <div class="flex flex-col mt-6">
    <div class="flex w-full px-4 items-center justify-between">
      <span class="text-sm font-semibold text-textColor-secondary">Gợi ý cho bạn</span>
      <RouterLink
        :to="{ name: 'FriendSuggestion' }"
        class="text-xs font-semibold text-textColor-primary hover:opacity-60"
        >Xem tất cả</RouterLink
      >
    </div>
    <div class="flex flex-col">
      <UserItemSkeleton v-if="!friendSuggest" v-for="i in 5" :key="i" />
      <UserSuggestionItem v-for="suggest in friendSuggest" :key="suggest.id" :user="suggest" />
    </div>
  </div>
</template>
