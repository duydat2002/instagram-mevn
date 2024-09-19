import "./assets/main.css";

import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { FontAwesomeIcon } from "@/plugins/fontAwesome";
import { useChatStore, useUsersOnlineStore, useUserStore } from "./store";
import { ClickOutside, ClickInside, Intersect, InfiniteScroll } from "@/directives";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import VueDOMPurifyHTML from "vue-dompurify-html";
import { initializeSocket } from "./plugins/socket";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(VueDOMPurifyHTML);
app.component("fa", FontAwesomeIcon);
app.directive("click-outside", ClickOutside);
app.directive("click-inside", ClickInside);
app.directive("intersect", Intersect);
app.directive("infinite-scroll", InfiniteScroll);

const { initializeChatSocket, init: initConversation } = useChatStore();
const { initializeOnlineSocket } = useUsersOnlineStore();
// initializeSocket(pinia);
initializeChatSocket();
initializeOnlineSocket();

const { isLogged, fetchUserInfo } = useUserStore();

if (isLogged) {
  await fetchUserInfo();
}

app.mount("#app");
