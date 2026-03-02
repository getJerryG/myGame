<template>
  <div class="app-page">
    <div class="app-header">
      <h1>{{ getPageTitle() }}</h1>
      <button
        class="back-button"
        @click="goBack"
      >
        返回桌面
      </button>
    </div>

    <div class="app-content">
      <!-- 根据page参数动态渲染不同的应用内容 -->
      <component :is="currentAppComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 接收路由参数
const props = defineProps<{
  page?: string; // 页面参数，从/app/:page路由接收
}>();

// 定义可用的应用组件映射
const appComponents: Record<string, () => Promise<{ default: any }>> = {
  // 引用项目中实际存在的组件
  hero: () => import("../../modules/game/views/HeroDevelopmentApp.vue"),
  game: () => import("../../modules/game/views/GameReleaseApp.vue"),
  settings: () => import("../../modules/game/views/GameSettingsApp.vue"),
  lottery: () => import("../../modules/lottery/views/LotteryPage.vue"),
  simulation: () => import("../../modules/simulation/views/NewSimulationPanel.vue"),
};

// 根据page参数获取当前应用组件
const currentAppComponent = computed(() => {
  const page = props.page || "hero";
  return appComponents[page] || appComponents.hero;
});

// 获取页面标题
const getPageTitle = () => {
  const titleMap: Record<string, string> = {
    hero: "英雄开发",
    game: "游戏发布",
    settings: "游戏设置",
    lottery: "抽奖系统",
    simulation: "模拟设置",
  };
  return titleMap[props.page || "hero"] || "应用页面";
};

// 返回桌面
const goBack = () => {
  router.push("/desktop/1"); // 默认返回第一天桌面
};
</script>

<style lang="scss" scoped>
.app-page {
  width: 100%;
  height: 100%;

  @include utils.flex-col(tokens.$spacing-0, stretch, flex-start);

  background-color: tokens.$gray-100;
}

.app-header {
  @include utils.flex-between;

  padding: tokens.$spacing-md;
  background-color: tokens.$bg-dark;
  color: tokens.$text-primary;
  box-shadow: tokens.$shadow-md;

  h1 {
    margin: 0;
    font-size: tokens.$font-size-2xl;
    font-weight: tokens.$font-weight-semibold;
    color: tokens.$primary;
  }
}

.back-button {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: tokens.$primary;
  color: tokens.$text-primary;
  border: none;
  border-radius: tokens.$radius-sm;
  cursor: pointer;
  font-size: tokens.$font-size-base;
  transition: all tokens.$transition-normal;

  &:hover {
    background-color: tokens.$primary-dark;
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-blue;
  }
}

.app-content {
  flex: 1;
  padding: tokens.$spacing-md;
  overflow-y: auto;

  @include utils.flex-center;

  > div {
    width: 100%;
    max-width: tokens.$max-content-width;
    background-color: tokens.$text-primary;
    border-radius: tokens.$radius-md;
    box-shadow: tokens.$shadow-md;
    padding: tokens.$spacing-xl;
    text-align: center;
  }
}
</style>
