import api from "@/plugins/axios";
import { IServerData } from "@/types";

const prefix = "/auth/";

export interface ITokenResult {
  accessToken: string;
  refreshToken: string;
}

export async function login(email: string, password: string) {
  const data = await api.post<any, IServerData<ITokenResult>>(prefix + "login", {
    email,
    password,
  });

  if (data.success) {
    localStorage.setItem("access_token", data.result!.accessToken);
    localStorage.setItem("refresh_token", data.result!.refreshToken);
  }

  return data;
}

export async function register(
  email: string,
  fullname: string,
  username: string,
  password: string
) {
  const data = await api.post<any, IServerData<ITokenResult>>(prefix + "register", {
    email,
    fullname,
    username,
    password,
  });

  if (data.success) {
    localStorage.setItem("access_token", data.result!.accessToken);
    localStorage.setItem("refresh_token", data.result!.refreshToken);
  }

  return data;
}

export function checkRegister(email: string, fullname: string, username: string, password: string) {
  return api.post<any, IServerData<boolean>>(prefix + "check-register", {
    email,
    fullname,
    username,
    password,
  });
}

export async function logout(refreshToken: string) {
  const data = await api.post<any, IServerData>(prefix + "logout", { refreshToken: refreshToken });

  if (data.success) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("theme");
  }

  return data;
}

export async function refreshToken(refreshToken: string) {
  const data = await api.post<any, IServerData<ITokenResult>>(prefix + "refresh-token", {
    refreshToken: refreshToken,
  });

  if (data.success) {
    localStorage.setItem("access_token", data.result!.accessToken);
  }

  return data;
}
