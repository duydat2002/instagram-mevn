import AppLayoutVue from "@/layouts/AppLayout.vue";

import { RouteRecordRaw } from "vue-router";
import type {
  NavigationGuardNext,
  NavigationGuardWithThis,
  RouteLocationNormalized,
} from "vue-router";

const handleEnterFollowModal: NavigationGuardWithThis<any> = (to, from, next) => {
  const isFromProfile = from.matched.some((route) => route.name == "Profile");
  const currentViewIndex = to.matched.length - 1;
  const prevViewIndex = from.matched.length - 1;

  if (isFromProfile) {
    if (to.matched[currentViewIndex]) {
      to.matched[currentViewIndex]!.components = {
        default: from.matched[prevViewIndex].components!.default,
        modal: () => import("@/views/profile/follows.vue"),
      };
    }

    if (from.matched.length > 1) {
      const childView = from.matched.slice(1);
      for (const view of childView) {
        to.matched.push(view);
      }
    }
  } else {
    to.matched[currentViewIndex].components = {
      default: () => import("@/views/profile/posts.vue"),
      modal: () => import("@/views/profile/follows.vue"),
    };
  }

  next();
};

export default [
  {
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
        component: () => import("@/views/profile/posts.vue"),
      },
      {
        path: "saved",
        name: "Saved",
        component: () => import("@/views/profile/saved.vue"),
      },
      {
        path: "tagged",
        name: "Tagged",
        component: () => import("@/views/profile/tagged.vue"),
      },
      {
        path: "followers",
        name: "Followers",
        beforeEnter: handleEnterFollowModal,
        children: [
          {
            path: "mutualOnly",
            name: "MutualFollowers",
          },
          {
            path: "mutualFirst",
            name: "MutualFirstFollowers",
          },
        ],
      },
      {
        path: "followings",
        name: "Followings",
        beforeEnter: handleEnterFollowModal,
      },
    ],
  },
] as Readonly<RouteRecordRaw[]>;
