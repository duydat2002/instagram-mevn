<script setup lang="ts">
import XIcon from "@icons/x-mark.svg";
import Modal from "@/components/Modal/Modal.vue";
import { ref } from "vue";
import { IUser } from "@/types";
import Avatar from "@/components/Common/Avatar.vue";
import UButton from "@/components/UI/UButton.vue";
import { debounce } from "@/helpers";
import { searchUsers } from "@/services/search";
import { storeToRefs } from "pinia";
import { useChatStore, useUserStore } from "@/store";
import { useRouter } from "vue-router";
import { socket } from "@/plugins/socket";

const emit = defineEmits(["close"]);

const router = useRouter();

const { createConversation } = useChatStore();
const { user } = storeToRefs(useUserStore());

const search = ref("");
const searchList = ref<IUser[]>([]);
const selectedList = ref<IUser[]>([]);
const loadingCreateChat = ref(false);

const handleSearch = async () => {
  debounce(async () => {
    searchList.value = [];
    if (search.value != "") {
      const data = await searchUsers(search.value);

      if (data.success) {
        searchList.value = data.result!.searchs;
      }
    }
  }, 300);
};

const clickMember = (member: IUser) => {
  if (selectedList.value.find((u) => u.id == member.id)) {
    deleteMember(member);
  } else {
    selectedList.value.push(member);
  }
  search.value = "";
  searchList.value = [];
};

const deleteMember = (member: IUser) => {
  selectedList.value = selectedList.value.filter((u) => u.id != member.id);
};

const createChat = async () => {
  loadingCreateChat.value = true;

  let members = selectedList.value.map((s) => s.id);
  if (!members.includes(user.value!.id)) members.push(user.value!.id);

  const type = members.length > 2 ? "group" : "duo";
  let groupname;
  if (type == "group") {
    groupname = `${user.value!.fullname} và những người bạn :))`;
  }

  await createConversation(type, members, groupname);

  loadingCreateChat.value = false;
  emit("close");
};

const close = () => {
  emit("close");
};
</script>

<template>
  <Modal isShow @click-outside="close">
    <div class="flex flex-col w-[500px] bg-bgColor-primary rounded-xl overflow-hidden">
      <div class="flex items-center justify-between p-4">
        <span></span>
        <span class="text-base font-bold">Tin nhắn mới</span>
        <XIcon class="w-4 cursor-pointer" @click="close" />
      </div>
      <div class="flex items-center px-4 py-1 border-t border-b border-borderColor">
        <span class="text-base font-semibold">Tới:</span>
        <div v-if="selectedList.length > 0" class="mx-2 flex items-center">
          <div
            v-for="u in selectedList"
            :key="u.id"
            class="flex items-center px-3 py-1 rounded-xl bg-[#e0f1ff]"
          >
            <span
              class="text-sm font-semibold mr-2 text-[#0095f6] hover:text-[#00376b] cursor-pointer"
              >{{ u.username }}</span
            >
            <XIcon class="w-3 text-[#0095f6] cursor-pointer" @click="deleteMember(u)" />
          </div>
        </div>
        <input
          class="text-base px-4 py-1"
          v-model="search"
          placeholder="Tìm kiếm..."
          @input="handleSearch"
        />
      </div>
      <div class="h-[200px] pt-4 overflow-y-scroll">
        <div v-if="searchList.length == 0" class="px-5 py-3 text-textColor-secondary">
          Không tìm thấy tài khoản.
        </div>
        <div v-else class="flex flex-col gap-2">
          <div
            v-for="u in searchList"
            :key="u.id"
            class="flex items-center mx-4 cursor-pointer"
            @click="clickMember(u)"
          >
            <Avatar class="" width="40" :avatarUrl="u.avatar" />
            <div class="flex-1 flex flex-col ml-2">
              <span class="text-textColor-primary">{{ u.fullname }}</span>
              <span class="text-xs text-textColor-secondary">{{ u.username }}</span>
            </div>
            <div
              v-if="selectedList.find((s) => s.id == u.id)"
              class="flex flex-center w-6 h-6 rounded-full border-borderColor bg-black border-[1px]"
            >
              <fa :icon="['fas', 'check']" class="w-4 text-white" />
            </div>
            <div
              v-else
              class="flex flex-center w-6 h-6 rounded-full border-borderColor border-[1px]"
            ></div>
          </div>
        </div>
      </div>
      <div class="p-4">
        <UButton
          primary
          size="large"
          class="w-full"
          @click="createChat"
          :isLoading="loadingCreateChat"
          ><span class="">Chat</span></UButton
        >
      </div>
    </div>
  </Modal>
</template>
