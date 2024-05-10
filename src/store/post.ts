import type { IComment, IPost, IReply, IUser } from "@/types";
import { defineStore } from "pinia";
import { __String } from "typescript";

interface IState {
  post: Nullable<IPost>;
  comment: string;
  comments: IComment[];
  commentRef: Nullable<HTMLInputElement>;
  replyTo: Nullable<string>;

  reportCommentPopup: boolean;
  removeCommentPopup: boolean;
  removeComment: Nullable<string>;
  removeCommentRef: Nullable<HTMLDivElement>;
  updatePostModal: boolean;

  postModal: boolean;
  postIdModal: string | null;
}

export const usePostStore = defineStore("post", {
  state: (): IState => ({
    post: null,
    comment: "",
    comments: [],
    commentRef: null,
    replyTo: null,

    reportCommentPopup: false,
    removeCommentPopup: false,
    removeComment: null,
    removeCommentRef: null,
    updatePostModal: false,

    postModal: false,
    postIdModal: null,
  }),
  actions: {
    addComment(comment: IComment) {
      this.comments.unshift(comment);
    },
    deleteComment(commentId: string) {
      if (commentId) {
        const commentIndex = this.comments.findIndex((c) => c.id == commentId);

        if (commentIndex != -1) {
          this.comments.splice(commentIndex, 1);
        } else {
          this.deleteReply(commentId);
        }

        this.removeCommentRef?.remove();

        this.removeCommentPopup = false;
        this.removeComment = null;
        this.removeCommentRef = null;
      }
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
    deleteReply(replyId: string) {
      const commentIndex = this.comments.findIndex((c) => c.replies.includes(this.removeComment!));
      if (commentIndex != -1)
        this.comments[commentIndex].replies = this.comments[commentIndex].replies.filter(
          (r) => r != replyId
        );
    },
  },
});
