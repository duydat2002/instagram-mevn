import { defineStore } from "pinia";
import { IConversation, IMessage } from "@/types/chat";
import { socket } from "@/plugins/socket";
import {
  createConversation as createConversationAPI,
  getConvesations,
  getMessagesInChat,
} from "@/services/chat";
import { useUserStore } from "./user";
import { useUsersOnlineStore } from "./usersOnline";
import { LIMIT_MESSAGE_FETCH } from "@/constants";

interface IState {
  conversations: IConversation[];
  conversationId: string | null;
  messages: IMessage[];
}

export const useChatStore = defineStore("chat", {
  state: (): IState => ({
    conversations: [],
    conversationId: null,
    messages: [],
  }),
  actions: {
    initializeChatSocket() {
      socket.on("conversation:created", (conversation: IConversation) => {
        this.addConversation(conversation);
      });
      socket.on("conversation:read", ({ conversationId }) => {
        const conversation = this.conversations.find((c) => c.id == conversationId);
        console.log("conversation:read", conversation?.id);
        if (!conversation) return;
        conversation.unreadCount = 0;
      });
      socket.on("message:sent", (message: IMessage) => {
        console.log("message:sent");
        const conversation = this.conversations.find((c) => c.id == message.conversation);

        if (!conversation) return;

        conversation.messages.push(message);
        conversation.lastMessage = message;

        if (message.conversation == this.conversationId) {
          conversation.unreadCount = 0;
          socket.emit("conversation:read", { conversationId: this.conversationId });
        } else {
          conversation.unreadCount++;
          socket.emit("conversation:incUnread", { conversationId: this.conversationId });
        }
      });

      socket.on("messages:read", ({ conversationId, messageIds, userId, readAt }) => {
        console.log("messages:read");

        const conversation = this.conversations.find((c) => c.id == conversationId);
        if (!conversation) return;

        conversation.messages.forEach((m) => {
          if (messageIds.includes(m.id) && !m.readBy.find((r) => r.userId == userId)) {
            m.readBy.push({ userId, readAt });
          }
        });
      });

      socket.on("message:typing", ({ userId, conversationId, isTyping }) => {
        const conversation = this.conversations.find((c) => c.id == conversationId);
        if (conversation) {
          if (!conversation.typingUser) conversation.typingUser = new Map();
          if (isTyping) {
            conversation.typingUser.set(userId, true);
          } else {
            conversation.typingUser.delete(userId);
          }
        }
      });
    },
    async init() {
      const usersOnlineStore = useUsersOnlineStore();

      const data = await getConvesations();
      if (data.success) this.conversations = data.result!.conversations;

      this.conversations = this.conversations.map((c) => ({
        ...c,
        messages: [],
        typingUser: new Map(),
      }));

      const people = this.conversations.flatMap((c) => c.members);
      people.forEach((p) => {
        usersOnlineStore.usersOnline.set(p.id, { isOnline: p.isOnline, lastOnline: p.lastOnline });
      });
    },
    async selectConversation(conversationId: string | null) {
      this.conversationId = conversationId;

      const conversation = this.conversations.find((c) => c.id == this.conversationId);
      if (!conversation) return;

      conversation.unreadCount = 0;
      socket.emit("conversation:read", { conversationId: this.conversationId });
      // Read messages
      const messages = conversation.messages;
      if (messages.length <= LIMIT_MESSAGE_FETCH) {
        const userStore = useUserStore();

        const messageIds = messages
          .filter(
            (m) =>
              !m.readBy.find((r) => r.userId == userStore.user?.id) &&
              m.author != userStore.user?.id
          )
          .map((m) => m.id);
        socket.emit("messages:read", { conversationId: this.conversationId, messageIds });
      }
    },
    async loadMessagesForSelected(order: "backward" | "forward" = "backward") {
      const conversation = this.conversations.find((c) => c.id == this.conversationId);

      if (conversation) {
        const firstMessage =
          conversation.messages.length > 0 ? conversation.messages[0] : undefined;
        const data = await getMessagesInChat(
          conversation.id,
          firstMessage?.id,
          LIMIT_MESSAGE_FETCH
        );
        if (data.success) {
          const messagesData = data.result!.messages;
          if (messagesData.length == 0) return;

          conversation.messages.unshift(...messagesData.reverse());
          conversation.hasMore = messagesData.length == LIMIT_MESSAGE_FETCH;

          // Read messages
          const userStore = useUserStore();

          const messageIds = messagesData
            .filter((m) => !m.readBy.find((r) => r.userId == userStore.user?.id))
            .map((m) => m.id);
          socket.emit("messages:read", { conversationId: this.conversationId, messageIds });
        }
      }
    },
    async createConversation(type: "duo" | "group", members: string[], groupName?: string) {
      const data = await createConversationAPI(type, members, groupName);

      if (data.success) {
        let conversation = data.result!.conversation;

        this.addConversation(conversation);
        this.conversationId = conversation.id;
      }
    },
    addConversation(conversation: IConversation) {
      const usersOnlineStore = useUsersOnlineStore();

      if (this.conversations.find((c) => c.id != conversation.id)) {
        socket.emit("conversation:created", { conversationId: conversation.id });

        conversation = {
          ...conversation,
          messages: [],
          typingUser: new Map(),
        };

        this.conversations.unshift(conversation);
        conversation.members.forEach((p) => {
          usersOnlineStore.usersOnline.set(p.id, {
            isOnline: p.isOnline,
            lastOnline: p.lastOnline,
          });
        });
      }
    },
  },
  getters: {
    selectedConversation: (state) => {
      return state.conversations.find((c) => c.id == state.conversationId);
    },
    unreadConversation: (state) => {
      return state.conversations.filter((c) => c.unreadCount > 0).length;
    },
  },
});
