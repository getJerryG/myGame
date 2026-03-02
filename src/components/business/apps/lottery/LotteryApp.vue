<template>
  <ApplicationWindow windowTitle="抽奖中心">
    <template #sidebar>
      <div class="sidebar-menu">
        <button
          class="menu-item"
          :class="{ active: activeTab === 'draw' }"
          @click="activeTab = 'draw'"
        >
          <span class="menu-icon">🎰</span>
          <span class="menu-name">抽奖</span>
        </button>
        <button
          class="menu-item"
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >
          <span class="menu-icon">📜</span>
          <span class="menu-name">抽奖记录</span>
        </button>
        <button
          class="menu-item"
          :class="{ active: activeTab === 'prizes' }"
          @click="activeTab = 'prizes'"
        >
          <span class="menu-icon">🎁</span>
          <span class="menu-name">奖品列表</span>
        </button>
      </div>
    </template>

    <template #content>
      <div class="lottery-content">
        <!-- 抽奖标签页 -->
        <div v-if="activeTab === 'draw'" class="tab-content">
          <div class="lottery-machine">
            <div class="machine-header">
              <h3 class="text-gold">幸运抽奖</h3>
              <div class="ticket-info">
                <span class="ticket-label">剩余抽奖券:</span>
                <span class="ticket-count">{{ tickets }}</span>
              </div>
            </div>

            <div class="lottery-wheel">
              <div class="wheel-container" :class="{ spinning: isSpinning }">
                <div
                  v-for="(prize, index) in prizes"
                  :key="index"
                  class="wheel-item"
                  :class="{ active: currentIndex === index }"
                  :style="getWheelItemStyle(index)"
                >
                  <span class="prize-icon">{{ prize.icon }}</span>
                  <span class="prize-name">{{ prize.name }}</span>
                </div>
              </div>
              <div class="wheel-pointer"></div>
            </div>

            <div class="lottery-controls">
              <button
                class="draw-btn"
                :disabled="isSpinning || tickets <= 0"
                @click="startDraw"
              >
                {{ isSpinning ? "抽奖中..." : "开始抽奖" }}
              </button>
              <button class="buy-btn" @click="buyTickets">购买抽奖券</button>
            </div>

            <div v-if="lastPrize" class="prize-result">
              <div class="result-title">恭喜获得</div>
              <div class="result-prize">
                <span class="result-icon">{{ lastPrize.icon }}</span>
                <span class="result-name">{{ lastPrize.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 抽奖记录标签页 -->
        <div v-else-if="activeTab === 'history'" class="tab-content">
          <h3 class="text-gold" style="margin-bottom: 20px">抽奖记录</h3>
          <div class="history-list">
            <div
              v-for="(record, index) in drawHistory"
              :key="index"
              class="history-item"
            >
              <div class="history-prize">
                <span class="prize-icon">{{ record.prize.icon }}</span>
                <span class="prize-name">{{ record.prize.name }}</span>
              </div>
              <div class="history-time">{{ record.time }}</div>
            </div>

            <div v-if="drawHistory.length === 0" class="empty-state">
              <p>暂无抽奖记录</p>
            </div>
          </div>
        </div>

        <!-- 奖品列表标签页 -->
        <div v-else-if="activeTab === 'prizes'" class="tab-content">
          <h3 class="text-gold" style="margin-bottom: 20px">奖品列表</h3>
          <div class="prizes-grid">
            <div
              v-for="(prize, index) in prizes"
              :key="index"
              class="prize-card"
              :class="prize.rarity"
            >
              <div class="prize-icon-large">{{ prize.icon }}</div>
              <div class="prize-info">
                <div class="prize-name">{{ prize.name }}</div>
                <div class="prize-rarity">
                  {{ getRarityLabel(prize.rarity) }}
                </div>
                <div class="prize-probability">
                  概率: {{ prize.probability }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ApplicationWindow>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ApplicationWindow from '@/components/common/window/ApplicationWindow.vue';

// 状态管理
const activeTab = ref<string>('draw');
const tickets = ref<number>(10);
const isSpinning = ref<boolean>(false);
const currentIndex = ref<number>(0);
const lastPrize = ref<{ icon: string; name: string } | null>(null);

// 奖品列表
const prizes = ref([
  { icon: '💎', name: '钻石x1000', rarity: 'legendary', probability: 1 },
  { icon: '👑', name: '皇冠', rarity: 'epic', probability: 5 },
  { icon: '💰', name: '金币x500', rarity: 'rare', probability: 15 },
  { icon: '🎁', name: '神秘礼包', rarity: 'rare', probability: 20 },
  { icon: '⭐', name: '星星x50', rarity: 'common', probability: 25 },
  { icon: '💎', name: '钻石x100', rarity: 'common', probability: 34 },
]);

// 抽奖记录
const drawHistory = ref<
  Array<{
    prize: { icon: string; name: string };
    time: string;
  }>
>([
  { prize: { icon: '💰', name: '金币x500' }, time: '2026-02-14 15:30' },
  { prize: { icon: '⭐', name: '星星x50' }, time: '2026-02-14 15:25' },
  { prize: { icon: '💎', name: '钻石x100' }, time: '2026-02-14 15:20' },
]);

// 获取转盘项目样式
const getWheelItemStyle = (index: number) => {
  const angle = (360 / prizes.value.length) * index;
  return {
    transform: `rotate(${angle}deg) translateY(-120px)`,
  };
};

// 获取稀有度标签
const getRarityLabel = (rarity: string): string => {
  const rarityMap: Record<string, string> = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  };
  return rarityMap[rarity] || '未知';
};

// 开始抽奖
const startDraw = (): void => {
  if (isSpinning.value || tickets.value <= 0) return;

  isSpinning.value = true;
  tickets.value--;

  // 模拟抽奖过程
  let spins = 0;
  const maxSpins = 20 + Math.floor(Math.random() * 10);
  const interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % prizes.value.length;
    spins++;

    if (spins >= maxSpins) {
      clearInterval(interval);
      isSpinning.value = false;

      // 确定奖品
      const random = Math.random() * 100;
      let cumulativeProbability = 0;
      let selectedPrize = prizes.value[0];

      for (const prize of prizes.value) {
        cumulativeProbability += prize.probability;
        if (random <= cumulativeProbability) {
          selectedPrize = prize;
          break;
        }
      }

      // 找到选中的奖品索引
      const prizeIndex = prizes.value.findIndex(
        (p) => p.name === selectedPrize.name,
      );
      currentIndex.value = prizeIndex;
      lastPrize.value = selectedPrize;

      // 添加到历史记录
      drawHistory.value.unshift({
        prize: selectedPrize,
        time: new Date().toLocaleString('zh-CN'),
      });

      alert(`恭喜获得: ${selectedPrize.name}!`);
    }
  }, 100);
};

// 购买抽奖券
const buyTickets = (): void => {
  const amount = prompt('请输入要购买的抽奖券数量:', '10');
  if (amount && !isNaN(Number(amount))) {
    tickets.value += Number(amount);
    alert(`成功购买 ${amount} 张抽奖券!`);
  }
};
</script>

<style lang="scss" scoped>
/* 侧边栏菜单 */
.sidebar-menu {
  @include utils.flex-col(0, stretch);

  width: 100%;
  height: 100%;
  background-color: tokens.$bg-secondary;
  padding: tokens.$spacing-md 0;
  overflow-y: auto;
}

.menu-item {
  @include utils.flex-row(tokens.$spacing-md, center);

  padding: tokens.$spacing-md tokens.$spacing-lg;
  background: none;
  border: none;
  color: tokens.$text-secondary;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  text-align: left;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-semibold;

  &:hover {
    background-color: tokens.$bg-light;
    color: tokens.$primary-blue;
  }

  &.active {
    background-color: rgb(59 130 246 / 20%);
    color: tokens.$primary-blue;
    border-right: 3px solid tokens.$primary-blue;
  }
}

.menu-icon {
  font-size: 20px;
}

/* 抽奖内容区域 */
.lottery-content {
  width: 100%;
  height: 100%;
  padding: tokens.$spacing-lg;
  background-color: tokens.$bg-primary;
  color: tokens.$text-primary;
  overflow-y: auto;

  @include utils.custom-scrollbar;
}

/* 标签页内容样式 */
.tab-content {
  width: 100%;
}

/* 抽奖机样式 */
.lottery-machine {
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-xl;
  box-shadow: tokens.$shadow-md;

  @include utils.flex-col(tokens.$spacing-lg, center);
}

.machine-header {
  @include utils.flex-between;

  width: 100%;
  margin-bottom: tokens.$spacing-lg;

  h3 {
    margin: 0;
    font-size: tokens.$font-size-xl;
    color: tokens.$primary-gold;
  }
}

.ticket-info {
  @include utils.flex-row(tokens.$space-2, center);

  .ticket-label {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
  }

  .ticket-count {
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$primary-blue;
  }
}

/* 转盘样式 */
.lottery-wheel {
  position: relative;
  width: 300px;
  height: 300px;
  margin: tokens.$spacing-xl 0;
}

.wheel-container {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: tokens.$bg-light;
  border: 8px solid tokens.$primary-gold;
  position: relative;
  transition: transform tokens.$transition-normal;

  &.spinning {
    animation: spin 0.1s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.wheel-item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;

  @include utils.flex-col(tokens.$space-1, center, center);

  font-size: tokens.$font-size-sm;
  color: tokens.$text-primary;
  width: 80px;
  height: 60px;
  margin-left: -40px;
  margin-top: -30px;

  &.active {
    .prize-icon {
      transform: scale(1.2);
      filter: drop-shadow(0 0 10px tokens.$primary-gold);
    }
  }
}

.prize-icon {
  font-size: 28px;
  transition: all tokens.$transition-fast;
}

.prize-name {
  font-size: tokens.$font-size-xs;
  text-align: center;
  font-weight: tokens.$font-weight-bold;
}

.wheel-pointer {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid tokens.$error;
  z-index: 10;
}

/* 控制按钮样式 */
.lottery-controls {
  @include utils.flex-row(tokens.$spacing-md, center);

  margin-top: tokens.$spacing-lg;
}

.draw-btn {
  padding: tokens.$space-3 tokens.$space-8;
  background-color: tokens.$primary-gold;
  color: tokens.$bg-dark;
  border: none;
  border-radius: tokens.$radius-md;
  cursor: pointer;
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-bold;
  transition: all tokens.$transition-fast;

  &:hover {
    &:not(:disabled) {
      background-color: #f59e0b;
      transform: translateY(-2px);
      box-shadow: tokens.$shadow-gold;
    }
  }

  &:disabled {
    background-color: tokens.$bg-tertiary;
    color: tokens.$text-muted;
    cursor: not-allowed;
  }
}

.buy-btn {
  padding: tokens.$space-3 tokens.$space-6;
  background-color: tokens.$primary-blue;
  color: white;
  border: none;
  border-radius: tokens.$radius-md;
  cursor: pointer;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  transition: all tokens.$transition-fast;

  &:hover {
    background-color: tokens.$primary-dark;
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-blue;
  }
}

/* 抽奖结果样式 */
.prize-result {
  margin-top: tokens.$spacing-lg;
  padding: tokens.$spacing-lg;
  background-color: rgb(251 191 36 / 20%);
  border: 2px solid tokens.$primary-gold;
  border-radius: tokens.$radius-md;
  text-align: center;
  animation: pulse 1s ease-in-out;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

.result-title {
  font-size: tokens.$font-size-base;
  color: tokens.$text-secondary;
  margin-bottom: tokens.$space-2;
}

.result-prize {
  @include utils.flex-row(tokens.$space-2, center, center);

  .result-icon {
    font-size: 36px;
  }

  .result-name {
    font-size: tokens.$font-size-xl;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$primary-gold;
  }
}

/* 历史记录样式 */
.history-list {
  @include utils.flex-col(tokens.$spacing-md);
}

.history-item {
  @include utils.flex-between;

  background-color: tokens.$bg-light;
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-md;
  box-shadow: tokens.$shadow-sm;
  transition: all tokens.$transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-md;
  }
}

.history-prize {
  @include utils.flex-row(tokens.$space-2, center);

  .prize-icon {
    font-size: 24px;
  }

  .prize-name {
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }
}

.history-time {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
}

/* 奖品列表样式 */
.prizes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: tokens.$spacing-lg;
}

.prize-card {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-lg;
  text-align: center;
  box-shadow: tokens.$shadow-md;
  transition: all tokens.$transition-fast;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-lg;
  }

  &.common {
    border-color: tokens.$border-medium;
  }

  &.rare {
    border-color: tokens.$primary-blue;
  }

  &.epic {
    border-color: rgb(139 92 246 / 50%);
  }

  &.legendary {
    border-color: tokens.$primary-gold;
  }
}

.prize-icon-large {
  font-size: 48px;
  margin-bottom: tokens.$spacing-md;
}

.prize-info {
  @include utils.flex-col(tokens.$space-1);

  .prize-name {
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }

  .prize-rarity {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
  }

  .prize-probability {
    font-size: tokens.$font-size-xs;
    color: tokens.$primary-gold;
    font-weight: tokens.$font-weight-bold;
  }
}

/* 空状态样式 */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: tokens.$spacing-2xl;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  color: tokens.$text-secondary;
}

/* 响应式设计 */
@include utils.mobile {
  .lottery-wheel {
    width: 250px;
    height: 250px;
  }

  .wheel-item {
    width: 60px;
    height: 50px;
    margin-left: -30px;
    margin-top: -25px;
  }

  .prize-icon {
    font-size: 20px;
  }

  .lottery-controls {
    flex-direction: column;
    gap: tokens.$spacing-md;
  }

  .draw-btn,
  .buy-btn {
    width: 100%;
  }

  .prizes-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .lottery-content {
    padding: tokens.$spacing-md;
  }

  .lottery-machine {
    padding: tokens.$spacing-md;
  }
}
</style>
