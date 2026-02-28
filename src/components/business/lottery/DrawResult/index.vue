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
  background-color: tokens.$bg-secondary;
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-lg;
  margin-bottom: tokens.$spacing-lg;
  border: 1px solid tokens.$success;
  flex: 1;
  min-height: 200px;
  overflow-y: auto;
  @include utils.flex-col(tokens.$spacing-0);
  @include utils.custom-scrollbar;

  h3 {
    margin-top: 0;
    color: tokens.$success;
  }
}

/* 抽奖结果空白区域 */
.result-spacer {
  height: 10px;
  background-color: transparent;
  flex-shrink: 0;
}

/* 奖励列表 */
.rewards {
  display: flex;
  flex-wrap: wrap;
  gap: tokens.$spacing-md;
  margin-top: tokens.$spacing-sm;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  @include utils.custom-scrollbar;
}

/* 奖励项 */
.reward-item {
  background-color: tokens.$bg-secondary;
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-lg;
  box-shadow: tokens.$shadow-md;
  border: 1px solid tokens.$border-light;
  @include utils.flex-col(tokens.$spacing-xs, center);
  min-width: 120px;
  opacity: 0;
  transform: scale(0.5);
  transition: all tokens.$transition-normal;

  &:hover {
    transform: scale(1.02);
    box-shadow: tokens.$shadow-lg;
    border-color: tokens.$border-medium;
  }
}

/* 动画类 */
.reward-item-animated {
  animation: rewardScaleIn 0.5s ease-out forwards;
}

/* 从小到大的动画 */
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
  font-weight: tokens.$font-weight-bold;
  font-size: tokens.$font-size-base;
  margin-bottom: tokens.$spacing-xs;
  text-align: center;
  color: tokens.$text-primary;
}

.reward-value {
  color: tokens.$success;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-bold;
}

/* 皮肤类型样式 */
.reward-type {
  display: block;
  color: tokens.$primary-blue;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-bold;
  margin-top: tokens.$spacing-xs;
  text-align: center;
  padding: 2px tokens.$spacing-sm;
  border-radius: tokens.$radius-sm;
  background-color: rgb(59 130 246 / 10%);
}
</style>
