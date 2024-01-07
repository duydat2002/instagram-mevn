import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    stopScroll: false as boolean,
    scrollPosition: 0,
  }),
  actions: {
    setStopScroll(value: boolean) {
      this.stopScroll = value;
    },
    setScrollPosition(position: number) {
      this.scrollPosition = position;
    },
  },
});
