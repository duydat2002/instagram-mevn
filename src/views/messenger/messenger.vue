<script lang="ts" setup>
import PenSquareIcon from "@icons/pen-square.svg";
import ConversationItem from "@/components/Pages/Messenger/ConversationItem.vue";

import { ref, onBeforeMount, onMounted, onBeforeUnmount, computed } from "vue";
import { socket } from "@/plugins/socket";
import { storeToRefs } from "pinia";
import { useChatStore, useUserStore } from "@/store";
import { getConvesations } from "@/services/chat";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import CreateConversation from "@/components/Pages/Messenger/CreateConversation.vue";

const route = useRoute();

const { selectConversation } = useChatStore();

const { user } = storeToRefs(useUserStore());
const { conversations } = storeToRefs(useChatStore());

const showCreateChat = ref(false);

const conversationsComp = computed(() => {
  return conversations.value.filter((c) => c.lastMessage);
});

onBeforeRouteUpdate(async (to, _, next) => {
  if (to.params.conversationId) selectConversation(to.params.conversationId.toString());

  next();
});

onMounted(async () => {
  if (route.params.conversationId) selectConversation(route.params.conversationId.toString());
});

onBeforeUnmount(() => {
  selectConversation(null);
});
</script>

<template>
  <div v-if="user" class="pb-12 min-[768px]:pb-0 flex w-full h-screen overflow-hidden">
    <div class="w-[120px] min-[900px]:w-[400px] flex flex-col border-r border-borderColor">
      <div
        class="h-[75px] px-6 pb-3 flex-shrink-0 flex items-end justify-center min-[900px]:justify-between"
      >
        <span
          class="hidden min-[900px]:block pb-2 text-xl leading-6 font-bold text-textColor-primary cursor-pointer"
          >{{ user?.username }}</span
        >
        <div class="p-2">
          <PenSquareIcon
            class="w-6 h-6 cursor-pointer"
            @click="
              () => {
                showCreateChat = true;
              }
            "
          />
        </div>
      </div>
      <div class="flex-1 overflow-y-scroll">
        <div class="flex flex-col">
          <div class="hidden min-[900px]:flex px-6 py-3 items-center justify-between">
            <span class="text-base font-bold text-textColor-primary">Tin nhắn</span>
            <span class="text-sm font-semibold text-textColor-secondary">Tin nhắn đang chờ</span>
          </div>
          <ConversationItem
            v-if="conversations"
            v-for="conversation in conversationsComp"
            :key="conversation.id"
            :conversation="conversation"
          />
        </div>
      </div>
    </div>
    <div class="flex-1">
      <RouterView></RouterView>
    </div>
    <CreateConversation
      v-if="showCreateChat"
      @close="
        () => {
          showCreateChat = false;
        }
      "
    />
  </div>
</template>
