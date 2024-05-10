import { defineStore } from "pinia";
import { IPoint, IUserReview } from "@/types";

interface IState {
  hoveredUserId: string | null;
  modalPosition: IPoint;
  triggerRef: HTMLElement | null;
  reviewCache: IUserReview[];
}

export const useUserReviewStore = defineStore("userReview", {
  state: (): IState => ({
    hoveredUserId: null,
    modalPosition: {
      x: 0,
      y: 0,
    },
    triggerRef: null,
    reviewCache: [],
  }),
  actions: {
    setHoveredUserId(userId: string) {
      this.hoveredUserId = userId;
    },
    setModalPosition(position: IPoint) {
      this.modalPosition = position;
    },
    setTriggerRef(elRef: HTMLElement) {
      this.triggerRef = elRef;
    },
    addUserReviewCache(review: IUserReview) {
      this.reviewCache.push(review);
    },
    resetAll() {
      this.triggerRef = null;
      this.hoveredUserId = null;
      this.modalPosition = { x: 0, y: 0 };
    },
  },
});
