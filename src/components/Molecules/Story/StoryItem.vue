<script setup lang="ts">
import Avatar from "@/components/Common/Avatar.vue";
import { IUser } from "@/types";

withDefaults(
  defineProps<{
    user: IUser;
    size?: string;
  }>(),
  {
    size: "64",
  }
);
</script>

<template>
  <div>
    <RouterLink to="/" class="flex flex-col flex-center">
      <Avatar
        :avatarUrl="user.avatar"
        :width="size"
        class="outline outline-1 outline-[#dbdbdb] -outline-offset-2"
      />
      <span class="w-full mt-2 text-xs font-semibold text-center text-dots">{{
        user.username
      }}</span>
    </RouterLink>
  </div>
</template>
