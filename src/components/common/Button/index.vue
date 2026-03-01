<template>
  <button
    class="btn"
    :class="[
      `btn--${variant}`,
      `btn--${size}`,
      `btn--${shape}`,
      { 'btn--disabled': disabled || loading },
      { 'btn--loading': loading },
      { 'btn--block': block },
      customClass
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <!-- 加载状态 -->
    <div v-if="loading" class="btn__loading">
      <div class="btn__spinner"></div>
    </div>
    
    <!-- 图标 -->
    <div v-if="icon" class="btn__icon" :class="{ 'btn__icon--right': iconPosition === 'right' }">
      {{ icon }}
    </div>
    
    <!-- 文本内容 -->
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface ButtonProps {
  /**
   * 按钮类型
   */
  type?: 'button' | 'submit' | 'reset';
  
  /**
   * 按钮样式变体
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  
  /**
   * 按钮尺寸
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 按钮形状
   */
  shape?: 'square' | 'round' | 'circle';
  
  /**
   * 是否禁用
   */
  disabled?: boolean;
  
  /**
   * 是否显示加载状态
   */
  loading?: boolean;
  
  /**
   * 是否为块级按钮
   */
  block?: boolean;
  
  /**
   * 图标
   */
  icon?: string;
  
  /**
   * 图标位置
   */
  iconPosition?: 'left' | 'right';
  
  /**
   * 自定义类名
   */
  customClass?: string;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  shape: 'square',
  disabled: false,
  loading: false,
  block: false,
  icon: '',
  iconPosition: 'left',
  customClass: ''
});

const emit = defineEmits<{
  /**
   * 点击事件
   */
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<style lang="scss" scoped>
/* 按钮基础样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: tokens.$spacing-sm;
  font-weight: tokens.$font-weight-medium;
  font-size: tokens.$font-size-base;
  line-height: 1;
  border: none;
  border-radius: tokens.$radius-sm;
  padding: tokens.$spacing-sm tokens.$spacing-md;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  position: relative;
  overflow: hidden;
  
  /* 文本溢出处理 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* 禁用状态 */
  &.btn--disabled {
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none;
  }
  
  /* 块级按钮 */
  &.btn--block {
    width: 100%;
  }
}

/* 按钮尺寸 */
.btn--small {
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  font-size: tokens.$font-size-sm;
}

.btn--medium {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  font-size: tokens.$font-size-base;
}

.btn--large {
  padding: tokens.$spacing-md tokens.$spacing-lg;
  font-size: tokens.$font-size-lg;
}

/* 按钮形状 */
.btn--square {
  border-radius: tokens.$radius-sm;
}

.btn--round {
  border-radius: tokens.$radius-full;
}

.btn--circle {
  border-radius: 50%;
  padding: tokens.$spacing-sm;
  min-width: 36px;
  min-height: 36px;
  
  .btn--small & {
    min-width: 28px;
    min-height: 28px;
    padding: tokens.$spacing-xs;
  }
  
  .btn--large & {
    min-width: 44px;
    min-height: 44px;
    padding: tokens.$spacing-md;
  }
  
  /* 圆形按钮只显示图标 */
  &:not(.btn--loading) {
    > :not(.btn__icon) {
      display: none;
    }
    
    .btn__icon {
      margin: 0;
    }
  }
}

/* 按钮变体 */
.btn--primary {
  background-color: tokens.$primary;
  color: white;
  
  &:hover:not(.btn--disabled) {
    background-color: tokens.$primary-dark;
    box-shadow: tokens.$shadow-md;
    transform: translateY(-1px);
  }
  
  &:active:not(.btn--disabled) {
    transform: translateY(0);
    box-shadow: tokens.$shadow-sm;
  }
}

.btn--secondary {
  background-color: tokens.$bg-secondary;
  color: tokens.$text-primary;
  border: 1px solid tokens.$border-medium;
  
  &:hover:not(.btn--disabled) {
    background-color: tokens.$bg-light;
    border-color: tokens.$primary;
    box-shadow: tokens.$shadow-md;
    transform: translateY(-1px);
  }
  
  &:active:not(.btn--disabled) {
    transform: translateY(0);
    box-shadow: tokens.$shadow-sm;
  }
}

.btn--success {
  background-color: tokens.$success;
  color: white;
  
  &:hover:not(.btn--disabled) {
    background-color: tokens.$success-green;
    box-shadow: tokens.$shadow-md;
    transform: translateY(-1px);
  }
  
  &:active:not(.btn--disabled) {
    transform: translateY(0);
    box-shadow: tokens.$shadow-sm;
  }
}

.btn--warning {
  background-color: tokens.$warning;
  color: white;
  
  &:hover:not(.btn--disabled) {
    background-color: tokens.$warning-yellow;
    box-shadow: tokens.$shadow-md;
    transform: translateY(-1px);
  }
  
  &:active:not(.btn--disabled) {
    transform: translateY(0);
    box-shadow: tokens.$shadow-sm;
  }
}

.btn--danger {
  background-color: tokens.$error;
  color: white;
  
  &:hover:not(.btn--disabled) {
    background-color: tokens.$error-red;
    box-shadow: tokens.$shadow-md;
    transform: translateY(-1px);
  }
  
  &:active:not(.btn--disabled) {
    transform: translateY(0);
    box-shadow: tokens.$shadow-sm;
  }
}

.btn--info {
  background-color: tokens.$info;
  color: white;
  
  &:hover:not(.btn--disabled) {
    background-color: tokens.$info-blue;
    box-shadow: tokens.$shadow-md;
    transform: translateY(-1px);
  }
  
  &:active:not(.btn--disabled) {
    transform: translateY(0);
    box-shadow: tokens.$shadow-sm;
  }
}

/* 图标样式 */
.btn__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  
  &--right {
    order: 1;
  }
}

/* 加载状态 */
.btn--loading {
  position: relative;
  
  > :not(.btn__loading) {
    visibility: hidden;
  }
}

.btn__loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  /* 针对非白色背景的调整 */
  .btn--secondary &,
  .btn--info & {
    border-color: rgba(0, 0, 0, 0.3);
    border-top-color: tokens.$text-primary;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@include utils.mobile {
  .btn--large {
    padding: tokens.$spacing-sm tokens.$spacing-md;
    font-size: tokens.$font-size-base;
  }
  
  .btn--block {
    width: 100%;
  }
}
</style>