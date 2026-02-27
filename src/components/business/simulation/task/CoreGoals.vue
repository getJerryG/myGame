<template>
  <div class="core-goals-container">
    <h2 class="text-2xl font-bold mb-6">核心目标升级</h2>

    <!-- 阶段导航 -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <div class="text-lg font-semibold">当前阶段</div>
        <div class="text-sm text-gray-600">
          第{{ simulationStore.coreGoals.currentStage }}个月目标
        </div>
      </div>

      <div class="relative">
        <!-- 进度�?-->
        <div
          class="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"
        ></div>

        <!-- 阶段节点 -->
        <div class="flex justify-between relative z-10">
          <div
            v-for="stage in simulationStore.coreGoals.stages"
            :key="stage.id"
            class="flex flex-col items-center"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
              :class="[
                stage.completed
                  ? 'bg-green-600 text-white shadow-lg scale-110'
                  : simulationStore.coreGoals.currentStage === stage.month
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-300 text-gray-600',
              ]"
              @click="goToStage(stage.month)"
            >
              {{ stage.month }}
            </div>
            <div
              class="text-xs mt-2 text-center w-20 truncate"
              :class="stage.completed ? 'text-green-600' : 'text-gray-500'"
            >
              {{ stage.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 当前阶段目标 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">
        {{ currentStage?.name }}（第{{ currentStage?.month }}个月�?      </h3>

      <div v-if="!currentStage" class="text-center py-8 text-gray-500">
        暂无目标
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="(goal, index) in currentStage.goals"
          :key="index"
          class="p-4 rounded-lg border transition-all duration-200"
          :class="[
            goal.completed
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 bg-white',
          ]"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="font-medium">{{ getGoalLabel(goal.type) }}</div>
            <div
              class="text-sm font-semibold"
              :class="goal.completed ? 'text-green-600' : 'text-blue-600'"
            >
              {{
                goal.completed
                  ? '�?已完�?
                  : `${formatValue(goal.current)}/${formatValue(goal.target)}`
              }}
            </div>
          </div>

          <div class="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              class="h-3 rounded-full transition-all duration-300 ease-out"
              :class="goal.completed ? 'bg-green-600' : 'bg-blue-600'"
              :style="{ width: `${calculateGoalProgress(goal)}%` }"
            ></div>
          </div>

          <div class="flex justify-between text-xs text-gray-500">
            <div>{{ formatValue(goal.current) }}</div>
            <div>{{ formatValue(goal.target) }}</div>
          </div>
        </div>
      </div>

      <!-- 阶段奖励 -->
      <div
        v-if="currentStage && !currentStage.completed"
        class="mt-6 p-4 bg-blue-50 rounded-lg"
      >
        <div class="font-medium text-blue-800 mb-2">阶段奖励</div>
        <div class="text-sm text-blue-700 space-y-1">
          <div>�?解锁新的高级操作</div>
          <div>�?获得额外的运营资�?/div>
          <div>�?提升游戏评级</div>
        </div>
      </div>

      <!-- 完成提示 -->
      <div
        v-if="currentStage && currentStage.completed"
        class="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400"
      >
        <div class="font-medium text-green-800">🎉 阶段目标已完成！</div>
        <div class="text-sm text-green-700 mt-1">已自动升级到下一阶段目标</div>
      </div>
    </div>

    <!-- 历史阶段记录 -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-semibold mb-4">历史阶段记录</h3>

      <div
        v-if="completedStages.length === 0"
        class="text-center py-8 text-gray-500"
      >
        暂无完成的阶�?      </div>

      <div v-else class="space-y-4">
        <div
          v-for="stage in completedStages"
          :key="stage.id"
          class="p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div class="flex items-center justify-between">
            <div class="font-medium">{{ stage.name }}</div>
            <div class="text-sm text-green-600">
              第{{ stage.month }}个月完成
            </div>
          </div>
          <div class="text-sm text-gray-600 mt-1">
            完成了{{ completedGoalsCount(stage) }}/{{
              stage.goals.length
            }}个目�?          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useSimulationStore } from '../../stores/simulationStore';

// 定义类型接口
interface CoreGoal {
  type: string;
  current: number;
  target: number;
  completed: boolean;
}

interface CoreGoalStage {
  id: string;
  month: number;
  name: string;
  goals: CoreGoal[];
  completed: boolean;
}

const simulationStore = useSimulationStore();

// 获取当前阶段
const currentStage = computed<CoreGoalStage | undefined>(() => {
  return simulationStore.coreGoals.stages.find(
    (stage) => stage.month === simulationStore.coreGoals.currentStage
  );
});

// 获取已完成阶�?const completedStages = computed<CoreGoalStage[]>(() => {
  return simulationStore.coreGoals.stages.filter((stage) => stage.completed);
});

// 跳转到指定阶�?const goToStage = (_month: number): void => {
  // 这里可以添加跳转到指定阶段的逻辑
  // console.log(`跳转到第${_month}个月阶段`);
};

// 获取目标标签
const getGoalLabel = (type: string): string => {
  const labels = {
    downloads: '累计下载�?,
    dau: '日活跃用�?,
    revenue: '总收�?,
    marketSentiment: '市场情绪',
  };
  return labels[type as keyof typeof labels] || type;
};

// 格式化数�?const formatValue = (value: number): string => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};

// 计算目标进度
const calculateGoalProgress = (goal: CoreGoal): number => {
  return Math.min(100, Math.round((goal.current / goal.target) * 100));
};

// 计算已完成目标数�?const completedGoalsCount = (stage: CoreGoalStage): number => {
  return stage.goals.filter((goal: CoreGoal) => goal.completed).length;
};

// 监听游戏状态变化，更新核心目标进度
watch(
  () => simulationStore.gameState.dayCount,
  () => {
    simulationStore.updateCoreGoalsProgress();
  }
);
</script>

<style lang=scss scoped>
.core-goals-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>




