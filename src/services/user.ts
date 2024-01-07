import api from "@/plugins/axios";
import { IFollowUser, IServerData, IUser } from "@/types";

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
