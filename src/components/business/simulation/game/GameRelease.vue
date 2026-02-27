<template>
  <div class="game-release-container">
    <h2 class="text-2xl font-bold mb-6">游戏公开发布</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 发布信息 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-4">发布准备</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >游戏名称</label
            >
            <div class="text-lg font-semibold">
              {{ simulationStore.gameSetup.gameName }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >游戏类型</label
            >
            <div class="text-lg font-semibold">
              {{ gameTypeLabels[simulationStore.gameSetup.gameType] }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >发布日期</label
            >
            <div class="text-lg font-semibold">
              第{{ simulationStore.gameState.year }}年{{
                simulationStore.gameState.month
              }}月{{ simulationStore.gameState.day }}�?            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >初始下载渠道</label
            >
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="channel in initialChannels"
                :key="channel"
                class="flex items-center"
              >
                <input
                  type="checkbox"
                  :id="`channel-${channel}`"
                  :checked="true"
                  disabled
                  class="mr-2"
                />
                <label
                  :for="`channel-${channel}`"
                  class="text-sm text-gray-600"
                  >{{ channel }}</label
                >
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <button
            @click="releaseGame"
            :disabled="isReleasing"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isReleasing">🚀 发布游戏</span>
            <span v-else>�?发布�?..</span>
          </button>
        </div>
      </div>

      <!-- 发布公告 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-4">发布公告</h3>

        <div class="bg-gray-50 p-4 rounded-md border-l-4 border-blue-500">
          <div class="text-center font-bold text-xl mb-4 text-blue-700">
            🎉 {{ simulationStore.gameSetup.gameName }} 正式发布 🎉
          </div>

          <div class="space-y-3">
            <p class="text-gray-700">亲爱的玩家们�?/p>
            <p class="text-gray-700">
              经过精心策划和开发，{{
                gameTypeLabels[simulationStore.gameSetup.gameType]
              }}游戏《{{
                simulationStore.gameSetup.gameName
              }}》正式与大家见面了！
            </p>
            <p class="text-gray-700">游戏特色�?/p>
            <ul class="list-disc pl-5 space-y-1 text-gray-700">
              <li>独特的游戏玩法设�?/li>
              <li>精美的游戏画�?/li>
              <li>丰富的英�?卡牌/休闲内容</li>
              <li>公平的竞技环境</li>
            </ul>
            <p class="text-gray-700">
              我们将持续更新内容，为大家带来更好的游戏体验�?            </p>
            <p class="text-gray-700">感谢大家的支持与期待�?/p>
            <p class="text-right text-gray-500 mt-4">
              ——《{{ simulationStore.gameSetup.gameName }}》开发团�?            </p>
          </div>
        </div>

        <div class="mt-4">
          <button
            @click="generateNewAnnouncement"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            🔄 重新生成公告
          </button>
        </div>
      </div>
    </div>

    <!-- 发布结果 -->
    <div
      v-if="releaseResult"
      class="mt-8 bg-white p-6 rounded-lg shadow-md border-2 border-green-500"
    >
      <h3 class="text-xl font-semibold mb-4 text-green-700">发布成功�?/h3>

      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-3xl font-bold text-green-600">
              {{ releaseResult.initialDownloads }}
            </div>
            <div class="text-sm text-gray-600">初始下载�?/div>
          </div>

          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-3xl font-bold text-blue-600">
              {{ releaseResult.initialRevenue }}
            </div>
            <div class="text-sm text-gray-600">初始收入</div>
          </div>

          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <div class="text-3xl font-bold text-purple-600">
              {{ releaseResult.initialSentiment }}
            </div>
            <div class="text-sm text-gray-600">初始市场情绪</div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 rounded-lg">
          <h4 class="font-semibold mb-2">发布效果分析�?/h4>
          <ul class="list-disc pl-5 space-y-1 text-gray-700">
            <li>游戏已成功发布到{{ initialChannels.length }}个初始渠�?/li>
            <li>
              预计首周下载量将达到{{ releaseResult.initialDownloads * 7 }}+
            </li>
            <li>市场情绪良好，玩家反馈积�?/li>
            <li>核心数据面板已解锁，可开始监控游戏运营数�?/li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSimulationStore } from '../../stores/simulationStore';

const simulationStore = useSimulationStore();
const isReleasing = ref(false);
const releaseResult = ref(null);

// 游戏类型标签
const gameTypeLabels = {
  moba: 'MOBA',
  card: '卡牌',
  casual: '休闲竞技',
};

// 初始下载渠道
const initialChannels = ['官方网站', '应用商店', '游戏平台', '社交媒体'];

// 发布游戏
  const releaseGame = async (): Promise<void> => {
    isReleasing.value = true;

    // 模拟发布过程
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 记录发布操作
    simulationStore.recordAction('releaseGame', {
      channels: initialChannels,
      date: simulationStore.gameState.currentDate,
    });

    // 生成初始数据
    const initialDownloads = Math.floor(5000 + Math.random() * 5000);
    const initialRevenue = Math.floor(initialDownloads * 0.1 * 100) / 100;
    const initialSentiment = Math.floor(60 + Math.random() * 20);

    // 保存发布结果
    releaseResult.value = {
      initialDownloads,
      initialRevenue,
      initialSentiment,
    };

    // 更新游戏状�?    simulationStore.gameState.currentPhase = 'growth';

    // 发布新版本后更新游戏日期
    simulationStore.nextDay();

    isReleasing.value = false;
  };

// 重新生成公告
const generateNewAnnouncement = (): void => {
  // 这里可以添加重新生成公告的逻辑
  // console.log('重新生成公告');
};
</script>

<style lang=scss scoped>
.game-release-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
