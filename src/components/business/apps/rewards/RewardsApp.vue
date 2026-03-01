<template>
  <div class="rewards-app">
    <!-- 应用头部 -->
    <div class="app-header">
      <h2>奖励中心</h2>
    </div>

    <!-- 标签页导航-->
    <div class="app-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'daily' }"
        @click="activeTab = 'daily'"
      >
        每日奖励
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'achievements' }"
        @click="activeTab = 'achievements'"
      >
        成就奖励
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'special' }"
        @click="activeTab = 'special'"
      >
        特殊奖励
      </button>
    </div>

    <!-- 标签页内容-->
    <div class="app-content">
      <!-- 每日奖励 -->
      <div
        v-if="activeTab === 'daily'"
        class="tab-content"
      >
        <div class="rewards-grid">
          <div
            v-for="reward in dailyRewards"
            :key="reward.id"
            class="reward-card"
            :class="{ claimed: reward.claimed }"
          >
            <div class="reward-header">
              <div class="reward-icon">{{ reward.icon }}</div>
              <div class="reward-name">{{ reward.name }}</div>
            </div>
            <div class="reward-description">{{ reward.description }}</div>
            <div class="reward-amount">
              <span class="amount-label">奖励:</span>
              <span class="amount-value">{{ reward.amount }}</span>
            </div>
            <button
              class="claim-btn"
              :disabled="reward.claimed"
              @click="claimDailyReward(reward.id)"
            >
              {{ reward.claimed ? '已领取' : '领取' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 成就奖励 -->
      <div
        v-else-if="activeTab === 'achievements'"
        class="tab-content"
      >
        <div class="achievements-list">
          <div
            v-for="achievement in achievements"
            :key="achievement.id"
            class="achievement-item"
            :class="{ completed: achievement.completed }"
          >
            <div class="achievement-info">
              <div class="achievement-icon">{{ achievement.icon }}</div>
              <div class="achievement-details">
                <div class="achievement-name">{{ achievement.name }}</div>
                <div class="achievement-description">{{ achievement.description }}</div>
                <div class="achievement-progress">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: `${(achievement.current / achievement.target) * 100}%` }"
                    ></div>
                  </div>
                  <span class="progress-text">{{ achievement.current }}/{{ achievement.target }}</span>
                </div>
              </div>
            </div>
            <div class="achievement-reward">
              <div class="reward-amount">{{ achievement.reward }}</div>
              <button
                class="claim-btn"
                :disabled="!achievement.completed || achievement.claimed"
                @click="claimAchievementReward(achievement.id)"
              >
                {{ achievement.claimed ? '已领取' : achievement.completed ? '领取' : '未完成' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 特殊奖励 -->
      <div
        v-else-if="activeTab === 'special'"
        class="tab-content"
      >
        <div class="special-rewards">
          <div
            v-for="reward in specialRewards"
            :key="reward.id"
            class="special-reward-card"
            :class="{ claimed: reward.claimed }"
          >
            <div class="reward-badge">{{ reward.badge }}</div>
            <div class="reward-icon">{{ reward.icon }}</div>
            <div class="reward-name">{{ reward.name }}</div>
            <div class="reward-description">{{ reward.description }}</div>
            <div class="reward-amount">{{ reward.amount }}</div>
            <button
              class="claim-btn special"
              :disabled="reward.claimed"
              @click="claimSpecialReward(reward.id)"
            >
              {{ reward.claimed ? '已领取' : '领取' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 导入类型
import type { App } from '../../../types/app';
import type { GameData } from '../../../types/game';
import type { Modal } from '../../../types/modal';

// Props定义
defineProps<{
  app: App;
  gameData?: GameData;
  modal?: Modal;
}>();

// 活跃标签页
const activeTab = ref('daily');

// 每日奖励
const dailyRewards = ref([
  {
    id: 'daily-1',
    name: '每日登录',
    icon: '📅',
    description: '每天登录游戏即可领取',
    amount: '100金币',
    claimed: false,
  },
  {
    id: 'daily-2',
    name: '每日任务',
    icon: '📋',
    description: '完成3个日常任务',
    amount: '200金币',
    claimed: true,
  },
  {
    id: 'daily-3',
    name: '每日分享',
    icon: '📤',
    description: '分享游戏到社交平台',
    amount: '50金币',
    claimed: false,
  },
]);

// 成就奖励
const achievements = ref([
  {
    id: 'ach-1',
    name: '初出茅庐',
    icon: '🎖️',
    description: '完成新手教程',
    current: 1,
    target: 1,
    reward: '500金币',
    completed: true,
    claimed: true,
  },
  {
    id: 'ach-2',
    name: '策划新手',
    icon: '🎯',
    description: '成功发布1个英雄',
    current: 0,
    target: 1,
    reward: '1000金币',
    completed: false,
    claimed: false,
  },
  {
    id: 'ach-3',
    name: '皮肤大师',
    icon: '🧵',
    description: '成功发布5个皮肤',
    current: 2,
    target: 5,
    reward: '2000金币',
    completed: false,
    claimed: false,
  },
]);

// 特殊奖励
const specialRewards = ref([
  {
    id: 'special-1',
    name: '首充礼包',
    icon: '🎁',
    description: '首次充值即可获得超值礼包',
    amount: '3000金币 + 限定皮肤',
    badge: '限时',
    claimed: false,
  },
  {
    id: 'special-2',
    name: 'VIP特权',
    icon: '👑',
    description: '成为VIP会员享受专属特权',
    amount: '每日500金币',
    badge: 'VIP',
    claimed: true,
  },
]);

// 领取每日奖励
const claimDailyReward = (rewardId: string) => {
  const reward = dailyRewards.value.find((r) => r.id === rewardId);
  if (reward && !reward.claimed) {
    reward.claimed = true;
    alert(`领取成功: ${reward.amount}`);
  }
};

// 领取成就奖励
const claimAchievementReward = (achievementId: string) => {
  const achievement = achievements.value.find((a) => a.id === achievementId);
  if (achievement && achievement.completed && !achievement.claimed) {
    achievement.claimed = true;
    alert(`领取成功: ${achievement.reward}`);
  }
};

// 领取特殊奖励
const claimSpecialReward = (rewardId: string) => {
  const reward = specialRewards.value.find((r) => r.id === rewardId);
  if (reward && !reward.claimed) {
    reward.claimed = true;
    alert(`领取成功: ${reward.amount}`);
  }
};
</script>

<style lang="scss" scoped>

.rewards-app {
  @include utils.flex-col(0, stretch);

  height: 100%;
  background-color: tokens.$bg-secondary;
  color: tokens.$text-primary;
}

.app-header {
  padding: tokens.$spacing-md tokens.$spacing-lg;
  background-color: tokens.$bg-light;
  border-bottom: 1px solid tokens.$border-light;

  h2 {
    margin: 0;
    font-size: tokens.$font-size-xl;
    color: tokens.$text-primary;
  }
}

.app-tabs {
  @include utils.tabs-container;
}

.tab-btn {
  @include utils.tab-item;

  &.active {
    background-color: rgb(59 130 246 / 20%);
    box-shadow: tokens.$shadow-blue;
  }
}

.app-content {
  flex: 1;
  padding: tokens.$spacing-lg;
  overflow-y: auto;

  @include utils.custom-scrollbar;
}

// 每日奖励样式
.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: tokens.$spacing-lg;
}

.reward-card {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-lg;
  box-shadow: tokens.$shadow-md;
  transition: all tokens.$transition-fast;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-lg;
  }

  &.claimed {
    opacity: 0.7;
    border-color: tokens.$border-medium;
    background-color: tokens.$bg-tertiary;
  }
}

.reward-header {
  @include utils.flex-row(tokens.$spacing-md, center);

  margin-bottom: tokens.$spacing-md;

  .reward-icon {
    font-size: 32px;
  }

  .reward-name {
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$primary-gold;
  }
}

.reward-description {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  margin-bottom: tokens.$spacing-md;
  line-height: tokens.$line-height-normal;
}

.reward-amount {
  @include utils.flex-row(tokens.$space-2, center);

  margin-bottom: tokens.$spacing-md;

  .amount-label {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
  }

  .amount-value {
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$primary-gold;
  }
}

.claim-btn {
  width: 100%;
  padding: tokens.$space-3;
  background-color: tokens.$primary-blue;
  border: none;
  border-radius: tokens.$radius-md;
  color: white;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover:not(:disabled) {
    background-color: tokens.$primary-dark;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: tokens.$bg-tertiary;
    color: tokens.$text-muted;
    cursor: not-allowed;
  }

  &.special {
    background-color: tokens.$primary-gold;
    color: tokens.$bg-dark;

    &:hover:not(:disabled) {
      background-color: #f59e0b;
    }
  }
}

// 成就奖励样式
.achievements-list {
  @include utils.flex-col(tokens.$spacing-md);
}

.achievement-item {
  @include utils.flex-between;

  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;
  box-shadow: tokens.$shadow-md;
  transition: all tokens.$transition-fast;
  border-left: 4px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-lg;
  }

  &.completed {
    border-left-color: tokens.$success;
  }
}

.achievement-info {
  @include utils.flex-row(tokens.$spacing-md, center);

  flex: 1;
}

.achievement-icon {
  font-size: 36px;
}

.achievement-details {
  flex: 1;

  .achievement-name {
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$primary-gold;
    margin-bottom: tokens.$space-1;
  }

  .achievement-description {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
    margin-bottom: tokens.$space-2;
  }
}

.achievement-progress {
  @include utils.flex-row(tokens.$spacing-md, center);

  .progress-bar {
    flex: 1;
    height: 8px;
    background-color: tokens.$bg-tertiary;
    border-radius: tokens.$radius-full;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background-color: tokens.$primary-blue;
    border-radius: tokens.$radius-full;
    transition: width tokens.$transition-normal;
  }

  .progress-text {
    font-size: tokens.$font-size-xs;
    color: tokens.$text-secondary;
    min-width: 50px;
  }
}

.achievement-reward {
  @include utils.flex-col(tokens.$spacing-md, flex-end);

  .reward-amount {
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$primary-gold;
  }
}

// 特殊奖励样式
.special-rewards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: tokens.$spacing-lg;
}

.special-reward-card {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-xl;
  box-shadow: tokens.$shadow-md;
  text-align: center;
  position: relative;
  transition: all tokens.$transition-fast;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-lg;
  }

  &.claimed {
    opacity: 0.7;
    border-color: tokens.$border-medium;
    background-color: tokens.$bg-tertiary;
  }
}

.reward-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: tokens.$error;
  color: white;
  padding: tokens.$space-1 tokens.$space-2;
  border-radius: tokens.$radius-full;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-bold;
}

.special-reward-card {
  .reward-icon {
    font-size: 48px;
    margin-bottom: tokens.$spacing-md;
  }

  .reward-name {
    font-size: tokens.$font-size-xl;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$primary-gold;
    margin-bottom: tokens.$space-2;
  }

  .reward-description {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
    margin-bottom: tokens.$spacing-md;
    line-height: tokens.$line-height-normal;
  }

  .reward-amount {
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$primary-blue;
    margin-bottom: tokens.$spacing-md;
  }
}
</style>
