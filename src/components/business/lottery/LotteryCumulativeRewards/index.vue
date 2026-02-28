<template>
  <div class="cumulative-rewards-panel-vertical">
    <div class="panel-header">
      <h3>累抽奖励</h3>
      <span class="draw-count-info"> 当前累计：{{ lotteryStore.drawCount }}次</span>
    </div>

    <!-- 累抽进度 -->
    <div class="progress-bar-container">
      <div class="progress-info">
        <span>当前进度</span>
        <span>{{ lotteryStore.drawCount }}次</span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- 竖向滚动的累抽奖励区�?-->
    <div class="vertical-rewards-list">
      <!-- 可领取奖�?-->
      <div
        v-if="availableCumulativeRewards.length > 0"
        class="rewards-section available"
      >
        <h4>可领取</h4>
        <div
          v-for="reward in availableCumulativeRewards"
          :key="reward.threshold"
          class="vertical-reward-item available"
        >
          <div class="reward-info">
            <span class="threshold">{{ reward.threshold }}次</span>
            <span class="reward-name">{{ reward.reward.name }}</span>
          </div>
          <button
            class="claim-button"
            @click="claimCumulativeReward(reward.threshold)"
          >
            领取
          </button>
        </div>
      </div>

      <!-- 未达到奖�?-->
      <div class="rewards-section unreached">
        <h4>未达到</h4>
        <div
          v-for="item in unreachedCumulativeRewards"
          :key="item.threshold"
          class="vertical-reward-item unreached"
        >
          <div class="reward-info">
            <span class="threshold">{{ item.threshold }}次</span>
            <span class="reward-name">{{ item.reward.name }}</span>
          </div>
          <div class="progress-text">{{ lotteryStore.drawCount }}/{{ item.threshold }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLotteryStore } from '@/stores/lotteryStore';

const lotteryStore = useLotteryStore();

// 计算当前进度百分比
const progressPercentage = computed(() => {
  const nextReward = lotteryStore.cumulativeRewards.find((reward) => reward.threshold > lotteryStore.drawCount);
  const previousReward = lotteryStore.cumulativeRewards
    .filter((reward) => reward.threshold <= lotteryStore.drawCount)
    .sort((a, b) => b.threshold - a.threshold)[0];

  if (!nextReward) return 100;

  const previousThreshold = previousReward ? previousReward.threshold : 0;
  const range = nextReward.threshold - previousThreshold;
  const currentProgress = lotteryStore.drawCount - previousThreshold;

  return Math.min(100, Math.round((currentProgress / range) * 100));
});

// 获取可领取的累抽奖励
const availableCumulativeRewards = computed(() => {
  return lotteryStore.cumulativeRewards.filter(
    (reward) =>
      reward.threshold <= lotteryStore.drawCount && !lotteryStore.claimedCumulativeRewards.includes(reward.threshold)
  );
});

// 获取未达到的累抽奖励
const unreachedCumulativeRewards = computed(() => {
  return lotteryStore.cumulativeRewards
    .filter(
      (reward) =>
        reward.threshold > lotteryStore.drawCount || lotteryStore.claimedCumulativeRewards.includes(reward.threshold)
    )
    .sort((a, b) => a.threshold - b.threshold);
});

// 领取累抽奖励
const claimCumulativeReward = (threshold: number): void => {
  lotteryStore.claimCumulativeReward(threshold);
};
</script>

<style lang="scss" scoped>

.cumulative-rewards-panel-vertical {
  @include utils.flex-col(tokens.$spacing-0);
  height: 100%;
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  box-shadow: tokens.$shadow-md;
  border: 1px solid tokens.$border-light;
  overflow: hidden;
}

.panel-header {
  @include utils.flex-between;
  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: tokens.$bg-light;
  border-bottom: 1px solid tokens.$border-light;

  h3 {
    margin: 0;
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-semibold;
    color: tokens.$text-primary;
  }
}

.draw-count-info {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
}

.progress-bar-container {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: tokens.$bg-light;
}

.progress-info {
  @include utils.flex-between;
  margin-bottom: tokens.$spacing-xs;
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
}

.progress-bar {
  @include utils.progress-bar;
}

.progress-fill {
  @include utils.progress-fill(tokens.$success);
}

.vertical-rewards-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 tokens.$spacing-md tokens.$spacing-md;
  @include utils.flex-col(tokens.$spacing-md);
  @include utils.custom-scrollbar;
}

.rewards-section {
  @include utils.flex-col(tokens.$spacing-sm);

  h4 {
    margin: 0;
    font-size: tokens.$font-size-sm;
    color: tokens.$text-primary;
    padding: tokens.$spacing-sm 0;
    border-bottom: 1px solid tokens.$border-light;
  }
}

.vertical-reward-item {
  @include utils.flex-between;
  padding: tokens.$spacing-sm;
  border-radius: tokens.$radius-sm;
  transition: all tokens.$transition-fast;

  &.available {
    background-color: rgb(16 185 129 / 10%);
    border: 1px solid tokens.$success;
  }

  &.unreached {
    background-color: tokens.$bg-light;
    border: 1px solid tokens.$border-light;
    opacity: 0.7;
  }
}

.reward-info {
  @include utils.flex-col(3px, flex-start);
}

.threshold {
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-sm;
}

.reward-name {
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-xs;
}

.claim-button {
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  background-color: tokens.$success;
  color: white;
  border: none;
  border-radius: tokens.$radius-sm;
  cursor: pointer;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-medium;
  transition: all tokens.$transition-fast;

  &:hover {
    background-color: #059669;
    transform: translateY(-1px);
  }
}

.progress-text {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
}
</style>
