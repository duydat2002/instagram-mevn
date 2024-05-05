export interface IReply {
  id: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
  comment: string;
  content: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}
