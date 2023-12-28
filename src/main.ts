import "./assets/main.css";

import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { FontAwesomeIcon } from "@/plugins/fontAwesome";
import { useUserStore } from "./store";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("fa", FontAwesomeIcon);

const { isLogged, fetchUserInfo } = useUserStore();

if (isLogged) {
  await fetchUserInfo();
}

app.mount("#app");
