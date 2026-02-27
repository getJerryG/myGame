<template>
  <div class="application-window">
    <header class="app-window-header">
      <div class="header-title-section">
        <span
          v-if="titleIcon"
          class="title-icon"
          >{{ titleIcon }}</span
        >
        <h2 class="header-title">{{ displayTitle }}</h2>
      </div>
      <div class="header-actions">
        <slot name="header-actions"></slot>
        <div
          v-if="showWindowControls"
          class="window-controls"
        >
          <button
            class="window-control-btn window-control-btn--close"
            @click="handleClose"
            title="关闭"
          >
            <span>×</span>
          </button>
        </div>
      </div>
    </header>

    <div class="app-window-content">
      <aside
        v-if="sidebarItems && sidebarItems.length > 0"
        class="app-window-sidebar"
      >
        <nav class="sidebar-nav">
          <div
            v-for="item in sidebarItems"
            :key="item.id"
            class="sidebar-nav-item"
            :class="{
              active: activeItemId === item.id,
              disabled: item.disabled,
            }"
            @click="handleSidebarItemClick(item)"
          >
            <span class="nav-item-icon">{{ item.icon }}</span>
            <span class="nav-item-text">{{ item.name }}</span>
            <span
              v-if="item.highlight"
              class="nav-item-highlight"
              >!</span
            >
          </div>
        </nav>
      </aside>

      <main
        class="app-window-main"
        :class="{
          'with-sidebar': sidebarItems && sidebarItems.length > 0,
        }"
      >
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface SidebarItem {
  id: string;
  name: string;
  icon: string;
  disabled?: boolean;
  highlight?: boolean;
}

const _props = withDefaults(
  defineProps<{
    title: string;
    windowTitle?: string;
    titleIcon?: string;
    sidebarItems?: SidebarItem[];
    activeItemId?: string;
    showWindowControls?: boolean;
    isMaximized?: boolean;
    className?: string;
  }>(),
  {
    windowTitle: '',
    titleIcon: '',
    sidebarItems: () => [],
    activeItemId: '',
    showWindowControls: false,
    isMaximized: false,
    className: '',
  }
);

const emit = defineEmits<{
  'update:activeItemId': [id: string];
  'item-click': [item: SidebarItem];
  close: [];
}>();

// 计算显示标题
const displayTitle = computed(() => {
  return _props.windowTitle || _props.title;
});

const handleSidebarItemClick = (item: SidebarItem): void => {
  if (!item.disabled) {
    emit('update:activeItemId', item.id);
    emit('item-click', item);
  }
};

const handleClose = (): void => {
  emit('close');
};
</script>

<style lang="scss" scoped>
.application-window {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--app-bg-primary);
  border: var(--border-width-1) solid var(--app-border-secondary);
  border-radius: var(--app-radius-md);
  box-shadow: var(--app-shadow-primary);
  overflow: hidden;
}

.app-window-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--app-bg-secondary);
  padding: var(--space-2) var(--space-3);
  border-bottom: var(--border-width-1) solid var(--app-border-secondary);
  min-height: var(--height-taskbar);
}

.header-title-section {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex: 1;
}

.title-icon {
  font-size: var(--icon-size-md);
  line-height: 1;
}

.header-title {
  margin: 0;
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--app-text-primary);
  line-height: var(--line-height-normal);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.window-controls {
  display: flex;
  align-items: center;
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

.app-window-content {
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
}

.app-window-sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  background-color: var(--app-bg-tertiary);
  border-right: var(--border-width-1) solid var(--app-border-secondary);
  overflow: hidden auto;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: var(--space-2) 0;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  margin: 0 var(--space-1);
  border-radius: var(--app-radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  color: var(--app-text-secondary);
  position: relative;

  &:hover:not(.disabled) {
    background-color: var(--bg-hover);
    color: var(--app-text-primary);
  }

  &.active {
    background-color: var(--bg-active);
    color: var(--app-text-primary);
  }

  &.disabled {
    opacity: var(--opacity-50);
    cursor: not-allowed;
  }
}

.nav-item-icon {
  font-size: var(--icon-size-md);
  width: var(--icon-size-md);
  height: var(--icon-size-md);
  line-height: 1;
  text-align: center;
  flex-shrink: 0;
}

.nav-item-text {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--line-height-normal);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item-highlight {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  min-width: 16px;
  border-radius: var(--radius-full);
  background-color: var(--danger-red);
  color: white;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  line-height: 1;
  flex-shrink: 0;
}

.app-window-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--app-bg-primary);
  padding: var(--space-4);

  &.with-sidebar {
    padding: var(--space-5);
  }
}

/* 金色重要字体样式 */
.text-gold {
  color: var(--primary-gold);
  font-weight: var(--font-bold);
}
</style>
