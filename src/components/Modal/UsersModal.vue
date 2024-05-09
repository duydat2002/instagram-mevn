<script lang="ts" setup>
import Modal from "./Modal.vue";
import UserItem from "@/components/Molecules/User/UserItem.vue";
import FollowButton from "@/components/Molecules/User/FollowButton.vue";
import UserItemSkeleton from "@/components/Skeleton/UserItemSkeleton.vue";

import { storeToRefs } from "pinia";
import { useUserStore, useUsersModalStore } from "@/store";
import { onBeforeUnmount } from "vue";

const emit = defineEmits(["cancel"]);

const { title, users } = storeToRefs(useUsersModalStore());
const { user: authUser } = storeToRefs(useUserStore());

const hanldeCancel = () => {
  emit("cancel");
};

onBeforeUnmount(() => {
  title.value = "";
  users.value = null;
});
</script>

<template>
  <Modal isShow @clickOutside="hanldeCancel">
    <div class="flex flex-col w-[400px] h-[400px] bg-bgColor-primary rounded-xl overflow-hidden">
      <div class="relative h-[42px] flex flex-center border-b border-borderColor">
        <span class="text-base font-semibold">{{ title }}</span>
        <div class="absolute top-0 bottom-0 right-0 p-2 mx-2 cursor-pointer" @click="hanldeCancel">
          <fa class="text-[25px]" :icon="['fas', 'xmark']" />
        </div>
      </div>
      <div class="flex-1 overflow-y-scroll">
        <UserItemSkeleton v-if="!users" v-for="i in 10" :key="i" />
        <UserItem v-for="user in users" :key="user.id" :user="user">
          <div v-if="user.id != authUser?.id" class="ml-4">
            <FollowButton :user="user" />
          </div>
        </UserItem>
      </div>
    </div>
  </Modal>
</template>
