<template>
  <ApplicationWindow
    title="数据中心"
    title-icon="📊"
    :sidebar-items="sidebarItems"
    :active-item-id="activeModule"
    @update:active-item-id="handleItemChange"
    @item-click="handleItemClick"
  >
    <template #header-actions> </template>

    <!-- 核心数据模块 -->
    <div
      v-if="activeModule === 'core-data'"
      class="module-content"
    >
      <h3>核心数据概览</h3>
      <div class="data-grid">
        <!-- 游戏核心数�?-->
        <div class="data-card">
          <div class="data-card-header">
            <h4>游戏核心数据</h4>
          </div>
          <div class="data-card-body">
            <div class="data-item">
              <span class="data-label">当前资金</span>
              <span class="data-value">{{ coreOverviewData.money }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">累计总流水</span>
              <span class="data-value">{{ coreOverviewData.totalMoney }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">声望</span>
              <span class="data-value">{{ coreOverviewData.reputation }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">游戏热度</span>
              <span class="data-value">{{ coreOverviewData.popularity }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">口碑</span>
              <span class="data-value">{{ coreOverviewData.wordOfMouth }}</span>
            </div>
          </div>
        </div>

        <!-- 英雄与皮肤数据 -->
        <div class="data-card">
          <div class="data-card-header">
            <h4>英雄与皮肤</h4>
          </div>
          <div class="data-card-body">
            <div class="data-item">
              <span class="data-label">已上线英雄</span>
              <span class="data-value">{{ coreOverviewData.heroCount }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">已上线皮肤</span>
              <span class="data-value">{{ coreOverviewData.skinCount }}</span>
            </div>
          </div>
        </div>

        <!-- 业务数据 -->
        <div class="data-card">
          <div class="data-card-header">
            <h4>业务数据</h4>
          </div>
          <div class="data-card-body">
            <div class="data-item">
              <span class="data-label">下载量</span>
              <span class="data-value">{{ coreOverviewData.downloads }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">日活跃用户</span>
              <span class="data-value">{{ coreOverviewData.dau }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">月活跃用户</span>
              <span class="data-value">{{ coreOverviewData.mau }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">市场情绪</span>
              <span class="data-value">{{ coreOverviewData.marketSentiment }}</span>
            </div>
          </div>
        </div>

        <!-- 收入指标 -->
        <div class="data-card">
          <div class="data-card-header">
            <h4>收入指标</h4>
          </div>
          <div class="data-card-body">
            <div class="data-item">
              <span class="data-label">总收入</span>
              <span class="data-value">{{ coreOverviewData.totalRevenue }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">日收入</span>
              <span class="data-value">{{ coreOverviewData.dailyRevenue }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">付费率</span>
              <span class="data-value">{{ coreOverviewData.paymentRate }}%</span>
            </div>
            <div class="data-item">
              <span class="data-label">ARPU</span>
              <span class="data-value">{{ coreOverviewData.arpu }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">七日留存率</span>
              <span class="data-value">{{ coreOverviewData.sevenDayRetention }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="activeModule === 'revenue-analysis'"
      class="module-content"
    >
      <h3>收入分析</h3>
      <div class="data-card">
        <div class="data-card-header">
          <h4>收入趋势</h4>
        </div>
        <div class="data-card-body">
          <div class="chart-placeholder">
            <p>收入趋势图表</p>
            <div class="trend-data">
              <div
                v-for="(item, index) in recentRevenueData"
                :key="index"
                class="trend-item"
              >
                <span class="trend-date">{{ item.date }}</span>
                <span class="trend-value">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="activeModule === 'user-profile'"
      class="module-content"
    >
      <h3>用户画像</h3>
      <p>用户画像功能开发中...</p>
    </div>

    <div
      v-else-if="activeModule === 'data-trends'"
      class="module-content"
    >
      <h3>数据趋势</h3>
      <p>数据趋势功能开发中...</p>
    </div>
  </ApplicationWindow>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ApplicationWindow from '@/components/common/window/ApplicationWindow.vue';
import type { SidebarItem } from '@/components/common/window/ApplicationWindow.vue';
import { getModuleIcon } from '@/utils/appUtils';
import { useSimulationCoreValuesStore } from '@/stores/simulation/simulationCoreValuesStore';
import { useSimulationBusinessDataStore } from '@/stores/simulation/simulationBusinessDataStore';
import { useSimulationGameStateStore } from '@/stores/simulation/simulationGameStateStore';

const props = defineProps({
  app: {
    type: Object,
    required: true,
  },
  gameData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:activeModule']);

// 活跃模块状�?const activeModule = ref(props.app.modules[0].id);

// 访问数据存储
const coreValuesStore = useSimulationCoreValuesStore();
const businessDataStore = useSimulationBusinessDataStore();
const gameStateStore = useSimulationGameStateStore();

// 格式化侧边栏项，添加图标
const sidebarItems = computed((): SidebarItem[] => {
  return props.app.modules.map((module) => ({
    id: module.id,
    name: module.name,
    icon: getModuleIcon(module.id),
  }));
});

// 当前激活的模块
const currentModule = computed(() => {
  return props.app.modules.find((m) => m.id === activeModule.value) || props.app.modules[0];
});

// 核心数据概览
const coreOverviewData = computed(() => {
  return {
    // 核心数�?    money: coreValuesStore.money,
    reputation: coreValuesStore.reputation,
    popularity: coreValuesStore.popularity,
    wordOfMouth: coreValuesStore.wordOfMouth,
    totalMoney: coreValuesStore.totalMoney,
    heroCount: coreValuesStore.heroCount,
    skinCount: coreValuesStore.skinCount,
    // 业务数据
    downloads: businessDataStore.downloads,
    dau: businessDataStore.dau,
    mau: businessDataStore.mau,
    totalRevenue: businessDataStore.totalRevenue,
    dailyRevenue: businessDataStore.dailyRevenue,
    marketSentiment: businessDataStore.marketSentiment,
    sevenDayRetention: Math.round(businessDataStore.sevenDayRetention * 100),
    paymentRate: Math.round(businessDataStore.paymentRate * 100),
    arpu: businessDataStore.arpu,
    userComplaints: businessDataStore.userComplaints,
  };
});

// 最近收入数据（用于图表展示）
const recentRevenueData = computed(() => {
  if (!businessDataStore.revenueHistory) {
    return [];
  }

  const history = [...businessDataStore.revenueHistory];
  return history.slice(-7).map((value, index) => ({
    date: `${gameStateStore.currentDate.month}/${gameStateStore.currentDate.day - 6 + index}`,
    value: value,
  }));
});

// 处理侧边栏项点击
const handleItemChange = (itemId: string): void => {
  activeModule.value = itemId;
  emit('update:activeModule', itemId);
};

const handleItemClick = (item: SidebarItem): void => {
  activeModule.value = item.id;
  emit('update:activeModule', item.id);
};
</script>

<style lang="scss" scoped>
.module-content {
  background-color: rgb(0 0 0 / 10%);
  border-radius: 8px;
  padding: 20px;
  min-height: 200px;
}

.module-content h3 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #4a9eff;
}

.module-content h4 {
  margin: 0 0 12px;
  font-size: 16px;
  color: #fff;
}

.module-content p {
  margin: 0 0 16px;
  color: #b0b0b0;
  line-height: 1.6;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.data-card {
  background-color: rgb(0 0 0 / 20%);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgb(74 158 255 / 20%);
  transition: all 0.2s ease;
}

.data-card:hover {
  border-color: rgb(74 158 255 / 50%);
  transform: translateY(-2px);
}

.data-card-header {
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgb(74 158 255 / 20%);
}

.data-card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.data-label {
  color: #b0b0b0;
  font-size: 14px;
}

.data-value {
  color: var(--primary-gold, #ffd700);
  font-weight: bold;
  font-size: 16px;
}

.chart-placeholder {
  background-color: rgb(0 0 0 / 20%);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.trend-data {
  margin-top: 20px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trend-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: rgb(0 0 0 / 20%);
  border-radius: 4px;
}

.trend-date {
  color: #b0b0b0;
  font-size: 14px;
}

.trend-value {
  color: var(--primary-gold, #ffd700);
  font-weight: bold;
  font-size: 14px;
}
</style>
