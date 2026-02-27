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
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.draw-count-info {
  font-size: 14px;
  color: #666;
}

.progress-bar-container {
  padding: 10px 15px;
  background-color: #f9f9f9;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
  color: #666;
}

.progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.vertical-rewards-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 15px 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.rewards-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rewards-section h4 {
  margin: 0;
  font-size: 14px;
  color: #333;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.vertical-reward-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.vertical-reward-item.available {
  background-color: #e8f5e8;
  border: 1px solid #c8e6c9;
}

.vertical-reward-item.unreached {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  opacity: 0.7;
}

.reward-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.threshold {
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.reward-name {
  color: #666;
  font-size: 13px;
}

.claim-button {
  padding: 6px 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.claim-button:hover {
  background-color: #45a049;
}

.progress-text {
  font-size: 12px;
  color: #999;
}
</style>
