<template>
  <div class="data-panel">
    <div class="data-item">
      <span class="label">无相积分：</span>
      <span class="value">{{ lotteryStore.points }}</span>
    </div>
    <div class="data-item">
      <span class="label">祈愿石：</span>
      <span class="value">{{ lotteryStore.stones }}</span>
    </div>
    <div class="data-item">
      <span class="label">累计抽奖：</span>
      <span class="value">{{ lotteryStore.drawCount }}次</span>
    </div>
    <div class="data-item">
      <span class="label">累计消费：</span>
      <span class="value">{{ lotteryStore.totalSpent }}元</span>
      <button
        class="info-button"
        title="消费说明"
        @click="$emit('show-consumption-info')"
      >
        <span class="info-icon">?</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLotteryStore } from '@/stores/lotteryStore';

// 向父组件传递事�?defineEmits(['show-consumption-info']);

const lotteryStore = useLotteryStore();
</script>

<style lang="scss" scoped>

.data-panel {
  @include utils.grid-layout(3, tokens.$space-2);

  background-color: tokens.$bg-secondary;
  padding: tokens.$space-4;
  border-radius: tokens.$radius-md;
  margin-bottom: tokens.$space-5;
  height: 60px;
  flex-shrink: 0;
  border: 1px solid tokens.$border-light;
}

.data-item {
  @include utils.flex-between;

  height: 30px;
}

.label {
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-sm;
}

.value {
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-sm;
}

.info-button {
  background-color: transparent;
  border: none;
  color: tokens.$success;
  cursor: pointer;
  font-size: tokens.$font-size-sm;
  width: 20px;
  height: 20px;
  border-radius: tokens.$radius-full;

  @include utils.flex-center;

  transition: background-color tokens.$transition-fast;

  &:hover {
    background-color: tokens.$bg-light;
  }
}

.info-icon {
  font-weight: tokens.$font-weight-bold;
}
</style>
