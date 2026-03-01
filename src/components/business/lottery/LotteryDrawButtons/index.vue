<template>
  <div class="draw-buttons-panel">
    <button
      class="draw-button single"
      :disabled="lotteryStore.stones < (lotteryStore.firstDraw ? 10 : 100)"
      @click="handleSingleDraw"
    >
      单抽 {{ lotteryStore.firstDraw ? '(1�?del>10�?/del>)' : '(10�?' }} ({{ lotteryStore.firstDraw ? 10 : 100 }}祈愿�?
    </button>
    <button
      class="draw-button ten"
      :disabled="lotteryStore.stones < 1000"
      @click="handleTenDraws"
    >
      10连抽 {{ lotteryStore.firstTenDraw ? '(91�?del>100�?/del>)' : '(100�?' }} (1000祈愿�?
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLotteryStore } from '@/stores/lotteryStore';

// 暴露事件给父组件
const emit = defineEmits(['single-draw', 'ten-draws']);

const lotteryStore = useLotteryStore();

// 处理单抽
const handleSingleDraw = (): void => {
  emit('single-draw');
};

// 处理10连抽
const handleTenDraws = (): void => {
  emit('ten-draws');
};
</script>

<style lang="scss" scoped>
// ============================================
// LotteryDrawButtons 组件样式
// ============================================

.draw-buttons-panel {
  @include utils.flex-center;

  gap: tokens.$spacing-lg;
  margin: tokens.$spacing-lg 0;
  padding: tokens.$spacing-lg;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  flex-shrink: 0;
}

.draw-button {
  padding: tokens.$spacing-md tokens.$spacing-xl;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  border: none;
  border-radius: tokens.$radius-md;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  min-width: 200px;
  box-shadow: tokens.$shadow-sm;

  &:hover {
    &:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: tokens.$shadow-md;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &.single {
    background: linear-gradient(135deg, tokens.$info 0%, color.adjust(tokens.$info, $lightness: -10%) 100%);

    &:hover {
      &:not(:disabled) {
        background: linear-gradient(135deg, color.adjust(tokens.$info, $lightness: 5%) 0%, tokens.$info 100%);
      }
    }
  }

  &.ten {
    background: linear-gradient(135deg, tokens.$warning 0%, color.adjust(tokens.$warning, $lightness: -10%) 100%);

    &:hover {
      &:not(:disabled) {
        background: linear-gradient(135deg, color.adjust(tokens.$warning, $lightness: 5%) 0%, tokens.$warning 100%);
      }
    }
  }
}

/* 响应式设计 */
@include utils.mobile {
  .draw-buttons-panel {
    flex-direction: column;
    gap: tokens.$spacing-sm;
  }

  .draw-button {
    width: 100%;
    min-width: auto;
    padding: tokens.$spacing-sm;
    font-size: tokens.$font-size-sm;
  }
}
</style>
