import { useCommonStore, useLoadingStore, useModalStore, useUserStore } from "@/store";
import routes from "./routes";
import { createMemoryHistory, createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  // history: createMemoryHistory(import.meta.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "link-active",
  linkExactActiveClass: "exact-link-active",
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (to.name == from.name || to.matched[0] != from.matched[0]) {
        return {
          top: 0,
        };
      }
    }
  },
});

const authPath = ["/accounts/login", "/accounts/emailsignup"];

router.beforeEach(async (to, from) => {
  const { startLoading } = useLoadingStore();
  const { isLogged } = useUserStore();

  if (from.name) {
    startLoading();
  }

  if (to.meta.requiresAuth && !isLogged) return "/accounts/login";
  if (authPath.includes(to.path) && isLogged) return "/";
  return;
});

router.afterEach((to, _from) => {
  const { stopLoading } = useLoadingStore();
  const { setTitle } = useCommonStore();

  if (to.meta.title) setTitle(to.meta.title as string);
  stopLoading();
});

export default router;
