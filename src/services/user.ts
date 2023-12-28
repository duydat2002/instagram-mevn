import api from "@/plugins/axios";
import { IServerData, IUser } from "@/types";

const prefix = "/users/";

export function getUser() {
  return api.get<any, IServerData<{ user: IUser }>>(prefix + "get-info");
}

export function getUserById(id: String) {
  return api.get<any, IServerData<{ user: IUser }>>(prefix + id);
}
