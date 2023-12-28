import AuthLayout from "@/layouts/AuthLayout.vue";
import AppLayout from "@/layouts/AppLayout.vue";

const routes = [
  {
    path: "/",
    component: () => import("@/views/home/index.vue"),
  },
  {
    path: "/explore",
    component: () => import("@/views/explore.vue"),
    meta: { layout: AppLayout, requiresAuth: true },
  },
  {
    path: "/accounts/login",
    component: () => import("@/components/Auth/Login.vue"),
    meta: { title: "Đăng nhập • Instagram", layout: AuthLayout },
  },
  {
    path: "/accounts/emailsignup",
    component: () => import("@/components/Auth/Register.vue"),
    meta: { title: "Đăng ký • Instagram", layout: AuthLayout },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/notFound.vue"),
    meta: { title: "Không tìm thấy trang - Instagram" },
  },
];

export default routes;
