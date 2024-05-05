<script lang="ts" setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { FOOTER_LINKS, LANGUAGES } from "@/constants";

const currentLanguege = ref({ value: "vi", name: "Tiếng Việt" });
</script>

<template>
  <footer class="mt-6 mb-12">
    <div class="flex flex-wrap justify-center gap-y-3">
      <RouterLink
        v-for="link in FOOTER_LINKS"
        :key="link.name"
        :to="link.path"
        class="mx-2 text-xs text-textColor-secondary hover:underline"
        >{{ link.name }}</RouterLink
      >
    </div>
    <div class="flex justify-center my-3 gap-4 text-xs text-textColor-secondary">
      <div class="relative">
        <span>{{ currentLanguege.name }} <fa :icon="['fas', 'chevron-down']" /></span>
        <select
          v-model="currentLanguege"
          class="absolute top-0 left-0 bottom-0 right-0 opacity-0 cursor-pointer"
        >
          <option v-for="language in LANGUAGES" :key="language.value" :value="language">
            {{ language.name }}
          </option>
        </select>
      </div>
      <span class="">© 2023 Instagram from Meta</span>
    </div>
  </footer>
</template>
