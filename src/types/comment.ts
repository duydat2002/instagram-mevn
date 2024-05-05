export interface IComment {
  id: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
  content: string;
  likes: string[];
  replies: string[];
  commentTo: "post" | "story";
  post: string;
  createdAt: string;
  updatedAt: string;
}
