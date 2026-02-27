<template>
  <div class="newbie-goals-container">
    <h2 class="text-2xl font-bold mb-6">新手目标</h2>

    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- 目标进度统计 -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <div class="text-lg font-semibold">完成进度</div>
          <div class="text-sm text-gray-600">
            {{ completedCount }}/{{ totalGoals }} 个目�?          </div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- 目标列表 -->
      <div class="space-y-4">
        <div
          v-for="goal in simulationStore.newbieGoals.goals"
          :key="goal.id"
          class="p-4 rounded-lg border-2 transition-all duration-200"
          :class="[
            goal.isCompleted
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50',
          ]"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center">
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  :class="
                    goal.isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  "
                >
                  <span v-if="goal.isCompleted">�?/span>
                  <span v-else>{{
                    simulationStore.newbieGoals.goals.indexOf(goal) + 1
                  }}</span>
                </div>
                <div>
                  <div class="font-medium">{{ goal.title }}</div>
                  <div class="text-sm text-gray-600 mt-1">
                    {{ goal.description }}
                  </div>

                  <!-- 进度显示（如果是数据类型目标�?-->
                  <div
                    v-if="goal.type === 'data' || goal.type === 'time'"
                    class="mt-2"
                  >
                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        class="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        :style="{ width: `${calculateGoalProgress(goal)}%` }"
                      ></div>
                    </div>
                    <div
                      class="flex justify-between text-xs text-gray-500 mt-1"
                    >
                      <span>{{ getCurrentValue(goal) }}</span>
                      <span>{{ goal.target }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 奖励和操作按�?-->
            <div class="flex flex-col items-end">
              <!-- 奖励显示 -->
              <div class="text-sm text-gray-600 mb-2">
                <span class="mr-2">{{ goal.reward.coins }} 💎</span>
                <span>{{ goal.reward.diamonds }} �?/span>
              </div>

              <!-- 操作按钮 -->
              <button
                v-if="goal.isCompleted"
                @click="claimReward(goal.id)"
                class="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                领取奖励
              </button>
              <button
                v-else
                disabled
                class="px-3 py-1 bg-gray-300 text-gray-500 text-xs rounded-md cursor-not-allowed"
              >
                未完�?              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 完成所有目标提�?-->
      <div
        v-if="completedCount === totalGoals"
        class="mt-8 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-md"
      >
        <div class="flex items-center">
          <div class="text-green-600 mr-3">🎉</div>
          <div>
            <strong class="text-green-800">恭喜完成所有新手目标！</strong>
            <p class="text-green-700 text-sm mt-1">
              已解锁中期权限，可以开始更高级的运营操作了�?            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSimulationStore } from '../../stores/simulationStore';

// 定义类型接口
interface NewbieGoalReward {
  coins: number;
  diamonds: number;
}

interface NewbieGoal {
  id: string;
  title: string;
  description: string;
  type: string;
  target: number;
  isCompleted: boolean;
  reward: NewbieGoalReward;
}

const simulationStore = useSimulationStore();

// 计算已完成目标数�?const completedCount = computed(() => {
  return simulationStore.newbieGoals.goals.filter((goal) => goal.isCompleted)
    .length;
});

// 计算总目标数�?const totalGoals = computed(() => {
  return simulationStore.newbieGoals.goals.length;
});

// 计算进度百分�?const progressPercentage = computed(() => {
  return Math.round((completedCount.value / totalGoals.value) * 100);
});

// 计算单个目标的进�?const calculateGoalProgress = (goal: NewbieGoal): number => {
  const current = getCurrentValue(goal);
  return Math.min(100, Math.round((current / goal.target) * 100));
};

// 获取当前�?const getCurrentValue = (goal: NewbieGoal): number => {
  switch (goal.id) {
    case 'goal5': // 累计下载�?      return simulationStore.businessData.downloads;
    case 'goal6': // 市场情绪
      return simulationStore.businessData.marketSentiment;
    case 'goal7': // 连续7天运�?      return simulationStore.gameState.dayCount;
    default:
      return 0;
  }
};

// 领取奖励
const claimReward = (goalId: string): void => {
  simulationStore.claimNewbieGoalReward(goalId);
  // 这里可以添加奖励领取成功的提�?};
</script>

<style lang=scss scoped>
.newbie-goals-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>




