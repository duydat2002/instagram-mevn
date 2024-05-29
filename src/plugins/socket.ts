import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKET_BASE_URL, {
  autoConnect: false,
  withCredentials: true,
  auth: {
    token: localStorage.getItem("access_token"),
  },
});
