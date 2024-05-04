import api from "@/plugins/axios";
import { IPost, IServerData } from "@/types";

const prefix = "/posts/";

export async function createPost(data: FormData) {
  return await api.post<any, IServerData<IPost>>(prefix, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function getPostsByAuthor(authorId: string) {
  return await api.get<any, IServerData<{ posts: IPost[] }>>(prefix + "get-posts/" + authorId);
}

export async function getSavedPosts() {
  return await api.get<any, IServerData<{ posts: IPost[] }>>(prefix + "get-saved-posts/");
}

export async function getTaggedPostsByUserId(authorId: string) {
  return await api.get<any, IServerData<{ posts: IPost[] }>>(
    prefix + "get-tagged-posts/" + authorId
  );
}
