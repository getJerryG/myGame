<template>
  <div class="operations-app">
    <!-- 左侧菜单�?-->
    <div class="modal-sidebar">
      <div
        class="sidebar-item"
        v-for="module in app.modules"
        :key="module.id"
        :class="{ active: activeModule === module.id }"
        @click="switchModule(module.id)"
      >
        <span class="sidebar-item-icon">{{ getModuleIcon(module.id) }}</span>
        <span class="sidebar-item-name">{{ module.name }}</span>
      </div>
    </div>

    <!-- 右侧内容�?-->
    <div class="modal-main">
      <!-- 核心数据概览 -->
      <div class="content-header">
        <h2>{{ currentModule.name }}</h2>
        <div
          class="module-core-data"
          v-if="app.coreData"
        >
          <div
            class="core-data-item"
            v-for="(value, key) in app.coreData"
            :key="key"
          >
            <span class="core-data-label">{{ getCoreDataLabel(key) }}:</span>
            <span class="core-data-value">{{ value }}</span>
          </div>
        </div>
      </div>

      <!-- 模块内容 -->
      <div class="content-body">
        <!-- 活动策划模块 -->
        <div
          v-if="activeModule === 'event-planning'"
          class="module-content"
        >
          <h3>活动策划</h3>
          <p>活动策划功能开发中...</p>
        </div>

        <!-- 运营策略模块 -->
        <div
          v-else-if="activeModule === 'operation-strategy'"
          class="module-content"
        >
          <h3>运营策略</h3>
          <p>运营策略功能开发中...</p>
        </div>

        <!-- 市场舆情模块 -->
        <div
          v-else-if="activeModule === 'market-sentiment'"
          class="module-content"
        >
          <h3>市场舆情</h3>
          <p>市场舆情功能开发中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 导入类型
import type { App } from '../../../types/app';
import type { GameData } from '../../../types/game';
import type { Modal } from '../../../types/modal';

// Props定义
const props = defineProps<{
  app: App;
  gameData?: GameData;
  modal?: Modal;
}>();

// Emits定义
const emit = defineEmits<{
  (e: 'update:activeModule', moduleId: string): void;
}>();

// 活跃模块状�?const activeModule = ref(props.app.modules[0].id);

// 当前激活的模块
const currentModule = computed(() => {
  return props.app.modules.find((m) => m.id === activeModule.value) || props.app.modules[0];
});

// 切换模块
const switchModule = (moduleId: string): void => {
  activeModule.value = moduleId;
  emit('update:activeModule', moduleId);
};

// 获取模块图标
const getModuleIcon = (moduleId: string): string => {
  const icons = {
    'event-planning': '🎉',
    'operation-strategy': '📋',
    'market-sentiment': '💬',
  };
  return icons[moduleId] || '📦';
};

// 获取核心数据标签
const getCoreDataLabel = (key: string): string => {
  const labels = {
    events: '活动',
    strategies: '策略',
    sentiment: '舆情',
    data: '数据',
  };
  return labels[key] || key;
};
</script>

<style lang="scss" scoped>
.operations-app {
  display: flex;
  width: 100%;
  height: 100%;
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

.module-content p {
  margin: 0 0 16px;
  color: #b0b0b0;
  line-height: 1.6;
}
</style>
