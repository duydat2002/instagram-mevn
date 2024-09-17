export interface IConversation {
  id: string;
  type: "duo" | "group";
  groupName?: boolean;
  members: {
    id: string;
    username: string;
    avatar: string;
    isOnline: boolean;
    lastOnline: string;
  }[];
  lastMessage: {
    id: string;
    author: string;
    type: "text" | "image" | "voice";
    content: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
  messages: IMessage[];
  typingUser: Map<string, boolean>;
  unreadCount: number;
  hasMore: boolean;
}

export interface IMessage {
  id: string;
  conversation: string;
  author: string;
  type: "text" | "image" | "voice";
  content: string;
  replyTo?: string;
  readBy: {
    userId: string;
    readAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface IMessageUI {
  message: IMessage;
  isMine: boolean;
  startSequence: boolean;
  endSequence: boolean;
  showTimeStamp: boolean;
}
