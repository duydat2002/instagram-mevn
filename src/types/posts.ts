export interface IPost {
  author: {
    id: string;
    username: string;
  };
  caption: string;
  contents: string[];
  type: "image" | "video" | "reel" | "multiple";
  tags: string[];
  likes: string[];
  comments: string[];
  ratio: number;
  createdAt: string;
  updatedAt: string;
}
