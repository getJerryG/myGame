<template>
  <div class="cumulative-rewards-panel-vertical">
    <div class="panel-header">
      <h3>累抽奖励</h3>
      <span class="draw-count-info"> 当前累计：{{ drawCount }}�?/span>
    </div>

    <!-- 累抽进度�?-->
    <div class="progress-bar-container">
      <div class="progress-info">
        <span>当前进度</span>
        <span>{{ drawCount }}�?/span>
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
        <h4>可领�?/h4>
        <div
          v-for="reward in availableCumulativeRewards"
          :key="reward.threshold"
          class="vertical-reward-item available"
        >
          <div class="reward-info">
            <span class="threshold">{{ reward.threshold }}�?/span>
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
        <h4>未达�?/h4>
        <div
          v-for="item in unreachedCumulativeRewards"
          :key="item.threshold"
          class="vertical-reward-item unreached"
        >
          <div class="reward-info">
            <span class="threshold">{{ item.threshold }}�?/span>
            <span class="reward-name">{{ item.reward.name }}</span>
          </div>
          <span class="status-badge">未达</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 接收props
const props = defineProps({
  drawCount: {
    type: Number,
    required: true,
  },
  cumulativeRewardConfig: {
    type: Object,
    required: true,
  },
  claimedRewards: {
    type: Object,
    required: true,
  },
  availableCumulativeRewards: {
    type: Array,
    required: true,
  },
  progressPercentage: {
    type: Number,
    required: true,
  },
});

// 定义emit事件
const emit = defineEmits(['claim-reward']);

/**
 * 获取未达到的累抽奖励
 * @returns {Array} - 未达到的累抽奖励列表
 */
const unreachedCumulativeRewards = computed(() => {
  const unreached = [];
  Object.entries(props.cumulativeRewardConfig).forEach(([threshold, reward]) => {
    const thresholdNum = parseInt(threshold);
    if (
      !props.claimedRewards[thresholdNum] &&
      !props.availableCumulativeRewards.some((r) => r.threshold === thresholdNum)
    ) {
      unreached.push({
        threshold: thresholdNum,
        reward,
      });
    }
  });
  return unreached;
});

/**
 * 领取累抽奖励
 * @param {number} threshold - 抽奖阈�? */
function claimCumulativeReward(threshold: number): void {
  emit('claim-reward', threshold);
}
</script>

<style lang="scss" scoped>

/* 右侧栏竖向累抽奖励样式 */
.cumulative-rewards-panel-vertical {
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  overflow: hidden;
  border: 1px solid tokens.$border-light;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .panel-header {
    padding: tokens.$spacing-md;
    background-color: tokens.$bg-light;
    border-bottom: 1px solid tokens.$border-light;

    @include utils.flex-col(tokens.$spacing-xs, flex-start);

    height: auto;
    min-height: 50px;
    flex-shrink: 0;

    h3 {
      margin: 0;
      color: tokens.$warning;
      font-size: tokens.$font-size-base;
      line-height: 20px;
    }
  }

  .draw-count-info {
    font-size: tokens.$font-size-xs;
    color: tokens.$text-secondary;
    margin-top: 2px;
    line-height: 16px;
  }
}

/* 累抽进度条 */
.progress-bar-container {
  margin-bottom: tokens.$spacing-md;
  position: relative;
  padding: 0 tokens.$spacing-md;
}

.progress-info {
  @include utils.flex-between;

  margin-bottom: tokens.$spacing-xs;
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
}

.progress-bar {
  position: relative;
  height: 10px;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  overflow: hidden;
  margin-bottom: tokens.$spacing-xs;
}

.progress-fill {
  height: 100%;
  background-color: tokens.$warning;
  border-radius: tokens.$radius-md;
  transition: width tokens.$transition-normal;
}

/* 竖向滚动的累抽奖励区域 */
.vertical-rewards-list {
  flex: 1;
  overflow-y: auto;
  padding: tokens.$spacing-md;

  @include utils.flex-col(tokens.$spacing-md);

  min-height: 0;

  @include utils.custom-scrollbar;
}

.rewards-section {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-sm;
  border: 1px solid tokens.$border-light;
  flex-shrink: 0;

  h4 {
    margin: 0 0 tokens.$spacing-sm;
    color: tokens.$warning;
    font-size: tokens.$font-size-sm;
    font-weight: tokens.$font-weight-bold;
    line-height: 18px;
  }
}

/* 竖向奖励项 */
.vertical-reward-item {
  @include utils.flex-between;

  padding: tokens.$spacing-sm;
  border-radius: tokens.$radius-sm;
  margin-bottom: tokens.$spacing-xs;
  font-size: tokens.$font-size-sm;
  border: 1px solid;
  height: 50px;
  flex-shrink: 0;

  &:last-child {
    margin-bottom: 0;
  }

  &.available {
    background-color: rgb(251 191 36 / 10%);
    border-color: tokens.$warning;
    animation: pulse 1s infinite;
  }

  &.unreached {
    background-color: tokens.$bg-light;
    border-color: tokens.$border-light;
    opacity: 0.7;
  }

  .reward-info {
    @include utils.flex-col(2px, flex-start);

    margin-bottom: 0;
  }

  .threshold {
    font-weight: tokens.$font-weight-bold;
    color: tokens.$warning;
    font-size: tokens.$font-size-xs;
    line-height: 14px;
  }

  .reward-name {
    font-size: tokens.$font-size-xs;
    color: tokens.$text-primary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
    line-height: 13px;
  }
}

/* 领取按钮 */
.claim-button {
  background-color: tokens.$success;
  color: white;
  border: none;
  padding: 3px tokens.$spacing-sm;
  border-radius: tokens.$radius-sm;
  cursor: pointer;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-medium;
  transition: all tokens.$transition-fast;
  flex-shrink: 0;
  margin-top: tokens.$spacing-xs;

  &:hover {
    background-color: #059669;
    transform: translateY(-1px);
  }
}

/* 状态徽章 */
.status-badge {
  font-size: tokens.$font-size-xs;
  padding: 2px 6px;
  border-radius: tokens.$radius-full;
  background-color: rgb(16 185 129 / 20%);
  color: tokens.$success;
  flex-shrink: 0;
  margin-top: tokens.$spacing-xs;
}

/* 脉冲动画 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgb(251 191 36 / 40%);
  }

  70% {
    box-shadow: 0 0 0 2px rgb(251 191 36 / 0%);
  }

  100% {
    box-shadow: 0 0 0 0 rgb(251 191 36 / 0%);
  }
}
</style>
