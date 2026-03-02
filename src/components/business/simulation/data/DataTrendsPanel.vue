<template>
  <section class="data-panel" aria-labelledby="data-trends-title">
    <div class="panel-header">
      <h2 id="data-trends-title" class="panel-title">数据趋势</h2>
      <button
        class="collapse-btn"
        aria-expanded="!isCollapsed"
        @click="toggleCollapse"
      >
        <span class="collapse-icon">{{ isCollapsed ? "▶️" : "🔽" }}</span>
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
                class="bar revenue-bar"
                :style="{ height: (item.value / maxRevenueValue) * 100 + '%' }"
              ></div>
              <div class="bar-label">{{ item.date.day }}日</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 下载量趋势图表 -->
      <div class="trend-chart">
        <h3 class="chart-title">下载量趋势</h3>
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
              <div class="bar-label">{{ item.date.day }}日</div>
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
              <div class="bar-label">{{ item.date.day }}日</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

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

// 响应式数据
const isCollapsed = ref(false);

// 计算属性
const revenueHistory = computed<HistoryItem[]>(() => {
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
    1,
  );
});

const maxActiveUsersValue = computed<number>(() => {
  return Math.max(
    ...props.businessData.dailyLoginHistory.map((h) => h.value),
    1,
  );
});

// 方法
const toggleCollapse = (): void => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style lang="scss" scoped>
.data-panel {
  background: white;
  border-radius: tokens.$radius-lg;
  box-shadow: tokens.$shadow-md;
  overflow: hidden;
  border: 1px solid tokens.$gray-200;

  .panel-header {
    @include utils.flex-between(center);

    padding: tokens.$spacing-md tokens.$spacing-lg;
    background: white;
    border-bottom: 1px solid tokens.$gray-200;
    border-radius: tokens.$radius-lg tokens.$radius-lg 0 0;
  }

  .panel-title {
    font-size: tokens.$font-size-sm;
    font-weight: tokens.$font-weight-semibold;
    color: tokens.$gray-800;
    margin: 0;
  }

  .collapse-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: tokens.$spacing-xs;
    border-radius: tokens.$radius-sm;
    transition: background-color tokens.$transition-fast;

    &:hover {
      background-color: tokens.$gray-100;
    }

    .collapse-icon {
      font-size: tokens.$font-size-sm;
    }
  }

  .panel-content {
    padding: tokens.$spacing-md;
    background: white;
    border-radius: 0 0 tokens.$radius-lg tokens.$radius-lg;
    transition: all tokens.$transition-normal;
    overflow: hidden;

    &.collapsed {
      max-height: 0;
      padding: 0;
      overflow: hidden;
    }
  }

  .trend-chart {
    margin-bottom: tokens.$spacing-md;

    &:last-child {
      margin-bottom: 0;
    }

    .chart-title {
      font-size: tokens.$font-size-xs;
      font-weight: tokens.$font-weight-medium;
      color: tokens.$gray-500;
      margin-bottom: tokens.$spacing-sm;
    }

    .chart-container {
      height: 150px;

      @include utils.flex-row(tokens.$spacing-sm, flex-end, flex-start);

      padding: tokens.$spacing-md 0;

      .chart-bars {
        flex: 1;

        @include utils.flex-row(tokens.$spacing-sm, flex-end, flex-start);

        .chart-bar {
          flex: 1;

          @include utils.flex-col(tokens.$spacing-xs, center, flex-end);

          .bar {
            width: 100%;
            border-radius: tokens.$radius-sm tokens.$radius-sm 0 0;
            transition: height tokens.$transition-normal;
            min-height: 2px;

            &.revenue-bar {
              background: linear-gradient(
                180deg,
                tokens.$primary-light,
                tokens.$primary
              );
            }

            &.downloads-bar {
              background: linear-gradient(
                180deg,
                tokens.$success-green,
                tokens.$secondary-dark
              );
            }

            &.active-users-bar {
              background: linear-gradient(180deg, tokens.$warning, #e67e22);
            }
          }

          .bar-label {
            font-size: 10px;
            color: tokens.$gray-500;
          }
        }
      }
    }
  }
}

/* 响应式设�? */
@include utils.mobile {
  .data-panel {
    .panel-header {
      padding: tokens.$spacing-sm tokens.$spacing-md;
    }

    .panel-content {
      padding: tokens.$spacing-md;
    }

    .chart-container {
      height: 180px;
    }
  }
}

/* 横屏手机适配 */
@include utils.landscape-mobile {
  .data-panel {
    .panel-header {
      padding: tokens.$spacing-xs tokens.$spacing-sm;
    }

    .panel-title {
      font-size: tokens.$font-size-sm;
    }

    .panel-content {
      padding: tokens.$spacing-sm;
    }

    .chart-container {
      height: 150px;
      padding: tokens.$spacing-sm 0;

      .chart-title {
        font-size: tokens.$font-size-sm;
        margin-bottom: tokens.$spacing-sm;
      }

      .bar-label {
        font-size: 9px;
      }
    }
  }
}
</style>
