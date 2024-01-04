import AppLayoutVue from "@/layouts/AppLayout.vue";
import { RouteRecordRaw } from "vue-router";

export default {
  path: "/:username",
  name: "Profile",
  redirect: { name: "Posts" },
  component: () => import("@/views/profile/index.vue"),
  meta: { layout: AppLayoutVue, requiresAuth: true },
  props: (to) => ({ data: to.meta.data }),
  children: [
    {
      path: "",
      name: "Posts",
      component: () => import("../views/profile/posts.vue"),
    },
    {
      path: "saved",
      name: "Saved",
      component: () => import("../views/profile/saved.vue"),
    },
    {
      path: "tagged",
      name: "Tagged",
      component: () => import("../views/profile/tagged.vue"),
    },
  ],
} as Readonly<RouteRecordRaw>;
