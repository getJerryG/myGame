<template>
  <div class="top-core-data" aria-labelledby="core-data-header">
    <h2 id="core-data-header" class="sr-only">核心数据</h2>

    <!-- 上方：策划信息和时间系统 -->
    <div class="top-section">
      <!-- 策划信息 -->
      <PlannerInfo
        :level="gameState.plannerLevel"
        :funds="gameState.plannerFunds"
      />

      <!-- 顶部时间系统 -->
      <TimeSystem
        :current-date="gameState.currentDate"
        :current-phase="gameState.currentPhase"
        :is-game-over="gameState.isGameOver"
        @next-day="nextDay"
      />
    </div>

    <!-- 下方：核心指标总览 -->
    <div class="bottom-section">
      <!-- 核心指标总览 -->
      <div class="core-metrics-overview">
        <!-- 日活用户 -->
        <MetricCard
          metric-name="日活用户"
          :value="animatedActiveUsers"
          icon="👥"
          :change="activeUsersChange"
          positive-icon="🔥"
          negative-icon="😢"
          :trend-points="activeUsersTrend"
          trend-color="var(--primary-gold)"
          :show-trend="showTrends"
        />

        <!-- 市场份额 -->
        <MetricCard
          metric-name="市场份额"
          :value="marketShare"
          suffix="%"
          icon="📊"
          :change="marketShareChange"
          positive-icon="🚀"
          negative-icon="📉"
          :trend-points="marketShareTrend"
          trend-color="var(--success-green)"
          :show-trend="showTrends"
        />

        <!-- 玩家满意度 -->
        <MetricCard
          metric-name="玩家满意度"
          :value="playerSatisfaction"
          suffix="%"
          icon="😊"
          :change="satisfactionChange"
          positive-icon="🌟"
          negative-icon="😞"
          :trend-points="satisfactionTrend"
          trend-color="var(--primary-gold)"
          :show-trend="showTrends"
        />

        <!-- 游戏评分 -->
        <MetricCard
          metric-name="游戏评分"
          :value="gameRating"
          icon="⭐"
          :change="ratingChange"
          positive-icon="👍"
          negative-icon="👎"
          :trend-points="ratingTrend"
          trend-color="var(--warning-yellow)"
          :show-trend="showTrends"
        />

        <!-- 竞争指数 -->
        <MetricCard
          metric-name="竞争指数"
          :value="competitionIndex"
          icon="⚔️"
          :change="competitionChange"
          positive-icon="💪"
          negative-icon="🛡️"
          :trend-points="competitionTrend"
          trend-color="var(--error-red)"
          :show-trend="showTrends"
        />

        <!-- 项目进度 -->
        <MetricCard
          metric-name="项目进度"
          :value="projectProgress"
          suffix="%"
          icon="🏗️"
          :change="progressChange"
          positive-icon="✅"
          negative-icon="⏳"
          :trend-points="progressTrend"
          trend-color="var(--info-blue)"
          :show-trend="showTrends"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import PlannerInfo from './PlannerInfo.vue';
import TimeSystem from './TimeSystem.vue';
import MetricCard from './MetricCard.vue';

import type { GameState } from '@/types/game';

// 定义 props
const props = defineProps<{
  gameState: GameState;
  businessData: any;
  showTrends?: boolean;
}>();

// 定义 emits
const emit = defineEmits<{
  'next-day': [];
}>();

// 模拟动画数据
const animatedActiveUsers = ref(0);
const animatedHour = ref(0);
const animatedMinute = ref(0);

// 计算属性
const activeUsersChange = computed(() => {
  // 模拟变化值
  return Math.floor(Math.random() * 10) - 5; // -5% 到 +5%
});

const marketShare = computed(() => {
  return Math.min(100, Math.max(0, props.businessData?.marketShare || 0));
});

const marketShareChange = computed(() => {
  return Math.floor(Math.random() * 8) - 4; // -4% 到 +4%
});

const playerSatisfaction = computed(() => {
  return Math.min(
    100,
    Math.max(0, props.businessData?.playerSatisfaction || 0),
  );
});

const satisfactionChange = computed(() => {
  return Math.floor(Math.random() * 6) - 3; // -3% 到 +3%
});

const gameRating = computed(() => {
  return Math.min(10, Math.max(0, props.businessData?.gameRating || 0));
});

const ratingChange = computed(() => {
  return (Math.random() * 0.8 - 0.4).toFixed(1); // -0.4 到 +0.4
});

const competitionIndex = computed(() => {
  return Math.min(100, Math.max(0, props.businessData?.competitionIndex || 0));
});

const competitionChange = computed(() => {
  return Math.floor(Math.random() * 12) - 6; // -6% 到 +6%
});

const projectProgress = computed(() => {
  return Math.min(100, Math.max(0, props.businessData?.projectProgress || 0));
});

const progressChange = computed(() => {
  return Math.floor(Math.random() * 5); // 0% 到 +5%
});

// 趋势数据
const activeUsersTrend = computed(() => {
  return '0,25 10,20 20,22 30,18 40,20 50,15 60,18 70,22 80,20 90,25 100,20';
});

const marketShareTrend = computed(() => {
  return '0,30 10,35 20,32 30,38 40,35 50,40 60,38 70,42 80,40 90,45 100,42';
});

const satisfactionTrend = computed(() => {
  return '0,70 10,72 20,68 30,75 40,72 50,78 60,75 70,80 80,78 90,82 100,80';
});

const ratingTrend = computed(() => {
  return '0,7.5 10,7.8 20,7.6 30,8.0 40,7.8 50,8.2 60,8.0 70,8.4 80,8.2 90,8.6 100,8.4';
});

const competitionTrend = computed(() => {
  return '0,40 10,45 20,42 30,50 40,48 50,55 60,52 70,60 80,58 90,65 100,62';
});

const progressTrend = computed(() => {
  return '0,20 10,22 20,25 30,28 40,30 50,35 60,38 70,42 80,45 90,48 100,50';
});

// 方法
const nextDay = () => {
  emit('next-day');
};

const formatDate = (date: any) => {
  if (!date) return '加载中...';
  return `${date.year}年${date.month}月${date.day}日`;
};

const formatTime = (hour: number, minute: number) => {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const getPhaseName = (phase: string) => {
  const phaseNames: Record<string, string> = {
    early: '早期',
    morning: '上午',
    afternoon: '下午',
    evening: '傍晚',
    night: '夜晚',
  };
  return phaseNames[phase] || '未知';
};

// 动画效果
const animateValue = (
  target: number,
  setter: (val: number) => void,
  duration = 1000,
) => {
  const start = performance.now();
  const initialValue = 0;

  const update = (timestamp: number) => {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);

    // 使用缓动函数
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = initialValue + (target - initialValue) * easeProgress;

    setter(currentValue);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

// 组件挂载后初始化动画
onMounted(() => {
  animateValue(props.businessData?.activeUsers || 0, (val) => {
    animatedActiveUsers.value = Math.floor(val);
  });

  // 初始化时间动画
  if (props.gameState?.currentDate) {
    animatedHour.value = props.gameState.currentDate.hour;
    animatedMinute.value = props.gameState.currentDate.minute;
  }
});

// 组件卸载清理
onUnmounted(() => {
  // 清理动画
});
</script>

<style lang="scss" scoped>
.top-core-data {
  background: tokens.$bg-dark;
  border-bottom: 2px solid tokens.$border-medium;
  padding: tokens.$spacing-lg;
  box-shadow: 0 2px 10px rgb(0 0 0 / 15%);
}

.top-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: tokens.$spacing-lg;
  padding-bottom: tokens.$spacing-lg;
  border-bottom: 1px solid tokens.$border-medium;
}

.bottom-section {
  .core-metrics-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: tokens.$spacing-lg;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
