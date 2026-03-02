<template>
  <aside v-if="items && items.length > 0" class="window-sidebar">
    <nav class="sidebar-nav">
      <div
        v-for="item in items"
        :key="item.id"
        class="sidebar-nav-item"
        :class="{
          active: activeItemId === item.id,
          disabled: item.disabled,
        }"
        @click="handleItemClick(item)"
      >
        <span class="nav-item-icon">{{ item.icon }}</span>
        <span class="nav-item-text">{{ item.name }}</span>
        <span v-if="item.highlight" class="nav-item-highlight">!</span>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
export interface SidebarItem {
  id: string;
  name: string;
  icon: string;
  disabled?: boolean;
  highlight?: boolean;
}

defineProps<{
  items: SidebarItem[];
  activeItemId?: string;
}>();

const emit = defineEmits<{
  "update:activeItemId": [id: string];
  "item-click": [item: SidebarItem];
}>();

const handleItemClick = (item: SidebarItem): void => {
  if (!item.disabled) {
    emit("update:activeItemId", item.id);
    emit("item-click", item);
  }
};
</script>

<style lang="scss" scoped>
.window-sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  background-color: var(--app-bg-secondary);
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
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--app-text-secondary);
  position: relative;

  &:hover {
    &:not(.disabled) {
      background-color: var(--bg-hover);
      color: var(--app-text-primary);
    }
  }

  &.active {
    background-color: var(--bg-active);
    color: var(--app-text-primary);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.nav-item-icon {
  font-size: 18px;
  width: 18px;
  height: 18px;
  line-height: 1;
  text-align: center;
  flex-shrink: 0;
}

.nav-item-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
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
  border-radius: 50%;
  background-color: #ef4444;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
}
</style>
