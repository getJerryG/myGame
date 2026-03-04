<template>
  <Panel class="cumulative-rewards-panel">
    <!-- 面板头部 -->
    <template #header>
      <div class="header-content">
        <h3>累抽奖励</h3>
        <span class="draw-count-info">
          当前累计：{{ lotteryStore.drawCount }}次</span>
      </div>
    </template>

    <!-- 累抽进度 -->
    <div class="progress-bar-container">
      <div class="progress-info">
        <span>当前进度</span>
        <span>{{ lotteryStore.drawCount }}次</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
    </div>

    <!-- 竖向滚动的累抽奖励区�?-->
    <div class="vertical-rewards-list">
      <!-- 可领取奖�?-->
      <Card v-if="availableCumulativeRewards.length > 0" class="rewards-section" variant="success">
        <template #header>
          <h4>可领取</h4>
        </template>

        <List :items="availableCumulativeRewards" layout="vertical" class="rewards-list">
          <template #item="{ item }">
            <Card variant="success" size="small" class="reward-item">
              <div class="reward-info">
                <span class="threshold">{{ item.threshold }}次</span>
                <span class="reward-name">{{ item.reward.name }}</span>
              </div>
              <Button variant="success" size="small" @click="claimCumulativeReward(item.threshold)">
                领取
              </Button>
            </Card>
          </template>
        </List>
      </Card>

      <!-- 未达到奖�?-->
      <Card class="rewards-section" variant="secondary">
        <template #header>
          <h4>未达到</h4>
        </template>

        <List :items="unreachedCumulativeRewards" layout="vertical" class="rewards-list">
          <template #item="{ item }">
            <Card variant="secondary" size="small" class="reward-item">
              <div class="reward-info">
                <span class="threshold">{{ item.threshold }}次</span>
                <span class="reward-name">{{ item.reward.name }}</span>
              </div>
              <div class="progress-text">
                {{ lotteryStore.drawCount }}/{{ item.threshold }}
              </div>
            </Card>
          </template>
        </List>
      </Card>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { useLotteryStore } from "@/stores/lotteryStore";
import Panel from "@/components/common/Panel/index.vue";
import Card from "@/components/common/Card/index.vue";
import List from "@/components/common/List/index.vue";
import Button from "@/components/common/Button/index.vue";

const lotteryStore = useLotteryStore();

// 计算当前进度百分比
const progressPercentage = computed(() => {
  const nextReward = lotteryStore.cumulativeRewards.find(
    (reward) => reward.threshold > lotteryStore.drawCount,
  );
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
      reward.threshold <= lotteryStore.drawCount &&
      !lotteryStore.claimedCumulativeRewards.includes(reward.threshold),
  );
});

// 获取未达到的累抽奖励
const unreachedCumulativeRewards = computed(() => {
  return lotteryStore.cumulativeRewards
    .filter(
      (reward) =>
        reward.threshold > lotteryStore.drawCount ||
        lotteryStore.claimedCumulativeRewards.includes(reward.threshold),
    )
    .sort((a, b) => a.threshold - b.threshold);
});

// 领取累抽奖励
const claimCumulativeReward = (threshold: number): void => {
  lotteryStore.claimCumulativeReward(threshold);
};
</script>

<style lang="scss" scoped>
/* 累抽奖励面板 */
.cumulative-rewards-panel {
  height: 100%;
  overflow: hidden;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
}

/* 累计抽奖次数信息 */
.draw-count-info {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
}

/* 进度条容器 */
.progress-bar-container {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  margin-bottom: tokens.$spacing-md;
}

/* 进度信息 */
.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: tokens.$spacing-xs;
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
}

/* 进度条 */
.progress-bar {
  height: 8px;
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-full;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: tokens.$success;
  border-radius: tokens.$radius-full;
  transition: width tokens.$transition-normal;
}

/* 奖励列表 */
.vertical-rewards-list {
  flex: 1;
  overflow-y: auto;
  padding: 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgb(0 0 0 / 10%);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(16 185 129 / 50%);
    border-radius: 3px;

    &:hover {
      background: rgb(16 185 129 / 80%);
    }
  }
}

/* 奖励区块 */
.rewards-section {
  margin-bottom: tokens.$spacing-md;

  h4 {
    margin: 0;
    font-size: tokens.$font-size-sm;
    font-weight: tokens.$font-weight-semibold;
    color: tokens.$text-primary;
  }
}

/* 奖励列表 */
.rewards-list {
  .list__item {
    padding: 0;
    border-bottom: none;

    &:hover {
      background-color: transparent;
    }
  }
}

/* 奖励项 */
.reward-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: tokens.$spacing-sm;
}

/* 奖励信息 */
.reward-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

/* 阈值信息 */
.threshold {
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-sm;
}

/* 奖励名称 */
.reward-name {
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-xs;
}

/* 进度文本 */
.progress-text {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
  font-weight: tokens.$font-weight-medium;
}
</style>
