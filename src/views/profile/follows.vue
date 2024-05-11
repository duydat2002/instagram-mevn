<script lang="ts" setup>
import UsersModal from "@/components/Modal/UsersModal.vue";

import { onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore, useUsersModalStore } from "@/store";
import { getFollowers, getFollowings, getMutualFollowedBy } from "@/services/user";

const route = useRoute();
const router = useRouter();

const { profileUser } = storeToRefs(useUserStore());
const { title, users } = storeToRefs(useUsersModalStore());

const handleCancel = () => {
  router.push({ name: "Profile", params: { username: profileUser.value?.username } });
};

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

  users.value = data?.result?.users || [];
});
</script>

<template>
  <UsersModal @cancel="handleCancel" />
</template>
