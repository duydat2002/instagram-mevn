import { defineStore } from "pinia";
import { IPoint } from "@/types";

interface IState {
  hoveredUserId: string | null;
  modalPosition: IPoint;
  triggerRef: HTMLElement | null;
}

export const useUserHoverStore = defineStore("userHover", {
  state: (): IState => ({
    hoveredUserId: null,
    modalPosition: {
      x: 0,
      y: 0,
    },
    triggerRef: null,
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
    resetAll() {
      this.triggerRef = null;
      this.hoveredUserId = null;
      this.modalPosition = { x: 0, y: 0 };
    },
  },
});
