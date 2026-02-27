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
import { watch } from 'vue';

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
  }
);
</script>

<style lang="scss" scoped>
.result-panel {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  padding: 15px;
  margin-top: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 300px;
}

.result-panel h3 {
  margin: 0 0 15px;
  font-size: 18px;
  color: #333;
}

.result-spacer {
  flex: 0 0 auto;
}

.rewards {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  overflow-y: auto;
  padding: 10px;
  align-content: flex-start;
}

.reward-item {
  background-color: #f0f8ff;
  border: 1px solid #add8e6;
  border-radius: 8px;
  padding: 12px;
  min-width: 150px;
  text-align: center;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  transition: all 0.3s ease;
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
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.reward-type {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.reward-value {
  display: block;
  font-size: 14px;
  color: #ff6b35;
  font-weight: bold;
}

/* 响应式设�? */
@media (width <= 1024px) {
  .result-panel {
    height: auto;
    min-height: 200px;
    flex: none;
  }
}
</style>
