<script lang="ts" setup>
import { useUserStore } from "@/store";
import { useRouter } from "vue-router";

const router = useRouter();

const handleLogout = async () => {
  const { logout } = useUserStore();

  await logout();
  router.go(0);
};
</script>

<template>
  <div>
    <p>Home page</p>
    <p class="" @click="handleLogout">Logout</p>
  </div>
</template>
