<script lang="ts" setup>
import HomePage from "./homePage.vue";
import HomeLogin from "./homeLogin.vue";

import { useUserStore } from "@/store";

const { isLogged } = useUserStore();
</script>

<template>
  <HomePage v-if="isLogged" />
  <HomeLogin v-else />
</template>
