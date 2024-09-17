import { Pinia } from "pinia";
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKET_BASE_URL, {
  autoConnect: false,
  withCredentials: true,
  auth: {
    token: localStorage.getItem("access_token"),
  },
});

export function initializeSocket(pinia: Pinia) {
  socket.on("connect", () => {
    console.log("connect");
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
}
