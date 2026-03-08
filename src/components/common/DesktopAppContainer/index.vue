<template>
  <div
    class="desktop-app-container"
    :class="{
      'is-maximized': windowState.isMaximized,
      'is-minimized': windowState.isMinimized,
    }"
    :style="containerStyle"
    @mousedown="startDrag"
  >
    <!-- 标题栏 -->
    <div class="app-header" @mousedown.stop="startDragHeader">
      <div class="app-title">
        <span class="app-icon">{{ app.icon }}</span>
        <span class="app-name">{{ app.name }}</span>
      </div>
      <div class="app-controls">
        <button class="control-button close" @click.stop="handleClose">
          <span>×</span>
        </button>
      </div>
    </div>

    <!-- 主要内容区域 - 支持侧边栏和主内容布局 -->
    <div class="app-content">
      <!-- 侧边栏（可选） -->
      <aside v-if="app.modules && app.modules.length > 1" class="app-sidebar">
        <nav class="sidebar-nav">
          <div
            v-for="module in app.modules"
            :key="module.id"
            class="sidebar-item"
            :class="{ active: windowState.activeModule === module.id }"
            @click="handleModuleChange(module.id)"
          >
            <span class="sidebar-item-icon">{{
              getModuleIcon(module.id)
            }}</span>
            <span class="sidebar-item-name">{{ module.name }}</span>
          </div>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <main class="app-main">
        <!-- 内容主体 -->
        <div class="content-body">
          <template v-if="currentAppComponent">
            <component
              :is="currentAppComponent"
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
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useWindowManagerStore } from "@/stores/windowManagerStore";

// 导入所有应用组件
import ChatApp from "@/components/business/chat/ChatApp.vue";
import CareerApp from "@/components/business/Career/CareerApp.vue";
import CollabCenterApp from "@/components/business/CollabCenter/CollabCenterApp.vue";
import ContentApp from "@/components/business/content/ContentApp.vue";
import DataCenterApp from "@/components/business/DataCenter/DataCenterApp.vue";
import EventApp from "@/components/business/event/EventApp.vue";
import EventLogApp from "@/components/business/EventLog/EventLogApp.vue";
import GameReleaseApp from "@/components/business/GameRelease/GameReleaseApp.vue";
import HeroApp from "@/components/business/hero/HeroApp.vue";
import LotteryApp from "@/components/business/lottery/LotteryApp.vue";
import OperationsApp from "@/components/business/Operations/OperationsApp.vue";
import RewardsApp from "@/components/business/Rewards/RewardsApp.vue";
import SentimentCenterApp from "@/components/business/SentimentCenter/SentimentCenterApp.vue";
import SkinApp from "@/components/business/Skin/SkinApp.vue";
import SystemSettingsApp from "@/components/business/SystemSettings/SystemSettingsApp.vue";
import TaskCenterApp from "@/components/business/TaskCenter/TaskCenterApp.vue";
import WalletApp from "@/components/business/Wallet/WalletApp.vue";
import AppStore from "@/components/business/AppStore/AppStore.vue";

// 应用组件映射
const appComponents: Record<string, DefineComponent> = {
  chat: ChatApp,
  career: CareerApp,
  "collab-center": CollabCenterApp,
  content: ContentApp,
  "data-center": DataCenterApp,
  event: EventApp,
  "event-log": EventLogApp,
  "game-release": GameReleaseApp,
  hero: HeroApp,
  lottery: LotteryApp,
  operations: OperationsApp,
  rewards: RewardsApp,
  "sentiment-center": SentimentCenterApp,
  skin: SkinApp,
  "system-settings": SystemSettingsApp,
  "task-center": TaskCenterApp,
  wallet: WalletApp,
  "app-store": AppStore,
};

// 定义应用类型
interface App {
  id: string;
  name: string;
  icon: string;
  position: { x: number; y: number };
  coreData: Record<string, unknown>;
  modules: Array<{
    id: string;
    name: string;
  }>;
}

// 定义窗口状态类型
interface WindowState {
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMaximized: boolean;
  isMinimized: boolean;
  activeModule: string;
}

// 定义游戏数据类型
type GameData = Record<string, unknown>;

// Props定义
const props = defineProps<{
  windowId: string;
  windowState: WindowState;
  app: App;
  gameData: GameData;
}>();

// Emits定义
const emit = defineEmits<{
  close: [appId: string];
  "update:windowState": [windowState: WindowState];
  "app-installed": [app: App];
}>();

// 获取窗口管理器store
// const windowManagerStore = useWindowManagerStore();

// 当前应用组件
const currentAppComponent = computed(() => {
  return appComponents[props.app.id];
});

// 容器样式
const containerStyle = computed(() => {
  if (props.windowState.isMaximized) {
    return {
      left: "0px",
      top: "0px",
      width: "100vw",
      height: "100vh",
    };
  }
  return {
    left: `${props.windowState.position.x}px`,
    top: `${props.windowState.position.y}px`,
    width: `${props.windowState.size.width}px`,
    height: `${props.windowState.size.height}px`,
  };
});

// 拖拽相关
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });

// 开始拖拽容器
const startDrag = (event: MouseEvent): void => {
  if (props.windowState.isMaximized) return;
  isDragging.value = true;
  dragOffset.value = {
    x: event.clientX - props.windowState.position.x,
    y: event.clientY - props.windowState.position.y,
  };
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDrag);
};

// 开始拖拽标题栏
const startDragHeader = (event: MouseEvent): void => {
  startDrag(event);
};

// 处理拖拽
const handleDrag = (event: MouseEvent): void => {
  if (!isDragging.value) return;
  const newPosition = {
    x: event.clientX - dragOffset.value.x,
    y: event.clientY - dragOffset.value.y,
  };
  emit("update:windowState", {
    ...props.windowState,
    position: newPosition,
  });
};

// 停止拖拽
const stopDrag = (): void => {
  isDragging.value = false;
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);
};

// 处理关闭
const handleClose = (): void => {
  emit("close", props.app.id);
};

// 处理模块切换
const handleModuleChange = (moduleId: string): void => {
  emit("update:windowState", {
    ...props.windowState,
    activeModule: moduleId,
  });
};

// 获取模块图标
const getModuleIcon = (moduleId: string): string => {
  const iconMap: Record<string, string> = {
    "balance-info": "💰",
    "transaction-history": "📊",
    "lottery-main": "🎰",
    "lottery-history": "📝",
    "lottery-rewards": "🎁",
    "hero-new": "➕",
    "hero-manage": "📋",
    "basic-settings": "⚙️",
    "advanced-settings": "🔧",
    about: "ℹ️",
  };
  return iconMap[moduleId] || "📄";
};

// 组件卸载时清理事件监听器
onUnmounted(() => {
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);
});
</script>

<style lang="scss" scoped>
.desktop-app-container {
  position: absolute;
  background-color: rgb(26 26 46 / 95%);
  border-radius: tokens.$radius-lg;
  box-shadow: 0 0 30px rgb(0 0 0 / 50%);
  overflow: hidden;

  @include utils.flex-col(tokens.$spacing-none, stretch, flex-start);

  z-index: tokens.$z-fixed;
  transition: all tokens.$transition-normal;

  /* 窗口状态样式 */
  &.is-maximized {
    border-radius: 0;
  }

  &.is-minimized {
    display: none;
  }
}

/* 标题栏样式 */
.app-header {
  @include utils.flex-between;

  padding: tokens.$spacing-sm tokens.$spacing-lg;
  background-color: rgb(74 158 255 / 10%);
  border-bottom: 1px solid rgb(74 158 255 / 30%);
  cursor: move;
}

.app-title {
  @include utils.flex-row(tokens.$spacing-sm, center);
}

.app-icon {
  font-size: tokens.$font-size-base;
  color: tokens.$primary-blue;
}

.app-name {
  color: tokens.$text-primary;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-bold;
}

.app-controls {
  @include utils.flex-row(tokens.$spacing-sm, center);
}

.control-button {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: tokens.$radius-sm;
  cursor: pointer;

  @include utils.flex-center;

  font-size: tokens.$font-size-sm;
  transition: all tokens.$transition-fast;

  &.close {
    background-color: rgb(255 107 107 / 20%);
    color: tokens.$danger-red;

    &:hover {
      background-color: rgb(255 107 107 / 40%);
    }
  }
}

/* 内容区域样式 */
.app-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 侧边栏样式 */
.app-sidebar {
  width: 200px;
  background-color: tokens.$bg-light;
  border-right: 1px solid rgb(74 158 255 / 30%);
}

.sidebar-nav {
  padding: tokens.$spacing-lg 0;
}

.sidebar-item {
  @include utils.flex-row(tokens.$spacing-3, center);

  padding: tokens.$spacing-3 tokens.$spacing-5;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  color: tokens.$gray-400;

  &:hover {
    background-color: rgb(74 158 255 / 10%);
    color: tokens.$text-primary;
  }

  &.active {
    background-color: rgb(74 158 255 / 20%);
    color: tokens.$primary-blue;
    border-right: 3px solid tokens.$primary-blue;
  }
}

.sidebar-item-icon {
  font-size: tokens.$font-size-base;
}

.sidebar-item-name {
  font-size: tokens.$font-size-sm;
}

/* 主内容区域样式 */
.app-main {
  flex: 1;
  overflow: auto;
  padding: tokens.$spacing-5;
}

.content-body {
  width: 100%;
  height: 100%;
}

/* 错误容器样式 */
.error-container {
  @include utils.flex-col(tokens.$spacing-4, center, center);

  height: 100%;
  text-align: center;
  color: tokens.$danger-red;

  h3 {
    font-size: tokens.$font-size-xl;
    margin-bottom: tokens.$spacing-4;
  }

  p {
    font-size: tokens.$font-size-sm;
    margin-bottom: tokens.$spacing-2;
  }
}

/* 滚动条样式 */
.app-main {
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: tokens.$bg-light;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(74 158 255 / 50%);
    border-radius: tokens.$radius-sm;

    &:hover {
      background: rgb(74 158 255 / 80%);
    }
  }
}
</style>
