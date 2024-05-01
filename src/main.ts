import "./assets/main.css";

import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { FontAwesomeIcon } from "@/plugins/fontAwesome";
import { useUserStore } from "./store";
import { ClickOutside, ClickInside } from "@/directives";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("fa", FontAwesomeIcon);
app.directive("click-outside", ClickOutside);
app.directive("click-inside", ClickInside);

const { isLogged, fetchUserInfo } = useUserStore();

if (isLogged) {
  await fetchUserInfo();
}

app.mount("#app");
