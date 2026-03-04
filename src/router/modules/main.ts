import type { RouteRecordRaw } from "vue-router";

const mainRoutes: RouteRecordRaw[] = [
  // 1. 主页 - 应用入口页面，展示项目概览及主要功能入口
  {
    path: "/",
    name: "Home",
    component: () => import("../../views/main/HomePage.vue"),
    meta: { title: "首页", requiresAuth: false },
  },

  // 2. 新建游戏 / 新手引导 - 新用户首次使用时的引导页面
  {
    path: "/hello",
    name: "Hello",
    component: () => import("../../views/main/HelloPage.vue"),
    meta: { title: "新手引导", requiresAuth: false },
  },

  // 3. 游戏桌面 —— 带天数参数 - 核心游戏界面，根据天数参数展示对应进度内容
  {
    path: "/desktop/:day",
    name: "Desktop",
    component: () => import("../../views/main/DesktopPage.vue"),
    props: true,
    meta: { title: "游戏桌面", requiresAuth: true },
    beforeEnter: (to, _from, next) => {
      // 路由守卫：验证day参数是否为有效数字
      const day = Number(to.params.day);
      if (!isNaN(day) && day > 0) {
        next();
      } else {
        next("/404");
      }
    },
  },
];

export default mainRoutes;
