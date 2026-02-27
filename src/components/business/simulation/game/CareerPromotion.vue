<template>
  <div class="career-promotion-container">
    <h2 class="text-2xl font-bold mb-6">职级晋升系统</h2>

    <!-- 当前职级信息 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">当前职级</h3>

      <div class="flex flex-col md:flex-row items-center justify-between">
        <!-- 职级徽章 -->
        <div class="text-center md:text-left mb-4 md:mb-0">
          <div class="text-4xl mb-2">🏆</div>
          <div class="text-3xl font-bold text-blue-600">
            {{ currentLevel.name }}
          </div>
          <div class="text-sm text-gray-500 mt-1">
            第{{ simulationStore.careerSystem.currentLevel }}�?/ 共{{
              totalLevels
            }}�?          </div>
        </div>

        <!-- 职级效果 -->
        <div class="flex space-x-6">
          <div class="text-center">
            <div class="text-sm text-gray-600 mb-1">可用预算</div>
            <div class="text-xl font-bold text-blue-700">
              💰 {{ simulationStore.decisionMaking.resources.budget }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-sm text-gray-600 mb-1">团队精力</div>
            <div class="text-xl font-bold text-green-700">
              👥 {{ simulationStore.decisionMaking.resources.teamEffort }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 晋升进度 -->
    <div v-if="nextLevel" class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">晋升进度</h3>

      <div class="space-y-4">
        <!-- 总体进度 -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <div class="text-sm font-medium">
              晋升到{{ nextLevel.name }}进度
            </div>
            <div class="text-sm text-gray-600">
              {{ promotionProgress?.average }}%
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div
              class="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-300"
              :style="{ width: `${promotionProgress?.average}%` }"
            ></div>
          </div>
        </div>

        <!-- 详细进度 -->
        <div class="space-y-3">
          <div>
            <div class="flex justify-between items-center mb-1">
              <div class="text-sm font-medium text-gray-700">运营天数</div>
              <div class="text-sm">
                {{ simulationStore.gameState.dayCount }}/{{
                  nextLevel.requirements.dayCount
                }}
                �?              </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-500 h-2 rounded-full"
                :style="{ width: `${promotionProgress?.dayCount}%` }"
              ></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-1">
              <div class="text-sm font-medium text-gray-700">累计下载</div>
              <div class="text-sm">
                {{ formatValue(simulationStore.businessData.downloads) }}/{{
                  formatValue(nextLevel.requirements.downloads)
                }}
              </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-green-500 h-2 rounded-full"
                :style="{ width: `${promotionProgress?.downloads}%` }"
              ></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-1">
              <div class="text-sm font-medium text-gray-700">总收�?/div>
              <div class="text-sm">
                {{ formatValue(simulationStore.businessData.totalRevenue) }}/{{
                  formatValue(nextLevel.requirements.revenue)
                }}
              </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-yellow-500 h-2 rounded-full"
                :style="{ width: `${promotionProgress?.revenue}%` }"
              ></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-1">
              <div class="text-sm font-medium text-gray-700">市场情绪</div>
              <div class="text-sm">
                {{ simulationStore.businessData.marketSentiment }}/{{
                  nextLevel.requirements.marketSentiment
                }}
              </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-purple-500 h-2 rounded-full"
                :style="{ width: `${promotionProgress?.marketSentiment}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- 晋升按钮 -->
        <div class="mt-6">
          <button
            @click="promoteLevel"
            :disabled="!canPromote"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="canPromote">🚀 立即晋升</span>
            <span v-else>🔒 条件未满�?/span>
          </button>
        </div>
      </div>
    </div>

    <!-- 下一级信�?-->
    <div v-if="nextLevel" class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">下一级：{{ nextLevel.name }}</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 解锁操作 -->
        <div>
          <div class="text-sm font-medium text-gray-700 mb-2">解锁操作</div>
          <div class="space-y-1">
            <div
              v-for="(operation, index) in nextLevel.unlockedOperations"
              :key="index"
              class="flex items-center text-sm text-blue-600"
            >
              <span class="mr-2">�?/span>
              {{ getOperationName(operation) }}
            </div>
          </div>
        </div>

        <!-- 职级效果 -->
        <div>
          <div class="text-sm font-medium text-gray-700 mb-2">职级效果</div>
          <div class="space-y-1">
            <div class="flex items-center text-sm">
              <span class="text-blue-600 mr-2">💰</span>
              <span>预算: {{ nextLevel.effects.budget }}</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="text-green-600 mr-2">👥</span>
              <span>团队精力: {{ nextLevel.effects.teamEffort }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 已达最高级 -->
    <div v-else class="bg-white rounded-lg shadow-md p-6">
      <div class="text-center py-8">
        <div class="text-5xl mb-4">🎉</div>
        <div class="text-2xl font-bold text-green-600 mb-2">
          恭喜！已达最高职�?        </div>
        <div class="text-gray-600">您已经成为策划总监，实现了终极目标�?/div>
      </div>
    </div>

    <!-- 职级说明 -->
    <div
      class="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md"
    >
      <div class="flex items-center">
        <div class="text-yellow-600 mr-3">💡</div>
        <div>
          <strong class="text-yellow-800">职级说明�?/strong>
          <p class="text-yellow-700 text-sm mt-1">
            职级晋升需要满足运营天数、累计下载量、总收入和市场情绪等条件。晋升后将获得更多预算和团队精力�?            同时解锁更多高级操作权限。达到策划总监级别后，您将获得游戏的终极权限�?          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSimulationStore } from '../../stores/simulationStore';

const simulationStore = useSimulationStore();

// 获取当前职级
const currentLevel = computed(() => {
  return simulationStore.getCurrentCareerLevel();
});

// 获取下一级职�?const nextLevel = computed(() => {
  return simulationStore.getNextCareerLevel();
});

// 总级别数
const totalLevels = computed(() => {
  return simulationStore.careerSystem.levels.length;
});

// 是否可以晋升
const canPromote = computed(() => {
  return simulationStore.canPromoteCareerLevel();
});

// 获取晋升进度
const promotionProgress = computed(() => {
  return simulationStore.getCareerPromotionProgress();
});

// 执行晋升
const promoteLevel = (): void => {
  simulationStore.promoteCareerLevel();
};

// 格式化数�?const formatValue = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};

// 获取操作名称
const getOperationName = (operationKey: string): string => {
  const operationNames: Record<string, string> = {
    releaseCommonSkin: '发布普通皮�?,
    improveDailyReward: '设置日常登录奖励',
    fixBug: '修复基础BUG',
    releaseLimitedSkin: '发布限定皮肤',
    heroAdjustment: '英雄调整',
    channelPromotion: '渠道投放',
    eventPlanning: '活动策划',
    heroRedesign: '英雄重做',
    crossBrandCooperation: '跨界合作',
    tournamentHolding: '赛事举办',
  };
  return operationNames[operationKey] || operationKey;
};
</script>

<style lang=scss scoped>
.career-promotion-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>




