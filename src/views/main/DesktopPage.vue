<template>
  <div class="desktop-page">
    <!-- 引入桌面系统组件 -->
    <DesktopSystem :gameData="gameData" />

    <!-- 首次进入欢迎模态框 -->
    <div v-if="showHelloModal" class="hello-modal-overlay">
      <div class="hello-modal-content">
        <HelloPage @close="handleHelloModalClose" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineAsyncComponent } from "vue";
import HelloPage from "./HelloPage.vue";

// 异步加载 DesktopSystem 组件，减少首屏加载时间
const DesktopSystem = defineAsyncComponent({
  loader: () => import("@/components/common/DesktopSystem/index.vue"),
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
  { immediate: true },
);

// 首次进入欢迎模态框控制
const showHelloModal = ref(false);

// 检查是否首次进入
onMounted(() => {
  const hasVisited = localStorage.getItem("hasVisited");
  if (!hasVisited) {
    showHelloModal.value = true;
  }
});

// 处理欢迎模态框关闭
const handleHelloModalClose = (): void => {
  showHelloModal.value = false;
  localStorage.setItem("hasVisited", "true");
};
</script>

<style lang="scss" scoped>
.desktop-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* 刘海栏样式 */
.notch-bar {
  height: 25px;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 tokens.$spacing-lg;
  z-index: tokens.$z-max;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: none;
  border: none;
}

.notch-info {
  display: flex;
  gap: tokens.$spacing-lg;
}

/* 桌面加载状态 */
.desktop-loading {
  width: 100vw;
  height: 100vh;

  @include utils.flex-center;

  background: linear-gradient(
    135deg,
    tokens.$bg-dark 0%,
    tokens.$bg-secondary 50%,
    tokens.$bg-tertiary 100%
  );
  color: tokens.$text-primary;
  font-size: tokens.$font-size-2xl;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }
}

.notch-item {
  display: flex;
  align-items: center;
  gap: tokens.$spacing-xs;
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  background-color: rgb(74 158 255 / 20%);
  border-radius: tokens.$radius-full;
  font-size: tokens.$font-size-sm;
}

.notch-label {
  color: tokens.$gray-400;
}

.notch-value {
  color: tokens.$primary;
  font-weight: tokens.$font-weight-bold;
}

/* 经验条样式 */
.exp-container {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-xs;
  min-width: 120px;
}

.exp-progress-bar {
  width: 100%;
  height: 6px;
  background-color: tokens.$bg-light;
  border-radius: 3px;
  overflow: hidden;
}

.exp-progress {
  height: 100%;
  background-color: tokens.$primary;
  border-radius: 3px;
  transition: width tokens.$transition-normal;
  background-image: linear-gradient(
    90deg,
    tokens.$primary,
    tokens.$primary-dark
  );
}

/* 欢迎模态框样式 */
.hello-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 85%);
  backdrop-filter: blur(tokens.$spacing-xs);

  @include utils.flex-center;

  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

.hello-modal-content {
  width: 90%;
  height: 90vh;
  max-width: tokens.$max-content-width;
  animation: slideUp 0.3s ease;
  border-radius: tokens.$radius-xl;
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
