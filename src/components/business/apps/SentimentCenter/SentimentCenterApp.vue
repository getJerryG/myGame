<template>
  <div class="sentiment-center-app">
    <!-- 应用头部 -->
    <div class="app-header">
      <h2>舆情中心</h2>
    </div>

    <!-- 标签页导航-->
    <div class="app-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'realtime' }"
        @click="activeTab = 'realtime'"
      >
        实时舆情
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'reputation' }"
        @click="activeTab = 'reputation'"
      >
        口碑变化
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'satisfaction' }"
        @click="activeTab = 'satisfaction'"
      >
        玩家满意度
      </button>
    </div>

    <!-- 标签页内容-->
    <div class="app-content">
      <!-- 实时舆情 -->
      <div
        v-if="activeTab === 'realtime'"
        class="tab-content"
      >
        <div class="sentiment-stats">
          <div class="stat-card positive">
            <div class="stat-label">正面舆情</div>
            <div class="stat-value">{{ realtimeStats.positive }}</div>
            <div class="stat-change positive">+5%</div>
          </div>
          <div class="stat-card neutral">
            <div class="stat-label">中性舆情</div>
            <div class="stat-value">{{ realtimeStats.neutral }}</div>
            <div class="stat-change">+2%</div>
          </div>
          <div class="stat-card negative">
            <div class="stat-label">负面舆情</div>
            <div class="stat-value">{{ realtimeStats.negative }}</div>
            <div class="stat-change negative">-3%</div>
          </div>
        </div>

        <div class="comments-section">
          <h3>最新评论</h3>
          <div class="comments-list">
            <div
              v-for="comment in latestComments"
              :key="comment.id"
              class="comment-item"
              :class="comment.sentiment"
            >
              <div class="comment-header">
                <div class="comment-user">{{ comment.user }}</div>
                <div class="comment-time">{{ comment.time }}</div>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
              <div
                class="comment-sentiment"
                :class="comment.sentiment"
              >
                {{ getSentimentLabel(comment.sentiment) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 口碑变化 -->
      <div
        v-else-if="activeTab === 'reputation'"
        class="tab-content"
      >
        <div class="chart-section">
          <h3>口碑变化趋势</h3>
          <div class="chart-placeholder">
            <div class="chart-title">30天口碑变化</div>
            <div class="chart-bars">
              <div
                v-for="(value, index) in reputationTrend"
                :key="index"
                class="chart-bar"
                :style="{ height: `${value}%` }"
              ></div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-color"></span>
                <span class="legend-text">口碑指数</span>
              </div>
            </div>
          </div>
        </div>

        <div class="reputation-details">
          <h3>口碑详情</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-label">当前口碑</div>
              <div class="detail-value">{{ currentReputation }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">日变化</div>
              <div class="detail-value positive">+2</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">周变化</div>
              <div class="detail-value positive">+8</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">月变化</div>
              <div class="detail-value positive">+15</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 玩家满意度 -->
      <div
        v-else-if="activeTab === 'satisfaction'"
        class="tab-content"
      >
        <div class="satisfaction-score">
          <h3>玩家满意度</h3>
          <div class="score-circle">
            <div class="score-number">{{ satisfactionScore }}</div>
            <div class="score-label">满意度</div>
          </div>
        </div>

        <div class="satisfaction-details">
          <h3>满意度分布</h3>
          <div class="satisfaction-grid">
            <div class="satisfaction-item">
              <div class="satisfaction-label">非常满意</div>
              <div class="satisfaction-bar">
                <div
                  class="satisfaction-fill"
                  :style="{ width: `${satisfactionDistribution.verySatisfied}%` }"
                ></div>
                <div class="satisfaction-percentage">{{ satisfactionDistribution.verySatisfied }}%</div>
              </div>
            </div>
            <div class="satisfaction-item">
              <div class="satisfaction-label">满意</div>
              <div class="satisfaction-bar">
                <div
                  class="satisfaction-fill"
                  :style="{ width: `${satisfactionDistribution.satisfied}%` }"
                ></div>
                <div class="satisfaction-percentage">{{ satisfactionDistribution.satisfied }}%</div>
              </div>
            </div>
            <div class="satisfaction-item">
              <div class="satisfaction-label">一般</div>
              <div class="satisfaction-bar">
                <div
                  class="satisfaction-fill"
                  :style="{ width: `${satisfactionDistribution.neutral}%` }"
                ></div>
                <div class="satisfaction-percentage">{{ satisfactionDistribution.neutral }}%</div>
              </div>
            </div>
            <div class="satisfaction-item">
              <div class="satisfaction-label">不满意</div>
              <div class="satisfaction-bar">
                <div
                  class="satisfaction-fill"
                  :style="{ width: `${satisfactionDistribution.dissatisfied}%` }"
                ></div>
                <div class="satisfaction-percentage">{{ satisfactionDistribution.dissatisfied }}%</div>
              </div>
            </div>
            <div class="satisfaction-item">
              <div class="satisfaction-label">非常不满意</div>
              <div class="satisfaction-bar">
                <div
                  class="satisfaction-fill"
                  :style="{ width: `${satisfactionDistribution.veryDissatisfied}%` }"
                ></div>
                <div class="satisfaction-percentage">{{ satisfactionDistribution.veryDissatisfied }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 导出舆情报告按钮 -->
      <div class="action-section">
        <button
          class="export-btn"
          @click="exportReport"
        >
          导出舆情报告
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 导入类型
import type { App } from '../../../types/app';
import type { GameData } from '../../../types/game';
import type { Modal } from '../../../types/modal';

// Props定义
defineProps<{
  app: App;
  gameData?: GameData;
  modal?: Modal;
}>();

// 活跃标签页
const activeTab = ref('realtime');

// 舆情状态标签映射
const getSentimentLabel = (sentiment: string): string => {
  const sentimentMap = {
    positive: '正面',
    neutral: '中性',
    negative: '负面',
  };
  return sentimentMap[sentiment as keyof typeof sentimentMap] || '未知';
};

// 实时舆情统计
const realtimeStats = ref({
  positive: 75,
  neutral: 15,
  negative: 10,
});

// 最新评论
const latestComments = ref([
  {
    id: 1,
    user: '玩家123',
    content: '新英雄李白太好玩了！技能设计得很有创意，手感也很棒',
    sentiment: 'positive',
    time: '今天 10:30',
  },
  {
    id: 2,
    user: '游戏爱好者',
    content: '这个版本的平衡做得还不错，各个英雄的出场率都比较均衡',
    sentiment: 'neutral',
    time: '今天 09:15',
  },
  {
    id: 3,
    user: '资深玩家',
    content: '最近服务器有点不稳定，经常卡顿，希望能尽快修复',
    sentiment: 'negative',
    time: '昨天 22:45',
  },
  {
    id: 4,
    user: '新手玩家',
    content: '游戏的新手引导很友好，让我很快就上手了',
    sentiment: 'positive',
    time: '昨天 18:20',
  },
  {
    id: 5,
    user: '竞技玩家',
    content: '排位赛匹配机制还有待优化，经常遇到队友差距很大的情况',
    sentiment: 'negative',
    time: '昨天 16:50',
  },
]);

// 口碑趋势数据
const reputationTrend = ref([
  65, 68, 70, 72, 75, 73, 76, 78, 80, 79, 82, 85, 83, 86, 88, 90, 89, 92, 94, 93, 95, 97, 96, 98, 100, 99, 102, 105,
  103, 106,
]);

// 当前口碑
const currentReputation = ref(106);

// 玩家满意度
const satisfactionScore = ref(85);

// 满意度分布
const satisfactionDistribution = ref({
  verySatisfied: 45,
  satisfied: 30,
  neutral: 15,
  dissatisfied: 8,
  veryDissatisfied: 2,
});

// 导出舆情报告
const exportReport = () => {
  console.log('导出舆情报告');
  alert('舆情报告导出成功');
};
</script>

<style lang="scss" scoped>

.sentiment-center-app {
  @include utils.flex-col(0, stretch);
  height: 100%;
  background-color: tokens.$bg-secondary;
  color: tokens.$text-primary;
}

.app-header {
  padding: tokens.$spacing-md tokens.$spacing-lg;
  background-color: tokens.$bg-light;
  border-bottom: 1px solid tokens.$border-light;

  h2 {
    margin: 0;
    font-size: tokens.$font-size-xl;
    color: tokens.$text-primary;
  }
}

.app-tabs {
  @include utils.tabs-container;
}

.tab-btn {
  @include utils.tab-item;

  &.active {
    background-color: rgb(59 130 246 / 20%);
    box-shadow: tokens.$shadow-blue;
  }
}

.app-content {
  flex: 1;
  padding: tokens.$spacing-lg;
  overflow-y: auto;
  @include utils.custom-scrollbar;
}

// 实时舆情样式
.sentiment-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: tokens.$spacing-md;
  margin-bottom: tokens.$spacing-lg;
}

.stat-card {
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-md;
  @include utils.flex-col(tokens.$space-2, center);

  &.positive {
    background-color: rgb(16 185 129 / 20%);
    border: 1px solid rgb(16 185 129 / 30%);
  }

  &.neutral {
    background-color: rgb(251 191 36 / 20%);
    border: 1px solid rgb(251 191 36 / 30%);
  }

  &.negative {
    background-color: rgb(239 68 68 / 20%);
    border: 1px solid rgb(239 68 68 / 30%);
  }

  .stat-label {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
  }

  .stat-value {
    font-size: tokens.$font-size-2xl;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }

  .stat-change {
    font-size: tokens.$font-size-xs;
    font-weight: tokens.$font-weight-bold;

    &.positive {
      color: tokens.$success;
    }

    &.negative {
      color: tokens.$error;
    }
  }
}

.comments-section {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;

  h3 {
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-base;
    color: tokens.$primary-blue;
  }
}

.comments-list {
  @include utils.flex-col(tokens.$spacing-md);
}

.comment-item {
  background-color: tokens.$bg-dark;
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-sm;
  border-left: 3px solid transparent;

  &.positive {
    border-left-color: tokens.$success;
  }

  &.neutral {
    border-left-color: tokens.$primary-gold;
  }

  &.negative {
    border-left-color: tokens.$error;
  }
}

.comment-header {
  @include utils.flex-between;
  margin-bottom: tokens.$space-2;

  .comment-user {
    font-size: tokens.$font-size-sm;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }

  .comment-time {
    font-size: tokens.$font-size-xs;
    color: tokens.$text-secondary;
  }
}

.comment-content {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-primary;
  margin-bottom: tokens.$space-2;
  line-height: tokens.$line-height-normal;
}

.comment-sentiment {
  display: inline-block;
  padding: tokens.$space-0 tokens.$space-1;
  border-radius: tokens.$radius-sm;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-bold;

  &.positive {
    background-color: rgb(16 185 129 / 20%);
    color: tokens.$success;
  }

  &.neutral {
    background-color: rgb(251 191 36 / 20%);
    color: tokens.$primary-gold;
  }

  &.negative {
    background-color: rgb(239 68 68 / 20%);
    color: tokens.$error;
  }
}

// 口碑变化样式
.chart-section {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;
  margin-bottom: tokens.$spacing-lg;

  h3 {
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-base;
    color: tokens.$primary-blue;
  }
}

.chart-placeholder {
  background-color: tokens.$bg-dark;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-lg;
  @include utils.flex-col(tokens.$spacing-lg, center);

  .chart-title {
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }

  .chart-bars {
    @include utils.flex-row(tokens.$spacing-md, flex-end, center);
    height: 200px;
    width: 100%;
  }

  .chart-bar {
    flex: 1;
    background-color: tokens.$primary-blue;
    border-radius: tokens.$radius-sm tokens.$radius-sm 0 0;
    transition: height tokens.$transition-normal;

    &:hover {
      background-color: tokens.$primary-dark;
    }
  }

  .chart-legend {
    @include utils.flex-row(tokens.$spacing-md);

    .legend-item {
      @include utils.flex-row(tokens.$space-2, center);

      .legend-color {
        width: 12px;
        height: 12px;
        background-color: tokens.$primary-blue;
        border-radius: tokens.$radius-sm;
      }

      .legend-text {
        font-size: tokens.$font-size-sm;
        color: tokens.$text-secondary;
      }
    }
  }
}

.reputation-details {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;

  h3 {
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-base;
    color: tokens.$primary-blue;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: tokens.$spacing-md;
}

.detail-item {
  @include utils.flex-col(tokens.$space-2, center);
  padding: tokens.$spacing-md;
  background-color: tokens.$bg-dark;
  border-radius: tokens.$radius-sm;

  .detail-label {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
  }

  .detail-value {
    font-size: tokens.$font-size-xl;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$primary-blue;

    &.positive {
      color: tokens.$success;
    }
  }
}

// 玩家满意度样式
.satisfaction-score {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-lg;
  @include utils.flex-col(tokens.$spacing-md, center);
  margin-bottom: tokens.$spacing-lg;

  h3 {
    margin: 0;
    font-size: tokens.$font-size-base;
    color: tokens.$primary-blue;
  }
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: rgb(59 130 246 / 20%);
  border: 10px solid rgb(59 130 246 / 30%);
  @include utils.flex-col(tokens.$space-2, center, center);

  .score-number {
    font-size: tokens.$font-size-3xl;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$primary-blue;
  }

  .score-label {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
  }
}

.satisfaction-details {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;

  h3 {
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-base;
    color: tokens.$primary-blue;
  }
}

.satisfaction-grid {
  @include utils.flex-col(tokens.$spacing-md);
}

.satisfaction-item {
  @include utils.flex-col(tokens.$space-2);

  .satisfaction-label {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
  }
}

.satisfaction-bar {
  @include utils.flex-row(tokens.$spacing-md, center);
  height: 20px;
  background-color: tokens.$bg-dark;
  border-radius: tokens.$radius-full;
  overflow: hidden;
}

.satisfaction-fill {
  height: 100%;
  background-color: tokens.$primary-blue;
  border-radius: tokens.$radius-full;
  transition: width tokens.$transition-normal;
}

.satisfaction-percentage {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  min-width: 40px;
}

// 导出报告按钮样式
.action-section {
  @include utils.flex-center;
  padding: tokens.$spacing-lg;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  margin-top: tokens.$spacing-lg;
}

.export-btn {
  padding: tokens.$space-3 tokens.$space-8;
  background-color: tokens.$primary-blue;
  border: none;
  border-radius: tokens.$radius-md;
  color: white;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover {
    background-color: tokens.$primary-dark;
    transform: translateY(-1px);
  }
}
</style>
