<template>
  <div class="game-admin-panel">
    <!-- 桌面系统 -->
    <DesktopSystem :game-data="gameData" />

    <!-- 游戏结束面板 -->
    <!-- GameOverPanel组件暂时不可用，注释�?-->
    <!-- <GameOverPanel
      :game-state="gameState"
      :business-data="businessData"
      @reset="resetGame"
    /> -->

    <!-- 系统通知弹窗 -->
    <!-- NotificationSystem组件暂时不可用，注释�?-->
    <!-- <NotificationSystem
      :show-notification="showNotification"
      :notification="notification"
      :current-date="
        gameState?.currentDate || {
          year: 0,
          month: 0,
          day: 0,
          hour: 0,
          minute: 0,
          second: 0,
        }
      "
      @close="closeNotification"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Simulation } from '@/models/Simulation';
// GameOverPanel组件暂时不可用，注释�?// import GameOverPanel from '@/components/business/simulation/GameOverPanel/index.vue';
// NotificationSystem组件暂时不可用，注释�?// import NotificationSystem from '@/components/business/simulation/NotificationSystem/index.vue';
import DesktopSystem from '@/components/common/DesktopSystem/index.vue';
import type { HistoryItem, Review, UserTask, GameEvent } from '../types/simulation-history';
import { useSimulationGameStateStore } from '@/stores/simulation/simulationGameStateStore';
import { useSimulationBusinessDataStore } from '@/stores/simulation/simulationBusinessDataStore';
import { useSimulationStore } from '@/stores/simulationStore';

// 在setup函数顶部获取store实例，确保Pinia已初始化
const gameStateStore = useSimulationGameStateStore();
const businessDataStore = useSimulationBusinessDataStore();
const simulationStore = useSimulationStore();

// 模拟数据
const simulation = ref(null);
const showAssessment = ref(false);
const gameState = ref(null);

// 模拟数据
const businessData = ref({
  downloads: 100,
  dau: 80,
  positiveReviews: 10,
  totalRevenue: 0,
  dailyRevenue: 0,
  revenueHistory: [],
  downloadsHistory: [],
  dailyLoginHistory: [],
  reviewsHistory: [],
});

const tasks = ref({
  daily: [],
  weekly: [],
  monthly: [],
});

const assessment = ref({
  currentMonthTarget: {
    downloads: 500,
    dau: 300,
    positiveReviews: 50,
    revenue: 1000,
  },
  passedMonths: 0,
});

const events = ref([]);

// 系统通知 - NotificationSystem组件暂时不可用，注释�?// const showNotification = ref(false);
// const notification = ref({
//   type: 'info',
//   title: '',
//   message: '',
//   date: null,
// });

// 时间模拟控制
const isSimulating = ref(false);
const simulationProgress = ref(0); // 模拟进度 0-100%
// 初始化游戏模拟
const initGame = (): void => {
  // 初始化Simulation实例
  simulation.value = new Simulation('simulation-1', '默认模拟');

  // 获取初始游戏状态
  const results = simulation.value.getResults();
  updateGameState(results);

  // 添加一些初始的历史数据，以便在页面加载时就能看到收入趋势
  if (businessData.value.revenueHistory.length === 0) {
    const initialHistory = [];
    const today = { ...gameState.value.currentDate };

    // 生成过去7天的模拟数据
    for (let i = 6; i >= 0; i--) {
      const date = { ...today };
      date.day = Math.max(1, date.day - i);

      initialHistory.push({
        date: { ...date },
        value: Math.floor(Math.random() * 1000) + 100,
      });
    }

    businessData.value.revenueHistory = initialHistory;
    businessData.value.downloadsHistory = initialHistory;
    businessData.value.dailyLoginHistory = initialHistory;
  }

  // 启动时间模拟
  simulation.value.startTimeSimulation();
  isSimulating.value = true;
};

const resetGame = (): void => {
  simulation.value.reset();
  const results = simulation.value.getResults();
  updateGameState(results);
  showAssessment.value = false;
};

// 定义Simulation结果类型
interface SimulationGameState {
  currentDate: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  dayCount: number;
  monthCount: number;
  isGameOver: boolean;
  gameOverReason: string;
  currentPhase: string;
  plannerLevel: string;
  plannerFunds: number;
}

interface SimulationBusinessData {
  downloads: number;
  dailyLogin: number;
  positiveReviews: number;
  totalRevenue: number;
  dailyRevenue: number;
  marketSentiment: number;
  sevenDayRetention: number;
  dau: number;
  mau: number;
  paymentRate: number;
  arpu: number;
  userComplaints: number;
  heroAverageUsage: number;
  channelConversionRate: number;
  baseNaturalGrowth: number;
  revenueHistory: HistoryItem[];
  downloadsHistory: HistoryItem[];
  dailyLoginHistory: HistoryItem[];
  marketSentimentHistory: HistoryItem[];
  dauHistory: HistoryItem[];
  mauHistory: HistoryItem[];
  retentionHistory: HistoryItem[];
  reviewsHistory: Review[];
}

interface SimulationTasks {
  daily: UserTask[];
  weekly: UserTask[];
  monthly: UserTask[];
}

interface SimulationAssessment {
  currentMonthTarget: {
    downloads: number;
    activeUsers: number;
    positiveReviews: number;
    revenue: number;
    dailyLogin?: number;
    marketSentiment?: number;
    sevenDayRetention?: number;
  };
  passedMonths: number;
}

interface SimulationResults {
  gameState: SimulationGameState;
  businessData: SimulationBusinessData;
  tasks: SimulationTasks;
  assessment: SimulationAssessment;
  events: GameEvent[];
}

const updateGameState = (results: SimulationResults): void => {
  // 保存当前的历史数据，以便在更新后保留
  const currentRevenueHistory = businessData.value.revenueHistory;
  const currentDownloadsHistory = businessData.value.downloadsHistory;
  const currentActiveUsersHistory = businessData.value.dailyLoginHistory;
  const currentReviewsHistory = businessData.value.reviewsHistory;

  // 更新游戏状�?  gameState.value = results.gameState;
  businessData.value = results.businessData;
  tasks.value = results.tasks;
  assessment.value = results.assessment;
  events.value = results.events;

  // 恢复历史数据
  businessData.value.revenueHistory = [...currentRevenueHistory, ...results.businessData.revenueHistory];
  businessData.value.downloadsHistory = [...currentDownloadsHistory, ...results.businessData.downloadsHistory];
  businessData.value.dailyLoginHistory = [...currentActiveUsersHistory, ...results.businessData.dailyLoginHistory];
  businessData.value.reviewsHistory = [...currentReviewsHistory, ...results.businessData.reviewsHistory];

  // 限制历史数据长度，只保留最�?0�?  businessData.value.revenueHistory =
  businessData.value.revenueHistory.slice(-30);
  businessData.value.downloadsHistory = businessData.value.downloadsHistory.slice(-30);
  businessData.value.dailyLoginHistory = businessData.value.dailyLoginHistory.slice(-30);
};

// closeNotification函数 - NotificationSystem组件暂时不可用，注释�?// const closeNotification = (): void => {
//   showNotification.value = false;
// };

// 组合游戏数据，传递给桌面系统
const gameData = computed(() => {
  return {
    gameState: {
      // 使用store中的游戏状�?      currentDate: gameStateStore.currentDate,
      dayCount: gameStateStore.dayCount,
      monthCount: gameStateStore.monthCount,
      isGameOver: gameStateStore.isGameOver,
      gameOverReason: gameStateStore.gameOverReason,
      currentPhase: gameStateStore.currentPhase,
      plannerLevel: '初级策划', // 这里可以根据需要从careerStore获取
      plannerFunds: businessDataStore.businessData?.plannerFunds || 10000,
    },
    businessData: businessData.value,
    tasks: tasks.value,
    assessment: assessment.value,
    events: events.value,
  };
});

// 初始化
onMounted(() => {
  // 初始化游戏模拟
  initGame();
});
</script>

<style lang="scss" scoped>
/* 主内�? */
.game-admin-panel {
  height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}
</style>
