export interface IReply {
  author: {
    id: string;
    username: string;
  };
  comment: string;
  content: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}
