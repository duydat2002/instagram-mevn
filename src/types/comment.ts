export interface IComment {
  author: {
    id: string;
    username: string;
  };
  content: string;
  likes: string[];
  replies: string[];
  commentTo: "post" | "story";
  post: string;
  createdAt: string;
  updatedAt: string;
}
