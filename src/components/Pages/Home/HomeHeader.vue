<script setup lang="ts">
import LogoText from "@icons/logo-text.svg";
import NotifiIcon from "@icons/heart.svg";
import UButton from "@/components/UI/UButton.vue";
import SearchInput from "@/components/Molecules/Search/SearchInput.vue";
import SearchResult from "@/components/Molecules/Search/SearchResult.vue";

import { ref } from "vue";
import { useResizeStore, useUserStore } from "@/store";
import { storeToRefs } from "pinia";

const { screen } = storeToRefs(useResizeStore());
const { isLogged } = storeToRefs(useUserStore());

const isShowSearch = ref(false);
</script>

<template>
  <header
    v-if="screen == 'mobile'"
    class="fixed flex items-center top-0 left-0 h-[60px] w-full px-5 border-b border-borderColor bg-bgColor-primary z-30"
  >
    <RouterLink to="/" class="">
      <LogoText class="w-[103px]" />
    </RouterLink>
    <div class="flex flex-1 h-full items-center justify-end">
      <template v-if="isLogged">
        <div class="flex-1 max-w-[280px] mr-5">
          <div class="relative">
            <SearchInput
              @click="
                () => {
                  isShowSearch = true;
                }
              "
              v-click-outside="{
                handle: () => {
                  isShowSearch = false;
                },
                excludes: ['#search-result'],
              }"
            />
            <div
              v-show="isShowSearch"
              id="search-result"
              class="absolute top-full w-[375px] mt-2 left-1/2 -translate-x-1/2"
            >
              <div class="flex-1 bg-bgColor-primary rounded-lg shadow-[0_0_20px_0_rgba(0,0,0,0.2)]">
                <SearchResult />
              </div>
            </div>
          </div>
        </div>
        <RouterLink :to="{ name: 'Home' }"><NotifiIcon class="w-6" /></RouterLink>
      </template>
      <template v-else>
        <UButton primary><RouterLink :to="{ name: 'Login' }">Đăng nhập</RouterLink></UButton>
        <UButton variant="text"
          ><RouterLink :to="{ name: 'Register' }">Đăng ký</RouterLink></UButton
        >
      </template>
    </div>
  </header>
</template>
