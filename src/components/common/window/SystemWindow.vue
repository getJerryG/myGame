<template>
  <div
    :id="`window-${windowId}`"
    ref="windowRef"
    class="window"
    :class="{
      'window--active': windowData.isActive,
      'window--dragging': windowData.isDragging,
      'window--merge-preview': isMergePreview,
    }"
    :style="{
      left: `${windowData.x}px`,
      top: `${windowData.y}px`,
      width: `${windowData.width}px`,
      height: `${windowData.height}px`,
      zIndex: windowData.zIndex,
    }"
    @click="activateWindow"
  >
    <!-- 标题�?-->
    <div
      ref="titleBarRef"
      class="window-title-bar"
      @mousedown.stop="startDrag"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.stop="handleDrop"
    >
      <!-- 选项卡区�?-->
      <div
        v-if="windowData.tabs && windowData.tabs.length > 1"
        class="window-tabs"
      >
        <div
          v-for="tab in windowData.tabs"
          :key="tab.id"
          class="window-tab"
          :class="{
            'window-tab--active': tab.id === windowData.activeTabId,
          }"
          @mousedown.stop="startTabDrag(tab.id)"
          @click.stop="switchTab(tab.id)"
          draggable="true"
          @dragstart="handleTabDragStart(tab.id)"
          @dragend="handleTabDragEnd"
        >
          <div class="window-tab-content">
            {{ tab.title }}
          </div>
          <button
            class="window-tab-close"
            @click.stop="closeTab(tab.id)"
            title="关闭选项�?
          >
            ×
          </button>
        </div>
      </div>
      <!-- 普通标�?-->
      <div
        v-else
        class="window-title"
      >
        {{ windowData.title }}
      </div>

      <!-- 窗口控制按钮 -->
      <div class="window-controls">
        <button
          class="window-control-btn window-control-btn--close"
          @click.stop="closeWindow"
          title="关闭窗口"
        >
          ×
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="window-content">
      <!-- 侧边�?-->
      <aside
        v-if="props.sidebarItems && props.sidebarItems.length > 0"
        class="window-sidebar"
      >
        <nav class="sidebar-nav">
          <div
            v-for="item in props.sidebarItems"
            :key="item.id"
            class="sidebar-nav-item"
            :class="{
              active: props.activeItemId === item.id,
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

      <!-- 主内�?-->
      <main
        v-if="!windowData.tabs || windowData.tabs.length === 0"
        class="window-main-content"
        :class="{
          'with-sidebar': props.sidebarItems && props.sidebarItems.length > 0,
        }"
      >
        <slot>
          {{ windowData.content.type }}
        </slot>
      </main>

      <!-- 选项卡内�?-->
      <div v-else>
        <main
          v-for="tab in windowData.tabs"
          :key="tab.id"
          v-show="tab.id === windowData.activeTabId"
          class="window-main-content"
          :class="{
            'with-sidebar': props.sidebarItems && props.sidebarItems.length > 0,
          }"
        >
          <slot :name="tab.id">
            {{ tab.content.type }}
          </slot>
        </main>
      </div>
    </div>

    <!-- 调整大小的手�?-->
    <div
      class="window-resize-handle window-resize-handle--se"
      @mousedown.stop="startResize('se')"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useWindowManagerStore } from '../../stores/windowManagerStore';

export interface SidebarItem {
  id: string;
  name: string;
  icon: string;
  disabled?: boolean;
  highlight?: boolean;
}

const props = defineProps<{
  windowId: string;
  sidebarItems?: SidebarItem[];
  activeItemId?: string;
}>();

const emit = defineEmits<{
  'update:activeItemId': [id: string];
  'item-click': [item: SidebarItem];
}>();

// 侧边栏相关逻辑
const handleSidebarItemClick = (item: SidebarItem): void => {
  if (!item.disabled) {
    emit('update:activeItemId', item.id);
    emit('item-click', item);
  }
};

const windowManagerStore = useWindowManagerStore();
const windowRef = ref<HTMLElement | null>(null);
const titleBarRef = ref<HTMLElement | null>(null);

// 拖拽状�?const dragStartPos = ref({ x: 0, y: 0 });
const windowStartPos = ref({ x: 0, y: 0 });
const resizeStartPos = ref({ x: 0, y: 0 });
const windowStartSize = ref({ width: 0, height: 0 });
const isResizing = ref(false);
const resizeDirection = ref<string | null>(null);
const tabDragData = ref<{ tabId: string; windowId: string } | null>(null);

// 计算属�?const windowData = computed(() => {
  return windowManagerStore.windows.find((w) => w.id === props.windowId)!;
});

const isMergePreview = computed(() => {
  return windowManagerStore.mergePreview?.targetId === props.windowId;
});

// 激活窗�?const activateWindow = () => {
  windowManagerStore.activateWindow(props.windowId);
};

// 开始拖�?const startDrag = (event: MouseEvent) => {
  if (event.target && (event.target as HTMLElement).closest('.window-tab-close')) {
    return;
  }

  dragStartPos.value = { x: event.clientX, y: event.clientY };
  windowStartPos.value = { x: windowData.value.x, y: windowData.value.y };

  windowManagerStore.startDrag(props.windowId);

  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('mouseup', stopDrag);

  // 阻止文本选择
  document.body.style.userSelect = 'none';
};

// 拖拽移动
const handleDragMove = (event: MouseEvent) => {
  if (!windowData.value.isDragging) return;

  const dx = event.clientX - dragStartPos.value.x;
  const dy = event.clientY - dragStartPos.value.y;

  windowManagerStore.updateWindowPosition(props.windowId, windowStartPos.value.x + dx, windowStartPos.value.y + dy);

  // 检测合并预�?  checkMergePreview();
};

// 停止拖拽
const stopDrag = () => {
  windowManagerStore.endDrag();

  document.removeEventListener('mousemove', handleDragMove);
  document.removeEventListener('mouseup', stopDrag);

  document.body.style.userSelect = '';
};

// 检查合并预�?const checkMergePreview = () => {
  if (!windowData.value.isDragging || windowManagerStore.dragSourceWindowId !== props.windowId) {
    return;
  }

  // 获取所有窗口的标题栏位�?  const sourceRect = windowRef.value?.getBoundingClientRect();
  if (!sourceRect) return;

  for (const window of windowManagerStore.windows) {
    if (window.id === props.windowId) continue;

    const targetElement = document.getElementById(`window-${window.id}`);
    if (!targetElement) continue;

    const targetRect = targetElement.getBoundingClientRect();
    const titleBarHeight = 32; // 标题栏高�?
    // 检查源窗口的标题栏是否与目标窗口的标题栏重�?    if (
      sourceRect.left < targetRect.left + targetRect.width &&
      sourceRect.left + sourceRect.width > targetRect.left &&
      sourceRect.top < targetRect.top + titleBarHeight &&
      sourceRect.top + titleBarHeight > targetRect.top
    ) {
      windowManagerStore.setMergePreview(props.windowId, window.id);
      return;
    }
  }

  windowManagerStore.setMergePreview(props.windowId, null);
};

// 开始调整大�?const startResize = (direction: string) => {
  resizeStartPos.value = { x: window.event!.clientX, y: window.event!.clientY };
  windowStartSize.value = { width: windowData.value.width, height: windowData.value.height };
  isResizing.value = true;
  resizeDirection.value = direction;

  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);

  document.body.style.userSelect = 'none';
};

// 调整大小
const handleResize = (event: MouseEvent) => {
  if (!isResizing.value || !resizeDirection.value) return;

  const dx = event.clientX - resizeStartPos.value.x;
  const dy = event.clientY - resizeStartPos.value.y;

  let newWidth = windowStartSize.value.width;
  let newHeight = windowStartSize.value.height;

  if (resizeDirection.value === 'se') {
    newWidth = Math.max(200, windowStartSize.value.width + dx);
    newHeight = Math.max(150, windowStartSize.value.height + dy);
  }

  windowManagerStore.updateWindowSize(props.windowId, newWidth, newHeight);
};

// 停止调整大小
const stopResize = () => {
  isResizing.value = false;
  resizeDirection.value = null;

  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);

  document.body.style.userSelect = '';
};

// 关闭窗口
const closeWindow = () => {
  windowManagerStore.closeWindow(props.windowId);
};

// 切换选项�?const switchTab = (tabId: string) => {
  windowManagerStore.switchTab(props.windowId, tabId);
};

// 关闭选项�?const closeTab = (tabId: string) => {
  windowManagerStore.closeTab(props.windowId, tabId);
};

// 开始拖拽选项�?const startTabDrag = (tabId: string) => {
  tabDragData.value = { tabId, windowId: props.windowId };
};

// 处理选项卡拖拽开�?const handleTabDragStart = (tabId: string) => {
  tabDragData.value = { tabId, windowId: props.windowId };
};

// 处理选项卡拖拽结�?const handleTabDragEnd = () => {
  if (tabDragData.value) {
    // 检查是否拖出了窗口区域
    const tabRect = (window.event?.target as HTMLElement).getBoundingClientRect();
    const titleBarRect = titleBarRef.value?.getBoundingClientRect();

    if (titleBarRect && (tabRect.top < titleBarRect.top || tabRect.bottom > titleBarRect.bottom)) {
      // 拖出了标题栏，分离窗�?      windowManagerStore.detachWindow(props.windowId, tabDragData.value.tabId);
    }

    tabDragData.value = null;
  }
};

// 处理拖放事件
const handleDragOver = (event: DragEvent) => {
  if (tabDragData.value && tabDragData.value.windowId !== props.windowId) {
    event.dataTransfer!.dropEffect = 'move';
  }
};

const handleDragLeave = () => {
  // 处理拖拽离开
};

const handleDrop = () => {
  if (tabDragData.value && tabDragData.value.windowId !== props.windowId) {
    // 将拖拽的选项卡合并到当前窗口
    const sourceWindow = windowManagerStore.windows.find((w) => w.id === tabDragData.value.windowId);
    if (sourceWindow?.tabs) {
      const tab = sourceWindow.tabs.find((t) => t.id === tabDragData.value!.tabId);
      if (tab) {
        // 这里需要实现选项卡合并逻辑
        // 目前的设计是拖拽整个窗口合并，选项卡拖拽用于分�?      }
    }
  }
};

// 组件挂载时添加键盘事件监�?onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

// 组件卸载时移除键盘事件监�?onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
  // 确保移除所有事件监听器
  document.removeEventListener('mousemove', handleDragMove);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
});

// 键盘事件处理
const handleKeyDown = (event: KeyboardEvent) => {
  // Ctrl+Tab 切换到下一个选项�?  if (event.ctrlKey && event.key === 'Tab') {
    event.preventDefault();
    windowManagerStore.nextTab(props.windowId);
  }

  // Ctrl+Shift+Tab 切换到上一个选项�?  if (event.ctrlKey && event.shiftKey && event.key === 'Tab') {
    event.preventDefault();
    windowManagerStore.prevTab(props.windowId);
  }
};
</script>

<style lang="scss" scoped>
.window {
  position: absolute;
  background: #fff; /* 明确的白色背景，防止窗口击穿 */
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 15%); /* 增强阴影效果 */
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  user-select: none;
  overflow: hidden;
  z-index: 10; /* 确保窗口在正确的层级 */

  &--active {
    box-shadow: 0 5px 25px rgb(0 0 0 / 25%); /* 增强活动窗口阴影 */
    border-color: #0078d7;
    z-index: 20; /* 活动窗口置于顶层 */
  }

  &--dragging {
    opacity: 0.9; /* 稍微提高透明度，增强拖拽体验 */
    cursor: grabbing;
    box-shadow: 0 6px 30px rgb(0 0 0 / 30%); /* 拖拽时更强的阴影 */
  }

  &--merge-preview {
    box-shadow:
      0 0 0 2px #0078d7 inset,
      0 5px 25px rgb(0 0 0 / 25%); /* 合并预览时增强阴�? */
  }
}

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

.window-content {
  flex: 1;
  padding: var(--space-4);
  overflow: auto;
  background: var(--app-bg-primary);
  min-height: 100px;
  z-index: 1;
}

.window-resize-handle {
  position: absolute;
  width: 16px;
  height: 16px;
  cursor: se-resize;

  &--se {
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      transparent 50%,
      var(--color-primary-blue) 50%,
      var(--color-primary-blue) 100%
    );
    opacity: 0;
    transition: opacity var(--transition-fast);

    .window:hover & {
      opacity: 0.5;
    }

    &:hover {
      opacity: 1;
    }
  }
}

/* 选项卡样�? */
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

/* 侧边栏样�? */
.window-content {
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

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

  &:hover:not(.disabled) {
    background-color: var(--bg-hover);
    color: var(--app-text-primary);
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

.window-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
  padding: 16px;

  &.with-sidebar {
    padding: 20px;
  }
}

/* 动画效果 */
@keyframes windowFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes windowSlide {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(0);
  }
}

.window {
  animation: windowFadeIn 0.2s ease-out;
}
</style>


