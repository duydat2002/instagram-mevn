import { socket } from "@/plugins/socket";
import { defineStore } from "pinia";

type UserStatus = {
  isOnline: boolean;
  lastOnline: string;
};

interface IState {
  usersOnline: Map<string, UserStatus>;
}

export const useUsersOnlineStore = defineStore("usersOnline", {
  state: (): IState => ({
    usersOnline: new Map(),
  }),
  actions: {
    initializeOnlineSocket() {
      socket.on("user:connected", ({ userId, lastOnline }) => {
        this.usersOnline.set(userId, { isOnline: true, lastOnline });
      });

      socket.on("user:disconnected", ({ userId, lastOnline }) => {
        this.usersOnline.set(userId, { isOnline: false, lastOnline });
      });
    },
  },
  // persist: true,
});
