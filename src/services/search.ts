import api from "@/plugins/axios";
import { IFollowUser, IServerData, IUser } from "@/types";
import { ISearch } from "@/types/search";

const prefix = "/search/";

export async function getHistories() {
  return await api.get<any, IServerData<{ searchs: ISearch[] }>>(prefix + "get-histories");
}

export async function searchUsers(search: string) {
  return await api.post<any, IServerData<{ searchs: IUser[] }>>(prefix + "search-user", {
    search,
  });
}

export async function addSearchHistory(search: string) {
  return await api.post<any, IServerData>(prefix + "add-history", {
    search,
  });
}

export async function deleteSearchHistory(searchId: string) {
  return await api.post<any, IServerData>(prefix + "delete-history", {
    searchId,
  });
}

export async function deleteAllSearchHistory() {
  return await api.post<any, IServerData>(prefix + "delete-all-history", {});
}
