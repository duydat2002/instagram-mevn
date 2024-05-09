import { IFollowUser } from "@/types";
import { defineStore } from "pinia";

interface IState {
  isShow: boolean;
  title: string;
  users: IFollowUser[] | null;
}

export const useUsersModalStore = defineStore("usersModal", {
  state: (): IState => ({
    isShow: false,
    title: "",
    users: null,
  }),
  actions: {},
});
