<script setup lang="ts">
import Avatar from "@/components/Common/Avatar.vue";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store";
import { IConversation } from "@/types/chat";
import { dateDistanceToNowStrict } from "@/helpers";
import GroupAvatar from "@/components/Common/GroupAvatar.vue";
import { watch } from "vue";

const props = defineProps<{
  conversation: IConversation;
}>();

const { user } = storeToRefs(useUserStore());

const lastMessageTime = ref("");
const intervalLastMessage = ref<NodeJS.Timeout>();

const duoUser = computed(() => {
  if (props.conversation.type == "duo") {
    return props.conversation.members.find((m) => m.id != user.value!.id);
  }
});

const lastMessageDesc = computed(() => {
  const lastMessage = props.conversation.lastMessage;

  if (!lastMessage) return "";
  if (lastMessage.type == "image") return "Bạn đã gửi một ảnh.";
  else if (lastMessage.type == "voice") return "Bạn đã gửi một tin nhắn thoại.";
  else return `${lastMessage.author == user.value?.id ? "Bạn: " : ""}${lastMessage.content}`;
});

const avatars = computed(() => props.conversation.members.map((m) => m.avatar));

watch(
  () => props.conversation.lastMessage,
  () => {
    lastMessageTime.value = dateDistanceToNowStrict(props.conversation.lastMessage.createdAt);
  }
);

onMounted(() => {
  if (props.conversation.lastMessage) {
    lastMessageTime.value = dateDistanceToNowStrict(props.conversation.lastMessage.createdAt);
    intervalLastMessage.value = setInterval(() => {
      lastMessageTime.value = dateDistanceToNowStrict(props.conversation.lastMessage.createdAt);
    }, 10000);
  }
});

onBeforeUnmount(() => {
  clearInterval(intervalLastMessage.value);
});
</script>

<template>
  <RouterLink
    :to="{ name: 'Conversation', params: { conversationId: conversation.id } }"
    class="flex items-center justify-center px-4 py-2 has-[exact-link-active]:bg-hover"
  >
    <Avatar
      v-if="conversation.type == 'duo'"
      :avatarUrl="duoUser?.avatar"
      width="50"
      class="-ml-1 flex-shrink-0"
    />
    <GroupAvatar v-else :avatars="avatars" />
    <div class="hidden min-[900px]:flex ml-3 flex-col justify-center flex-1 overflow-hidden">
      <div>
        <span
          class="inline text-dots"
          :class="[conversation.unreadCount > 0 ? 'font-semibold' : 'font-normal']"
          >{{ conversation.type == "duo" ? duoUser?.username : conversation.groupName }}</span
        >
      </div>
      <div
        v-if="conversation.lastMessage"
        class="flex items-center text-xs text-textColor-secondary"
      >
        <span
          class="text-dots"
          :class="[
            conversation.unreadCount > 0
              ? 'font-semibold text-textColor-primary'
              : 'font-normal text-textColor-secondary',
          ]"
          >{{ lastMessageDesc }}</span
        >
        <span class="flex-shrink-0 ml-1"> • {{ lastMessageTime }}</span>
      </div>
    </div>
    <div v-if="conversation.unreadCount > 0" class="flex flex-center">
      <div class="flex flex-center w-5 h-5 rounded-full bg-blue-600">
        <span class="text-xs text-white">{{ conversation.unreadCount }}</span>
      </div>
    </div>
  </RouterLink>
</template>
