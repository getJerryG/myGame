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
    <!-- 标题�?->
    <div class="modal-header" @mousedown.stop="startDragHeader">
      <div class="modal-title">
        <span class="app-icon">{{ app.icon }}</span>
        <span class="app-name">{{ app.name }}</span>
      </div>
      <div class="modal-controls">
        <button class="control-button minimize" @click.stop="$emit('minimize')">
          <span>�?/span>
        </button>
        <button class="control-button maximize" @click.stop="$emit('maximize')">
          <span v-if="!modal.isMaximized">�?/span>
          <span v-else>�?/span>
        </button>
        <button class="control-button close" @click.stop="$emit('close')">
          <span>×</span>
        </button>
      </div>
    </div>

    <!-- 主要内容区域 - 动态加载应用组�?-->
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
            <h3>应用组件不存�?/h3>
            <p>无法加载应用: {{ app.id }}</p>
            <p>请检查应用配置或联系管理�?/p>
          </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

// 导入所有应用组�?import ChatApp from '@/components/business/apps/chat/ChatApp.vue';
import DataCenterApp from '@/components/business/apps/DataCenter/DataCenterApp.vue';
import OperationsApp from '@/components/business/apps/operations/OperationsApp.vue';
import ContentApp from '@/components/business/apps/content/ContentApp.vue';
import RewardsApp from '@/components/business/apps/rewards/RewardsApp.vue';
import WalletApp from '@/components/business/apps/wallet/WalletApp.vue';
import LotteryApp from '@/components/business/apps/lottery/LotteryApp.vue';
import GameSettingsApp from '@/components/business/apps/game-settings/GameSettingsApp.vue';
import AppStore from '@/components/business/apps/AppStore/AppStore.vue';
import HeroApp from '@/components/business/apps/hero/HeroApp.vue';
import SkinApp from '@/components/business/apps/skin/SkinApp.vue';
// 确保游戏发布组件被正确导入并命名
import GameReleaseApp from '@/modules/game/views/GameReleaseApp.vue';

// 确保组件有正确的名称
GameReleaseApp.name = 'GameReleaseApp';

// 导入类型

import type { GameData } from '../types/game';
import type { Modal } from '../types/modal';

// Props定义
const props = defineProps<{
  modal: Modal;
  app: App;
  gameData?: GameData;
}>();

// Emits定义
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'minimize'): void;
  (e: 'maximize'): void;
  (e: 'update:modal', modal: Modal): void;
  (e: 'app-installed', app: App): void;
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
  'data-center': DataCenterApp,
  operations: OperationsApp,
  content: ContentApp,
  rewards: RewardsApp,
  wallet: WalletApp,
  lottery: LotteryApp,
  'game-settings': GameSettingsApp,
  'app-store': AppStore,
  'hero-development': HeroApp,
  'skin-development': SkinApp,
  'event-development': OperationsApp, // 事件开发使用运营管理组
  'game-release': GameReleaseApp, // 游戏发布使用专门的游戏发布组
};

// 获取当前应用组件
const currentAppComponent = computed(() => {
  return appComponents[props.app.id] || null;
});

// 模态框样式
const modalStyle = computed(() => {
  if (props.modal.isMaximized) {
    return {
      left: '0px',
      top: '0px',
      width: '100%',
      height: 'calc(100% - 48px)', // 减去任务栏高�?      zIndex: 100,
    };
  }

  if (isMinimized.value) {
    return {
      display: 'none',
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
    transition: isDragging.value ? 'none' : 'all 0.08s ease',
  };
});

// 拖拽功能
const startDrag = (e: MouseEvent): void => {
  // 排除控制按钮区域，防止点击按钮时触发拖拽
  if (
    (e.target as Element).closest('.control-button') ||
    (e.target as Element).closest('.modal-controls')
  ) {
    return;
  }

  if (
    e.target.classList.contains('modal-header') ||
    (e.target as Element).closest('.modal-header')
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

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
};

const drag = (e: MouseEvent): void => {
  if (!isDragging.value) return;

  // 获取桌面容器尺寸（减去任务栏高度48px�?  const desktopWidth = window.innerWidth;
  const desktopHeight = window.innerHeight - 48;

  // 计算新的位置
  let newX = e.clientX - dragOffset.value.x;
  let newY = e.clientY - dragOffset.value.y;

  // 碰撞检�? 确保窗口不会超出桌面范围
  // 左边�?  newX = Math.max(0, newX);
  // 上边�?  newY = Math.max(0, newY);
  // 右边�?- 考虑窗口宽度
  newX = Math.min(desktopWidth - props.modal.size.width, newX);
  // 下边�?- 考虑窗口高度
  newY = Math.min(desktopHeight - props.modal.size.height, newY);

  // 更新拖拽位置，用于实时渲�?  dragPosition.value = { x: newX, y: newY };

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
    emit('update:modal', updatedModal);
  }

  // 直接将isDragging设为false，不再等待nextTick
  // 同步dragPosition与props.modal.position，确保状态一�?  dragPosition.value = { ...props.modal.position };
  isDragging.value = false;

  // 清理事件监听�?  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);

  // 取消动画�?  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

// 组件卸载时清理事件监�?onUnmounted(() => {
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<style lang=scss scoped>
.desktop-modal {
  position: absolute;
  background-color: rgb(26 26 46 / 95%);
  border: 1px solid #4a9eff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgb(0 0 0 / 50%), 0 0 0 2px rgb(255 255 255 / 80%);
  overflow: hidden;
  transition: all 0.08s ease;
  min-width: 600px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.desktop-modal.is-maximized {
  border-radius: 0;
  min-width: 0;
  min-height: 0;
}

.desktop-modal.is-minimized {
  display: none;
}

/* 标题栏样�? */
.modal-header {
  height: 48px;
  background-color: rgb(74 158 255 / 20%);
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  cursor: move;
  user-select: none;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-title .app-icon {
  font-size: 20px;
}

.modal-title .app-name {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.modal-controls {
  display: flex;
  gap: 4px;
}

.control-button {
  width: 32px;
  height: 32px;
  background-color: transparent;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
}

.control-button:hover {
  background-color: rgb(255 255 255 / 10%);
}

.control-button.close:hover {
  background-color: #ff4757;
}

.control-button.minimize:hover,
.control-button.maximize:hover {
  background-color: rgb(74 158 255 / 50%);
}

/* 内容区域样式 */
.modal-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧菜单栏样�? */
.modal-sidebar {
  width: 200px;
  background-color: rgb(0 0 0 / 20%);
  border-right: 1px solid #333;
  overflow-y: auto;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #b0b0b0;
  border-left: 3px solid transparent;
}

.sidebar-item:hover {
  background-color: rgb(74 158 255 / 20%);
  color: #fff;
}

.sidebar-item.active {
  background-color: rgb(74 158 255 / 30%);
  color: #fff;
  border-left-color: #4a9eff;
}

.sidebar-item-icon {
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.sidebar-item-name {
  font-size: 14px;
  font-weight: 500;
}

/* 右侧内容区域样式 */
.modal-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: rgb(26 26 46 / 50%);
}

.content-header {
  padding: 16px;
  border-bottom: 1px solid #333;
  background-color: rgb(0 0 0 / 10%);
}

.content-header h2 {
  margin: 0 0 12px;
  font-size: 20px;
  color: #fff;
}

.module-core-data {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.core-data-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.core-data-label {
  color: #b0b0b0;
}

.core-data-value {
  color: #4a9eff;
  font-weight: bold;
}

.content-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  color: #fff;
}

.module-content {
  background-color: rgb(0 0 0 / 10%);
  border-radius: 8px;
  padding: 20px;
  min-height: 200px;
}

.module-content h3 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #4a9eff;
}

.module-content h4 {
  margin: 0 0 12px;
  font-size: 16px;
  color: #fff;
}

.module-content p {
  margin: 0 0 16px;
  color: #b0b0b0;
  line-height: 1.6;
}

/* 数据卡片样式 */
.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.data-card {
  background-color: rgb(0 0 0 / 20%);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgb(74 158 255 / 20%);
  transition: all 0.2s ease;
}

.data-card:hover {
  border-color: rgb(74 158 255 / 50%);
  transform: translateY(-2px);
}

.data-card-header {
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgb(74 158 255 / 20%);
}

.data-card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.data-label {
  color: #b0b0b0;
  font-size: 14px;
}

.data-value {
  color: #4a9eff;
  font-weight: bold;
  font-size: 16px;
}

/* 图表占位�? */
.chart-placeholder {
  background-color: rgb(0 0 0 / 20%);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.trend-data {
  margin-top: 20px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trend-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: rgb(0 0 0 / 20%);
  border-radius: 4px;
}

.trend-date {
  color: #b0b0b0;
  font-size: 14px;
}

.trend-value {
  color: #4a9eff;
  font-weight: bold;
  font-size: 14px;
}

/* 任务列表样式 */
.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.tasks-section {
  background-color: rgb(0 0 0 / 20%);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgb(74 158 255 / 20%);
}

.task-item {
  padding: 8px 12px;
  margin: 8px 0;
  background-color: rgb(0 0 0 / 20%);
  border-radius: 4px;
  color: #b0b0b0;
  font-size: 14px;
  transition: all 0.2s ease;
}

.task-item:hover {
  background-color: rgb(74 158 255 / 20%);
  color: #fff;
}

/* 关于页面样式 */
.about-content {
  background-color: rgb(0 0 0 / 20%);
  border-radius: 8px;
  padding: 20px;
  margin-top: 16px;
}

.about-content p {
  margin: 8px 0;
  color: #b0b0b0;
  font-size: 14px;
}

.about-content strong {
  color: #4a9eff;
}

/* 错误提示样式 */
.error-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  background-color: rgb(255 71 87 / 10%);
  border: 1px solid rgb(255 71 87 / 30%);
  border-radius: 8px;
  margin: 20px;
}

.error-container h3 {
  color: #ff4757;
  margin-bottom: 12px;
  font-size: 20px;
}

.error-container p {
  color: #b0b0b0;
  margin: 8px 0;
  font-size: 14px;
}

/* 滚动条样�? */
.modal-sidebar::-webkit-scrollbar,
.content-body::-webkit-scrollbar {
  width: 8px;
}

.modal-sidebar::-webkit-scrollbar-track,
.content-body::-webkit-scrollbar-track {
  background: rgb(0 0 0 / 10%);
}

.modal-sidebar::-webkit-scrollbar-thumb,
.content-body::-webkit-scrollbar-thumb {
  background: rgb(74 158 255 / 50%);
  border-radius: 4px;
}

.modal-sidebar::-webkit-scrollbar-thumb:hover,
.content-body::-webkit-scrollbar-thumb:hover {
  background: rgb(74 158 255 / 70%);
}
</style>




