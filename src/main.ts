import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import router from "./router";
import App from "./App.vue";
import "@/styles/index.scss";

// 创建应用实例
const app = createApp(App);

// 创建并配置Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 注册插件
app
  .use(pinia)
  .use(router) // 注册路由
  .mount("#app"); // 挂载应用
