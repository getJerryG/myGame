<template>
  <div
    v-if="gameState && gameState.isGameOver"
    class="game-over-panel"
  >
    <div class="game-over-content">
      <h2 class="game-over-title">游戏结束</h2>
      <p class="game-over-reason">{{ gameState?.gameOverReason || '' }}</p>
      <div class="final-stats">
        <h3 class="stats-title">最终数据</h3>
        <div class="stat-item">
          <span class="stat-label">存活月份:</span>
          <span class="stat-value">{{ gameState?.monthCount || 0 }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">总下载量:</span>
          <span class="stat-value">{{ businessData?.downloads || 0 }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">最高日活用户:</span>
          <span class="stat-value">{{
            businessData?.dailyLoginHistory && businessData.dailyLoginHistory.length > 0
              ? Math.max(...businessData.dailyLoginHistory.map((h) => h.value))
              : 0
          }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">总收入:</span>
          <span class="stat-value">¥{{ businessData?.totalRevenue || 0 }}</span>
        </div>
      </div>
      <button
        class="restart-btn"
        @click="resetGame"
      >
        重新开始
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  gameState:
    | {
        isGameOver: boolean;
        gameOverReason?: string;
        monthCount?: number;
      }
    | null
    | undefined;
  businessData:
    | {
        downloads?: number;
        dailyLoginHistory?: Array<{ value: number }>;
        totalRevenue?: number;
      }
    | null
    | undefined;
}>();

const emit = defineEmits<{
  reset: [];
}>();

const resetGame = (): void => {
  emit('reset');
};
</script>

<style lang="scss" scoped>

/* 游戏结束面板 */
.game-over-panel {
  @include utils.modal-overlay;
  z-index: tokens.$z-modal;
  animation: fadeIn 0.3s ease;
}

.game-over-content {
  background: tokens.$bg-secondary;
  border-radius: tokens.$radius-xl;
  padding: tokens.$spacing-2xl;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: tokens.$shadow-xl;
  border: 1px solid tokens.$border-light;
  animation: slideInUp 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.game-over-title {
  font-size: tokens.$font-size-3xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$error;
  margin: 0 0 tokens.$spacing-md;
}

.game-over-reason {
  font-size: tokens.$font-size-base;
  color: tokens.$text-secondary;
  margin: 0 0 tokens.$spacing-xl;
}

.final-stats {
  background: tokens.$bg-light;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-lg;
  margin-bottom: tokens.$spacing-xl;
  text-align: left;
}

.stats-title {
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
  margin: 0 0 tokens.$spacing-md;
  text-align: center;
}

.stat-item {
  @include utils.flex-between;
  padding: tokens.$spacing-sm 0;
  border-bottom: 1px solid tokens.$border-light;

  &:last-child {
    border-bottom: none;
  }
}

.stat-label {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
}

.stat-value {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
}

.restart-btn {
  padding: tokens.$spacing-md tokens.$spacing-xl;
  background: tokens.$primary-blue;
  color: white;
  border: none;
  border-radius: tokens.$radius-md;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-semibold;
  cursor: pointer;
  transition: all tokens.$transition-normal;

  &:hover {
    background: tokens.$primary-dark;
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-lg;
  }
}

/* 响应式设计 */
@include utils.mobile {
  .game-over-content {
    padding: tokens.$spacing-lg;
    margin: tokens.$spacing-md;
  }

  .game-over-title {
    font-size: tokens.$font-size-2xl;
    margin-bottom: tokens.$spacing-sm;
  }

  .game-over-reason {
    font-size: tokens.$font-size-sm;
    margin-bottom: tokens.$spacing-lg;
  }

  .final-stats {
    padding: tokens.$spacing-md;
    margin-bottom: tokens.$spacing-lg;
  }

  .stats-title {
    font-size: tokens.$font-size-base;
    margin-bottom: tokens.$spacing-sm;
  }

  .stat-item {
    padding: tokens.$spacing-xs 0;
  }

  .stat-label,
  .stat-value {
    font-size: tokens.$font-size-xs;
  }

  .restart-btn {
    padding: tokens.$spacing-sm tokens.$spacing-lg;
    font-size: tokens.$font-size-sm;
  }
}

/* 横屏手机适配 */
@include utils.landscape-mobile {
  .game-over-content {
    padding: tokens.$spacing-lg;
    margin: tokens.$spacing-sm;
  }

  .game-over-title {
    font-size: tokens.$font-size-2xl;
    margin-bottom: tokens.$spacing-sm;
  }

  .game-over-reason {
    font-size: tokens.$font-size-sm;
    margin-bottom: tokens.$spacing-lg;
  }

  .final-stats {
    padding: tokens.$spacing-md;
    margin-bottom: tokens.$spacing-lg;
  }

  .stats-title {
    font-size: tokens.$font-size-base;
    margin-bottom: tokens.$spacing-sm;
  }

  .stat-item {
    padding: tokens.$spacing-xs 0;
  }

  .stat-label,
  .stat-value {
    font-size: tokens.$font-size-xs;
  }

  .restart-btn {
    padding: tokens.$spacing-sm tokens.$spacing-lg;
    font-size: tokens.$font-size-sm;
  }
}
</style>
