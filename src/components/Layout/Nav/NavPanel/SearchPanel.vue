<script lang="ts" setup>
import SearchInput from "@/components/Molecules/Search/SearchInput.vue";
import SearchResult from "@/components/Molecules/Search/SearchResult.vue";
</script>

<template>
  <div
    class="w-[400px] h-full rounded-r-2xl flex flex-col bg-bgColor-primary border-r border-borderColor shadow-[4px_0_24px_rgba(0,0,0,0.15)]"
  >
    <span class="block p-6 mb-4 text-2xl font-semibold text-textColor-primary">Tìm kiếm</span>
    <div class="flex-1 flex flex-col">
      <SearchInput />
      <div class="mt-6 border-t border-borderColor"></div>
      <div class="flex-1">
        <SearchResult />
      </div>
    </div>
  </div>
</template>
