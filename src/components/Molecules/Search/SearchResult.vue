<script setup lang="ts">
import UserItem from "../User/UserItem.vue";
import Loading from "@/components/Common/Loading.vue";
import ConfirmPopup from "@/components/Popup/ConfirmPopup.vue";

import { ref, onMounted } from "vue";
import { IUser } from "@/types";
import {
  addSearchHistory,
  deleteAllSearchHistory,
  deleteSearchHistory,
  getHistories,
} from "@/services/search";
import { storeToRefs } from "pinia";
import { useSearchStore } from "@/store";

const emit = defineEmits(["close"]);

const { search, searchList, isLoadingSearch } = storeToRefs(useSearchStore());
const searchHistory = ref<IUser[]>([]);
const deleteAllPopup = ref(false);

const handleClickUserItem = async (searchId: string) => {
  const data = await addSearchHistory(searchId);

  if (data.success) {
    await getSearchHistories();
  }
};

const handleClickHistoryItem = async (searchId: string) => {
  emit("close");
  await handleClickUserItem(searchId);
};

const handleDeleteHistory = async (searchId: string) => {
  const data = await deleteSearchHistory(searchId);

  if (data.success) {
    searchHistory.value = searchHistory.value.filter((s) => s.id != searchId);
  }
};

const getSearchHistories = async () => {
  const data = await getHistories();
  if (data.success) {
    const histories = data.result!.searchs.map((s) => s.search);
    searchHistory.value = histories;
  }
};

const handleDeleteAllHistories = async () => {
  const data = await deleteAllSearchHistory();

  if (data.success) {
    searchHistory.value = [];
  }
  deleteAllPopup.value = false;
};

onMounted(async () => {
  await getSearchHistories();
});
</script>

<template>
  <div v-if="search == ''" class="w-full h-full flex flex-col">
    <div class="m-6 flex items-center justify-between">
      <span class="text-base font-semibold">Gần đây</span>
      <span
        v-if="searchHistory.length > 0"
        class="font-semibold text-buttonColor-primary hover:text-link cursor-pointer"
        @click="
          () => {
            deleteAllPopup = true;
          }
        "
        >Xóa tất cả</span
      >
    </div>
    <div class="w-full h-full">
      <div v-if="searchHistory.length > 0" class="w-full h-full flex flex-col">
        <RouterLink
          v-for="user in searchHistory"
          :key="user.id"
          :to="{ name: 'Profile', params: { username: user.username } }"
        >
          <UserItem
            :user="user"
            class="px-6 hover:bg-hover"
            @click="handleClickHistoryItem(user.id)"
          >
            <fa
              class="flex-shrink-0 w-5 h-5 p-2 ml-3 text-textColor-secondary cursor-pointer"
              :icon="['fas', 'xmark']"
              @click.stop.prevent="handleDeleteHistory(user.id)"
            />
          </UserItem>
        </RouterLink>
      </div>
      <div
        v-else
        class="w-full h-full flex flex-center font-semibold text-textColor-secondary py-5"
      >
        Không có nội dung tìm kiếm mới đây.
      </div>
    </div>
  </div>
  <div v-else class="w-full h-full flex flex-col overflow-y-auto py-3">
    <div v-if="isLoadingSearch" class="flex w-full h-full flex-center">
      <Loading width="30" color="#767676" />
    </div>
    <RouterLink
      v-else-if="searchList.length > 0"
      v-for="user in searchList"
      :key="user.id"
      :to="{ name: 'Profile', params: { username: user.username } }"
    >
      <UserItem :user="user" class="px-6 hover:bg-hover" @click="handleClickUserItem(user.id)" />
    </RouterLink>
    <div v-else class="w-full h-full flex flex-center font-semibold text-textColor-secondary py-5">
      Không tìm thấy kết quả nào.
    </div>
  </div>
  <ConfirmPopup
    v-if="deleteAllPopup"
    id="deleteAllSearchPopup"
    title="Xóa lịch sử tìm kiếm?"
    desc="Bạn sẽ không thể hoàn tác
            hành động này. Nếu xóa lịch sử tìm kiếm, có thể bạn vẫn nhìn thấy các tài khoản mình đã
            tìm trong kết quả gợi ý."
    confirmMessage="Clear all"
    cancelMessage="Lúc khác"
    @confirm="handleDeleteAllHistories"
    @cancel="
      () => {
        deleteAllPopup = false;
      }
    "
  />
</template>
