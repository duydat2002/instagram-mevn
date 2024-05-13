import { defineStore } from "pinia";
import { IUser } from "@/types";

interface IState {
  search: string;
  searchList: IUser[];
  isLoadingSearch: boolean;
}

export const useSearchStore = defineStore("search", {
  state: (): IState => ({
    search: "",
    searchList: [],
    isLoadingSearch: false,
  }),
  actions: {},
});
