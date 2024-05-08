<script lang="ts" setup>
import Loading from "@/components/Common/Loading.vue";
import UserItem from "@/components/Molecules/User/UserItem.vue";

import { ref, onMounted } from "vue";
import {
  getHistories,
  searchUsers,
  addSearchHistory,
  deleteSearchHistory,
  deleteAllSearchHistory,
} from "@/services/search";
import { debounce } from "@/helpers";
import { IUser } from "@/types";
import ConfirmPopup from "@/components/Popup/ConfirmPopup.vue";

const emit = defineEmits(["close"]);

const searchHistory = ref<IUser[]>([]);
const searchList = ref<IUser[]>([]);
const search = ref("");
const isLoading = ref(false);
const isFocus = ref(false);
const deleteAllPopup = ref(false);

const handleSearch = () => {
  debounce(async () => {
    if (search.value != "") {
      isLoading.value = true;
      searchList.value = [];

      const data = await searchUsers(search.value);

      if (data.success) {
        searchList.value = data.result!.searchs;
      }

      isLoading.value = false;
    }
  }, 300);
};

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

const handleDeleteAllHistories = async () => {
  const data = await deleteAllSearchHistory();

  if (data.success) {
    searchHistory.value = [];
  }
  deleteAllPopup.value = false;
};

const getSearchHistories = async () => {
  const data = await getHistories();
  if (data.success) {
    const histories = data.result!.searchs.map((s) => s.search);
    searchHistory.value = histories;
  }
};

const handleResetSearch = () => {
  search.value = "";
  searchList.value = [];
};

onMounted(async () => {
  await getSearchHistories();
});
</script>

<template>
  <div
    class="w-[400px] h-full rounded-r-2xl flex flex-col bg-bgColor-primary border-r border-borderColor shadow-[4px_0_24px_rgba(0,0,0,0.15)]"
  >
    <span class="block p-6 mb-4 text-2xl font-semibold text-textColor-primary">Tìm kiếm</span>
    <div class="flex-1 flex flex-col">
      <div
        class="mx-4 relative flex items-center rounded-lg bg-[#EFEFEF] dark:bg-[#262626]"
        :class="{ focus: isFocus }"
      >
        <fa
          class="w-4 ml-4 parent-[.focus]:hidden text-[#8e8e8e]"
          :icon="['fas', 'magnifying-glass']"
        />
        <input
          type="text"
          class="flex-1 py-2 pl-3 pr-4 parent-[.focus]:pl-4 text-base bg-transparent"
          placeholder="Tìm kiếm"
          v-model="search"
          @input="handleSearch"
          @focus="
            () => {
              isFocus = true;
            }
          "
          v-click-outside.short="
            () => {
              isFocus = false;
            }
          "
        />
        <div class="absolute top-1/2 -translate-y-1/2 right-4">
          <Loading v-if="isLoading" width="18" color="#767676" />
          <fa
            v-else-if="isFocus"
            class="text-[#838383] cursor-pointer"
            :icon="['fas', 'circle-xmark']"
            @click="handleResetSearch"
          />
        </div>
      </div>
      <div class="mt-6 border-t border-borderColor"></div>
      <div class="flex-1">
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
              <UserItem
                v-for="user in searchHistory"
                :key="user.id"
                :user="user"
                class="px-6"
                @click="handleClickHistoryItem(user.id)"
              >
                <fa
                  class="flex-shrink-0 w-5 h-5 p-2 ml-3 text-textColor-secondary cursor-pointer"
                  :icon="['fas', 'xmark']"
                  @click.stop="handleDeleteHistory(user.id)"
                />
              </UserItem>
            </div>
            <div
              v-else
              class="w-full h-full flex flex-center font-semibold text-textColor-secondary"
            >
              Không có nội dung tìm kiếm mới đây.
            </div>
          </div>
        </div>
        <div v-else class="w-full h-full flex flex-col overflow-y-auto">
          <div v-if="isLoading" class="flex w-full h-full flex-center">
            <Loading v-if="isLoading" width="20" color="#767676" />
          </div>
          <UserItem
            v-else-if="searchList.length > 0"
            v-for="user in searchList"
            :key="user.id"
            :user="user"
            class="px-6"
            @click="handleClickUserItem(user.id)"
          />
          <div v-else class="w-full h-full flex flex-center font-semibold text-textColor-secondary">
            Không tìm thấy kết quả nào.
          </div>
        </div>
      </div>
    </div>
    <ConfirmPopup
      v-if="deleteAllPopup"
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
  </div>
</template>
