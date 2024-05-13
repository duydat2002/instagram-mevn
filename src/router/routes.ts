import AuthLayout from "@/layouts/AuthLayout.vue";
import AppLayout from "@/layouts/AppLayout.vue";
import { RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/store";
import profile from "./profile";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home/index.vue"),
    beforeEnter: (to, _from, next) => {
      const { isLogged } = useUserStore();

      if (isLogged) to.meta.layout = AppLayout;
      else to.meta.layout = AuthLayout;

      next();
    },
    meta: { title: "Instagram", layout: AppLayout },
  },
  {
    path: "/explore",
    name: "Explore",
    component: () => import("@/views/explore/index.vue"),
    meta: { title: "Instagram", layout: AppLayout, requiresAuth: true },
  },
  {
    path: "/explore/people",
    name: "FriendSuggestion",
    component: () => import("@/views/explore/people.vue"),
    meta: { title: "Instagram", layout: AppLayout, requiresAuth: true },
  },
  {
    path: "/reels",
    name: "Reels",
    component: () => import("@/views/reels.vue"),
    meta: { title: "Instagram", layout: AppLayout, requiresAuth: true },
  },
  {
    path: "/inbox",
    name: "Messenger",
    component: () => import("@/views/messenger.vue"),
    meta: { title: "Hộp thư • Chat", layout: AppLayout, requiresAuth: true },
  },
  ...profile,
  {
    path: "/p/:postId",
    name: "Post",
    component: () => import("@/views/post.vue"),
    meta: { layout: AppLayout },
  },
  {
    path: "/:username/saved/all-posts/",
    name: "AllSavedPost",
    component: () => import("@/views/profile/allSavedPost.vue"),
    meta: { title: "Tất cả bài viết • Instagram", layout: AppLayout, requiresAuth: true },
  },
  {
    path: "/accounts/login",
    name: "Login",
    component: () => import("@/components/Pages/Auth/Login.vue"),
    meta: { title: "Đăng nhập • Instagram", layout: AuthLayout },
  },
  {
    path: "/accounts/emailsignup",
    name: "Register",
    component: () => import("@/components/Pages/Auth/Register.vue"),
    meta: { title: "Đăng ký • Instagram", layout: AuthLayout },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/notFound.vue"),
    meta: { title: "Không tìm thấy trang • Instagram" },
  },
];

export default routes;
