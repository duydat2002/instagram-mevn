import api from "@/plugins/axios";
import { IFollowUser, IPost, IServerData } from "@/types";

const prefix = "/posts/";

export async function createPost(data: FormData) {
  return await api.post<any, IServerData<IPost>>(prefix, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function getPostById(postId: string) {
  return await api.get<any, IServerData<{ post: IPost }>>(prefix + postId);
}

export async function updatePost(postId: string, caption?: string, tags?: string[]) {
  return await api.patch<any, IServerData<{ post: IPost }>>(prefix + postId, { caption, tags });
}

export async function deletePost(postId: string) {
  return await api.delete<any, IServerData<{ post: IPost }>>(prefix + postId);
}

export async function getLikedUsersOfPost(postId: string) {
  return await api.get<any, IServerData<{ users: IFollowUser[] }>>(prefix + postId + "/likes");
}

export async function likePost(postId: string) {
  return await api.post<any, IServerData>(prefix + postId + "/like");
}

export async function unlikePost(postId: string) {
  return await api.post<any, IServerData>(prefix + postId + "/unlike");
}

export async function savePost(postId: string) {
  return await api.post<any, IServerData>(prefix + postId + "/save");
}

export async function unsavePost(postId: string) {
  return await api.post<any, IServerData>(prefix + postId + "/unsave");
}

export async function viewedPost(postId: string) {
  return await api.post<any, IServerData>(prefix + postId + "/viewed");
}

export async function getPostsIsFollow() {
  return await api.get<any, IServerData<{ posts: IPost[] }>>(prefix + "get-posts-follow/");
}

export async function getNewFeeds(start: number, pageSize: number = 2) {
  return await api.get<any, IServerData<{ posts: IPost[] }>>(prefix + "get-newfeeds", {
    params: { start, pageSize },
  });
}

export async function getPostsByAuthor(authorId: string) {
  return await api.get<any, IServerData<{ posts: IPost[] }>>(prefix + "get-posts/" + authorId);
}

export async function getOtherPostsByAuthor(postId: string, authorId: string) {
  return await api.get<any, IServerData<{ posts: IPost[] }>>(
    prefix + postId + "/get-other-posts/" + authorId
  );
}

export async function getSavedPosts() {
  return await api.get<any, IServerData<{ posts: IPost[] }>>(prefix + "get-saved-posts/");
}

export async function getTaggedPostsByUserId(authorId: string) {
  return await api.get<any, IServerData<{ posts: IPost[] }>>(
    prefix + "get-tagged-posts/" + authorId
  );
}
