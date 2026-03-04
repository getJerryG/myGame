import type { RouteRecordRaw } from "vue-router";

const errorRoutes: RouteRecordRaw[] = [
  // 404 - 处理所有未匹配的路由
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../../views/main/NotFoundPage.vue"),
    meta: { title: "页面未找到" },
  },
];

export default errorRoutes;
