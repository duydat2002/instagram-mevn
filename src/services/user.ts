import api from "@/plugins/axios";
import { IFollowUser, IPost, IServerData, IUser, IUserReview } from "@/types";

const prefix = "/users/";

export async function getUser() {
  return await api.get<any, IServerData<{ user: IUser }>>(prefix + "get-info");
}

export async function getUserById(id: string) {
  return await api.get<any, IServerData<{ user: IUser }>>(prefix + id);
}

export async function getUserByUsername(username: string) {
  return await api.get<any, IServerData<{ user: IUser }>>(prefix + "by-username/" + username);
}

export async function getUserPreview(id: string) {
  return await api.get<any, IServerData<IUserReview>>(prefix + id + "/get-review");
}

// User profile
export async function updateUserAvatar(userId: string, data: FormData) {
  return await api.patch<any, IServerData<{ avatar: string }>>(prefix + userId + "/avatar", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteUserAvatar(userId: string) {
  return await api.delete<any, IServerData>(prefix + userId + "/avatar");
}

// User follow Other user
export async function followUser(userId: string, otherUserId: string) {
  return await api.post<any, IServerData>(prefix + userId + "/follow", { id: otherUserId });
}

export async function unfollowUser(userId: string, otherUserId: string) {
  return await api.post<any, IServerData>(prefix + userId + "/unfollow", { id: otherUserId });
}

export async function getMutualFollowedBy(userId: string) {
  return await api.get<any, IServerData<{ users: IFollowUser[] }>>(
    prefix + userId + "/mutual-follow"
  );
}

export async function getFollowers(userId: string) {
  return await api.get<any, IServerData<{ users: IFollowUser[] }>>(prefix + userId + "/followers");
}

export async function getFollowings(userId: string) {
  return await api.get<any, IServerData<{ users: IFollowUser[] }>>(prefix + userId + "/followings");
}

export async function checkIsFollowing(otherUserId: string) {
  return await api.post<any, IServerData<boolean>>(prefix + otherUserId + "/check-following");
}
