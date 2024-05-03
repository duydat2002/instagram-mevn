import { defineStore } from "pinia";

interface IState {
  darkMode: boolean;
}

export const useThemeStore = defineStore("theme", {
  state: (): IState => ({
    darkMode: false,
  }),
  actions: {
    setTheme(value: boolean) {
      this.darkMode = value;
    },
  },
  persist: true,
});
