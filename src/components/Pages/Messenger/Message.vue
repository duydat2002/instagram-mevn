<script setup lang="ts">
import Avatar from "@/components/Common/Avatar.vue";
import { useChatStore, useUserStore } from "@/store";
import { IMessage, IMessageUI } from "@/types/chat";
import { format } from "date-fns";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const props = defineProps<{
  message: IMessageUI;
}>();

const { user } = storeToRefs(useUserStore());
const { selectedConversation: conversation } = storeToRefs(useChatStore());

const showReadBy = ref(false);
const showTimeStamp = ref(false);

const author = computed(() => {
  return conversation.value?.members.find((m) => m.id == props.message.message.author);
});

const readBy = computed(() => {
  const members = conversation.value?.members;
  const readByIds = props.message.message.readBy
    .map((r) => r.userId)
    .filter((r) => r != user.value?.id);

  return members?.filter((m) => readByIds.includes(m.id));
});

const showReadByComp = computed(() => {
  return (
    (showReadBy.value && props.message.message.readBy.length > 0) ||
    (conversation.value?.lastMessage.id == props.message.message.id &&
      props.message.message.readBy.length > 0)
  );
});

const toggleMessage = () => {
  showReadBy.value = !showReadBy.value;
  showTimeStamp.value = !showTimeStamp.value;
};
</script>

<template>
  <div class="flex flex-col">
    <div
      v-if="showTimeStamp || message.showTimeStamp"
      class="text-xs text-textColor-secondary font-medium text-center"
    >
      {{ format(message.message.createdAt, "HH:mm") }}
    </div>
    <div class="flex items-center my-[1px]">
      <template v-if="message.isMine">
        <div class="flex-1"></div>
        <div class="w-10"></div>
        <div
          class="bubble"
          :class="{ mine: message.isMine, start: message.startSequence, end: message.endSequence }"
          @click="toggleMessage"
        >
          <span class="" v-html="message.message.content"></span>
        </div>
      </template>
      <template v-else>
        <div class="flex overflow-hidden" :class="[message.endSequence ? 'h-auto' : 'h-0']">
          <Avatar :avatarUrl="author?.avatar" width="28px" />
        </div>
        <div
          class="bubble"
          :class="{ mine: message.isMine, start: message.startSequence, end: message.endSequence }"
          @click="toggleMessage"
        >
          <span class="" v-html="message.message.content"></span>
        </div>
        <div class="w-10"></div>
        <div class="flex-1"></div>
      </template>
    </div>
    <div
      v-if="showReadByComp"
      class="flex items-center"
      :class="[message.isMine ? 'pr-3 self-end' : 'pl-12 self-start']"
    >
      <span
        v-if="conversation?.type == 'duo' && message.isMine"
        class="text-xs text-textColor-secondary"
        >Đã xem</span
      >
      <template v-if="conversation?.type == 'group'">
        <Avatar
          v-for="member in readBy"
          :key="member.id"
          :avatarUrl="member.avatar"
          width="14"
          borderWidth="0px"
          :title="member.username"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.bubble {
  background: #efefef;
  color: #000;
  border-radius: 4px 18px 18px 4px;
  padding: 7px 12px;
}

.bubble.mine {
  background: #3797f0;
  color: #fff;
  border-radius: 18px 4px 4px 18px;
}

.start {
  margin-top: 4px;
  border-top-left-radius: 18px;
}
.mine.start {
  border-top-right-radius: 18px;
}

.end {
  border-bottom-left-radius: 18px;
}
.mine.end {
  border-bottom-right-radius: 18px;
}
</style>
