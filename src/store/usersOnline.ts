import { socket } from "@/plugins/socket";
import { defineStore } from "pinia";

interface IState {
  usersOnline: Map<string, { lastOnline: string }>;
}

export const useUsersOnlineStore = defineStore("usersOnline", {
  state: (): IState => ({
    usersOnline: new Map(),
  }),
  actions: {
    bindEvents() {
      socket.on("connect", async () => {
        console.log("connect"); 
      });

      socket.on("disconnect", async () => {
        console.log("disconnect");
      });
    },
  },
});
