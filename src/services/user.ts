import api from "@/plugins/axios";
import { IServerData, IUser } from "@/types";

const prefix = "/users/";

export function getUser() {
  return api.get<any, IServerData<{ user: IUser }>>(prefix + "get-info");
}

export function getUserById(id: string) {
  return api.get<any, IServerData<{ user: IUser }>>(prefix + id);
}

export function getUserByUsername(username: string) {
  return api.get<any, IServerData<{ user: IUser }>>(prefix + "by-username/" + username);
}

// User follow Other user
export async function followUser(userId: string, otherUserId: string) {
  return api.post<any, IServerData>(prefix + userId + "/follow", { id: otherUserId });
}

export function unfollowUser(userId: string, otherUserId: string) {
  return api.post<any, IServerData>(prefix + userId + "/unfollow", { id: otherUserId });
}

// Get mutual follow User by Other user
export function getMutualFollowedBy(userId: string, otherUserId: string) {
  return api.post<any, IServerData<{ mutual: IUser[] }>>(prefix + userId + "/mutual-follow", {
    id: otherUserId,
  });
}
