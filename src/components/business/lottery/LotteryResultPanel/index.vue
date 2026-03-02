<template>
  <div class="result-panel">
    <h3 v-if="lastResult">抽奖结果</h3>
    <div class="result-spacer"></div>
    <div v-if="lastResult" class="rewards">
      <div
        v-for="(reward, index) in lastResult.rewards"
        :key="index"
        class="reward-item"
        :class="{ 'reward-item-animated': isAnimating }"
        :style="{ animationDelay: `${index * 150}ms` }"
      >
        <span class="reward-name">{{ reward.name }}</span>
        <!-- 显示皮肤类型 -->
        <span v-if="reward.skinName" class="reward-type">{{
          reward.skinName
        }}</span>
        <span v-if="reward.type.includes('points')" class="reward-value"
          >+{{ reward.value }}积分</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";

// 接收父组件传递的结果和动画状态
const props = defineProps({
  lastResult: {
    type: Object,
    default: null,
  },
  isAnimating: {
    type: Boolean,
    default: false,
  },
});

// 监听结果变化，触发动画
watch(
  () => props.lastResult,
  (newResult) => {
    if (newResult) {
      // 动画会通过父组件的isAnimating控制
    }
  },
);
</script>

<style lang="scss" scoped>
.result-panel {
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  box-shadow: tokens.$shadow-md;
  border: 1px solid tokens.$border-light;
  padding: tokens.$spacing-md;
  margin-top: tokens.$spacing-lg;
  flex: 1;

  @include utils.flex-col(tokens.$spacing-0);

  overflow: hidden;
  min-height: 300px;

  h3 {
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-lg;
    color: tokens.$text-primary;
  }
}

.result-spacer {
  flex: 0 0 auto;
}

.rewards {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: tokens.$spacing-md;
  overflow-y: auto;
  padding: tokens.$spacing-sm;
  align-content: flex-start;

  @include utils.custom-scrollbar;
}

.reward-item {
  background-color: tokens.$bg-light;
  border: 1px solid tokens.$border-light;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-md;
  min-width: 150px;
  text-align: center;
  box-shadow: tokens.$shadow-sm;
  transition: all tokens.$transition-normal;

  &:hover {
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-md;
    border-color: tokens.$border-medium;
  }
}

.reward-item-animated {
  animation: rewardAppear 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes rewardAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reward-name {
  display: block;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  margin-bottom: tokens.$spacing-xs;
}

.reward-type {
  display: block;
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
  margin-bottom: tokens.$spacing-xs;
}

.reward-value {
  display: block;
  font-size: tokens.$font-size-sm;
  color: tokens.$warning;
  font-weight: tokens.$font-weight-bold;
}

/* 响应式设计 */
@include utils.tablet {
  .result-panel {
    height: auto;
    min-height: 200px;
    flex: none;
  }
}
</style>
