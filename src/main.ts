import "./assets/main.css";

import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { FontAwesomeIcon } from "@/plugins/fontAwesome";
import { useUserStore } from "./store";
import { ClickOutside, ClickInside } from "@/directives";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import VueDOMPurifyHTML from "vue-dompurify-html";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(VueDOMPurifyHTML);
app.component("fa", FontAwesomeIcon);
app.directive("click-outside", ClickOutside);
app.directive("click-inside", ClickInside);

const { isLogged, fetchUserInfo } = useUserStore();

if (isLogged) {
  await fetchUserInfo();
}

app.mount("#app");
