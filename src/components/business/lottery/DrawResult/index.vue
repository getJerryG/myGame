<template>
  <div class="result-panel">
    <h3 v-if="lastResult">抽奖结果</h3>
    <div class="result-spacer"></div>
    <div
      v-if="lastResult"
      class="rewards"
    >
      <div
        v-for="(reward, index) in lastResult.rewards"
        :key="index"
        class="reward-item"
        :class="{ 'reward-item-animated': isAnimating }"
        :style="{ animationDelay: `${index * 150}ms` }"
      >
        <span class="reward-name">{{ reward.name }}</span>
        <!-- 显示皮肤类型 -->
        <span
          v-if="reward.skinName"
          class="reward-type"
          >{{ reward.skinName }}</span
        >
        <span
          v-if="reward.type.includes('points')"
          class="reward-value"
          >+{{ reward.value }}积分</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 接收props
defineProps({
  lastResult: {
    type: Object,
    default: null,
  },
  isAnimating: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
/* 抽奖结果面板 */
.result-panel {
  background-color: #e8f5e8;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #4caf50;
  flex: 1;
  min-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* 抽奖结果空白区域 */
.result-spacer {
  height: 10px;
  background-color: transparent;
  flex-shrink: 0;
}

.result-panel h3 {
  margin-top: 0;
  color: #4caf50;
}

/* 奖励列表 */
.rewards {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

/* 奖励�? */
.reward-item {
  background-color: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.3s ease-out;
}

/* 动画�? */
.reward-item-animated {
  animation: rewardScaleIn 0.5s ease-out forwards;
}

/* 从小到大的动�? */
@keyframes rewardScaleIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.reward-name {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
  text-align: center;
}

.reward-value {
  color: #4caf50;
  font-size: 14px;
  font-weight: bold;
}

/* 皮肤类型样式 */
.reward-type {
  display: block;
  color: #2196f3;
  font-size: 14px;
  font-weight: bold;
  margin-top: 5px;
  text-align: center;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: rgb(33 150 243 / 10%);
}
</style>
