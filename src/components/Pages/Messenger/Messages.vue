<script setup lang="ts">
import Message from "@/components/Pages/Messenger/Message.vue";

import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useChatStore, useUserStore } from "@/store";
import { IMessageUI } from "@/types/chat";
import { intervalToDuration } from "date-fns";
import { nextTick } from "vue";

const { loadMessagesForSelected } = useChatStore();

const { user } = storeToRefs(useUserStore());
const { conversationId, selectedConversation: conversation } = storeToRefs(useChatStore());

const messagesContainer = ref<HTMLDivElement>();
const outOfPost = ref(false);

const messagesComp = computed<IMessageUI[]>(() => {
  if (!conversation.value) return [];

  const messages = conversation.value.messages ?? [];

  return messages.map((m, i) => {
    const prevMessage = messages[i - 1];
    const nextMessage = messages[i + 1];
    const isMine = m.author == user.value?.id;
    let prevBySameAuthor = false;
    let nextBySameAuthor = false;
    let startSequence = true;
    let endSequence = true;
    let showTimeStamp = true;

    if (prevMessage) {
      const timestampDuration = intervalToDuration({
        start: prevMessage.createdAt,
        end: m.createdAt,
      });
      prevBySameAuthor = prevMessage.author == m.author;

      if (!timestampDuration.hours || timestampDuration.hours < 1) {
        if (prevBySameAuthor) {
          showTimeStamp = false;
          startSequence = false;
        }
      }
    }

    if (nextMessage) {
      const timestampDuration = intervalToDuration({
        start: m.createdAt,
        end: nextMessage.createdAt,
      });
      nextBySameAuthor = nextMessage.author == m.author;

      if (nextBySameAuthor && (!timestampDuration.hours || timestampDuration.hours < 1)) {
        endSequence = false;
      }
    }

    return {
      message: m,
      isMine,
      startSequence,
      endSequence,
      showTimeStamp,
    };
  });
});

const someoneTyping = computed(() => {
  if (conversation.value?.typingUser?.size) {
    const typings = Array.from(conversation.value.typingUser.keys());

    const usernames = conversation.value.members
      .filter((m) => typings.includes(m.id))
      .map((m) => m.username);

    return usernames.join(", ") + " đang nhập...";
  }
});

const resetChat = () => {
  outOfPost.value = false;
};

const fetchMessages = async () => {
  if (conversation.value?.hasMore) {
    const beforeScrollTop = messagesContainer.value?.scrollTop ?? 0;
    const beforeScrollHeight = messagesContainer.value?.scrollHeight ?? 0;
    await loadMessagesForSelected();
    nextTick(() => {
      if (messagesContainer.value) {
        const afterScrollHeight = messagesContainer.value.scrollHeight;

        messagesContainer.value.scrollTop =
          beforeScrollTop + (afterScrollHeight - beforeScrollHeight);
      }
    });
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value)
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
};

watch(
  () => conversation.value?.lastMessage,
  async () => {
    await scrollToBottom();
  },
  { immediate: true }
);

watch(
  conversationId,
  async () => {
    resetChat();
    if (conversation.value?.messages?.length == 0) await loadMessagesForSelected();
    await scrollToBottom();
  },
  { immediate: true }
);
</script>

<template>
  <div
    ref="messagesContainer"
    v-infinite-scroll.self.up="fetchMessages"
    class="flex-1 overflow-y-scroll"
  >
    <div class="h-full flex flex-col px-4 pt-4">
      <div class="flex-1 flex flex-col">
        <Message v-for="m in messagesComp" :key="m.message.id" :message="m" />
      </div>
      <div v-if="someoneTyping" class="flex justify-end">
        <span class="text-xs text-textColor-secondary">{{ someoneTyping }}</span>
      </div>
    </div>
  </div>
</template>
