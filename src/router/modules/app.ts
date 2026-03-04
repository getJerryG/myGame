import type { RouteRecordRaw } from "vue-router";

const appRoutes: RouteRecordRaw[] = [
  // 游戏内各个应用页面 - 集中管理各类系统功能页面
  {
    path: "/app/:page",
    name: "AppPage",
    component: () => import("../../views/main/AppPage.vue"),
    props: true,
    meta: { title: "应用页面", requiresAuth: true },
    beforeEnter: (to, _from, next) => {
      // 路由守卫：验证page参数是否为允许的应用名称
      const allowedPages = [
        "hero",
        "game",
        "settings",
        "lottery",
        "simulation",
      ];
      if (allowedPages.includes(to.params.page as string)) {
        next();
      } else {
        next("/404");
      }
    },
  },
];

export default appRoutes;
