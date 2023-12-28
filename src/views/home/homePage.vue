<script lang="ts" setup>
import { useUserStore } from "@/store";

const handleLogout = async () => {
  const { logout } = useUserStore();

  await logout();
};
</script>

<template>
  <div>
    <p>Home page</p>
    <p class="" @click="handleLogout">Logout</p>
  </div>
</template>
