<template>
  <div
    class="card"
    :class="[
      `card--${variant}`,
      `card--${size}`,
      `card--${shape}`,
      { 'card--elevated': elevated },
      { 'card--hoverable': hoverable },
      customClass,
    ]"
  >
    <!-- 卡片头部 -->
    <div v-if="$slots.header || title || subtitle" class="card__header">
      <div v-if="title || subtitle" class="card__header-content">
        <h3 v-if="title" class="card__title">{{ title }}</h3>
        <p v-if="subtitle" class="card__subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.header - actions" class="card__header-actions">
        <slot name="header-actions"></slot>
      </div>
    </div>

    <!-- 卡片图片 -->
    <div v-if="$slots.image" class="card__image">
      <slot name="image"></slot>
    </div>

    <!-- 卡片内容 -->
    <div v-if="$slots.default" class="card__content">
      <slot></slot>
    </div>

    <!-- 卡片标签 -->
    <div v-if="tags && tags.length > 0" class="card__tags">
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="card__tag"
        :class="`card__tag--${tag.variant || 'default'}`"
      >
        {{ tag.text }}
      </span>
    </div>

    <!-- 卡片底部 -->
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface CardTag {
  /**
   * 标签文本
   */
  text: string;

  /**
   * 标签样式变体
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

interface CardProps {
  /**
   * 卡片样式变体
   */
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info';

  /**
   * 卡片尺寸
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * 卡片形状
   */
  shape?: 'square' | 'round';

  /**
   * 是否显示阴影
   */
  elevated?: boolean;

  /**
   * 是否可悬停
   */
  hoverable?: boolean;

  /**
   * 卡片标题
   */
  title?: string;

  /**
   * 卡片副标题
   */
  subtitle?: string;

  /**
   * 卡片标签
   */
  tags?: CardTag[];

  /**
   * 自定义类名
   */
  customClass?: string;
}

const props = withDefaults(defineProps<CardProps>(), {
  variant: 'default',
  size: 'medium',
  shape: 'square',
  elevated: true,
  hoverable: true,
  title: '',
  subtitle: '',
  tags: () => [],
  customClass: '',
});
</script>

<style lang="scss" scoped>
/* 卡片基础样式 */
.card {
  background-color: tokens.$bg-light;
  border: 1px solid tokens.$border-light;
  border-radius: tokens.$radius-md;
  overflow: hidden;
  transition: all tokens.$transition-normal;

  /* 阴影效果 */
  &--elevated {
    box-shadow: tokens.$shadow-sm;
  }

  /* 悬停效果 */
  &--hoverable {
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: tokens.$shadow-md;
    }
  }
}

/* 卡片尺寸 */
.card--small {
  padding: tokens.$spacing-sm;

  .card__header,
  .card__content,
  .card__footer {
    padding: tokens.$spacing-xs;
  }

  .card__title {
    font-size: tokens.$font-size-base;
  }

  .card__subtitle {
    font-size: tokens.$font-size-sm;
  }
}

.card--medium {
  padding: tokens.$spacing-md;
}

.card--large {
  padding: tokens.$spacing-lg;

  .card__title {
    font-size: tokens.$font-size-lg;
  }
}

/* 卡片形状 */
.card--square {
  border-radius: tokens.$radius-md;
}

.card--round {
  border-radius: tokens.$radius-xl;

  .card__image {
    border-radius: tokens.$radius-lg;
  }
}

/* 卡片变体 */
.card--default {
  background-color: tokens.$bg-light;
  border-color: tokens.$border-light;
}

.card--primary {
  background-color: rgb(59 130 246 / 10%);
  border-color: tokens.$primary;
}

.card--secondary {
  background-color: tokens.$bg-secondary;
  border-color: tokens.$border-medium;
}

.card--success {
  background-color: rgb(16 185 129 / 10%);
  border-color: tokens.$success;
}

.card--warning {
  background-color: rgb(245 158 11 / 10%);
  border-color: tokens.$warning;
}

.card--danger {
  background-color: rgb(239 68 68 / 10%);
  border-color: tokens.$error;
}

.card--info {
  background-color: rgb(56 189 248 / 10%);
  border-color: tokens.$info;
}

/* 卡片头部 */
.card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: tokens.$spacing-md;
  padding-bottom: tokens.$spacing-md;
  margin-bottom: tokens.$spacing-md;
  border-bottom: 1px solid tokens.$border-light;

  /* 响应式调整 */
  @include utils.mobile {
    flex-direction: column;
    align-items: stretch;
  }
}

.card__header-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-xs;
}

.card__title {
  margin: 0;
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
}

.card__subtitle {
  margin: 0;
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  line-height: 1.5;
}

.card__header-actions {
  display: flex;
  gap: tokens.$spacing-xs;
}

/* 卡片图片 */
.card__image {
  margin-bottom: tokens.$spacing-md;
  border-radius: tokens.$radius-sm;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
}

/* 卡片内容 */
.card__content {
  margin-bottom: tokens.$spacing-md;
  color: tokens.$text-primary;
  line-height: 1.6;
}

/* 卡片标签 */
.card__tags {
  display: flex;
  gap: tokens.$spacing-xs;
  flex-wrap: wrap;
  margin-bottom: tokens.$spacing-md;
}

.card__tag {
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  border-radius: tokens.$radius-full;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-medium;
  white-space: nowrap;

  &--default {
    background-color: tokens.$bg-secondary;
    color: tokens.$text-primary;
    border: 1px solid tokens.$border-medium;
  }

  &--primary {
    background-color: rgb(59 130 246 / 20%);
    color: tokens.$primary;
    border: 1px solid rgb(59 130 246 / 30%);
  }

  &--success {
    background-color: rgb(16 185 129 / 20%);
    color: tokens.$success;
    border: 1px solid rgb(16 185 129 / 30%);
  }

  &--warning {
    background-color: rgb(245 158 11 / 20%);
    color: tokens.$warning;
    border: 1px solid rgb(245 158 11 / 30%);
  }

  &--danger {
    background-color: rgb(239 68 68 / 20%);
    color: tokens.$error;
    border: 1px solid rgb(239 68 68 / 30%);
  }

  &--info {
    background-color: rgb(56 189 248 / 20%);
    color: tokens.$info;
    border: 1px solid rgb(56 189 248 / 30%);
  }
}

/* 卡片底部 */
.card__footer {
  padding-top: tokens.$spacing-md;
  border-top: 1px solid tokens.$border-light;
  display: flex;
  gap: tokens.$spacing-sm;
  justify-content: flex-end;

  /* 响应式调整 */
  @include utils.mobile {
    flex-direction: column;
  }
}

/* 响应式设计 */
@include utils.mobile {
  .card--large {
    padding: tokens.$spacing-md;

    .card__title {
      font-size: tokens.$font-size-base;
    }
  }

  .card__header {
    flex-direction: column;
    align-items: stretch;
  }

  .card__header-actions {
    justify-content: flex-end;
  }

  .card__footer {
    flex-direction: column;
  }
}
</style>
