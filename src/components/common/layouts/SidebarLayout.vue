<template>
  <div :class="[baseClass, className, { 'dark-theme': darkTheme }]">
    <!-- 左侧侧边�?-->
    <div class="sidebar-layout-sidebar">
      <div
        class="sidebar-item"
        v-for="item in sidebarItems"
        :key="item.id"
        :class="{ active: activeItemId === item.id }"
        @click="handleItemClick(item)"
      >
        <span class="sidebar-item-icon">{{ item.icon }}</span>
        <span class="sidebar-item-name">{{ item.name }}</span>
      </div>
    </div>

    <!-- 右侧主内容区�?-->
    <div class="sidebar-layout-main">
      <!-- 内容头部 -->
      <div
        class="content-header"
        v-if="showHeader"
      >
        <h2>{{ currentItem?.name || '' }}</h2>
        <div
          class="module-core-data"
          v-if="coreData"
        >
          <div
            class="core-data-item"
            v-for="(value, key) in coreData"
            :key="key"
          >
            <span class="core-data-label">{{ getCoreDataLabel(key) }}:</span>
            <span class="core-data-value">{{ value }}</span>
          </div>
        </div>
      </div>

      <!-- 内容主体 -->
      <div class="content-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * 侧边栏布局组件 - 提供带有侧边导航和主内容区域的布局
 *
 * @description 该组件用于创建包含侧边导航栏和主内容区域的布局，支持深�?浅色主题切换，适用于多模块应用
 * @example
 * ```vue
 * <SidebarLayout
 *   :sidebar-items="sidebarItems"
 *   :active-item-id="activeModule"
 *   :dark-theme="true"
 *   :show-header="true"
 *   :core-data="coreData"
 *   :label-map="labelMap"
 *   @update:activeItemId="updateActiveModule"
 *   @item-click="handleItemClick"
 * >
 *   <!-- 主内容区�?-->
 * </SidebarLayout>
 * ```
 */

// 定义侧边栏项类型
/**
 * 侧边栏项类型定义
 */
export interface SidebarItem {
  /**
   * 侧边栏项唯一标识�?   */
  id: string;
  /**
   * 侧边栏项名称
   */
  name: string;
  /**
   * 侧边栏项图标
   */
  icon: string;
}

// 定义属�?const props = withDefaults(
  defineProps<{
    /**
     * 侧边栏项列表
     */
    sidebarItems: SidebarItem[];
    /**
     * 当前激活的侧边栏项ID
     */
    activeItemId: string;
    /**
     * 自定义类�?     */
    className?: string;
    /**
     * 是否使用深色主题
     */
    darkTheme?: boolean;
    /**
     * 是否显示内容头部
     */
    showHeader?: boolean;
    /**
     * 核心数据，显示在内容头部
     */
    coreData?: Record<string, unknown>;
    /**
     * 核心数据标签映射，用于将key转换为更友好的显示名�?     */
    labelMap?: Record<string, string>;
  }>(),
  {
    className: '',
    darkTheme: false,
    showHeader: true,
    coreData: () => ({}),
    labelMap: () => ({}),
  }
);

// 定义事件
/**
 * 组件事件定义
 */
const emit = defineEmits<{
  /**
   * 侧边栏项激活状态变化事�?   */
  'update:activeItemId': [id: string];
  /**
   * 侧边栏项点击事件
   */
  'item-click': [item: SidebarItem];
}>();

// 基础类名
const baseClass = computed((): string => 'sidebar-layout');

// 当前选中的侧边栏�?const currentItem = computed((): SidebarItem | null => {
  return props.sidebarItems.find((item) => item.id === props.activeItemId) || null;
});

// 处理侧边栏项点击
const handleItemClick = (item: SidebarItem): void => {
  emit('update:activeItemId', item.id);
  emit('item-click', item);
};

// 获取核心数据标签
const getCoreDataLabel = (key: string): string => {
  return props.labelMap[key] || key;
};
</script>

<style lang="scss" scoped>
.sidebar-layout {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;

  // 深色主题
  &.dark-theme {
    .sidebar-layout-sidebar {
      background-color: rgb(0 0 0 / 20%);
      border-right: 1px solid #333;

      .sidebar-item {
        color: #b0b0b0;

        &:hover {
          background-color: rgb(74 158 255 / 20%);
          color: #fff;
        }

        &.active {
          background-color: rgb(74 158 255 / 30%);
          color: #fff;
          border-left-color: #4a9eff;
        }
      }
    }

    .sidebar-layout-main {
      background-color: rgb(26 26 46 / 50%);

      .content-header {
        border-bottom: 1px solid #333;
        background-color: rgb(0 0 0 / 10%);

        h2 {
          color: #fff;
        }
      }

      .core-data-item {
        .core-data-label {
          color: #b0b0b0;
        }

        .core-data-value {
          color: #4a9eff;
        }
      }

      .content-body {
        color: #fff;
      }
    }
  }

  // 浅色主题（默认）
  &:not(.dark-theme) {
    .sidebar-layout-sidebar {
      background-color: #f0f0f0;
      border-right: 1px solid #ddd;

      .sidebar-item {
        color: #666;

        &:hover {
          background-color: rgb(78 205 196 / 10%);
          color: #333;
        }

        &.active {
          background-color: white;
          color: #333;
          border-left-color: #4ecdc4;
        }
      }
    }

    .sidebar-layout-main {
      background-color: white;

      .content-header {
        border-bottom: 1px solid #ddd;
        background-color: #fafafa;

        h2 {
          color: #333;
        }
      }

      .core-data-item {
        .core-data-label {
          color: #666;
        }

        .core-data-value {
          color: #4ecdc4;
        }
      }

      .content-body {
        color: #333;
      }
    }
  }
}

/* 侧边栏样�? */
.sidebar-layout-sidebar {
  width: 200px;
  overflow-y: auto;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
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

/* 主内容区域样�? */
.sidebar-layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  padding: 16px;

  h2 {
    margin: 0 0 12px;
    font-size: 20px;
  }
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
  font-weight: 500;
}

.core-data-value {
  font-weight: bold;
}

.content-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>


