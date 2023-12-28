import axios from "axios";
import api from "@/plugins/axios";
import { refreshToken as refreshTokenFn } from "@/services/auth";

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

service.interceptors.request.use(async (config) => {
  let accessToken = localStorage.getItem("access_token");

  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
});

service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const data = error?.response?.data;
    const refreshToken = localStorage.getItem("refresh_token");

    if (error?.response.status == 401 && refreshToken) {
      const res = await refreshTokenFn(refreshToken);

      error.config.headers.Authorization = `Bearer ${res.result.accessToken}`;

      return api.request(error.config);
    }

    return data;
  }
);

export default service;
