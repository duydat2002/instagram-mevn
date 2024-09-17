import api from "@/plugins/axios";
import { IServerData } from "@/types";
import { IConversation, IMessage } from "@/types/chat";

const prefix = "/chat/";

export async function getConvesations() {
  return await api.get<any, IServerData<{ conversations: IConversation[] }>>(
    prefix + "get-conversations"
  );
}

export async function createConversation(
  type: "duo" | "group",
  members: string[],
  groupName?: string
) {
  return await api.post<any, IServerData<{ conversation: IConversation }>>(
    prefix + "create-conversation",
    { type, members, groupName }
  );
}

export async function addPeopleToConversation(conversationId: string, people: string[]) {
  return await api.post<any, IServerData<{ conversation: IConversation }>>(
    prefix + conversationId + "/add-people",
    { people }
  );
}

export async function deletePeopleFromConversation(conversationId: string, people: string[]) {
  return await api.post<any, IServerData<{ conversation: IConversation }>>(
    prefix + conversationId + "/delete-people",
    { people }
  );
}

export async function getMessagesInChat(
  conversationId: string,
  oldestMessageId?: string,
  limit: number = 30
) {
  return await api.get<any, IServerData<{ messages: IMessage[] }>>(
    prefix + conversationId + "/get-messages",
    {
      params: { oldestMessageId, limit },
    }
  );
}

export async function sendMessage(
  conversationId: string,
  content: string,
  type?: string,
  replyTo?: string
) {
  return await api.post<any, IServerData<{ message: IMessage }>>(
    prefix + conversationId + "/send-message",
    { type, content, replyTo }
  );
}
