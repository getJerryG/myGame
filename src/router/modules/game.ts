import type { RouteRecordRaw } from "vue-router";

const gameRoutes: RouteRecordRaw[] = [
  // 报告/结算页 —— 带天数 - 展示指定天数的游戏报告和结算信息
  {
    path: "/report/:day",
    name: "Report",
    component: () => import("../../views/game/SettlementPage.vue"),
    props: true,
    meta: { title: "游戏报告", requiresAuth: true },
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

export default gameRoutes;
