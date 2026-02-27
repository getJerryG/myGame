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
.draw-buttons-panel {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  flex-shrink: 0;
}

.draw-button {
  padding: 15px 30px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 200px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
}

.draw-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgb(0 0 0 / 30%);
}

.draw-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.draw-button.single {
  background-color: #2196f3;
}

.draw-button.single:hover:not(:disabled) {
  background-color: #1976d2;
}

.draw-button.ten {
  background-color: #ff9800;
}

.draw-button.ten:hover:not(:disabled) {
  background-color: #f57c00;
}

/* 响应式设�? */
@media (width <= 640px) {
  .draw-buttons-panel {
    flex-direction: column;
    gap: 8px;
  }

  .draw-button {
    width: 100%;
    min-width: auto;
    padding: 10px;
    font-size: 14px;
  }
}
</style>
