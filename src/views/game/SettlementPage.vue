<template>
  <div class="settlement-page">
    <!-- 背景 -->
    <div class="settlement-background"></div>

    <!-- 主要内容 -->
    <div class="settlement-content">
      <!-- 结算标题 -->
      <div class="settlement-title">
        <h1>今日结算</h1>
        <p class="settlement-date">{{ formatDate(new Date()) }}</p>
      </div>

      <!-- 核心数据概览 -->
      <div class="settlement-overview">
        <div class="overview-item">
          <div class="overview-label">日收入</div>
          <div class="overview-value income">
            ¥{{ dailyRevenue.toFixed(2) }}
          </div>
        </div>
        <div class="overview-item">
          <div class="overview-label">总下载量</div>
          <div class="overview-value downloads">
            {{ downloads.toLocaleString() }}
          </div>
        </div>
        <div class="overview-item">
          <div class="overview-label">日活跃用户</div>
          <div class="overview-value dau">{{ dau.toLocaleString() }}</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">市场情绪</div>
          <div class="overview-value sentiment">{{ marketSentiment }}%</div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="charts-section">
        <!-- 收入趋势图 -->
        <div class="chart-card">
          <h3>收入趋势</h3>
          <div class="chart-container">
            <Line :data="revenueChartData" :options="chartOptions" />
          </div>
        </div>

        <!-- 用户数据对比图 -->
        <div class="chart-card">
          <h3>用户数据</h3>
          <div class="chart-container">
            <Bar :data="userChartData" :options="chartOptions" />
          </div>
        </div>

        <!-- 市场情绪与留存率 -->
        <div class="chart-card">
          <h3>市场表现</h3>
          <div class="chart-container">
            <Line :data="marketChartData" :options="marketChartOptions" />
          </div>
        </div>

        <!-- 付费数据图 -->
        <div class="chart-card">
          <h3>付费数据</h3>
          <div class="chart-container">
            <Doughnut :data="paymentChartData" :options="doughnutOptions" />
          </div>
        </div>
      </div>

      <!-- 详细数据表格 -->
      <div class="detailed-data">
        <h3>详细数据</h3>
        <div class="data-grid">
          <div class="data-item">
            <span class="data-label">总营收</span>
            <span class="data-value">¥{{ totalRevenue.toFixed(2) }}</span>
          </div>
          <div class="data-item">
            <span class="data-label">月活跃用户</span>
            <span class="data-value">{{ mau.toLocaleString() }}</span>
          </div>
          <div class="data-item">
            <span class="data-label">7日留存率</span>
            <span class="data-value"
              >{{ (sevenDayRetention * 100).toFixed(1) }}%</span
            >
          </div>
          <div class="data-item">
            <span class="data-label">付费率</span>
            <span class="data-value"
              >{{ (paymentRate * 100).toFixed(1) }}%</span
            >
          </div>
          <div class="data-item">
            <span class="data-label">ARPU</span>
            <span class="data-value">¥{{ arpu.toFixed(2) }}</span>
          </div>
          <div class="data-item">
            <span class="data-label">用户投诉</span>
            <span class="data-value">{{ userComplaints }}</span>
          </div>
          <div class="data-item">
            <span class="data-label">英雄平均使用率</span>
            <span class="data-value">{{ heroAverageUsage.toFixed(1) }}%</span>
          </div>
          <div class="data-item">
            <span class="data-label">渠道转化率</span>
            <span class="data-value"
              >{{ (channelConversionRate * 100).toFixed(1) }}%</span
            >
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="settlement-actions">
        <button class="action-button" @click="backToHome">返回主页</button>
        <button class="action-button primary" @click="continueGame">
          继续游戏
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "vue-chartjs";

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const router = useRouter();

// 接收路由参数
const props = defineProps<{
  day?: string; // 天数参数，从/report/:day路由接收
}>();

// 当前天数
const currentDay = ref(1);

// 根据路由参数更新当前天数
watch(
  () => props.day,
  (newDay) => {
    if (newDay) {
      const dayNumber = Number(newDay);
      currentDay.value = dayNumber;
      // 这里可以添加根据天数获取对应数据的逻辑
      // 例如：businessDataStore.fetchDataByDay(dayNumber);
    }
  },
  { immediate: true },
);

// 提供默认数据
const dailyRevenue = ref(1000 + Math.random() * 5000);
const totalRevenue = ref(10000 + Math.random() * 50000);
const downloads = ref(500 + Math.random() * 2000);
const dau = ref(200 + Math.random() * 1000);
const mau = ref(1000 + Math.random() * 5000);
const marketSentiment = ref(0.6 + Math.random() * 0.4);
const sevenDayRetention = ref(0.3 + Math.random() * 0.4);
const paymentRate = ref(0.05 + Math.random() * 0.1);
const arpu = ref(5 + Math.random() * 15);
const userComplaints = ref(Math.floor(Math.random() * 20));
const heroAverageUsage = ref(0.2 + Math.random() * 0.6);
const channelConversionRate = ref(0.02 + Math.random() * 0.08);

// 生成历史数据
const generateHistoryData = (
  days: number,
  baseValue: number,
  variation: number,
): number[] => {
  return Array.from(
    { length: days },
    () => baseValue + Math.random() * variation - variation / 2,
  );
};

const revenueHistory = ref(generateHistoryData(7, 2000, 3000));
const downloadsHistory = ref(generateHistoryData(7, 1000, 1500));
const dauHistory = ref(generateHistoryData(7, 500, 700));
const marketSentimentHistory = ref(generateHistoryData(7, 0.7, 0.3));
const retentionHistory = ref(generateHistoryData(7, 0.4, 0.3));

// 格式化日期
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

// 生成模拟历史数据（如果没有足够的数据）
const generateMockHistory = (
  length: number,
  baseValue: number,
  variation: number,
): number[] => {
  return Array.from({ length }, () => {
    return baseValue + Math.random() * variation - variation / 2;
  });
};

// 图表通用配置
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "#ffffff",
      },
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
      ticks: {
        color: "#ffffff",
      },
    },
    y: {
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
      ticks: {
        color: "#ffffff",
      },
    },
  },
};

// 市场图表配置
const marketChartOptions = {
  ...chartOptions,
  scales: {
    ...chartOptions.scales,
    y: {
      ...chartOptions.scales?.y,
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: "#ffffff",
        },
      },
    },
  },
};

// 饼图配置
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        color: "#ffffff",
      },
    },
  },
};

// 收入趋势图数据
const revenueChartData = computed(() => {
  const history =
    revenueHistory.value.length > 0
      ? revenueHistory
      : generateMockHistory(7, 1000, 500);
  return {
    labels: history.map((_, i) => `第${i + 1}天`),
    datasets: [
      {
        label: "日收入",
        data: history,
        borderColor: "#4a9eff",
        backgroundColor: "rgba(74, 158, 255, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };
});

// 用户数据对比图
const userChartData = computed(() => {
  const days = 7;
  const downloadHistory =
    downloadsHistory.value.length > 0
      ? downloadsHistory.value.slice(-days)
      : generateMockHistory(days, 500, 200);
  const dauHistoryData =
    dauHistory.value.length > 0
      ? dauHistory.value.slice(-days)
      : generateMockHistory(days, 200, 100);

  return {
    labels: downloadHistory.map((_, i) => `第${i + 1}天`),
    datasets: [
      {
        label: "下载量",
        data: downloadHistory,
        backgroundColor: "rgba(74, 158, 255, 0.6)",
      },
      {
        label: "日活跃",
        data: dauHistoryData,
        backgroundColor: "rgba(34, 197, 94, 0.6)",
      },
    ],
  };
});

// 市场表现图
const marketChartData = computed(() => {
  const days = 7;
  const sentimentHistory =
    marketSentimentHistory.value.length > 0
      ? marketSentimentHistory.value.slice(-days)
      : generateMockHistory(days, 50, 20);
  const retentionHistoryData =
    retentionHistory.value.length > 0
      ? retentionHistory.value.slice(-days).map((r) => r * 100)
      : generateMockHistory(days, 30, 10);

  return {
    labels: sentimentHistory.map((_, i) => `第${i + 1}天`),
    datasets: [
      {
        label: "市场情绪",
        data: sentimentHistory,
        borderColor: "#4a9eff",
        backgroundColor: "rgba(74, 158, 255, 0.2)",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "7日留存率",
        data: retentionHistoryData,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };
});

// 付费数据图
const paymentChartData = computed(() => {
  const payerCount = Math.round(dau.value * paymentRate.value);
  const nonPayerCount = dau.value - payerCount;

  return {
    labels: ["付费用户", "非付费用户"],
    datasets: [
      {
        data: [payerCount, nonPayerCount],
        backgroundColor: ["rgba(255, 215, 0, 0.8)", "rgba(100, 116, 139, 0.8)"],
        borderColor: ["rgba(255, 215, 0, 1)", "rgba(100, 116, 139, 1)"],
        borderWidth: 1,
      },
    ],
  };
});

// 返回主页
const backToHome = (): void => {
  router.push("/");
};

// 继续游戏
const continueGame = (): void => {
  router.push("/desktop");
};
</script>

<style lang="scss" scoped>
.settlement-page {
  width: 100vw;
  height: 100vh;

  @include utils.flex-center;

  overflow: hidden;
  position: relative;
  font-family: tokens.$font-family-base;
}

.settlement-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    tokens.$bg-dark 0%,
    tokens.$bg-secondary 50%,
    tokens.$bg-tertiary 100%
  );
  background-size: cover;
  background-position: center;
  opacity: 0.9;

  /* 添加装饰性元素 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(
        circle at 30% 40%,
        rgb(255 215 0 / 10%) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 60%,
        rgb(255 107 107 / 10%) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 50% 20%,
        rgb(74 158 255 / 10%) 0%,
        transparent 50%
      );
    animation: backgroundPulse 4s ease-in-out infinite alternate;
  }
}

@keyframes backgroundPulse {
  from {
    opacity: 0.8;
  }

  to {
    opacity: 1;
  }
}

.settlement-content {
  @include utils.flex-col(tokens.$spacing-md, center, flex-start);

  z-index: 1;
  max-width: tokens.$max-content-width;
  width: 100%;
  padding: tokens.$spacing-md;
  overflow-y: auto;
  max-height: 100vh;

  @include utils.custom-scrollbar;
}

.settlement-title {
  text-align: center;
  margin-bottom: tokens.$spacing-lg;

  h1 {
    font-size: tokens.$font-size-5xl;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$primary-gold;
    text-shadow: 0 0 20px rgb(255 215 0 / 50%);
    margin: 0;
    animation: titleGlow 2s ease-in-out infinite alternate;
  }

  .settlement-date {
    font-size: tokens.$font-size-lg;
    color: tokens.$text-primary;
    margin: tokens.$spacing-sm 0 0;
    opacity: 0.8;
  }

  @media (width <= 768px) {
    h1 {
      font-size: tokens.$font-size-3xl;
    }
  }
}

@keyframes titleGlow {
  from {
    text-shadow: 0 0 20px rgb(255 215 0 / 50%);
  }

  to {
    text-shadow:
      0 0 30px rgb(255 215 0 / 80%),
      0 0 40px rgb(255 215 0 / 30%);
  }
}

/* 核心数据概览 */
.settlement-overview {
  @include utils.grid-auto-fill(200px, tokens.$spacing-md);

  width: 100%;
  margin-bottom: tokens.$spacing-lg;

  .overview-item {
    background-color: tokens.$bg-lighter;
    border-radius: tokens.$radius-lg;
    padding: tokens.$spacing-md;
    backdrop-filter: blur(10px);
    border: 2px solid tokens.$border-light;
    text-align: center;
    transition: all tokens.$transition-normal;

    &:hover {
      transform: translateY(-5px);
      box-shadow: tokens.$shadow-lg;
      border-color: rgb(255 215 0 / 50%);
    }

    .overview-label {
      color: tokens.$gray-400;
      font-size: tokens.$font-size-sm;
      margin-bottom: tokens.$spacing-sm;
      display: block;
    }

    .overview-value {
      font-size: tokens.$font-size-2xl;
      font-weight: tokens.$font-weight-bold;
      color: tokens.$text-primary;

      &.income {
        color: tokens.$success;
      }

      &.downloads {
        color: tokens.$primary;
      }

      &.dau {
        color: tokens.$warning;
      }

      &.sentiment {
        color: tokens.$lottery-purple;
      }
    }
  }

  @media (width <= 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 图表区域 */
.charts-section {
  @include utils.grid-auto-fill(550px, tokens.$spacing-md);

  width: 100%;
  margin-bottom: tokens.$spacing-lg;

  @media (width <= 1200px) {
    grid-template-columns: 1fr;
  }

  @media (width <= 768px) {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background-color: tokens.$bg-lighter;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-md;
  backdrop-filter: blur(10px);
  border: 2px solid tokens.$border-light;
  transition: all tokens.$transition-normal;

  &:hover {
    transform: translateY(-5px);
    box-shadow: tokens.$shadow-lg;
    border-color: rgb(255 215 0 / 50%);
  }

  h3 {
    color: tokens.$text-primary;
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-lg;
    text-align: center;
    border-bottom: 1px solid tokens.$border-light;
    padding-bottom: tokens.$spacing-sm;
  }

  .chart-container {
    height: 300px;
    width: 100%;

    @media (width <= 1200px) {
      height: 250px;
    }

    @media (width <= 768px) {
      height: 200px;
    }
  }
}

/* 详细数据表格 */
.detailed-data {
  width: 100%;
  margin-bottom: tokens.$spacing-lg;

  h3 {
    color: tokens.$text-primary;
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-xl;
    text-align: center;
  }

  .data-grid {
    @include utils.grid-auto-fill(250px, tokens.$spacing-md);

    @media (width <= 768px) {
      grid-template-columns: 1fr;
    }
  }

  .data-item {
    @include utils.flex-between;

    padding: tokens.$spacing-sm tokens.$spacing-md;
    background-color: tokens.$bg-lighter;
    border-radius: tokens.$radius-md;
    backdrop-filter: blur(5px);
    border: 1px solid tokens.$border-light;

    .data-label {
      color: tokens.$gray-400;
      font-weight: tokens.$font-weight-medium;
    }

    .data-value {
      color: tokens.$text-primary;
      font-weight: tokens.$font-weight-bold;
      font-size: tokens.$font-size-lg;
    }
  }
}

/* 操作按钮 */
.settlement-actions {
  display: flex;
  gap: tokens.$spacing-md;
  margin-top: tokens.$spacing-lg;

  .action-button {
    padding: tokens.$spacing-sm tokens.$spacing-xl;
    font-size: tokens.$font-size-lg;
    color: tokens.$text-primary;
    background-color: tokens.$bg-lighter;
    border: 2px solid tokens.$border-light;
    border-radius: tokens.$radius-full;
    cursor: pointer;
    transition: all tokens.$transition-normal;
    font-weight: tokens.$font-weight-bold;

    &:hover {
      background-color: tokens.$bg-light;
      border-color: tokens.$border-medium;
      transform: translateY(-2px);
    }

    &.primary {
      background: linear-gradient(
        135deg,
        tokens.$primary 0%,
        tokens.$primary-dark 100%
      );
      border-color: rgb(74 158 255 / 50%);

      &:hover {
        background: linear-gradient(
          135deg,
          tokens.$primary-dark 0%,
          tokens.$primary 100%
        );
        box-shadow: 0 6px 20px rgb(74 158 255 / 40%);
      }
    }
  }

  @media (width <= 768px) {
    flex-direction: column;
    gap: tokens.$spacing-sm;
    width: 100%;
    max-width: 300px;
  }
}
</style>
