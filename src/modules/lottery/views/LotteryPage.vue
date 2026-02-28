<template>
  <div class="lottery-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">抽奖系统</h1>
      <p class="page-subtitle">试试你的手气，赢取丰厚奖励！</p>
    </div>

    <!-- 抽奖区域 -->
    <div class="lottery-area">
      <!-- 抽奖机 -->
      <div class="lottery-machine">
        <div class="machine-display">
          <div
            v-for="(item, index) in displayItems"
            :key="index"
            class="display-item"
            :class="{ active: index === activeIndex }"
          >
            <span class="item-icon">{{ item.icon }}</span>
            <span class="item-name">{{ item.name }}</span>
          </div>
        </div>

        <!-- 抽奖按钮 -->
        <button
          class="lottery-button"
          :disabled="isSpinning || lotteryTickets <= 0"
          @click="startLottery"
        >
          <span v-if="isSpinning">抽奖中...</span>
          <span v-else>开始抽奖 ({{ lotteryTickets }} 张)</span>
        </button>
      </div>

      <!-- 抽奖结果 -->
      <div
        v-if="lotteryResult"
        class="lottery-result"
      >
        <div class="result-header">
          <span class="result-icon">🎉</span>
          <span class="result-text">恭喜获得</span>
        </div>
        <div class="result-item">
          <span class="result-item-icon">{{ lotteryResult.icon }}</span>
          <span class="result-item-name">{{ lotteryResult.name }}</span>
          <span
            class="result-item-rarity"
            :class="lotteryResult.rarity"
          >
            {{ getRarityText(lotteryResult.rarity) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 奖品列表 -->
    <div class="prizes-section">
      <h3 class="section-title">奖品列表</h3>
      <div class="prizes-grid">
        <div
          v-for="prize in prizes"
          :key="prize.id"
          class="prize-card"
          :class="prize.rarity"
        >
          <span class="prize-icon">{{ prize.icon }}</span>
          <span class="prize-name">{{ prize.name }}</span>
          <span class="prize-probability">{{ prize.probability }}%</span>
        </div>
      </div>
    </div>

    <!-- 抽奖记录 -->
    <div class="history-section">
      <h3 class="section-title">抽奖记录</h3>
      <div class="history-list">
        <div
          v-for="(record, index) in lotteryHistory"
          :key="index"
          class="history-item"
        >
          <span class="history-time">{{ record.time }}</span>
          <span class="history-prize">{{ record.prizeName }}</span>
          <span
            class="history-rarity"
            :class="record.rarity"
          >
            {{ getRarityText(record.rarity) }}
          </span>
        </div>
        <div
          v-if="lotteryHistory.length === 0"
          class="no-history"
        >
          暂无抽奖记录
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 奖品数据
interface Prize {
  id: number;
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  probability: number;
}

const prizes: Prize[] = [
  { id: 1, name: '金币', icon: '💰', rarity: 'common', probability: 40 },
  { id: 2, name: '经验药水', icon: '🧪', rarity: 'common', probability: 30 },
  { id: 3, name: '强化石', icon: '💎', rarity: 'rare', probability: 15 },
  { id: 4, name: '高级装备', icon: '⚔️', rarity: 'epic', probability: 10 },
  { id: 5, name: '传说武器', icon: '👑', rarity: 'legendary', probability: 5 },
];

// 抽奖券数量
const lotteryTickets = ref(10);

// 是否正在抽奖
const isSpinning = ref(false);

// 当前激活的索引
const activeIndex = ref(0);

// 抽奖结果
const lotteryResult = ref<Prize | null>(null);

// 显示的物品（用于抽奖动画）
const displayItems = computed(() => {
  return [...prizes, ...prizes, ...prizes];
});

// 抽奖历史
interface LotteryRecord {
  time: string;
  prizeName: string;
  rarity: string;
}

const lotteryHistory = ref<LotteryRecord[]>([]);

// 获取稀有度文本
const getRarityText = (rarity: string): string => {
  const rarityMap: Record<string, string> = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  };
  return rarityMap[rarity] || rarity;
};

// 开始抽奖
const startLottery = () => {
  if (isSpinning.value || lotteryTickets.value <= 0) return;

  isSpinning.value = true;
  lotteryResult.value = null;
  lotteryTickets.value--;

  // 抽奖动画
  let spins = 0;
  const maxSpins = 20 + Math.floor(Math.random() * 10);
  const interval = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % displayItems.value.length;
    spins++;

    if (spins >= maxSpins) {
      clearInterval(interval);
      finishLottery();
    }
  }, 100);
};

// 完成抽奖
const finishLottery = () => {
  // 根据概率计算结果
  const random = Math.random() * 100;
  let cumulativeProbability = 0;
  let selectedPrize = prizes[0];

  for (const prize of prizes) {
    cumulativeProbability += prize.probability;
    if (random <= cumulativeProbability) {
      selectedPrize = prize;
      break;
    }
  }

  lotteryResult.value = selectedPrize;
  isSpinning.value = false;

  // 添加到历史记录
  const now = new Date();
  lotteryHistory.value.unshift({
    time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
    prizeName: selectedPrize.name,
    rarity: selectedPrize.rarity,
  });

  // 限制历史记录数量
  if (lotteryHistory.value.length > 10) {
    lotteryHistory.value = lotteryHistory.value.slice(0, 10);
  }
};
</script>

<style lang="scss" scoped>

.lottery-page {
  @include utils.flex-col(tokens.$spacing-lg, stretch, flex-start);
  padding: tokens.$spacing-xl;
  min-height: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: tokens.$spacing-lg;

  .page-title {
    font-size: tokens.$font-size-3xl;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
    margin: 0 0 tokens.$spacing-sm;
    text-shadow: 0 0 20px rgb(255 215 0 / 50%);
  }

  .page-subtitle {
    font-size: tokens.$font-size-base;
    color: tokens.$text-muted;
    margin: 0;
  }
}

.lottery-area {
  @include utils.flex-col(tokens.$spacing-lg, center, center);
  margin-bottom: tokens.$spacing-xl;
}

.lottery-machine {
  @include utils.flex-col(tokens.$spacing-md, center, center);
  padding: tokens.$spacing-xl;
  background: linear-gradient(135deg, tokens.$bg-lighter 0%, tokens.$bg-light 100%);
  border-radius: tokens.$radius-xl;
  border: 3px solid tokens.$border-medium;
  box-shadow: tokens.$shadow-lg;
  min-width: 400px;
}

.machine-display {
  @include utils.flex-row(tokens.$spacing-sm, center, center);
  flex-wrap: wrap;
  gap: tokens.$spacing-sm;
  padding: tokens.$spacing-md;
  background-color: tokens.$bg-dark;
  border-radius: tokens.$radius-lg;
  border: 2px solid tokens.$border-light;
}

.display-item {
  @include utils.flex-col(tokens.$spacing-xs, center, center);
  padding: tokens.$spacing-sm;
  background-color: tokens.$bg-lighter;
  border-radius: tokens.$radius-md;
  border: 2px solid transparent;
  transition: all tokens.$transition-normal;
  min-width: 80px;

  &.active {
    border-color: tokens.$primary;
    background-color: rgb(74 158 255 / 20%);
    box-shadow: 0 0 20px rgb(74 158 255 / 50%);
    transform: scale(1.1);
  }

  .item-icon {
    font-size: tokens.$font-size-2xl;
  }

  .item-name {
    font-size: tokens.$font-size-xs;
    color: tokens.$text-muted;
    text-align: center;
  }
}

.lottery-button {
  padding: tokens.$spacing-md tokens.$spacing-2xl;
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  background: linear-gradient(135deg, tokens.$primary 0%, tokens.$primary-dark 100%);
  border: none;
  border-radius: tokens.$radius-full;
  cursor: pointer;
  transition: all tokens.$transition-normal;
  box-shadow: 0 4px 15px rgb(74 158 255 / 40%);
  min-width: 200px;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgb(74 158 255 / 60%);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
}

.lottery-result {
  @include utils.flex-col(tokens.$spacing-md, center, center);
  padding: tokens.$spacing-xl;
  background: linear-gradient(135deg, tokens.$success 0%, #059669 100%);
  border-radius: tokens.$radius-xl;
  box-shadow: tokens.$shadow-lg;
  animation: resultPop 0.5s ease-out;

  .result-header {
    @include utils.flex-row(tokens.$spacing-sm, center, center);

    .result-icon {
      font-size: tokens.$font-size-3xl;
      animation: bounce 1s ease-in-out infinite;
    }

    .result-text {
      font-size: tokens.$font-size-xl;
      font-weight: tokens.$font-weight-bold;
      color: tokens.$text-primary;
    }
  }

  .result-item {
    @include utils.flex-col(tokens.$spacing-sm, center, center);
    padding: tokens.$spacing-md;
    background-color: rgb(255 255 255 / 20%);
    border-radius: tokens.$radius-lg;
    backdrop-filter: blur(10px);

    .result-item-icon {
      font-size: tokens.$font-size-4xl;
    }

    .result-item-name {
      font-size: tokens.$font-size-xl;
      font-weight: tokens.$font-weight-bold;
      color: tokens.$text-primary;
    }

    .result-item-rarity {
      padding: tokens.$spacing-xs tokens.$spacing-sm;
      border-radius: tokens.$radius-full;
      font-size: tokens.$font-size-sm;
      font-weight: tokens.$font-weight-bold;

      &.common {
        background-color: tokens.$gray-500;
        color: tokens.$text-primary;
      }

      &.rare {
        background-color: tokens.$primary;
        color: tokens.$text-primary;
      }

      &.epic {
        background-color: tokens.$lottery-purple;
        color: tokens.$text-primary;
      }

      &.legendary {
        background: linear-gradient(135deg, tokens.$primary-gold 0%, #f59e0b 100%);
        color: tokens.$gray-900;
      }
    }
  }
}

@keyframes resultPop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.prizes-section {
  margin-bottom: tokens.$spacing-xl;

  .section-title {
    font-size: tokens.$font-size-xl;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
    margin-bottom: tokens.$spacing-md;
    text-align: center;
  }
}

.prizes-grid {
  @include utils.grid-auto-fill(150px, tokens.$spacing-md);
}

.prize-card {
  @include utils.flex-col(tokens.$spacing-xs, center, center);
  padding: tokens.$spacing-md;
  background-color: tokens.$bg-lighter;
  border-radius: tokens.$radius-lg;
  border: 2px solid tokens.$border-light;
  transition: all tokens.$transition-normal;

  &:hover {
    transform: translateY(-5px);
    box-shadow: tokens.$shadow-md;
  }

  &.common {
    border-color: tokens.$gray-500;
  }

  &.rare {
    border-color: tokens.$primary;
    box-shadow: 0 0 10px rgb(74 158 255 / 30%);
  }

  &.epic {
    border-color: tokens.$lottery-purple;
    box-shadow: 0 0 10px rgb(139 92 246 / 30%);
  }

  &.legendary {
    border-color: tokens.$primary-gold;
    box-shadow: 0 0 15px rgb(255 215 0 / 50%);
    background: linear-gradient(135deg, rgb(255 215 0 / 10%) 0%, transparent 100%);
  }

  .prize-icon {
    font-size: tokens.$font-size-3xl;
  }

  .prize-name {
    font-size: tokens.$font-size-sm;
    font-weight: tokens.$font-weight-semibold;
    color: tokens.$text-primary;
    text-align: center;
  }

  .prize-probability {
    font-size: tokens.$font-size-xs;
    color: tokens.$text-muted;
  }
}

.history-section {
  .section-title {
    font-size: tokens.$font-size-xl;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
    margin-bottom: tokens.$spacing-md;
    text-align: center;
  }
}

.history-list {
  @include utils.flex-col(tokens.$spacing-sm, stretch, flex-start);
  max-height: 300px;
  overflow-y: auto;
  padding: tokens.$spacing-md;
  background-color: tokens.$bg-lighter;
  border-radius: tokens.$radius-lg;
  border: 1px solid tokens.$border-light;
}

.history-item {
  @include utils.flex-between;
  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  border-left: 4px solid tokens.$border-light;

  .history-time {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-muted;
    min-width: 60px;
  }

  .history-prize {
    font-size: tokens.$font-size-base;
    color: tokens.$text-primary;
    flex: 1;
    text-align: center;
  }

  .history-rarity {
    font-size: tokens.$font-size-xs;
    font-weight: tokens.$font-weight-bold;
    padding: tokens.$spacing-xs tokens.$spacing-sm;
    border-radius: tokens.$radius-sm;
    min-width: 50px;
    text-align: center;

    &.common {
      background-color: tokens.$gray-500;
      color: tokens.$text-primary;
    }

    &.rare {
      background-color: tokens.$primary;
      color: tokens.$text-primary;
    }

    &.epic {
      background-color: tokens.$lottery-purple;
      color: tokens.$text-primary;
    }

    &.legendary {
      background: linear-gradient(135deg, tokens.$primary-gold 0%, #f59e0b 100%);
      color: tokens.$gray-900;
    }
  }
}

.no-history {
  text-align: center;
  color: tokens.$text-muted;
  padding: tokens.$spacing-xl;
  font-style: italic;
}

/* 响应式设计 */
@media (width <= 768px) {
  .lottery-page {
    padding: tokens.$spacing-lg tokens.$spacing-md;
  }

  .lottery-machine {
    min-width: auto;
    width: 100%;
  }

  .machine-display {
    justify-content: center;
  }

  .display-item {
    min-width: 60px;
    padding: tokens.$spacing-xs;

    .item-icon {
      font-size: tokens.$font-size-xl;
    }

    .item-name {
      font-size: tokens.$font-size-xs;
    }
  }

  .prizes-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .history-item {
    flex-direction: column;
    gap: tokens.$spacing-xs;
    text-align: center;

    .history-time,
    .history-prize,
    .history-rarity {
      width: 100%;
    }
  }
}
</style>
