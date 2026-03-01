<template>
  <div
    class="list"
    :class="[
      `list--${layout}`,
      { 'list--loading': loading },
      { 'list--selectable': selectable },
      { 'list--draggable': draggable },
      customClass
    ]"
    @dragover.prevent
    @drop="handleDrop"
  >
    <!-- 加载状态 -->
    <div v-if="loading" class="list__loading">
      <div class="list__spinner"></div>
      <div class="list__loading-text">{{ loadingText }}</div>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="items.length === 0" class="list__empty">
      <div class="list__empty-icon">{{ emptyIcon }}</div>
      <div class="list__empty-text">{{ emptyText }}</div>
      <slot name="empty-actions"></slot>
    </div>
    
    <!-- 列表内容 -->
    <template v-else>
      <!-- 垂直列表 -->
      <ul v-if="layout === 'vertical'" class="list__content list__content--vertical">
        <li
          v-for="(item, index) in items"
          :key="item[keyField] || index"
          class="list__item"
          :class="[
            { 'list__item--selected': selectable && selectedKeys.includes(item[keyField]) },
            { 'list__item--dragging': draggingItem === item[keyField] }
          ]"
          :data-key="item[keyField]"
          :draggable="draggable"
          @click="handleItemClick(item, index)"
          @dragstart="handleDragStart(item, index)"
          @dragend="handleDragEnd"
          @dragover.prevent
          @drop="handleItemDrop(item, index)"
        >
          <!-- 选择框 -->
          <div v-if="selectable" class="list__item-checkbox">
            <input
              type="checkbox"
              :checked="selectedKeys.includes(item[keyField])"
              @change="handleItemSelect(item, index)"
              @click.stop
            >
          </div>
          
          <!-- 拖拽手柄 -->
          <div v-if="draggable" class="list__item-drag-handle">
            {{ dragHandleIcon }}
          </div>
          
          <!-- 列表项内容 -->
          <div class="list__item-content">
            <slot name="item" :item="item" :index="index">
              <!-- 默认列表项内容 -->
              <div class="list__item-title">{{ item[titleField] }}</div>
              <div v-if="item[subtitleField]" class="list__item-subtitle">{{ item[subtitleField] }}</div>
            </slot>
          </div>
        </li>
      </ul>
      
      <!-- 网格列表 -->
      <div v-else-if="layout === 'grid'" class="list__content list__content--grid" :style="gridStyle">
        <div
          v-for="(item, index) in items"
          :key="item[keyField] || index"
          class="list__item list__item--grid"
          :class="[
            { 'list__item--selected': selectable && selectedKeys.includes(item[keyField]) },
            { 'list__item--dragging': draggingItem === item[keyField] }
          ]"
          :data-key="item[keyField]"
          :draggable="draggable"
          @click="handleItemClick(item, index)"
          @dragstart="handleDragStart(item, index)"
          @dragend="handleDragEnd"
        >
          <!-- 选择框 -->
          <div v-if="selectable" class="list__item-checkbox list__item-checkbox--grid">
            <input
              type="checkbox"
              :checked="selectedKeys.includes(item[keyField])"
              @change="handleItemSelect(item, index)"
              @click.stop
            >
          </div>
          
          <!-- 列表项内容 -->
          <div class="list__item-content">
            <slot name="item" :item="item" :index="index">
              <!-- 默认列表项内容 -->
              <div class="list__item-title">{{ item[titleField] }}</div>
              <div v-if="item[subtitleField]" class="list__item-subtitle">{{ item[subtitleField] }}</div>
            </slot>
          </div>
        </div>
      </div>
      
      <!-- 流式列表 -->
      <div v-else-if="layout === 'flow'" class="list__content list__content--flow">
        <div
          v-for="(item, index) in items"
          :key="item[keyField] || index"
          class="list__item list__item--flow"
          :class="[
            { 'list__item--selected': selectable && selectedKeys.includes(item[keyField]) },
            { 'list__item--dragging': draggingItem === item[keyField] }
          ]"
          :data-key="item[keyField]"
          :draggable="draggable"
          @click="handleItemClick(item, index)"
          @dragstart="handleDragStart(item, index)"
          @dragend="handleDragEnd"
        >
          <!-- 列表项内容 -->
          <div class="list__item-content">
            <slot name="item" :item="item" :index="index">
              <!-- 默认列表项内容 -->
              <div class="list__item-title">{{ item[titleField] }}</div>
            </slot>
          </div>
        </div>
      </div>
    </template>
    
    <!-- 分页器 -->
    <div v-if="pagination && !loading && items.length > 0" class="list__pagination">
      <slot name="pagination"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';

interface ListItem {
  [key: string]: any;
}

interface ListProps {
  /**
   * 列表数据
   */
  items: ListItem[];
  
  /**
   * 列表布局
   */
  layout?: 'vertical' | 'grid' | 'flow';
  
  /**
   * 是否可选择
   */
  selectable?: boolean;
  
  /**
   * 是否可拖拽
   */
  draggable?: boolean;
  
  /**
   * 是否显示加载状态
   */
  loading?: boolean;
  
  /**
   * 是否显示分页
   */
  pagination?: boolean;
  
  /**
   * 数据项的唯一标识字段
   */
  keyField?: string;
  
  /**
   * 数据项的标题字段
   */
  titleField?: string;
  
  /**
   * 数据项的副标题字段
   */
  subtitleField?: string;
  
  /**
   * 已选择的键值列表
   */
  selectedKeys?: any[];
  
  /**
   * 加载状态文本
   */
  loadingText?: string;
  
  /**
   * 空状态文本
   */
  emptyText?: string;
  
  /**
   * 空状态图标
   */
  emptyIcon?: string;
  
  /**
   * 拖拽手柄图标
   */
  dragHandleIcon?: string;
  
  /**
   * 网格布局的列数
   */
  gridColumns?: number;
  
  /**
   * 网格布局的间距
   */
  gridGap?: string;
  
  /**
   * 自定义类名
   */
  customClass?: string;
}

const props = withDefaults(defineProps<ListProps>(), {
  layout: 'vertical',
  selectable: false,
  draggable: false,
  loading: false,
  pagination: false,
  keyField: 'id',
  titleField: 'title',
  subtitleField: 'subtitle',
  selectedKeys: () => [],
  loadingText: '加载中...',
  emptyText: '暂无数据',
  emptyIcon: '📭',
  dragHandleIcon: '☰',
  gridColumns: 3,
  gridGap: '16px',
  customClass: ''
});

const emit = defineEmits<{
  /**
   * 列表项点击事件
   */
  'item-click': [item: ListItem, index: number];
  
  /**
   * 列表项选择事件
   */
  'item-select': [selectedKeys: any[], item: ListItem, index: number];
  
  /**
   * 列表项拖拽开始事件
   */
  'drag-start': [item: ListItem, index: number];
  
  /**
   * 列表项拖拽结束事件
   */
  'drag-end': [item: ListItem | null, index: number | null];
  
  /**
   * 列表项拖拽放置事件
   */
  'drag-drop': [fromIndex: number, toIndex: number];
  
  /**
   * 列表拖拽放置事件
   */
  'drop': [fromIndex: number, toIndex: number];
}>();

// 拖拽状态
const draggingItem = ref<any>(null);
const draggingIndex = ref<number | null>(null);

// 计算网格样式
const gridStyle = computed(() => {
  return {
    '--grid-columns': props.gridColumns,
    '--grid-gap': props.gridGap
  };
});

// 处理列表项点击
const handleItemClick = (item: ListItem, index: number) => {
  emit('item-click', item, index);
};

// 处理列表项选择
const handleItemSelect = (item: ListItem, index: number) => {
  let newSelectedKeys: any[];
  const itemKey = item[props.keyField];
  
  if (props.selectedKeys.includes(itemKey)) {
    newSelectedKeys = props.selectedKeys.filter(key => key !== itemKey);
  } else {
    newSelectedKeys = [...props.selectedKeys, itemKey];
  }
  
  emit('item-select', newSelectedKeys, item, index);
};

// 处理拖拽开始
const handleDragStart = (item: ListItem, index: number) => {
  draggingItem.value = item[props.keyField];
  draggingIndex.value = index;
  emit('drag-start', item, index);
};

// 处理拖拽结束
const handleDragEnd = () => {
  draggingItem.value = null;
  draggingIndex.value = null;
  emit('drag-end', null, null);
};

// 处理列表项拖拽放置
const handleItemDrop = (targetItem: ListItem, targetIndex: number) => {
  if (draggingIndex.value !== null) {
    emit('drag-drop', draggingIndex.value, targetIndex);
    handleDragEnd();
  }
};

// 处理列表拖拽放置
const handleDrop = () => {
  if (draggingIndex.value !== null) {
    emit('drop', draggingIndex.value, 0);
    handleDragEnd();
  }
};
</script>

<style lang="scss" scoped>
/* 列表基础样式 */
.list {
  width: 100%;
  position: relative;
  
  /* 自定义滚动条 */
  @include utils.custom-scrollbar;
}

/* 列表内容 */
.list__content {
  width: 100%;
  
  /* 垂直列表 */
  &--vertical {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  /* 网格列表 */
  &--grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-columns, 3), 1fr);
    gap: var(--grid-gap, 16px);
  }
  
  /* 流式列表 */
  &--flow {
    display: flex;
    flex-wrap: wrap;
    gap: var(--grid-gap, 16px);
  }
}

/* 列表项 */
.list__item {
  position: relative;
  transition: all tokens.$transition-fast;
  
  /* 垂直列表项 */
  .list__content--vertical & {
    padding: tokens.$spacing-sm tokens.$spacing-md;
    border-bottom: 1px solid tokens.$border-light;
    cursor: pointer;
    
    &:hover {
      background-color: tokens.$bg-light;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  /* 网格列表项 */
  &--grid {
    background-color: tokens.$bg-light;
    border: 1px solid tokens.$border-light;
    border-radius: tokens.$radius-md;
    padding: tokens.$spacing-md;
    cursor: pointer;
    transition: all tokens.$transition-fast;
    
    &:hover {
      box-shadow: tokens.$shadow-md;
      transform: translateY(-2px);
      border-color: tokens.$primary;
    }
  }
  
  /* 流式列表项 */
  &--flow {
    background-color: tokens.$bg-secondary;
    border: 1px solid tokens.$border-medium;
    border-radius: tokens.$radius-full;
    padding: tokens.$spacing-xs tokens.$spacing-sm;
    cursor: pointer;
    white-space: nowrap;
    
    &:hover {
      background-color: tokens.$bg-light;
      border-color: tokens.$primary;
    }
  }
  
  /* 选中状态 */
  &--selected {
    background-color: rgb(59 130 246 / 10%);
    border-color: tokens.$primary;
    
    .list__content--vertical & {
      background-color: rgb(59 130 246 / 10%);
    }
    
    .list__content--grid & {
      box-shadow: tokens.$shadow-md;
    }
    
    .list__content--flow & {
      background-color: rgb(59 130 246 / 20%);
    }
  }
  
  /* 拖拽状态 */
  &--dragging {
    opacity: 0.5;
    transform: rotate(5deg);
    box-shadow: tokens.$shadow-lg;
    z-index: 100;
  }
}

/* 列表项内容 */
.list__item-content {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-xs;
}

/* 列表项标题 */
.list__item-title {
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-base;
}

/* 列表项副标题 */
.list__item-subtitle {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
}

/* 选择框 */
.list__item-checkbox {
  display: flex;
  align-items: center;
  margin-right: tokens.$spacing-sm;
  cursor: pointer;
  
  input[type="checkbox"] {
    accent-color: tokens.$primary;
  }
  
  /* 网格列表的选择框 */
  &--grid {
    position: absolute;
    top: tokens.$spacing-sm;
    right: tokens.$spacing-sm;
    margin-right: 0;
  }
}

/* 拖拽手柄 */
.list__item-drag-handle {
  display: flex;
  align-items: center;
  margin-right: tokens.$spacing-sm;
  cursor: grab;
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-sm;
  
  &:active {
    cursor: grabbing;
  }
}

/* 加载状态 */
.list__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: tokens.$spacing-xl;
  gap: tokens.$spacing-sm;
}

.list__spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: tokens.$primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.list__loading-text {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
}

/* 空状态 */
.list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: tokens.$spacing-xl;
  gap: tokens.$spacing-sm;
  text-align: center;
}

.list__empty-icon {
  font-size: tokens.$font-size-3xl;
  color: tokens.$text-muted;
}

.list__empty-text {
  font-size: tokens.$font-size-base;
  color: tokens.$text-secondary;
}

/* 分页器 */
.list__pagination {
  margin-top: tokens.$spacing-md;
  display: flex;
  justify-content: center;
}

/* 动画 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@include utils.mobile {
  .list__content--grid {
    grid-template-columns: repeat(var(--grid-columns-mobile, 2), 1fr);
  }
  
  .list__content--flow {
    justify-content: center;
  }
}

@include utils.small-mobile {
  .list__content--grid {
    grid-template-columns: 1fr;
  }
}
</style>