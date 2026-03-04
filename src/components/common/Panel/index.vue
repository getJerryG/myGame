<template>
  <div
    class="panel"
    :class="[
      `panel--${variant}`,
      `panel--${size}`,
      { 'panel--collapsible': collapsible },
      { 'panel--collapsed': isCollapsed },
      { 'panel--disabled': disabled },
      customClass,
    ]"
  >
    <!-- 面板头部 -->
    <div v-if="$slots.header || title" class="panel__header">
      <!-- 折叠按钮 -->
      <button
        v-if="collapsible"
        class="panel__collapse-btn"
        :aria-expanded="!isCollapsed"
        aria-label="折叠/展开面板"
        @click="toggleCollapse"
      >
        <span class="panel__collapse-icon">{{ isCollapsed ? "▶️" : "▼" }}</span>
      </button>

      <!-- 头部内容 -->
      <div class="panel__header-content">
        <slot name="header">
          <h3 v-if="title" class="panel__title">{{ title }}</h3>
        </slot>
      </div>

      <!-- 头部操作区 -->
      <div v-if="$slots.header - actions" class="panel__header-actions">
        <slot name="header-actions"></slot>
      </div>
    </div>

    <!-- 面板内容 -->
    <div
      v-if="!isCollapsed || !collapsible"
      class="panel__content"
      :class="{ 'panel__content--collapsible': collapsible }"
    >
      <slot></slot>
    </div>

    <!-- 面板底部 -->
    <div
      v-if="$slots.footer && (!isCollapsed || !collapsible)"
      class="panel__footer"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PanelProps {
  /**
   * 面板样式变体
   */
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info";

  /**
   * 面板尺寸
   */
  size?: "small" | "medium" | "large";

  /**
   * 是否可折叠
   */
  collapsible?: boolean;

  /**
   * 是否默认折叠
   */
  defaultCollapsed?: boolean;

  /**
   * 当前折叠状态（受控模式）
   */
  collapsed?: boolean;

  /**
   * 是否禁用
   */
  disabled?: boolean;

  /**
   * 面板标题
   */
  title?: string;

  /**
   * 自定义类名
   */
  customClass?: string;
}

const props = withDefaults(defineProps<PanelProps>(), {
  variant: "default",
  size: "medium",
  collapsible: false,
  defaultCollapsed: false,
  collapsed: undefined,
  disabled: false,
  title: "",
  customClass: "",
});

const emit = defineEmits<{
  /**
   * 折叠状态变化事件
   */
  "collapse-change": [collapsed: boolean];
}>();

// 折叠状态（支持受控和非受控模式）
const isCollapsed = ref(props.defaultCollapsed);

// 监听外部collapsed属性变化（受控模式）
watch(
  () => props.collapsed,
  (newValue) => {
    if (newValue !== undefined) {
      isCollapsed.value = newValue;
    }
  },
  { immediate: true },
);

// 切换折叠状态
const toggleCollapse = (): void => {
  if (props.disabled) return;

  const newState = !isCollapsed.value;
  isCollapsed.value = newState;
  emit("collapse-change", newState);
};
</script>

<style lang="scss" scoped>
/* 面板基础样式 */
.panel {
  background-color: tokens.$bg-light;
  border: 1px solid tokens.$border-light;
  border-radius: tokens.$radius-lg;
  overflow: hidden;
  transition: all tokens.$transition-normal;

  /* 禁用状态 */
  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

/* 面板尺寸 */
.panel--small {
  padding: tokens.$spacing-sm;

  .panel__header {
    padding: tokens.$spacing-xs tokens.$spacing-sm;
  }

  .panel__content {
    padding: tokens.$spacing-sm;
  }

  .panel__footer {
    padding: tokens.$spacing-xs tokens.$spacing-sm;
  }

  .panel__title {
    font-size: tokens.$font-size-base;
  }
}

.panel--medium {
  padding: tokens.$spacing-md;
}

.panel--large {
  padding: tokens.$spacing-lg;

  .panel__title {
    font-size: tokens.$font-size-lg;
  }
}

/* 面板变体 */
.panel--default {
  background-color: tokens.$bg-light;
  border-color: tokens.$border-light;
}

.panel--primary {
  background-color: rgb(59 130 246 / 10%);
  border-color: tokens.$primary;
}

.panel--secondary {
  background-color: tokens.$bg-secondary;
  border-color: tokens.$border-medium;
}

.panel--success {
  background-color: rgb(16 185 129 / 10%);
  border-color: tokens.$success;
}

.panel--warning {
  background-color: rgb(245 158 11 / 10%);
  border-color: tokens.$warning;
}

.panel--danger {
  background-color: rgb(239 68 68 / 10%);
  border-color: tokens.$error;
}

.panel--info {
  background-color: rgb(56 189 248 / 10%);
  border-color: tokens.$info;
}

/* 面板头部 */
.panel__header {
  display: flex;
  align-items: center;
  gap: tokens.$spacing-sm;
  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: tokens.$bg-secondary;
  border-bottom: 1px solid tokens.$border-light;
  margin: -1px -1px 0;

  /* 可折叠面板头部样式 */
  .panel--collapsible & {
    cursor: pointer;
    transition: all tokens.$transition-normal;

    &:hover {
      background-color: tokens.$bg-light;
    }
  }
}

/* 折叠按钮 */
.panel__collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: tokens.$text-secondary;
  transition: all tokens.$transition-fast;

  &:hover {
    color: tokens.$text-primary;
    transform: scale(1.1);
  }
}

.panel__collapse-icon {
  font-size: tokens.$font-size-xs;
  transition: transform tokens.$transition-fast;
}

/* 头部内容 */
.panel__header-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: tokens.$spacing-sm;
}

.panel__title {
  margin: 0;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
}

/* 头部操作区 */
.panel__header-actions {
  display: flex;
  gap: tokens.$spacing-xs;
}

/* 面板内容 */
.panel__content {
  padding: tokens.$spacing-md;
  color: tokens.$text-primary;
  line-height: 1.6;

  /* 可折叠内容的过渡效果 */
  &--collapsible {
    transition: all tokens.$transition-normal;
  }
}

/* 面板底部 */
.panel__footer {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: tokens.$bg-secondary;
  border-top: 1px solid tokens.$border-light;
  margin: 0 -1px -1px;
  display: flex;
  justify-content: flex-end;
  gap: tokens.$spacing-sm;
}

/* 折叠状态 */
.panel--collapsed {
  .panel__content {
    max-height: 0;
    padding: 0;
    overflow: hidden;
    border: none;
  }

  .panel__footer {
    max-height: 0;
    padding: 0;
    overflow: hidden;
    border: none;
  }
}

/* 响应式设计 */
@include utils.mobile {
  .panel--large {
    padding: tokens.$spacing-md;

    .panel__title {
      font-size: tokens.$font-size-base;
    }
  }

  .panel__header {
    padding: tokens.$spacing-xs;
  }

  .panel__content {
    padding: tokens.$spacing-sm;
  }

  .panel__footer {
    padding: tokens.$spacing-xs;
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
