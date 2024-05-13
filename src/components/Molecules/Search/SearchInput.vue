<script setup lang="ts">
import Loading from "@/components/Common/Loading.vue";

import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { debounce } from "@/helpers";
import { searchUsers } from "@/services/search";
import { useSearchStore } from "@/store";

const { search, searchList, isLoadingSearch } = storeToRefs(useSearchStore());
const searchRef = ref<HTMLInputElement>();
const isFocus = ref(false);

const handleSearch = () => {
  debounce(async () => {
    if (search.value != "") {
      isLoadingSearch.value = true;
      searchList.value = [];

      const data = await searchUsers(search.value);

      if (data.success) {
        searchList.value = data.result!.searchs;
      }

      isLoadingSearch.value = false;
    }
  }, 300);
};

const handleResetSearch = () => {
  search.value = "";
  searchList.value = [];
  searchRef.value?.focus();
};
</script>

<template>
  <div
    class="mx-4 flex items-center rounded-lg bg-[#EFEFEF] dark:bg-[#262626]"
    :class="{ focus: isFocus }"
    v-click-outside.short="
      () => {
        isFocus = false;
      }
    "
  >
    <fa
      class="w-4 ml-4 parent-[.focus]:hidden text-[#8e8e8e]"
      :icon="['fas', 'magnifying-glass']"
    />
    <input
      type="text"
      ref="searchRef"
      class="flex-1 py-2 pl-3 pr-4 parent-[.focus]:pl-4 text-base bg-transparent text-textColor-secondary parent-[.focus]:text-textColor-primary"
      placeholder="Tìm kiếm"
      v-model="search"
      @input="handleSearch"
      @focus="
        () => {
          isFocus = true;
        }
      "
    />
    <div class="pr-4">
      <Loading v-if="isLoadingSearch" width="18" color="#767676" />
      <fa
        v-else-if="isFocus"
        class="text-[#838383] cursor-pointer"
        :icon="['fas', 'circle-xmark']"
        @click="handleResetSearch"
      />
    </div>
  </div>
</template>
