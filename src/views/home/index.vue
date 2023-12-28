<script lang="ts" setup>
import HomePage from "./homePage.vue";
import HomeLogin from "./homeLogin.vue";

import { storeToRefs } from "pinia";
import { useUserStore } from "@/store";

const { isLogged } = storeToRefs(useUserStore());
</script>

<template>
  <HomePage v-if="isLogged" />
  <HomeLogin v-else />
</template>
