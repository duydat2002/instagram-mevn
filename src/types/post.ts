export interface IPost {
  id: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
  caption: string;
  contents: string[];
  type: "image" | "video" | "reel" | "multiple";
  tags: string[];
  likes: string[];
  comments: string[];
  viewers: string[];
  ratio: number;
  createdAt: string;
  updatedAt: string;
}
