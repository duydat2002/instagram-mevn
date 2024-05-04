import { defineStore } from "pinia";

interface IState {
  title: string;
}

export const useCommonStore = defineStore("common", {
  state: (): IState => ({
    title: "Instagram",
  }),
  actions: {
    setTitle(value: string) {
      this.title = value;
    },
  },
});
