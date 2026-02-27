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
/* 右侧栏竖向累抽奖励样�? */
.cumulative-rewards-panel-vertical {
  background-color: #fff3e0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ffcc80;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.cumulative-rewards-panel-vertical .panel-header {
  padding: 12px;
  background-color: #ffe0b2;
  border-bottom: 1px solid #ffcc80;
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: auto;
  min-height: 50px;
  flex-shrink: 0;
}

.cumulative-rewards-panel-vertical .panel-header h3 {
  margin: 0;
  color: #e65100;
  font-size: 16px;
  line-height: 20px;
}

.cumulative-rewards-panel-vertical .draw-count-info {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
  line-height: 16px;
}

/* 累抽进度�? */
.progress-bar-container {
  margin-bottom: 15px;
  position: relative;
  padding: 0 12px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 12px;
  color: #666;
}

.progress-bar {
  position: relative;
  height: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-fill {
  height: 100%;
  background-color: #ffb74d;
  border-radius: 5px;
  transition: width 0.3s ease;
}

/* 竖向滚动的累抽奖励区�? */
.vertical-rewards-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: 0;
}

.rewards-section {
  background-color: rgb(255 255 255 / 80%);
  border-radius: 6px;
  padding: 10px;
  border: 1px solid rgb(255 193 7 / 30%);
  flex-shrink: 0;
}

.rewards-section h4 {
  margin: 0 0 8px;
  color: #f57c00;
  font-size: 14px;
  font-weight: bold;
  line-height: 18px;
}

/* 竖向奖励�? */
.vertical-reward-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 6px;
  font-size: 13px;
  border: 1px solid;
  height: 50px;
  flex-shrink: 0;
}

.vertical-reward-item:last-child {
  margin-bottom: 0;
}

.vertical-reward-item.available {
  background-color: #fff3cd;
  border-color: #ffeeba;
  animation: pulse 1s infinite;
}

.vertical-reward-item.unreached {
  background-color: #f5f5f5;
  border-color: #e0e0e0;
  opacity: 0.7;
}

.vertical-reward-item .reward-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-start;
  margin-bottom: 0;
}

.vertical-reward-item .threshold {
  font-weight: bold;
  color: #e65100;
  font-size: 12px;
  line-height: 14px;
}

.vertical-reward-item .reward-name {
  font-size: 11px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  line-height: 13px;
}

/* 领取按钮 */
.claim-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 3px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  transition: background-color 0.3s;
  flex-shrink: 0;
  margin-top: 4px;
}

.claim-button:hover {
  background-color: #45a049;
}

/* 状态徽�? */
.status-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  background-color: #c8e6c9;
  color: #2e7d32;
  flex-shrink: 0;
  margin-top: 4px;
}

/* 脉冲动画 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgb(255 193 7 / 40%);
  }

  70% {
    box-shadow: 0 0 0 2px rgb(255 193 7 / 0%);
  }

  100% {
    box-shadow: 0 0 0 0 rgb(255 193 7 / 0%);
  }
}
</style>
