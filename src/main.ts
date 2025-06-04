import { createApp } from "vue";
import App from "./App.vue";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import router from "./router";
import store from "./store";
import "@/plugins/axios";
import "@/access";
import "bytemd/dist/index.css";

// 创建应用实例
const app = createApp(App);

// 使用插件
app.use(ArcoVue).use(store).use(router);

// 在挂载前先获取用户信息
store.dispatch("user/getLoginUser").finally(() => {
  app.mount("#app");
});
