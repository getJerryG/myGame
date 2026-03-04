<template>
  <div
    class="desktop-modal"
    :class="{
      'is-maximized': modal.isMaximized,
      'is-minimized': isMinimized,
    }"
    :style="modalStyle"
    @mousedown="startDrag"
  >
    <!-- 标题栏 -->
    <div class="modal-header" @mousedown.stop="startDragHeader">
      <div class="modal-title">
        <span class="app-icon">{{ app.icon }}</span>
        <span class="app-name">{{ app.name }}</span>
      </div>
      <div class="modal-controls">
        <button class="control-button minimize" @click.stop="$emit('minimize')">
          <span>−</span>
        </button>
        <button class="control-button maximize" @click.stop="$emit('maximize')">
          <span v-if="!modal.isMaximized">□</span>
          <span v-else>❐</span>
        </button>
        <button class="control-button close" @click.stop="$emit('close')">
          <span>×</span>
        </button>
      </div>
    </div>

    <!-- 主要内容区域 - 动态加载应用组件 -->
    <div class="modal-content">
      <template v-if="currentAppComponent">
        <component
          :is="currentAppComponent"
          :modal="modal"
          :app="app"
          :game-data="gameData"
          @app-installed="(app) => emit('app-installed', app)"
        />
      </template>
      <template v-else>
        <div class="error-container">
          <h3>应用组件不存在</h3>
          <p>无法加载应用: {{ app.id }}</p>
          <p>请检查应用配置或联系管理员</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入所有应用组件
import ChatApp from "@/components/business/apps/chat/ChatApp.vue";
import DataCenterApp from "@/components/business/apps/DataCenter/DataCenterApp.vue";
import OperationsApp from "@/components/business/apps/operations/OperationsApp.vue";
import ContentApp from "@/components/business/apps/content/ContentApp.vue";
import RewardsApp from "@/components/business/apps/rewards/RewardsApp.vue";
import WalletApp from "@/components/business/apps/wallet/WalletApp.vue";
import LotteryApp from "@/components/business/apps/lottery/LotteryApp.vue";
import GameSettingsApp from "@/components/business/apps/game-settings/GameSettingsApp.vue";
import AppStore from "@/components/business/apps/AppStore/AppStore.vue";
import HeroApp from "@/components/business/apps/hero/HeroApp.vue";
import SkinApp from "@/components/business/apps/skin/SkinApp.vue";
// 确保游戏发布组件被正确导入并命名
import GameReleaseApp from "@/modules/game/views/GameReleaseApp.vue";

// 确保组件有正确的名称
GameReleaseApp.name = "GameReleaseApp";

// 导入类型

import type { GameData } from "../types/game";
import type { Modal } from "../types/modal";

// Props定义
const props = defineProps<{
  modal: Modal;
  app: App;
  gameData?: GameData;
}>();

// Emits定义
const emit = defineEmits<{
  (e: "close"): void;
  (e: "minimize"): void;
  (e: "maximize"): void;
  (e: "update:modal", modal: Modal): void;
  (e: "app-installed", app: App): void;
}>();

// 拖拽相关
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const isMinimized = ref(false);
const dragPosition = ref({ x: 0, y: 0 });
let animationFrameId: number | null = null;

// 应用组件映射
const appComponents = {
  chat: ChatApp,
  "data-center": DataCenterApp,
  operations: OperationsApp,
  content: ContentApp,
  rewards: RewardsApp,
  wallet: WalletApp,
  lottery: LotteryApp,
  "game-settings": GameSettingsApp,
  "app-store": AppStore,
  "hero-development": HeroApp,
  "skin-development": SkinApp,
  "event-development": OperationsApp, // 事件开发使用运营管理组件
  "game-release": GameReleaseApp, // 游戏发布使用专门的游戏发布组件
};

// 获取当前应用组件
const currentAppComponent = computed(() => {
  return appComponents[props.app.id] || null;
});

// 模态框样式
const modalStyle = computed(() => {
  if (props.modal.isMaximized) {
    return {
      left: "0px",
      top: "0px",
      width: "100%",
      height: "calc(100% - 48px)", // 减去任务栏高度
      zIndex: 100,
    };
  }

  if (isMinimized.value) {
    return {
      display: "none",
    };
  }

  // 使用拖拽位置进行实时更新，优化性能
  const left = isDragging.value ? dragPosition.value.x : props.modal.position.x;
  const top = isDragging.value ? dragPosition.value.y : props.modal.position.y;

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${props.modal.size.width}px`,
    height: `${props.modal.size.height}px`,
    zIndex: 100,
    // 关闭过渡动画以提高拖拽流畅度
    transition: isDragging.value ? "none" : "all 0.08s ease",
  };
});

// 拖拽功能
const startDrag = (e: MouseEvent): void => {
  // 排除控制按钮区域，防止点击按钮时触发拖拽
  if (
    (e.target as Element).closest(".control-button") ||
    (e.target as Element).closest(".modal-controls")
  ) {
    return;
  }

  if (
    e.target.classList.contains("modal-header") ||
    (e.target as Element).closest(".modal-header")
  ) {
    startDragHeader(e);
  }
};

const startDragHeader = (e: MouseEvent): void => {
  if (props.modal.isMaximized) return;

  isDragging.value = true;
  dragOffset.value = {
    x: e.clientX - props.modal.position.x,
    y: e.clientY - props.modal.position.y,
  };

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
};

const drag = (e: MouseEvent): void => {
  if (!isDragging.value) return;

  // 获取桌面容器尺寸（减去任务栏高度48px）
  const desktopWidth = window.innerWidth;
  const desktopHeight = window.innerHeight - 48;

  // 计算新的位置
  let newX = e.clientX - dragOffset.value.x;
  let newY = e.clientY - dragOffset.value.y;

  // 碰撞检测 - 确保窗口不会超出桌面范围
  // 左边界
  newX = Math.max(0, newX);
  // 上边界
  newY = Math.max(0, newY);
  // 右边界 - 考虑窗口宽度
  newX = Math.min(desktopWidth - props.modal.size.width, newX);
  // 下边界 - 考虑窗口高度
  newY = Math.min(desktopHeight - props.modal.size.height, newY);

  // 更新拖拽位置，用于实时渲染
  dragPosition.value = { x: newX, y: newY };

  // 使用requestAnimationFrame优化性能
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(() => {
      animationFrameId = null;
      // 这里不立即更新modal，而是在停止拖拽时更新
    });
  }
};

const stopDrag = (): void => {
  if (
    isDragging.value &&
    (dragPosition.value.x !== props.modal.position.x ||
      dragPosition.value.y !== props.modal.position.y)
  ) {
    // 只有当位置发生变化时才更新modal
    const updatedModal = {
      ...props.modal,
      position: { ...dragPosition.value },
    };
    emit("update:modal", updatedModal);
  }

  // 直接将isDragging设为false，不再等待nextTick
  // 同步dragPosition与props.modal.position，确保状态一致
  dragPosition.value = { ...props.modal.position };
  isDragging.value = false;

  // 清理事件监听器
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);

  // 取消动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

// 组件卸载时清理事件监听器
onUnmounted(() => {
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
});
</script>

<style lang="scss" scoped>
.desktop-modal {
  position: absolute;
  background-color: rgb(26 26 46 / 95%);
  border: 1px solid tokens.$primary-blue;
  border-radius: tokens.$radius-lg;
  box-shadow:
    0 8px 32px rgb(0 0 0 / 50%),
    0 0 0 2px rgb(255 255 255 / 80%);
  overflow: hidden;
  transition: all 0.08s ease;
  min-width: 600px;
  min-height: 400px;

  @include utils.flex-col(tokens.$spacing-none, stretch, flex-start);

  &.is-maximized {
    border-radius: 0;
    min-width: 0;
    min-height: 0;
  }

  &.is-minimized {
    display: none;
  }
}

/* 标题栏样式 */
.modal-header {
  height: 48px;
  background-color: rgb(74 158 255 / 20%);
  border-bottom: 1px solid tokens.$border-medium;

  @include utils.flex-between;

  padding: 0 tokens.$spacing-lg;
  cursor: move;
  user-select: none;
}

.modal-title {
  @include utils.flex-row(tokens.$spacing-sm, center);

  .app-icon {
    font-size: tokens.$font-size-xl;
  }

  .app-name {
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }
}

.modal-controls {
  @include utils.flex-row(tokens.$spacing-xs, center);
}

.control-button {
  width: 32px;
  height: 32px;
  background-color: transparent;
  border: none;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-bold;
  cursor: pointer;
  border-radius: tokens.$radius-sm;

  @include utils.flex-center;

  transition: all tokens.$transition-fast;

  &:hover {
    background-color: tokens.$bg-lighter;
  }

  &.close {
    &:hover {
      background-color: tokens.$error;
    }
  }

  &.minimize {
    &:hover {
      background-color: rgb(74 158 255 / 50%);
    }
  }

  &.maximize {
    &:hover {
      background-color: rgb(74 158 255 / 50%);
    }
  }
}

/* 内容区域样式 */
.modal-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧菜单栏样式 */
.modal-sidebar {
  width: 200px;
  background-color: tokens.$bg-light;
  border-right: 1px solid tokens.$border-medium;
  overflow-y: auto;
}

.sidebar-item {
  @include utils.flex-row(tokens.$spacing-3, center);

  padding: tokens.$spacing-3 tokens.$spacing-4;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  color: tokens.$text-muted;
  border-left: 3px solid transparent;

  &:hover {
    background-color: rgb(74 158 255 / 20%);
    color: tokens.$text-primary;
  }

  &.active {
    background-color: rgb(74 158 255 / 30%);
    color: tokens.$text-primary;
    border-left-color: tokens.$primary-blue;
  }
}

.sidebar-item-icon {
  font-size: tokens.$font-size-lg;
  width: 20px;
  text-align: center;
}

.sidebar-item-name {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
}

/* 右侧内容区域样式 */
.modal-main {
  flex: 1;

  @include utils.flex-col(tokens.$spacing-none, stretch, flex-start);

  overflow: hidden;
  background-color: rgb(26 26 46 / 50%);
}

.content-header {
  padding: tokens.$spacing-lg;
  border-bottom: 1px solid tokens.$border-medium;
  background-color: rgb(0 0 0 / 10%);

  h2 {
    margin: 0 0 tokens.$spacing-3;
    font-size: tokens.$font-size-xl;
    color: tokens.$text-primary;
  }
}

.module-core-data {
  @include utils.flex-row(tokens.$spacing-5, center);

  flex-wrap: wrap;
}

.core-data-item {
  @include utils.flex-row(tokens.$spacing-2, center);

  font-size: tokens.$font-size-sm;
}

.core-data-label {
  color: tokens.$text-muted;
}

.core-data-value {
  color: tokens.$primary-blue;
  font-weight: tokens.$font-weight-bold;
}

.content-body {
  flex: 1;
  padding: tokens.$spacing-5;
  overflow-y: auto;
  color: tokens.$text-primary;
}

.module-content {
  background-color: rgb(0 0 0 / 10%);
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-5;
  min-height: 200px;

  h3 {
    margin: 0 0 tokens.$spacing-4;
    font-size: tokens.$font-size-lg;
    color: tokens.$primary-blue;
  }

  h4 {
    margin: 0 0 tokens.$spacing-3;
    font-size: tokens.$font-size-base;
    color: tokens.$text-primary;
  }

  p {
    margin: 0 0 tokens.$spacing-4;
    color: tokens.$text-muted;
    line-height: tokens.$line-height-relaxed;
  }
}

/* 数据卡片样式 */
.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: tokens.$spacing-4;
  margin-top: tokens.$spacing-4;
}

.data-card {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-4;
  border: 1px solid rgb(74 158 255 / 20%);
  transition: all tokens.$transition-fast;

  &:hover {
    border-color: rgb(74 158 255 / 50%);
    transform: translateY(-2px);
  }
}

.data-card-header {
  margin-bottom: tokens.$spacing-3;
  padding-bottom: tokens.$spacing-2;
  border-bottom: 1px solid rgb(74 158 255 / 20%);
}

.data-card-body {
  @include utils.flex-col(tokens.$spacing-3, stretch);
}

.data-item {
  @include utils.flex-between;

  padding: tokens.$spacing-2 0;
}

.data-label {
  color: tokens.$text-muted;
  font-size: tokens.$font-size-sm;
}

.data-value {
  color: tokens.$primary-blue;
  font-weight: tokens.$font-weight-bold;
  font-size: tokens.$font-size-base;
}

/* 图表占位符 */
.chart-placeholder {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-5;
  text-align: center;
  min-height: 200px;

  @include utils.flex-col(tokens.$spacing-4, center, center);
}

.trend-data {
  margin-top: tokens.$spacing-5;
  width: 100%;
  max-width: 400px;

  @include utils.flex-col(tokens.$spacing-2, stretch);
}

.trend-item {
  @include utils.flex-between;

  padding: tokens.$spacing-2 tokens.$spacing-3;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-sm;
}

.trend-date {
  color: tokens.$text-muted;
  font-size: tokens.$font-size-sm;
}

.trend-value {
  color: tokens.$primary-blue;
  font-weight: tokens.$font-weight-bold;
  font-size: tokens.$font-size-sm;
}

/* 任务列表样式 */
.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: tokens.$spacing-4;
  margin-top: tokens.$spacing-4;
}

.tasks-section {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-4;
  border: 1px solid rgb(74 158 255 / 20%);
}

.task-item {
  padding: tokens.$spacing-2 tokens.$spacing-3;
  margin: tokens.$spacing-2 0;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-sm;
  color: tokens.$text-muted;
  font-size: tokens.$font-size-sm;
  transition: all tokens.$transition-fast;

  &:hover {
    background-color: rgb(74 158 255 / 20%);
    color: tokens.$text-primary;
  }
}

/* 关于页面样式 */
.about-content {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-5;
  margin-top: tokens.$spacing-4;

  p {
    margin: tokens.$spacing-2 0;
    color: tokens.$text-muted;
    font-size: tokens.$font-size-sm;
  }

  strong {
    color: tokens.$primary-blue;
  }
}

/* 错误提示样式 */
.error-container {
  flex: 1;

  @include utils.flex-col(tokens.$spacing-3, center, center);

  text-align: center;
  padding: tokens.$spacing-5;
  background-color: rgb(239 68 68 / 10%);
  border: 1px solid rgb(239 68 68 / 30%);
  border-radius: tokens.$radius-lg;
  margin: tokens.$spacing-5;

  h3 {
    color: tokens.$error;
    margin-bottom: tokens.$spacing-3;
    font-size: tokens.$font-size-xl;
  }

  p {
    color: tokens.$text-muted;
    margin: tokens.$spacing-2 0;
    font-size: tokens.$font-size-sm;
  }
}

/* 滚动条样式 */
.modal-sidebar,
.content-body {
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgb(0 0 0 / 10%);
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(74 158 255 / 50%);
    border-radius: tokens.$radius-sm;

    &:hover {
      background: rgb(74 158 255 / 70%);
    }
  }
}
</style>
