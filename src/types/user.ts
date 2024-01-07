export interface IUser {
  id: string;
  username: string;
  fullname?: string;
  avatar: string;
  email: string;
  bio?: string;
  followers: string[];
  followings: string[];
  posts: string[];
  saved_posts: string[];
  tagged_posts: string[];
  liked_posts: string[];
  isPrivate: boolean;
}

export interface IFollowUser extends IUser {
  isFollowed: boolean;
  followOrder: number;
}
