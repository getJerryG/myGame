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
    <!-- 标题栏（带选项卡） -->
    <WindowTitleBar
      :title="windowData.title"
      :tabs="windowData.tabs"
      :active-tab-id="windowData.activeTabId"
      @close="closeWindow"
      @tab-click="switchTab"
      @tab-close="closeTab"
      @tab-drag-start="startTabDrag"
      @tab-drag-end="handleTabDragEnd"
      @mousedown.stop="startDrag"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent
      @drop.stop="handleDrop"
    />

    <!-- 内容区域 -->
    <div class="window-content">
      <!-- 侧边栏 -->
      <WindowSidebar
        v-if="props.sidebarItems && props.sidebarItems.length > 0"
        :items="props.sidebarItems"
        :active-item-id="props.activeItemId"
        @update:active-item-id="(id) => emit('update:activeItemId', id)"
        @item-click="handleSidebarItemClick"
      />

      <!-- 主内容区 -->
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

      <!-- 选项卡内容 -->
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

    <!-- 调整大小手柄 -->
    <WindowResizeHandle @resize="handleResize" @resize-end="stopResize" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useWindowManagerStore } from '../../stores/windowManagerStore';
import WindowTitleBar from './WindowTitleBar.vue';
import WindowSidebar from './WindowSidebar.vue';
import WindowResizeHandle from './WindowResizeHandle.vue';

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

// 拖拽状态
const dragStartPos = ref({ x: 0, y: 0 });
const windowStartPos = ref({ x: 0, y: 0 });
const resizeStartPos = ref({ x: 0, y: 0 });
const windowStartSize = ref({ width: 0, height: 0 });
const tabDragData = ref<{ tabId: string; windowId: string } | null>(null);

// 计算属性
const windowData = computed(() => {
  return windowManagerStore.windows.find((w) => w.id === props.windowId)!;
});

const isMergePreview = computed(() => {
  return windowManagerStore.mergePreview?.targetId === props.windowId;
});

// 激活窗口
const activateWindow = () => {
  windowManagerStore.activateWindow(props.windowId);
};

// 开始拖拽
const startDrag = (event: MouseEvent) => {
  if (
    event.target &&
    (event.target as HTMLElement).closest('.window-tab-close')
  ) {
    return;
  }

  dragStartPos.value = { x: event.clientX, y: event.clientY };
  windowStartPos.value = { x: windowData.value.x, y: windowData.value.y };

  windowManagerStore.startDrag(props.windowId);

  document.addEventListener('mousemove', handleDragMove);
  document.addEventListener('mouseup', stopDrag);
  document.body.style.userSelect = 'none';
};

// 拖拽移动
const handleDragMove = (event: MouseEvent) => {
  if (!windowData.value.isDragging) return;

  const dx = event.clientX - dragStartPos.value.x;
  const dy = event.clientY - dragStartPos.value.y;

  windowManagerStore.updateWindowPosition(
    props.windowId,
    windowStartPos.value.x + dx,
    windowStartPos.value.y + dy,
  );
};

// 停止拖拽
const stopDrag = () => {
  windowManagerStore.endDrag();

  document.removeEventListener('mousemove', handleDragMove);
  document.removeEventListener('mouseup', stopDrag);
  document.body.style.userSelect = '';
};

// 处理调整大小
const handleResize = (direction: string, dx: number, dy: number): void => {
  const newWidth = Math.max(200, windowStartSize.value.width + dx);
  const newHeight = Math.max(150, windowStartSize.value.height + dy);
  windowManagerStore.updateWindowSize(props.windowId, newWidth, newHeight);
};

const stopResize = () => {
  // 调整大小结束
};

// 关闭窗口
const closeWindow = () => {
  windowManagerStore.closeWindow(props.windowId);
};

// 切换选项卡
const switchTab = (tabId: string) => {
  windowManagerStore.switchTab(props.windowId, tabId);
};

// 关闭选项卡
const closeTab = (tabId: string) => {
  windowManagerStore.closeTab(props.windowId, tabId);
};

// 开始拖拽选项卡
const startTabDrag = (tabId: string) => {
  tabDragData.value = { tabId, windowId: props.windowId };
};

// 处理选项卡拖拽结束
const handleTabDragEnd = () => {
  if (tabDragData.value) {
    tabDragData.value = null;
  }
};

// 处理拖放事件
const handleDragOver = (event: DragEvent) => {
  if (tabDragData.value && tabDragData.value.windowId !== props.windowId) {
    event.dataTransfer!.dropEffect = 'move';
  }
};

const handleDrop = () => {
  if (tabDragData.value && tabDragData.value.windowId !== props.windowId) {
    // 将拖拽的选项卡合并到当前窗口
    const sourceWindow = windowManagerStore.windows.find(
      (w) => w.id === tabDragData.value.windowId,
    );
    if (sourceWindow?.tabs) {
      const tab = sourceWindow.tabs.find(
        (t) => t.id === tabDragData.value!.tabId,
      );
      if (tab) {
        // 这里需要实现选项卡合并逻辑
      }
    }
  }
};

// 组件挂载时添加键盘事件监听
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

// 组件卸载时移除键盘事件监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
  // 确保移除所有事件监听器
  document.removeEventListener('mousemove', handleDragMove);
  document.removeEventListener('mouseup', stopDrag);
});

// 键盘事件处理
const handleKeyDown = (event: KeyboardEvent) => {
  // Ctrl+Tab 切换到下一个选项卡
  if (event.ctrlKey && event.key === 'Tab') {
    event.preventDefault();
    windowManagerStore.nextTab(props.windowId);
  }

  // Ctrl+Shift+Tab 切换到上一个选项卡
  if (event.ctrlKey && event.shiftKey && event.key === 'Tab') {
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
      0 5px 25px rgb(0 0 0 / 25%); /* 合并预览时增强阴? */
  }
}

.window-content {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  padding: 16px;
  background-color: #fff;
}

.window-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;

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
