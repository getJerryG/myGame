<template>
  <div class="desktop-page">
    <!-- 引入桌面系统组件 -->
    <DesktopSystem :gameData="gameData" />

    <!-- 首次进入欢迎模态框 -->
    <div
      v-if="showHelloModal"
      class="hello-modal-overlay"
    >
      <div class="hello-modal-content">
        <HelloPage @close="handleHelloModalClose" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineAsyncComponent } from 'vue';
import HelloPage from './HelloPage.vue';

// 异步加载 DesktopSystem 组件，减少首屏加载时间
const DesktopSystem = defineAsyncComponent({
  loader: () => import('@/components/common/DesktopSystem/index.vue'),
  loadingComponent: {
    template: '<div class="desktop-loading">正在加载桌面...</div>',
  },
  delay: 0, // 立即显示 loading 状态
  timeout: 30000, // 30秒超时
});

// 接收路由参数
const props = defineProps<{
  day?: string; // 天数参数，从/desktop/:day路由接收
}>();

// 模拟游戏数据
const gameData = ref({
  gameState: {
    currentDate: {
      year: 2024,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
    },
  },
});

// 根据路由参数更新当前天数
watch(
  () => props.day,
  (newDay) => {
    if (newDay) {
      const dayNumber = Number(newDay);
      gameData.value.gameState.currentDate.day = dayNumber;
    }
  },
  { immediate: true }
);

// 首次进入欢迎模态框控制
const showHelloModal = ref(false);

// 检查是否首次进入
onMounted(() => {
  const hasVisited = localStorage.getItem('hasVisited');
  if (!hasVisited) {
    showHelloModal.value = true;
  }
});

// 处理欢迎模态框关闭
const handleHelloModalClose = () => {
  showHelloModal.value = false;
  localStorage.setItem('hasVisited', 'true');
};
</script>

<style lang="scss" scoped>
.desktop-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* 刘海栏样�? */
.notch-bar {
  height: 25px;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: none;
  border: none;
}

.notch-info {
  display: flex;
  gap: 20px;
}

/* 桌面加载状态 */
.desktop-loading {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #fff;
  font-size: 1.5rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.notch-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background-color: rgb(74 158 255 / 20%);
  border-radius: 15px;
  font-size: 14px;
}

.notch-label {
  color: #aaa;
}

.notch-value {
  color: #4a9eff;
  font-weight: bold;
}

/* 经验条样�? */
.exp-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 120px;
}

.exp-progress-bar {
  width: 100%;
  height: 6px;
  background-color: rgb(255 255 255 / 20%);
  border-radius: 3px;
  overflow: hidden;
}

.exp-progress {
  height: 100%;
  background-color: #4a9eff;
  border-radius: 3px;
  transition: width 0.3s ease;
  background-image: linear-gradient(90deg, #4a9eff, #357abd);
}

/* 欢迎模态框样式 */
.hello-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 85%);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

.hello-modal-content {
  width: 90%;
  height: 90vh;
  max-width: 1200px;
  animation: slideUp 0.3s ease;
  border-radius: 20px;
  overflow: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px) scale(0.9);
    opacity: 0;
  }

  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>
