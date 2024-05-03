import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
  state: () => ({
    isLoadingProgress: false,
  }),
  actions: {
    startLoading() {
      this.isLoadingProgress = true;
    },
    stopLoading() {
      this.isLoadingProgress = false;
    },
  },
});
