<template>
  <div class="content-app">
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
        <div class="module-core-data" v-if="app.coreData">
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
        <!-- 英雄管理模块 -->
        <div v-if="activeModule === 'hero-management'" class="module-content">
          <h3>英雄管理</h3>
          <p>英雄管理功能开发中...</p>
        </div>

        <!-- 皮肤发布模块 -->
        <div v-else-if="activeModule === 'skin-release'" class="module-content">
          <h3>皮肤发布</h3>
          <p>皮肤发布功能开发中...</p>
        </div>

        <!-- 游戏优化模块 -->
        <div
          v-else-if="activeModule === 'game-optimization'"
          class="module-content"
        >
          <h3>游戏优化</h3>
          <p>游戏优化功能开发中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ContentService } from '@/services/ContentService';

const props = defineProps({
  app: {
    type: Object,
    required: true,
  },
  gameData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:activeModule"]);

// 活跃模块状�?const activeModule = ref(props.app.modules[0].id);

// 当前激活的模块
const currentModule = computed(() => {
  return ContentService.getCurrentModule(props.app.modules, activeModule.value);
});

// 切换模块
const switchModule = (moduleId: string): void => {
  activeModule.value = moduleId;
  emit("update:activeModule", moduleId);
};

// 获取模块图标 - 组件方法，用于模板调用
const getModuleIcon = (moduleId: string): string => {
  return ContentService.getModuleIcon(moduleId);
};

// 获取核心数据标签 - 组件方法，用于模板调用
const getCoreDataLabel = (key: string): string => {
  return ContentService.getCoreDataLabel(key);
};
</script>

<style lang="scss" scoped>
.content-app {
  @include utils.flex-row(0, stretch, flex-start);

  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 左侧菜单栏样式 */
.modal-sidebar {
  width: 200px;
  background-color: tokens.$bg-light;
  border-right: 1px solid tokens.$border-medium;
  overflow-y: auto;

  @include utils.custom-scrollbar;
}

.sidebar-item {
  @include utils.flex-row(tokens.$spacing-md, center, flex-start);

  padding: tokens.$spacing-sm tokens.$spacing-md;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  color: tokens.$text-muted;
  border-left: 3px solid transparent;

  &:hover {
    background-color: rgba(tokens.$primary-blue, 0.2);
    color: tokens.$text-primary;
  }

  &.active {
    background-color: rgba(tokens.$primary-blue, 0.3);
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

  @include utils.flex-col(0, stretch, flex-start);

  overflow: hidden;
  background-color: tokens.$bg-light;
}

.content-header {
  padding: tokens.$spacing-md;
  border-bottom: 1px solid tokens.$border-medium;
  background-color: tokens.$bg-light;

  h2 {
    margin: 0 0 tokens.$spacing-sm;
    font-size: tokens.$font-size-xl;
    color: tokens.$text-primary;
  }
}

.module-core-data {
  @include utils.flex-row(tokens.$spacing-lg, center, flex-start);

  flex-wrap: wrap;
}

.core-data-item {
  @include utils.flex-row(tokens.$spacing-sm);

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
  padding: tokens.$spacing-lg;
  overflow-y: auto;
  color: tokens.$text-primary;

  @include utils.custom-scrollbar;
}

.module-content {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-lg;
  min-height: 200px;

  h3 {
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-lg;
    color: tokens.$primary-blue;
  }

  p {
    margin: 0 0 tokens.$spacing-md;
    color: tokens.$text-muted;
    line-height: tokens.$line-height-normal;
  }
}
</style>
