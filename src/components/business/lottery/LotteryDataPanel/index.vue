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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
  background-color: var(--app-bg-secondary);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-5);
  height: 60px;
  flex-shrink: 0;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
}

.label {
  font-weight: var(--font-bold);
  color: var(--app-text-primary);
  font-size: var(--text-sm);
}

.value {
  color: var(--app-text-secondary);
  font-size: var(--text-sm);
}

.info-button {
  background-color: transparent;
  border: none;
  color: var(--success-green);
  cursor: pointer;
  font-size: var(--text-sm);
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-fast);
}

.info-button:hover {
  background-color: var(--bg-hover);
}

.info-icon {
  font-weight: var(--font-bold);
}
</style>
