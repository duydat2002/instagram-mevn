import { defineStore } from "pinia";
import { IUser } from "@/types";
import { login, register, logout } from "@/services/auth";
import { getUser } from "@/services/user";

interface IState {
  user: Nullable<IUser>;
  profileUser: Nullable<IUser>;
  isLogged: boolean;
}

export const useUserStore = defineStore("user", {
  state: (): IState => ({
    profileUser: null,
    user: null,
    isLogged: !!localStorage.getItem("refresh_token"),
  }),
  actions: {
    setProfileUser(user: Nullable<IUser>) {
      this.profileUser = user;
    },
    async login(username: string, password: string) {
      const data = await login(username, password);

      await this.fetchUserInfo();

      return data;
    },
    async register(email: string, fullname: string, username: string, password: string) {
      const data = await register(email, fullname, username, password);

      await this.fetchUserInfo();

      return data;
    },
    async fetchUserInfo() {
      console.log("fetchUserInfo");
      const data = await getUser();

      if (data.success) {
        this.user = data.result!.user;
        this.isLogged = true;
      } else {
        this.user = null;
        this.isLogged = false;
      }
    },
    async logout() {
      await logout(localStorage.getItem("refresh_token") || "");

      this.user = null;
      this.isLogged = false;
    },
  },
});
