<template>
  <div class="basic-operations-container">
    <h2 class="text-2xl font-bold mb-6">首次基础策划操作</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 发布普通皮�?-->
      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold mb-4 text-blue-600">发布普通皮�?/h3>
        <p class="text-gray-600 mb-4">
          为英雄发布一款普通皮肤，提升玩家活跃度和收入
        </p>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >选择英雄</label
          >
          <select
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="hero1">英雄1</option>
            <option value="hero2">英雄2</option>
            <option value="hero3">英雄3</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >皮肤名称</label
          >
          <input
            type="text"
            placeholder="请输入皮肤名�?
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          @click="releaseCommonSkin"
          class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          发布皮肤
        </button>

        <div class="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
          <div><strong>预期效果�?/strong></div>
          <div>�?登录�?+5%</div>
          <div>�?收入 +10%</div>
          <div>�?市场情绪 +2</div>
        </div>
      </div>

      <!-- 设置日常登录奖励 -->
      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold mb-4 text-green-600">
          设置日常登录奖励
        </h3>
        <p class="text-gray-600 mb-4">设置连续登录奖励，提高用户留存率</p>

        <div class="space-y-3">
          <div
            v-for="(reward, index) in loginRewards"
            :key="index"
            class="flex items-center justify-between"
          >
            <span class="text-sm font-medium">第{{ index + 1 }}�?/span>
            <div class="flex items-center">
              <select
                class="px-3 py-1 border border-gray-300 rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="coins">金币</option>
                <option value="diamonds">钻石</option>
                <option value="items">道具</option>
              </select>
              <input
                type="number"
                min="0"
                placeholder="数量"
                class="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        <button
          @click="setDailyLoginRewards"
          class="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 mt-4"
        >
          保存设置
        </button>

        <div class="mt-4 p-3 bg-green-50 rounded-md text-sm text-green-700">
          <div><strong>预期效果�?/strong></div>
          <div>�?登录�?+8%</div>
          <div>�?7日留�?+5%</div>
          <div>�?市场情绪 +3</div>
        </div>
      </div>

      <!-- 修复基础BUG -->
      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 class="text-xl font-semibold mb-4 text-orange-600">修复基础BUG</h3>
        <p class="text-gray-600 mb-4">修复游戏中的基础BUG，提升游戏体�?/p>

        <div class="space-y-3">
          <div
            v-for="(bug, index) in bugs"
            :key="index"
            class="flex items-start"
          >
            <input type="checkbox" :id="`bug-${index}`" class="mt-1 mr-2" />
            <label :for="`bug-${index}`" class="text-sm">
              <div class="font-medium">{{ bug.title }}</div>
              <div class="text-xs text-gray-500">{{ bug.description }}</div>
            </label>
          </div>
        </div>

        <button
          @click="fixBasicBugs"
          class="w-full py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-200 mt-4"
        >
          修复选中BUG
        </button>

        <div class="mt-4 p-3 bg-orange-50 rounded-md text-sm text-orange-700">
          <div><strong>预期效果�?/strong></div>
          <div>�?登录�?+3%</div>
          <div>�?用户投诉 -10%</div>
          <div>�?市场情绪 +2</div>
        </div>
      </div>
    </div>

    <!-- 导师引导 -->
    <div
      class="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md"
    >
      <div class="flex items-center">
        <div class="text-yellow-600 mr-3">👨‍�?/div>
        <div>
          <strong class="text-yellow-800">导师提示�?/strong>
          <p class="text-yellow-700 text-sm mt-1">
            完成以上三个基础操作，即可解锁核心数据面板，开始正式运营游戏。建议按照顺序依次完成这些操作�?          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSimulationStore } from '../../stores/simulationStore';

const simulationStore = useSimulationStore();

// 登录奖励数据
const loginRewards = ref([
  { type: 'coins', amount: 100 },
  { type: 'coins', amount: 200 },
  { type: 'diamonds', amount: 10 },
  { type: 'items', amount: 1 },
  { type: 'coins', amount: 300 },
  { type: 'diamonds', amount: 15 },
  { type: 'items', amount: 2 },
]);

// BUG列表
const bugs = ref([
  { id: 1, title: '登录失败问题', description: '部分用户登录时出现网络错�? },
  { id: 2, title: '界面显示异常', description: '某些设备上界面元素重�? },
  { id: 3, title: '音效缺失', description: '游戏音效偶尔无法播放' },
  { id: 4, title: '数据同步问题', description: '部分数据无法及时同步' },
]);

// 发布普通皮�?const releaseCommonSkin = (): void => {
  simulationStore.recordAction('releaseCommonSkin', {
    heroId: 'hero1',
    skinName: '新皮�?,
    quality: 'common',
  });
  // 这里可以添加成功提示
};

// 设置日常登录奖励
const setDailyLoginRewards = (): void => {
  simulationStore.recordAction('improveDailyReward', {
    rewards: loginRewards.value,
  });
  // 这里可以添加成功提示
  // console.log('设置了日常登录奖�?);
};

// 修复基础BUG
const fixBasicBugs = (): void => {
  simulationStore.recordAction('fixBug', {
    bugIds: bugs.value.map((_, index) => index + 1), // 获取所有BUG的ID
  });
  // 这里可以添加成功提示
  // console.log('修复了所有BUG');
};
</script>

<style lang=scss scoped>
.basic-operations-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>




