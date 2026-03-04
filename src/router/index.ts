import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

// 导入路由模块
import mainRoutes from "./modules/main";
import gameRoutes from "./modules/game";
import appRoutes from "./modules/app";
import errorRoutes from "./modules/error";

// 合并所有路由
const routes: RouteRecordRaw[] = [
  ...mainRoutes,
  ...gameRoutes,
  ...appRoutes,
  ...errorRoutes,
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 添加全局路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 策划大师：王者经营`;
  } else {
    document.title = "策划大师：王者经营";
  }
  next();
});

export default router;
