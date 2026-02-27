<template>
  <div class="top-core-data" aria-labelledby="core-data-header">
    <h2 id="core-data-header" class="sr-only">核心数据</h2>

    <!-- 上方：策划信息和时间系统 -->
    <div class="top-section">
      <!-- 策划信息 -->
      <div class="planner-info">
        <div class="planner-level">
          <span class="label">策划等级:</span>
          <span class="value">{{ gameState.plannerLevel }}</span>
          <span class="level-badge">🎓</span>
        </div>
        <div class="planner-funds">
          <span class="label">策划资金:</span>
          <span class="value">¥{{ gameState.plannerFunds }}</span>
          <span class="funds-badge">💰</span>
        </div>
      </div>

      <!-- 顶部时间系统 -->
      <div class="time-system">
        <div class="calendar-clock">
          <div class="calendar">
            <div class="calendar-date">
              {{ formatDate(gameState.currentDate) }}
            </div>
            <div class="calendar-time">
              <span>{{
                formatTime(Math.floor(animatedHour), Math.floor(animatedMinute))
              }}</span>
            </div>
            <div class="calendar-phase">
              {{ getPhaseName(gameState.currentPhase) }}
            </div>
          </div>

          <!-- 快捷操作按钮 -->
          <div class="quick-actions">
            <button
              class="next-day-btn"
              :disabled="gameState.isGameOver"
              aria-label="进入下一�?
              :aria-disabled="gameState.isGameOver"
              @click="nextDay"
            >
              <span class="btn-icon" aria-hidden="true">▶️</span>
              <span class="btn-text">下一�?/span>
              <span class="btn-glow" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 下方：核心指标总览 -->
    <div class="bottom-section">
      <!-- 核心指标总览 -->
      <div class="core-metrics-overview">
        <!-- 日活用户 -->
        <div class="metric-card" aria-label="日活用户: {{ businessData.dau }}">
          <div class="metric-header">
            <span class="metric-icon">👥</span>
            <span class="metric-name">日活用户</span>
          </div>
          <div class="metric-value">
            <span class="value">{{ animatedActiveUsers }}</span>
            <span
              class="change"
              :class="{
                positive: activeUsersChange > 0,
                negative: activeUsersChange < 0,
              }"
            >
              {{ activeUsersChange > 0 ? '�? : '�?
              }}{{ Math.abs(activeUsersChange) }}%
            </span>
            <span class="factor-icon" v-if="activeUsersChange > 0">🔥</span>
            <span class="factor-icon" v-else-if="activeUsersChange < 0"
              >😢</span
            >
          </div>
          <div class="metric-trend" v-if="showTrends">
            <div class="mini-trend">
              <svg width="100" height="30" viewBox="0 0 100 30">
                <polyline
                  :points="activeUsersTrend"
                  fill="none"
                  stroke="var(--primary-gold)"
                  stroke-width="2"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- 市场份额 -->
        <div class="metric-card" aria-label="市场份额: {{ marketShare }}%">
          <div class="metric-header">
            <span class="metric-icon">📊</span>
            <span class="metric-name">市场份额</span>
          </div>
          <div class="metric-value">
            <span class="value">{{ marketShare }}%</span>
            <span
              class="change"
              :class="{
                positive: marketShareChange > 0,
                negative: marketShareChange < 0,
              }"
            >
              {{ marketShareChange > 0 ? '�? : '�?
              }}{{ Math.abs(marketShareChange) }}%
            </span>
            <span class="factor-icon" v-if="marketShareChange > 0">🚀</span>
            <span class="factor-icon" v-else-if="marketShareChange < 0"
              >📉</span
            >
          </div>
          <div class="metric-trend" v-if="showTrends">
            <div class="mini-trend">
              <svg width="100" height="30" viewBox="0 0 100 30">
                <polyline
                  :points="marketShareTrend"
                  fill="none"
                  stroke="var(--success-green)"
                  stroke-width="2"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- 玩家满意�?-->
        <div
          class="metric-card"
          aria-label="玩家满意�? {{ playerSatisfaction }}%"
        >
          <div class="metric-header">
            <span class="metric-icon">😊</span>
            <span class="metric-name">玩家满意�?/span>
          </div>
          <div class="metric-value">
            <span class="value">{{ playerSatisfaction }}%</span>
            <span
              class="change"
              :class="{
                positive: satisfactionChange > 0,
                negative: satisfactionChange < 0,
              }"
            >
              {{ satisfactionChange > 0 ? '�? : '�?
              }}{{ Math.abs(satisfactionChange) }}%
            </span>
            <span class="factor-icon" v-if="satisfactionChange > 0">❤️</span>
            <span class="factor-icon" v-else-if="satisfactionChange < 0"
              >💔</span
            >
          </div>
          <div class="metric-trend" v-if="showTrends">
            <div class="mini-trend">
              <svg width="100" height="30" viewBox="0 0 100 30">
                <polyline
                  :points="satisfactionTrend"
                  fill="none"
                  stroke="#8B5CF6"
                  stroke-width="2"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- 收入 -->
        <div
          class="metric-card"
          aria-label="收入: ¥{{ businessData.totalRevenue }}"
        >
          <div class="metric-header">
            <span class="metric-icon">💰</span>
            <span class="metric-name">收入</span>
          </div>
          <div class="metric-value">
            <span class="value">¥{{ animatedRevenue }}</span>
            <span
              class="change"
              :class="{
                positive: revenueChange > 0,
                negative: revenueChange < 0,
              }"
            >
              {{ revenueChange > 0 ? '�? : '�? }}{{ Math.abs(revenueChange) }}%
            </span>
            <span class="factor-icon" v-if="revenueChange > 0">💸</span>
            <span class="factor-icon" v-else-if="revenueChange < 0">💤</span>
          </div>
          <div class="metric-trend" v-if="showTrends">
            <div class="mini-trend">
              <svg width="100" height="30" viewBox="0 0 100 30">
                <polyline
                  :points="revenueTrend"
                  fill="none"
                  stroke="var(--danger-red)"
                  stroke-width="2"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- 留存�?-->
        <div class="metric-card" aria-label="留存�? {{ retentionRate }}%">
          <div class="metric-header">
            <span class="metric-icon">🔄</span>
            <span class="metric-name">留存�?/span>
          </div>
          <div class="metric-value">
            <span class="value">{{ retentionRate }}%</span>
            <span
              class="change"
              :class="{
                positive: retentionChange > 0,
                negative: retentionChange < 0,
              }"
            >
              {{ retentionChange > 0 ? '�? : '�?
              }}{{ Math.abs(retentionChange) }}%
            </span>
            <span class="factor-icon" v-if="retentionChange > 0">🔄</span>
            <span class="factor-icon" v-else-if="retentionChange < 0">📤</span>
          </div>
          <div class="metric-trend" v-if="showTrends">
            <div class="mini-trend">
              <svg width="100" height="30" viewBox="0 0 100 30">
                <polyline
                  :points="retentionTrend"
                  fill="none"
                  stroke="var(--primary-gold)"
                  stroke-width="2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 趋势图切换按�?-->
      <div class="trend-toggle">
        <button
          class="toggle-btn"
          @click="toggleTrends"
          :class="{ active: showTrends }"
        >
          <span>{{ showTrends ? '隐藏趋势' : '显示趋势' }}</span>
          <span class="toggle-icon">{{ showTrends ? '�? : '�? }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang=ts>
import { computed, onMounted, ref, watch } from 'vue';

// 定义 props
const props = defineProps({
  gameState: {
    type: Object,
    required: true,
  },
  businessData: {
    type: Object,
    required: true,
  },
  assessment: {
    type: Object,
    required: true,
  },

  isSimulating: {
    type: Boolean,
    default: false,
  },
  simulationProgress: {
    type: Number,
    default: 0,
  },
});

// 定义 emit
const emit = defineEmits(['next-day']);

// 用于动画效果的过渡�?const animatedDownloads = ref(0);
const animatedActiveUsers = ref(0);
const animatedRevenue = ref(0);
// 时间动画�?const animatedHour = ref(0);
const animatedMinute = ref(0);
// 控制趋势图显�?const showTrends = ref(false);

// 市场份额（模拟数据）
const marketShare = computed(() => {
  return Math.round((props.businessData.dau / 10000) * 100 * 10) / 10;
});

// 玩家满意度（模拟数据�?const playerSatisfaction = computed(() => {
  return Math.min(
    100,
    Math.round(
      ((props.businessData.positiveReviews || 0) /
        (props.businessData.dau || 1)) *
        100 *
        10
    ) / 10
  );
});

// 留存率（模拟数据�?const retentionRate = computed(() => {
  return Math.round(70 + Math.random() * 20 * 10) / 10;
});

// 变化率计�?const activeUsersChange = computed(() => {
  return calculateChange(
    props.businessData.dau,
    props.businessData.dailyLoginHistory
  );
});

const marketShareChange = computed(() => {
  return Math.round((Math.random() - 0.4) * 10 * 10) / 10;
});

const satisfactionChange = computed(() => {
  return Math.round((Math.random() - 0.45) * 5 * 10) / 10;
});

const revenueChange = computed(() => {
  return calculateChange(
    props.businessData.totalRevenue,
    props.businessData.revenueHistory
  );
});

const retentionChange = computed(() => {
  return Math.round((Math.random() - 0.5) * 2 * 10) / 10;
});

// 迷你趋势图数�?const activeUsersTrend = computed(() => {
  return generateTrendData(props.businessData.dailyLoginHistory, 50, 500);
});

const marketShareTrend = computed(() => {
  return generateTrendData(null, 10, 30);
});

const satisfactionTrend = computed(() => {
  return generateTrendData(null, 50, 100);
});

const revenueTrend = computed(() => {
  return generateTrendData(props.businessData.revenueHistory, 0, 1000);
});

const retentionTrend = computed(() => {
  return generateTrendData(null, 60, 90);
});

// 数字动画方法
const animateValue = (refObj, start, end, duration) => {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);

    // 处理小时�?3�?的特殊情�?    let value;
    if (refObj === animatedHour.value && end < start) {
      // 当小时从23跳到0时，计算�?4小时过渡
      const totalHours = 24 - start + end;
      value = Math.floor((progress * totalHours + start) % 24);
    } else {
      // 正常情况
      value = Math.floor(progress * (end - start) + start);
    }

    // 更新ref值，这里允许修改ref对象的value属性，因为ref是Vue的响应式对象
    // eslint-disable-next-line no-param-reassign
    refObj.value = value;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
};

// 计算变化�?const calculateChange = (currentValue, history) => {
  if (!history || history.length < 2) {
    return 0;
  }
  const previousValue = history[history.length - 2].value;
  if (previousValue === 0) {
    return 0;
  }
  const change = ((currentValue - previousValue) / previousValue) * 100;
  return Math.round(change * 10) / 10;
};

// 生成趋势图数�?const generateTrendData = (history, min, max) => {
  const points = [];
  const count = 7;

  if (history && history.length > 0) {
    const recentHistory = history.slice(-count);
    recentHistory.forEach((item, index) => {
      const x = (index / (count - 1)) * 100;
      const y = 30 - ((item.value - min) / (max - min)) * 30;
      points.push(`${x},${Math.max(5, Math.min(25, y))}`);
    });
  } else {
    // 生成随机趋势数据
    for (let i = 0; i < count; i++) {
      const x = (i / (count - 1)) * 100;
      const y =
        30 - ((min + Math.random() * (max - min) - min) / (max - min)) * 30;
      points.push(`${x},${Math.max(5, Math.min(25, y))}`);
    }
  }

  return points.join(' ');
};

// 格式化日�?const formatDate = (date) => {
  if (date.hour !== undefined) {
    return `${String(date.year).padStart(2, '0')}�?{String(date.month).padStart(2, '0')}�?{String(date.day).padStart(2, '0')}天`;
  }
  return `${String(date.year).padStart(2, '0')}�?{String(date.month).padStart(2, '0')}�?{String(date.day).padStart(2, '0')}天`;
};

// 格式化时�?const formatTime = (hour, minute) => {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

// 获取阶段名称
const getPhaseName = (phase) => {
  const phaseNames = {
    startup: '初创�?,
    growth: '成长�?,
    maturity: '成熟�?,
    decline: '衰退�?,
  };
  return phaseNames[phase] || phase;
};

// 进入下一�?const nextDay = () => {
  emit('next-day');
};

// 切换趋势图显�?const toggleTrends = () => {
  showTrends.value = !showTrends.value;
};

// 监听业务数据变化，触发动�?watch(
  () => props.businessData.downloads,
  (newVal, oldVal) => {
    animateValue(animatedDownloads, oldVal || 0, newVal, 1000);
  }
);

watch(
  () => props.businessData.dau,
  (newVal, oldVal) => {
    animateValue(animatedActiveUsers, oldVal || 0, newVal, 1000);
  }
);

watch(
  () => props.businessData.totalRevenue,
  (newVal, oldVal) => {
    animateValue(animatedRevenue, oldVal || 0, newVal, 1000);
  }
);

// 监听时间变化，触发平滑动�?watch(
  () => props.gameState.currentDate.hour,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      animateValue(animatedHour, oldVal || 0, newVal, 1000);
    }
  }
);

watch(
  () => props.gameState.currentDate.minute,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      animateValue(animatedMinute, oldVal || 0, newVal, 500);
    }
  }
);

// 初始化动画�?onMounted(() => {
  animatedDownloads.value = props.businessData.downloads;
  animatedActiveUsers.value = props.businessData.dau;
  animatedRevenue.value = props.businessData.totalRevenue;
  // 初始化时间动画�?  animatedHour.value = props.gameState.currentDate.hour || 0;
  animatedMinute.value = props.gameState.currentDate.minute || 0;
});
</script>

<style lang=scss scoped>
@import './TopCoreData.css';
</style>




