<template>
  <div class="operation-strategy-panel">
    <!-- 面板头部 -->
    <div class="panel-header">
      <h3 class="panel-title">运营策略</h3>
      <button
        class="collapse-btn"
        aria-expanded="!isCollapsed"
        @click="toggleCollapse"
      >
        <span class="collapse-icon">{{ isCollapsed ? '▶️' : '▼' }}</span>
      </button>
    </div>

    <!-- 面板内容 -->
    <div
      class="panel-content"
      :class="{ collapsed: isCollapsed }"
    >
      <!-- 策略类型标签页 -->
      <div class="strategy-tabs">
        <button
          v-for="tab in strategyTabs"
          :key="tab.value"
          class="strategy-tab"
          :class="{ active: activeTab === tab.value }"
          @click="switchTab(tab.value)"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>

      <!-- 策略配置内容 -->
      <div class="strategy-content">
        <!-- 广告投放配置 -->
        <div
          v-if="activeTab === 'advertisement'"
          class="tab-content"
        >
          <AdvertisingConfig
            :channels="advertisementChannels"
            :settings="advertisementSettings"
            :selected-channel-ids="selectedChannels"
            @update:settings="advertisementSettings = $event"
            @update:selected-channel-ids="selectedChannels = $event"
          />
        </div>

        <!-- 合作联动配置 -->
        <div
          v-if="activeTab === 'collaboration'"
          class="tab-content"
        >
          <CollaborationConfig
            :options="collaborationOptions"
            @select-option="selectCollaboration"
            @confirm-collaboration="confirmCollaboration"
            @reset-selection="resetCollaboration"
          />
        </div>

        <!-- 危机应对配置 -->
        <div
          v-if="activeTab === 'crisis'"
          class="tab-content"
        >
          <CrisisConfig
            :crisis-types="crisisTypes"
            :crisis-solutions="crisisSolutions"
            @select-crisis="selectCrisis"
            @select-solution="selectSolution"
          />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button
          class="btn btn-secondary"
          @click="resetSettings"
        >
          <span class="btn-icon">🔄</span>
          <span class="btn-text">重置设置</span>
        </button>
        <button
          class="btn btn-primary"
          @click="confirmStrategy"
        >
          <span class="btn-icon">📋</span>
          <span class="btn-text">确认策略</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AdvertisingConfig from './AdvertisingConfig.vue';
import CollaborationConfig from './CollaborationConfig.vue';
import CrisisConfig from './CrisisConfig.vue';

// 面板折叠状态
const isCollapsed = ref(false);

// 当前激活的标签页
const activeTab = ref('advertisement');

// 策略类型标签
const strategyTabs = ref([
  { value: 'advertisement', label: '广告投放', icon: '📱' },
  { value: 'collaboration', label: '合作联动', icon: '🤝' },
  { value: 'crisis', label: '危机应对', icon: '🚨' },
]);

// 选中的渠道
const selectedChannels = ref([1, 3]);

// 广告投放设置
const advertisementSettings = ref({
  budget: 200000,
  duration: '14',
  targetAudience: 'youngAdult',
});

// 广告投放渠道
const advertisementChannels = ref([
  {
    id: 1,
    name: '社交媒体',
    icon: '📱',
    description: '微信、微博、抖音等平台',
    stats: {
      conversionRate: 3.5,
      cost: 150,
    },
  },
  {
    id: 2,
    name: '游戏平台',
    icon: '🎮',
    description: '应用商店、游戏论坛',
    stats: {
      conversionRate: 5.2,
      cost: 200,
    },
  },
  {
    id: 3,
    name: 'KOL合作',
    icon: '👑',
    description: '游戏主播、网红推广',
    stats: {
      conversionRate: 8.7,
      cost: 500,
    },
  },
  {
    id: 4,
    name: '搜索引擎',
    icon: '🔍',
    description: '百度、谷歌等搜索平台',
    stats: {
      conversionRate: 2.8,
      cost: 120,
    },
  },
]);

// 合作联动选项
const collaborationOptions = ref([
  {
    id: 1,
    name: 'KPL战队',
    icon: '🏆',
    type: '电竞合作',
    expected: {
      effect: '提升游戏电竞影响力',
      cost: 50,
      duration: 30,
    },
  },
  {
    id: 2,
    name: '知名IP',
    icon: '🎬',
    type: 'IP联动',
    expected: {
      effect: '吸引IP粉丝群体',
      cost: 100,
      duration: 45,
    },
  },
  {
    id: 3,
    name: '品牌合作',
    icon: '🛍️',
    type: '商业合作',
    expected: {
      effect: '提升品牌知名度',
      cost: 30,
      duration: 21,
    },
  },
]);

// 危机类型
const crisisTypes = ref([
  {
    id: 1,
    name: '玩家大规模抗议',
    icon: '🔥',
    description: '玩家对游戏更新或决策强烈不满',
  },
  {
    id: 2,
    name: '竞争对手活动',
    icon: '⚔️',
    description: '竞争对手推出针对性活动',
  },
  {
    id: 3,
    name: '负面舆情',
    icon: '💣',
    description: '社交媒体负面消息扩散',
  },
  {
    id: 4,
    name: '技术问题',
    icon: '🐛',
    description: '服务器崩溃、游戏BUG等',
  },
]);

// 选中的危机
const selectedCrisis = ref(null);

// 选中的解决方案
const selectedSolution = ref(null);

// 危机解决方案
const crisisSolutions = ref({
  1: [
    {
      name: '发布道歉声明',
      cost: 0,
      description: '官方发布道歉声明，承认问题并承诺改进',
      effect: '缓解部分玩家情绪',
      executionTime: '立即',
    },
    {
      name: '发放补偿奖励',
      cost: 10,
      description: '向所有玩家发放补偿奖励',
      effect: '有效缓解玩家不满',
      executionTime: '24小时内',
    },
    {
      name: '紧急调整游戏内容',
      cost: 20,
      description: '根据玩家反馈紧急调整游戏内容',
      effect: '彻底解决问题根源',
      executionTime: '72小时内',
    },
  ],
  2: [
    {
      name: '推出对抗活动',
      cost: 30,
      description: '推出针对性活动对抗竞争对手',
      effect: '吸引玩家注意力',
      executionTime: '7天内',
    },
    {
      name: '加强福利力度',
      cost: 25,
      description: '临时提升游戏内福利力度',
      effect: '提高玩家留存',
      executionTime: '48小时内',
    },
  ],
  3: [
    {
      name: '舆情监测',
      cost: 5,
      description: '加强舆情监测和引导',
      effect: '控制负面消息扩散',
      executionTime: '立即',
    },
    {
      name: '正面宣传',
      cost: 15,
      description: '加大正面宣传力度',
      effect: '平衡负面舆情',
      executionTime: '3天内',
    },
    {
      name: 'KOL合作',
      cost: 40,
      description: '与KOL合作进行正面宣传',
      effect: '有效改善公众 perception',
      executionTime: '7天内',
    },
  ],
  4: [
    {
      name: '技术修复',
      cost: 8,
      description: '紧急修复技术问题',
      effect: '解决技术故障',
      executionTime: '24小时内',
    },
    {
      name: '服务器扩容',
      cost: 15,
      description: '临时扩容服务器',
      effect: '提高系统稳定性',
      executionTime: '48小时内',
    },
    {
      name: '发放补偿',
      cost: 12,
      description: '向受影响玩家发放补偿',
      effect: '缓解玩家不满',
      executionTime: '72小时内',
    },
  ],
});

// 切换折叠状态
function toggleCollapse(): void {
  isCollapsed.value = !isCollapsed.value;
}

// 切换标签页
function switchTab(tab: string): void {
  activeTab.value = tab;
}

// 选择合作联动
function selectCollaboration(): void {
  // 选择合作联动逻辑
}

// 确认合作联动
function confirmCollaboration(): void {
  // 确认合作联动逻辑
}

// 重置合作联动选择
function resetCollaboration(): void {
  // 重置合作联动选择逻辑
}

// 选择危机类型
function selectCrisis(crisisId: number): void {
  selectedCrisis.value = crisisId;
  selectedSolution.value = null;
}

// 选择解决方案
function selectSolution(index: number): void {
  selectedSolution.value = index;
}

// 重置设置
function resetSettings(): void {
  switch (activeTab.value) {
    case 'advertisement':
      selectedChannels.value = [];
      advertisementSettings.value = {
        budget: 200000,
        duration: '14',
        targetAudience: 'youngAdult',
      };
      break;
    case 'crisis':
      selectedCrisis.value = null;
      selectedSolution.value = null;
      break;
  }
}

// 确认策略
function confirmStrategy(): void {
  emit('strategy-confirmed', {
    type: activeTab.value,
    settings: activeTab.value === 'advertisement' ? advertisementSettings.value : {},
    selectedChannels: selectedChannels.value,
    selectedCrisis: selectedCrisis.value,
    selectedSolution: selectedSolution.value,
  });
  alert('策略已确认！');
}

// 定义事件
const emit = defineEmits(['strategy-confirmed']);
</script>

<style lang="scss" scoped>
.operation-strategy-panel {
  @include utils.panel-base;
}

/* 面板头部 */
.panel-header {
  @include utils.panel-header;
}

.panel-title {
  @include utils.panel-title;
}

.collapse-btn {
  @include utils.collapse-btn;
}

.collapse-icon {
  font-size: tokens.$font-size-sm;
}

/* 面板内容 */
.panel-content {
  @include utils.panel-content;

  &.collapsed {
    max-height: 0;
    padding: 0;
    overflow: hidden;
  }
}

/* 策略类型标签页 */
.strategy-tabs {
  @include utils.tabs-container;
}

.strategy-tab {
  @include utils.tab-item;

  &.active {
    .tab-label {
      color: tokens.$text-primary;
    }
  }
}

.tab-icon {
  font-size: tokens.$font-size-base;
}

.tab-label {
  @include utils.tab-label;
}

/* 策略配置内容 */
.strategy-content {
  margin-bottom: tokens.$spacing-xl;
}

.tab-content {
  @include utils.fade-in;
}

/* 操作按钮 */
.action-buttons {
  @include utils.flex-row(tokens.$spacing-md, center, flex-end);

  .btn {
    &-primary {
      @include utils.btn-primary;
    }

    &-secondary {
      @include utils.btn-secondary;
    }
  }
}

/* 响应式设计 */
@include utils.mobile {
  .panel-content {
    padding: tokens.$spacing-md;
  }

  .strategy-tabs {
    flex-direction: column;
  }

  .strategy-tab {
    padding: tokens.$spacing-sm tokens.$spacing-md;
    justify-content: flex-start;
  }

  .action-buttons {
    flex-direction: column;

    .btn {
      width: 100%;
    }
  }
}

/* 横屏手机适配 */
@include utils.landscape-mobile {
  .panel-content {
    padding: tokens.$spacing-sm;
  }
}
</style>
