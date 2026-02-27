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
            <div class="stat-change">+5%</div>
          </div>
          <div class="stat-card neutral">
            <div class="stat-label">中性舆情</div>
            <div class="stat-value">{{ realtimeStats.neutral }}</div>
            <div class="stat-change">+2%</div>
          </div>
          <div class="stat-card negative">
            <div class="stat-label">负面舆情</div>
            <div class="stat-value">{{ realtimeStats.negative }}</div>
            <div class="stat-change">-3%</div>
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

      <!-- 玩家满意�?-->
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
  // 这里应该调用store来生成和导出报告
  console.log('导出舆情报告');
  alert('舆情报告导出成功');
};
</script>

<style lang="scss" scoped>
.sentiment-center-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: rgb(26 26 46 / 50%);
  color: var(--text-primary);
}

// 实时舆情样式
.sentiment-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &.positive {
    background-color: rgb(46 213 115 / 20%);
    border: 1px solid rgb(46 213 115 / 30%);
  }

  &.neutral {
    background-color: rgb(255 215 0 / 20%);
    border: 1px solid rgb(255 215 0 / 30%);
  }

  &.negative {
    background-color: rgb(255 71 87 / 20%);
    border: 1px solid rgb(255 71 87 / 30%);
  }

  .stat-label {
    font-size: 14px;
    color: #b0b0b0;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #fff;
  }

  .stat-change {
    font-size: 12px;
    font-weight: bold;

    &.positive {
      color: #2ed573;
    }

    &.negative {
      color: #ff4757;
    }
  }
}

.comments-section {
  background-color: rgb(0 0 0 / 10%);
  border-radius: 8px;
  padding: 16px;

  h3 {
    margin: 0 0 16px;
    font-size: 16px;
    color: #4a9eff;
  }
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-item {
  background-color: rgb(0 0 0 / 10%);
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid transparent;

  &.positive {
    border-left-color: #2ed573;
  }

  &.neutral {
    border-left-color: #ffd700;
  }

  &.negative {
    border-left-color: #ff4757;
  }
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  .comment-user {
    font-size: 14px;
    font-weight: bold;
    color: #fff;
  }

  .comment-time {
    font-size: 12px;
    color: #b0b0b0;
  }
}

.comment-content {
  font-size: 14px;
  color: #fff;
  margin-bottom: 8px;
  line-height: 1.4;
}

.comment-sentiment {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;

  &.positive {
    background-color: rgb(46 213 115 / 20%);
    color: #2ed573;
  }

  &.neutral {
    background-color: rgb(255 215 0 / 20%);
    color: #ffd700;
  }

  &.negative {
    background-color: rgb(255 71 87 / 20%);
    color: #ff4757;
  }
}

// 口碑变化样式
.chart-section {
  background-color: rgb(0 0 0 / 10%);
  border-radius: 8px;
  padding: 16px;

  h3 {
    margin: 0 0 16px;
    font-size: 16px;
    color: #4a9eff;
  }
}

.chart-placeholder {
  background-color: rgb(0 0 0 / 10%);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  .chart-title {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }

  .chart-bars {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    height: 200px;
    width: 100%;
  }

  .chart-bar {
    flex: 1;
    background-color: #4a9eff;
    border-radius: 4px 4px 0 0;
    transition: height 0.3s ease;

    &:hover {
      background-color: #357abd;
    }
  }

  .chart-legend {
    display: flex;
    gap: 12px;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .legend-color {
        width: 12px;
        height: 12px;
        background-color: #4a9eff;
        border-radius: 2px;
      }

      .legend-text {
        font-size: 14px;
        color: #b0b0b0;
      }
    }
  }
}

.reputation-details {
  background-color: rgb(0 0 0 / 10%);
  border-radius: 8px;
  padding: 16px;

  h3 {
    margin: 0 0 16px;
    font-size: 16px;
    color: #4a9eff;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: rgb(0 0 0 / 10%);
  border-radius: 6px;

  .detail-label {
    font-size: 14px;
    color: #b0b0b0;
  }

  .detail-value {
    font-size: 20px;
    font-weight: bold;
    color: #4a9eff;
  }
}

// 玩家满意度样式
.satisfaction-score {
  background-color: rgb(0 0 0 / 10%);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  h3 {
    margin: 0;
    font-size: 16px;
    color: #4a9eff;
  }
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: rgb(74 158 255 / 20%);
  border: 10px solid rgb(74 158 255 / 30%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .score-number {
    font-size: 32px;
    font-weight: bold;
    color: #4a9eff;
  }

  .score-label {
    font-size: 14px;
    color: #b0b0b0;
  }
}

.satisfaction-details {
  background-color: rgb(0 0 0 / 10%);
  border-radius: 8px;
  padding: 16px;

  h3 {
    margin: 0 0 16px;
    font-size: 16px;
    color: #4a9eff;
  }
}

.satisfaction-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.satisfaction-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .satisfaction-label {
    font-size: 14px;
    color: #b0b0b0;
  }
}

.satisfaction-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 20px;
  background-color: rgb(0 0 0 / 20%);
  border-radius: 10px;
  overflow: hidden;
}

.satisfaction-fill {
  height: 100%;
  background-color: #4a9eff;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.satisfaction-percentage {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  min-width: 40px;
}

// 导出报告按钮样式
.action-section {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: rgb(0 0 0 / 10%);
  border-radius: 8px;
}

.export-btn {
  padding: 12px 32px;
  background-color: #4a9eff;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #357abd;
    transform: translateY(-1px);
  }
}
</style>
