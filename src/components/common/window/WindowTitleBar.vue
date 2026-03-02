<template>
  <div class="window-title-bar">
    <!-- 选项卡区域 -->
    <div v-if="tabs && tabs.length > 1" class="window-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="window-tab"
        :class="{
          'window-tab--active': tab.id === activeTabId,
        }"
        @mousedown.stop="$emit('tab-drag-start', tab.id)"
        @click.stop="$emit('tab-click', tab.id)"
        draggable="true"
        @dragstart="$emit('tab-drag-start', tab.id)"
        @dragend="$emit('tab-drag-end')"
      >
        <div class="window-tab-content">
          {{ tab.title }}
        </div>
        <button
          class="window-tab-close"
          @click.stop="$emit('tab-close', tab.id)"
          title="关闭选项卡"
        >
          ×
        </button>
      </div>
    </div>
    <!-- 普通标题 -->
    <div v-else class="window-title">
      {{ title }}
    </div>

    <!-- 窗口控制按钮 -->
    <div class="window-controls">
      <button
        class="window-control-btn window-control-btn--close"
        @click.stop="$emit('close')"
        title="关闭窗口"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface WindowTab {
  id: string;
  title: string;
  content: unknown;
}

defineProps<{
  title: string;
  tabs?: WindowTab[];
  activeTabId?: string;
}>();

defineEmits<{
  close: [];
  "tab-click": [tabId: string];
  "tab-close": [tabId: string];
  "tab-drag-start": [tabId: string];
  "tab-drag-end": [];
}>();
</script>

<style lang="scss" scoped>
.window-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f0f0f0;
  padding: 8px 12px;
  cursor: move;
  border-bottom: 1px solid #ccc;
  min-height: 32px;

  .window--active & {
    background: #0078d7;
    color: white;
    border-bottom-color: #005a9e;
  }

  &:active {
    cursor: grabbing;
  }
}

.window-title {
  font-weight: bold;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.window-controls {
  display: flex;
  gap: var(--space-1);
}

.window-control-btn {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);

  &:hover {
    opacity: 0.8;
  }

  &--close {
    background: var(--danger-red);
    color: white;

    &:hover {
      background: var(--color-danger-dark);
    }
  }
}

/* 选项卡样式 */
.window-tabs {
  display: flex;
  gap: var(--space-1);
  flex: 1;
  overflow: auto hidden;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: var(--app-bg-tertiary);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border-primary);
    border-radius: var(--radius-sm);
  }
}

.window-tab {
  display: flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  background: var(--app-bg-tertiary);
  border: var(--border-width-1) solid var(--app-border-secondary);
  border-bottom: none;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 120px;
  max-width: 200px;
  height: 24px;

  .window--active & {
    background: var(--app-bg-primary);
    color: var(--color-primary-blue);
    border-color: var(--color-primary-blue);
  }

  &--active {
    background: var(--app-bg-primary);
    color: var(--color-primary-blue);
    border-color: var(--color-primary-blue);
  }

  &:hover {
    background: var(--bg-hover);

    .window--active & {
      background: var(--bg-active);
    }
  }

  &:active {
    cursor: grabbing;
  }
}

.window-tab-content {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--text-xs);
}

.window-tab-close {
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  color: inherit;
  font-size: var(--text-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  margin-left: var(--space-1);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--app-bg-tertiary);

    .window--active & {
      background: var(--bg-hover);
    }
  }
}
</style>
