<script setup lang="ts">
import MicIcon from "@icons/mic.svg";
import ImageIcon from "@icons/image.svg";
import HeartIcon from "@icons/heart.svg";
import EmojiIcon from "@icons/emoji.svg";
import InfoIcon from "@icons/i-circle.svg";
import Avatar from "@/components/Common/Avatar.vue";
import GroupAvatar from "@/components/Common/GroupAvatar.vue";
import EmojiPicker from "@/components/Common/EmojiPicker.vue";
import Messages from "@/components/Pages/Messenger/Messages.vue";

import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useChatStore, useUsersOnlineStore, useUserStore } from "@/store";
import { sendMessage } from "@/services/chat";
import { socket } from "@/plugins/socket";
import { compareDesc } from "date-fns";
import { dateDistanceToNow, dateDistanceToNowStrict } from "@/helpers";
import { IUser } from "@/types";

const { user } = storeToRefs(useUserStore());
const { usersOnline } = storeToRefs(useUsersOnlineStore());
const { selectedConversation: conversation } = storeToRefs(useChatStore());

const message = ref("");
const messageRef = ref<HTMLTextAreaElement>();
const emojiPickerActive = ref(false);

const duoUser = computed(() => {
  if (conversation.value?.type == "duo") {
    return conversation.value?.members.find((m) => m.id != user.value!.id);
  }
});

const avatars = computed(() => conversation.value!.members.map((m) => m.avatar));

const onlineStatus = computed(() => {
  let usersStatus = Array.from(usersOnline.value, ([id, values]) => ({
    id,
    ...values,
  })).filter((s) => s.id != user.value?.id);
  if (usersStatus.some((s) => s.isOnline)) {
    return "Đang hoạt động";
  } else {
    usersStatus = usersStatus
      .filter((m) => m.lastOnline != "")
      .sort((a, b) => compareDesc(a.lastOnline, b.lastOnline));

    if (usersStatus.length == 0) return "Hoạt động 1 phút trước";

    return `Hoạt động ${dateDistanceToNowStrict(usersStatus[0].lastOnline)}`;
  }
});

const getOnlineStatus = (members: IUser[]) => {
  if (members.some((m) => m.isOnline)) {
    return "Đang hoạt động";
  } else {
    const mostRecentLastOnline = members
      .filter((m) => m.lastOnline != "")
      .sort((a, b) => compareDesc(a.lastOnline, b.lastOnline));

    if (mostRecentLastOnline.length == 0) return "";

    return `Hoạt động ${dateDistanceToNowStrict(mostRecentLastOnline[0].lastOnline)}`;
  }
};

const handleInputMessage = () => {
  messageRef.value!.style.height = "";
  messageRef.value!.style.height = Math.min(messageRef.value!.scrollHeight, 80) + "px";

  socket.emit("message:typing", {
    conversationId: conversation.value?.id,
    isTyping: message.value.length > 0,
  });
};

const handleSendMessage = async () => {
  if (message.value.trim() != "") {
    const data = await sendMessage(conversation.value!.id, message.value);

    if (data.success) {
      message.value = "";
      socket.emit("message:typing", {
        conversationId: conversation.value?.id,
        isTyping: false,
      });
    }
  }
};

const handleClickEmoji = (emoji: string) => {
  if (messageRef.value) {
    messageRef.value.setRangeText(
      emoji,
      messageRef.value.selectionStart!,
      messageRef.value.selectionEnd!,
      "end"
    );
    message.value = messageRef.value.value;
    messageRef.value.focus();
  }
};

// onMounted(() => {
//   console.log("object", conversation.value);
//   if (conversation.value) {
//     onlineStatus.value = getOnlineStatus(conversation.value.members as IUser[]);
//   }
// });

onBeforeUnmount(() => {
  socket.emit("message:typing", {
    conversationId: conversation.value?.id,
    isTyping: false,
  });
});
</script>

<template>
  <div v-if="conversation" class="flex h-full">
    <div class="flex-1 h-full flex flex-col">
      <div class="h-[75px] flex items-center justify-between border-b border-borderColor">
        <RouterLink to="" class="flex items-center px-4 py-2">
          <Avatar
            v-if="conversation.type == 'duo'"
            :avatarUrl="duoUser?.avatar"
            width="50"
            class="-ml-1 flex-shrink-0"
          />
          <GroupAvatar v-else :avatars="avatars" class="mr-1" />
          <div class="ml-3 flex flex-col justify-center flex-1 overflow-hidden">
            <div>
              <span class="inline text-base font-semibold text-dots">{{
                conversation.type == "duo" ? duoUser?.username : conversation.groupName
              }}</span>
            </div>
            <div class="flex items-center text-xs text-textColor-secondary">
              <span>{{ onlineStatus }}</span>
            </div>
          </div>
        </RouterLink>
        <InfoIcon class="w-6 h-6 mr-4" />
      </div>
      <Messages />
      <div class="m-4 px-2 flex items-center border border-borderColor rounded-3xl">
        <div class="relative">
          <div
            class="p-2 cursor-pointer"
            @click="
              () => {
                emojiPickerActive = !emojiPickerActive;
              }
            "
          >
            <EmojiIcon width="24" height="24" />
          </div>
          <EmojiPicker
            v-if="emojiPickerActive"
            class="absolute left-0 min-[380px]:left-4 min-[380px]:w-[315px] bottom-full mb-[7px]"
            @clicked="handleClickEmoji"
          />
        </div>
        <div class="flex-grow flex relative">
          <textarea
            v-model="message"
            ref="messageRef"
            placeholder="Nhắn tin..."
            name="comment"
            class="h-[20px] w-full resize-none leading-[18px] overflow-y-hidden"
            @input="handleInputMessage"
            @keydown.enter.exact.prevent="handleSendMessage"
          />
        </div>
        <div class="flex items-center">
          <div class="p-2 cursor-pointer">
            <MicIcon class="w-6 h-6" />
          </div>
          <div class="p-2 cursor-pointer">
            <ImageIcon class="w-6 h-6" />
          </div>
          <div class="p-2 cursor-pointer">
            <HeartIcon class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
    <div class=""></div>
  </div>
</template>
