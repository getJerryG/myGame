<template>
  <section class="data-panel" aria-labelledby="data-trends-title">
    <div class="panel-header">
      <h2 id="data-trends-title" class="panel-title">数据趋势</h2>
      <button
        class="collapse-btn"
        aria-expanded="!isCollapsed"
        @click="toggleCollapse"
      >
        <span class="collapse-icon">{{ isCollapsed ? '▶️' : '�? }}</span>
      </button>
    </div>

    <div class="panel-content" :class="{ collapsed: isCollapsed }">
      <!-- 收入趋势图表 -->
      <div class="trend-chart">
        <h3 class="chart-title">收入趋势</h3>
        <div class="chart-container">
          <div class="chart-bars">
            <div
              v-for="(item, index) in revenueHistory"
              :key="index"
              class="chart-bar"
            >
              <div
                class="bar"
                :style="{ height: (item.value / maxRevenueValue) * 100 + '%' }"
              ></div>
              <div class="bar-label">{{ item.date.day }}�?/div>
            </div>
          </div>
        </div>
      </div>

      <!-- 下载量趋势图�?-->
      <div class="trend-chart">
        <h3 class="chart-title">下载量趋�?/h3>
        <div class="chart-container">
          <div class="chart-bars">
            <div
              v-for="(item, index) in downloadsHistory"
              :key="index"
              class="chart-bar"
            >
              <div
                class="bar downloads-bar"
                :style="{
                  height: (item.value / maxDownloadsValue) * 100 + '%',
                }"
              ></div>
              <div class="bar-label">{{ item.date.day }}�?/div>
            </div>
          </div>
        </div>
      </div>

      <!-- 日活用户趋势图表 -->
      <div class="trend-chart">
        <h3 class="chart-title">日活用户趋势</h3>
        <div class="chart-container">
          <div class="chart-bars">
            <div
              v-for="(item, index) in activeUsersHistory"
              :key="index"
              class="chart-bar"
            >
              <div
                class="bar active-users-bar"
                :style="{
                  height: (item.value / maxActiveUsersValue) * 100 + '%',
                }"
              ></div>
              <div class="bar-label">{{ item.date.day }}�?/div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 定义类型接口
interface HistoryItem {
  date: {
    day: number;
  };
  value: number;
}

interface BusinessData {
  revenueHistory: HistoryItem[];
  downloadsHistory: HistoryItem[];
  dailyLoginHistory: HistoryItem[];
}

// Props
const props = defineProps<{
  businessData: BusinessData;
}>();

// 响应式数�?const isCollapsed = ref(false);

// 计算属�?const revenueHistory = computed<HistoryItem[]>(() => {
  return props.businessData.revenueHistory.slice(-7);
});

const downloadsHistory = computed<HistoryItem[]>(() => {
  return props.businessData.downloadsHistory.slice(-7);
});

const activeUsersHistory = computed<HistoryItem[]>(() => {
  return props.businessData.dailyLoginHistory.slice(-7);
});

const maxRevenueValue = computed<number>(() => {
  return Math.max(...props.businessData.revenueHistory.map((h) => h.value), 1);
});

const maxDownloadsValue = computed<number>(() => {
  return Math.max(
    ...props.businessData.downloadsHistory.map((h) => h.value),
    1
  );
});

const maxActiveUsersValue = computed<number>(() => {
  return Math.max(
    ...props.businessData.dailyLoginHistory.map((h) => h.value),
    1
  );
});

// 方法
const toggleCollapse = (): void => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style lang=scss scoped>
/* 数据趋势面板 */
.data-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

/* 面板头部 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 8px 8px 0 0;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.collapse-btn:hover {
  background-color: #f1f5f9;
}

.collapse-icon {
  font-size: 14px;
}

/* 面板内容 */
.panel-content {
  padding: 16px;
  background: white;
  border-radius: 0 0 8px 8px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.panel-content.collapsed {
  max-height: 0;
  padding: 0;
  overflow: hidden;
}

/* 趋势图表 */
.trend-chart {
  margin-bottom: 16px;
}

.trend-chart:last-child {
  margin-bottom: 0;
}

.chart-title {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 12px;
}

.chart-container {
  height: 150px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 16px 0;
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #3498db, #2980b9);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
  min-height: 2px;
}

.bar.downloads-bar {
  background: linear-gradient(180deg, #2ecc71, #27ae60);
}

.bar.active-users-bar {
  background: linear-gradient(180deg, #f39c12, #e67e22);
}

.bar-label {
  font-size: 10px;
  color: #64748b;
}

/* 响应式设�? */
@media (width <= 768px) {
  .panel-header {
    padding: 12px 15px;
  }

  .panel-content {
    padding: 15px;
  }

  .chart-container {
    height: 180px;
  }
}

/* 横屏手机适配 */
@media (orientation: landscape) and (height <= 600px) {
  .panel-header {
    padding: 10px 12px;
  }

  .panel-title {
    font-size: 14px;
  }

  .panel-content {
    padding: 12px;
  }

  .chart-container {
    height: 150px;
    padding: 10px 0;
  }

  .chart-title {
    font-size: 13px;
    margin-bottom: 10px;
  }

  .bar-label {
    font-size: 9px;
  }
}
</style>




