<template>
  <div class="game-setup-container">
    <div class="game-setup-content">
      <h2 class="text-2xl font-bold mb-6 text-center">游戏基础设定</h2>

      <!-- 游戏类型选择 -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >选择游戏类型</label
        >
        <div class="grid grid-cols-3 gap-4">
          <button
            v-for="gameType in gameTypes"
            :key="gameType.value"
            @click="selectedGameType = gameType.value"
            :class="[
              'p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center',
              selectedGameType === gameType.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50',
            ]"
          >
            <div class="text-lg font-semibold mb-2">{{ gameType.label }}</div>
            <div class="text-xs text-gray-500 text-center">
              {{ gameType.description }}
            </div>
          </button>
        </div>
      </div>

      <!-- 游戏名称输入 -->
      <div class="mb-8">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >设定游戏名称</label
        >
        <input
          v-model="gameName"
          type="text"
          placeholder="请输入游戏名称（1-20个字符，不允许特殊字符）"
          class="w-full px-4 py-3 border transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="[
            'border-gray-300',
            gameNameError ? 'border-red-500' : ''
          ]"
          :maxlength="20"
          @input="validateGameName"
        />
        <div class="flex justify-between text-xs mt-1">
          <div v-if="gameNameError" class="text-red-500">
            {{ gameNameError }}
          </div>
          <div class="text-gray-500">
            {{ gameName.length }}/20
          </div>
        </div>
      </div>

      <!-- 发布按钮 -->
      <button
        @click="publishGame"
        :disabled="!canPublish"
        class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        发布游戏
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSimulationStore } from '../../stores/simulationStore';

const simulationStore = useSimulationStore();

// 游戏类型选项
const gameTypes = [
  { value: 'moba', label: 'MOBA', description: '多人在线战术竞技游戏' },
  { value: 'card', label: '卡牌', description: '策略卡牌收集游戏' },
  { value: 'casual', label: '休闲竞技', description: '轻松休闲的竞技游戏' },
];

// 类型定义
const GameTypeValues = ['moba', 'card', 'casual'] as const;
type GameType = typeof GameTypeValues[number];

// 选中的游戏类�?const selectedGameType = ref<GameType>('moba');

// 游戏名称
const gameName = ref('我的游戏');
// 游戏名称错误信息
const gameNameError = ref<string>('');

/**
 * 验证游戏名称
 * 1-20个字符，不允许特殊字�? */
const validateGameName = (): void => {
  const name = gameName.value.trim();
  
  if (name.length === 0) {
    gameNameError.value = '';
    return;
  }
  
  if (name.length > 20) {
    gameNameError.value = '游戏名称不能超过20个字�?;
    return;
  }
  
  if (name.length < 1) {
    gameNameError.value = '游戏名称不能为空';
    return;
  }
  
  // 检查是否包含特殊字�?  const specialCharRegex = /[^a-zA-Z0-9\u4e00-\u9fa5\s]/;
  if (specialCharRegex.test(name)) {
    gameNameError.value = '游戏名称不能包含特殊字符';
    return;
  }
  
  gameNameError.value = '';
};

/**
 * 安全的HTML编码函数
 * @param str 需要编码的字符�? * @returns 编码后的字符�? */
const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// 计算是否可以发布
const canPublish = computed(() => {
  return gameName.value.trim().length > 0 && 
         gameName.value.length <= 20 && 
         !gameNameError.value;
});

// 发布游戏
const publishGame = (): void => {
  // 最后验证一�?  validateGameName();
  
  if (!canPublish.value) {
    return;
  }
  
  // 安全编码游戏名称，防止XSS攻击
  const safeGameName = escapeHtml(gameName.value.trim());
  
  // 创建游戏
  simulationStore.createGame(
    selectedGameType.value,
    safeGameName
  );

  // 记录游戏设定
  simulationStore.recordAction('gameSetup', {
    gameType: selectedGameType.value,
    gameName: safeGameName,
  });

  // 触发游戏发布事件
  // 这里可以根据需要添加更多逻辑，比如解锁核心数据面�?};
</script>

<style lang=scss scoped>
.game-setup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.game-setup-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 10%),
    0 2px 4px -1px rgb(0 0 0 / 6%);
  max-width: 500px;
  width: 100%;
}
</style>




