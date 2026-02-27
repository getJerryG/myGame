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
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 接收路由参数
const props = defineProps<{
  page?: string; // 页面参数，从/app/:page路由接收
}>();

// 定义可用的应用组件映射
const appComponents: Record<string, () => Promise<{ default: any }>> = {
  // 引用项目中实际存在的组件
  hero: () => import('../../modules/game/views/HeroDevelopmentApp.vue'),
  game: () => import('../../modules/game/views/GameReleaseApp.vue'),
  settings: () => import('../../modules/game/views/GameSettingsApp.vue'),
  lottery: () => import('../../modules/lottery/views/LotteryPage.vue'),
  simulation: () => import('../../modules/simulation/views/NewSimulationPanel.vue'),
};

// 根据page参数获取当前应用组件
const currentAppComponent = computed(() => {
  const page = props.page || 'hero';
  return appComponents[page] || appComponents.hero;
});

// 获取页面标题
const getPageTitle = () => {
  const titleMap: Record<string, string> = {
    hero: '英雄开发',
    game: '游戏发布',
    settings: '游戏设置',
    lottery: '抽奖系统',
    simulation: '模拟设置',
  };
  return titleMap[props.page || 'hero'] || '应用页面';
};

// 返回桌面
const goBack = () => {
  router.push('/desktop/1'); // 默认返回第一天桌面
};
</script>

<style lang="scss" scoped>
.app-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #1a1a2e;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: #4a9eff;
}

.back-button {
  padding: 10px 20px;
  background-color: #4a9eff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #357abd;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(74, 158, 255, 0.4);
  }
}

.app-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  & > div {
    width: 100%;
    max-width: 1200px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    padding: 30px;
    text-align: center;
  }
}
</style>
