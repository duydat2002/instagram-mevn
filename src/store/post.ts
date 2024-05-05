import type { IComment, IPost, IReply, IUser } from "@/types";
import { defineStore } from "pinia";

interface IState {
  post: Nullable<IPost>;
  comment: string;
  comments: IComment[];
  commentRef: Nullable<HTMLInputElement>;
  replyTo: Nullable<string>;
}

export const usePostStore = defineStore("post", {
  state: (): IState => ({
    post: null,
    comment: "",
    comments: [],
    commentRef: null,
    replyTo: null,
  }),
  actions: {
    addComment(comment: IComment) {
      this.comments.unshift(comment);
    },
    deleteComment(commentId: string) {
      this.comments = this.comments.filter((c) => c.id != commentId);
    },
    setReply(replyTo: string, replyUsername: string) {
      this.replyTo = replyTo;
      this.comment = `@${replyUsername} `;
      this.commentRef?.focus();
    },
    addReply(reply: IReply) {
      const index = this.comments.findIndex((c) => c.id == reply.comment);
      if (index != -1) this.comments![index].replies.unshift(reply.id);
    },
  },
});
