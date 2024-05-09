import api from "@/plugins/axios";
import { IComment, IFollowUser, IReply, IServerData } from "@/types";

const prefix = "/comments/";

export async function getPostComments(postId: string) {
  return await api.get<any, IServerData<{ comments: IComment[] }>>(prefix + postId);
}

export async function getCommentReplies(commentId: string) {
  return await api.get<any, IServerData<{ replies: IReply[] }>>(prefix + commentId + "/replies");
}

export async function getLikedUsersOfComment(commentId: string) {
  return await api.get<any, IServerData<{ users: IFollowUser[] }>>(prefix + commentId + "/likes");
}

export async function likeComment(commentId: string) {
  return await api.post<any, IServerData>(prefix + commentId + "/like");
}

export async function unlikeComment(commentId: string) {
  return await api.post<any, IServerData>(prefix + commentId + "/unlike");
}

export async function commentPost(postId: string, content: string) {
  return await api.post<any, IServerData<{ comment: IComment }>>(prefix + postId, { content });
}

export async function replyComment(commentId: string, content: string) {
  return await api.post<any, IServerData<{ reply: IReply }>>(prefix + commentId + "/reply", {
    content,
  });
}

export async function updateComment(commentId: string, content: string) {
  return await api.patch<any, IServerData<{ comment: IComment | IReply }>>(prefix + commentId, {
    content,
  });
}

export async function deleteComment(commentId: string) {
  return await api.delete<any, IServerData>(prefix + commentId);
}
