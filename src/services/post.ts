import api from "@/plugins/axios";
import { IServerData } from "@/types";

const prefix = "/posts/";

export async function getPostsByAuthor(authorId: string) {
  return await api.get<any, IServerData>(prefix + "get-posts/" + authorId);
}
