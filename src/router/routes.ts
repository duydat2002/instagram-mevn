import AuthLayout from "@/layouts/AuthLayout.vue";
import AppLayout from "@/layouts/AppLayout.vue";

const routes = [
  {
    path: "/",
    component: () => import("@/views/home.vue"),
    meta: { layout: AppLayout },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/notFound.vue"),
    meta: { title: "Không tìm thấy trang - Instagram" },
  },
];

export default routes;
