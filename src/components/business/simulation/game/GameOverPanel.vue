<template>
  <div
    v-if="gameState && gameState.isGameOver"
    class="game-over-panel"
  >
    <div class="game-over-content">
      <h2 class="game-over-title">游戏结束</h2>
      <p class="game-over-reason">{{ gameState?.gameOverReason || '' }}</p>
      <div class="final-stats">
        <h3>最终数�?/h3>
        <div class="stat-item">
          <span class="stat-label">存活月份:</span>
          <span class="stat-value">{{ gameState?.monthCount || 0 }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">总下载量:</span>
          <span class="stat-value">{{ businessData?.downloads || 0 }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">最高日活用�?</span>
          <span class="stat-value">{{
            businessData?.dailyLoginHistory && businessData.dailyLoginHistory.length > 0
              ? Math.max(...businessData.dailyLoginHistory.map((h) => h.value))
              : 0
          }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">总收�?</span>
          <span class="stat-value">¥{{ businessData?.totalRevenue || 0 }}</span>
        </div>
      </div>
      <button
        class="restart-btn"
        @click="resetGame"
      >
        重新开�?      </button>
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
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 80%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.game-over-content {
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 4px 30px rgb(0 0 0 / 30%);
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
  font-size: 28px;
  font-weight: 700;
  color: #dc2626;
  margin: 0 0 12px;
}

.game-over-reason {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 30px;
}

.final-stats {
  background: #f8fafc;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  text-align: left;
}

.final-stats h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 15px;
  text-align: center;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.restart-btn {
  padding: 15px 30px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.restart-btn:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgb(0 0 0 / 20%);
}

/* 响应式设�? */
@media (width <= 768px) {
  .game-over-content {
    padding: 20px;
    margin: 20px;
  }

  .game-over-title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .game-over-reason {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .final-stats {
    padding: 15px;
    margin-bottom: 20px;
  }

  .final-stats h3 {
    font-size: 15px;
    margin-bottom: 12px;
  }

  .stat-item {
    padding: 6px 0;
  }

  .stat-label,
  .stat-value {
    font-size: 13px;
  }

  .restart-btn {
    padding: 12px 24px;
    font-size: 14px;
  }
}

/* 横屏手机适配 */
@media (orientation: landscape) and (height <= 600px) {
  .game-over-content {
    padding: 20px;
    margin: 10px;
  }

  .game-over-title {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .game-over-reason {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .final-stats {
    padding: 15px;
    margin-bottom: 20px;
  }

  .final-stats h3 {
    font-size: 15px;
    margin-bottom: 12px;
  }

  .stat-item {
    padding: 6px 0;
  }

  .stat-label,
  .stat-value {
    font-size: 13px;
  }

  .restart-btn {
    padding: 12px 24px;
    font-size: 14px;
  }
}
</style>
