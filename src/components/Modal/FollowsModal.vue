<script lang="ts" setup>
import Modal from "./Modal.vue";
import UserItem from "@/components/Profile/UserItem.vue";

import { ref, onMounted, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store";
import { getFollowers, getFollowings, getMutualFollowedBy } from "@/services/user";
import { IFollowUser } from "@/types";

const route = useRoute();
const router = useRouter();

const { profileUser } = storeToRefs(useUserStore());
const followUsers = ref<IFollowUser[]>([]);
const title = ref("");

onBeforeMount(async () => {
  let data;
  switch (route.name) {
    case "Followers":
      data = await getFollowers(profileUser.value?.id || "");
      title.value = "Người theo dõi";
      break;
    case "MutualFollowers":
      data = await getMutualFollowedBy(profileUser.value?.id || "");
      title.value = "Người theo dõi";
      break;
    case "MutualFirstFollowers":
      data = await getFollowers(profileUser.value?.id || "");
      title.value = "Người theo dõi";
      break;
    case "Followings":
      data = await getFollowings(profileUser.value?.id || "");
      title.value = "Đang theo dõi";
      break;
  }

  console.log(data?.result?.users);
  followUsers.value = data?.result?.users || [];
});
</script>

<template>
  <Modal isShow @clickOutside="() => router.push({ name: 'Profile' })">
    <div class="flex flex-col w-[400px] h-[400px] bg-bgColor-primary rounded-xl overflow-hidden">
      <div class="relative h-[42px] flex flex-center border-b border-borderColor">
        <span class="text-base font-semibold">{{ title }}</span>
        <RouterLink :to="{ name: 'Profile' }" class="absolute top-0 bottom-0 right-0 p-2 mx-2">
          <fa class="text-[25px]" :icon="['fas', 'xmark']" />
        </RouterLink>
      </div>
      <div class="flex-1 overflow-y-scroll">
        <UserItem v-for="u in followUsers" :key="u.id" :user="u" />
      </div>
    </div>
  </Modal>
</template>
