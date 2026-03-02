import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

// 定义路由配置
const routes = [
  // 1. 主页 - 应用入口页面，展示项目概览及主要功能入口
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/main/HomePage.vue'),
    meta: { title: '首页', requiresAuth: false }, // 添加元数据，包含页面标题和权限要求
  },

  // 2. 新建游戏 / 新手引导 - 新用户首次使用时的引导页面
  {
    path: '/hello',
    name: 'Hello',
    component: () => import('../views/main/HelloPage.vue'),
    meta: { title: '新手引导', requiresAuth: false },
  },

  // 3. 游戏桌面 —— 带天数参数 - 核心游戏界面，根据天数参数展示对应进度内容
  {
    path: '/desktop/:day',
    name: 'Desktop',
    component: () => import('../views/main/DesktopPage.vue'),
    props: true, // 启用props传递，组件内可直接通过props接收day参数
    meta: { title: '游戏桌面', requiresAuth: true },
    beforeEnter: (
      to: RouteLocationNormalized,
      _from: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) => {
      // 路由守卫：验证day参数是否为有效数字
      const day = Number(to.params.day);
      if (!isNaN(day) && day > 0) {
        next();
      } else {
        next('/404'); // 参数无效时重定向到404页面
      }
    },
  },

  // 4. 游戏内各个应用页面（最优雅写法）- 集中管理各类系统功能页面
  {
    path: '/app/:page',
    name: 'AppPage',
    component: () => import('../views/main/AppPage.vue'),
    props: true, // 启用props传递，组件内可直接通过props接收page参数
    meta: { title: '应用页面', requiresAuth: true },
    beforeEnter: (
      to: RouteLocationNormalized,
      _from: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) => {
      // 路由守卫：验证page参数是否为允许的应用名称
      const allowedPages = [
        'hero',
        'game',
        'settings',
        'lottery',
        'simulation',
      ];
      if (allowedPages.includes(to.params.page as string)) {
        next();
      } else {
        next('/404'); // 参数无效时重定向到404页面
      }
    },
  },

  // 5. 报告/结算页 —— 也带天数 - 展示指定天数的游戏报告和结算信息
  {
    path: '/report/:day',
    name: 'Report',
    component: () => import('../views/game/SettlementPage.vue'),
    props: true, // 启用props传递，组件内可直接通过props接收day参数
    meta: { title: '游戏报告', requiresAuth: true },
    beforeEnter: (
      to: RouteLocationNormalized,
      _from: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) => {
      // 路由守卫：验证day参数是否为有效数字
      const day = Number(to.params.day);
      if (!isNaN(day) && day > 0) {
        next();
      } else {
        next('/404'); // 参数无效时重定向到404页面
      }
    },
  },

  // 404 - 处理所有未匹配的路由
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/main/NotFoundPage.vue'),
    meta: { title: '页面未找到' },
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 添加路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 策划大师：王者经营`;
  } else {
    document.title = '策划大师：王者经营';
  }
  next();
});

export default router;
