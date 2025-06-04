<script>
import BasicLayout from "@/layouts/BasicLayout.vue";
import { useRoute } from "vue-router";

export default {
  components: { BasicLayout },
  setup() {
    const route = useRoute(); // ✅ 正确：在 setup 函数内调用
    return { route }; // 将 route 暴露给模板
  },
};
</script>
<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view></router-view>
    </template>
    <template v-else>
      <BasicLayout></BasicLayout>
    </template>
  </div>
</template>

<style>
#app {
}

/* 在线链接服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
@font-face {
  font-family: "iconfont"; /* Project id 4940180 */
  src: url("//at.alicdn.com/t/c/font_4940180_u7nli4fx3t9.woff2?t=1749027258756")
      format("woff2"),
    url("//at.alicdn.com/t/c/font_4940180_u7nli4fx3t9.woff?t=1749027258756")
      format("woff"),
    url("//at.alicdn.com/t/c/font_4940180_u7nli4fx3t9.ttf?t=1749027258756")
      format("truetype");
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-like:before {
  content: "\e8ad";
}

.icon-message:before {
  content: "\e8bd";
}

.icon-down:before {
  content: "\e8cc";
}

.icon-up:before {
  content: "\e8cb";
}
</style>
