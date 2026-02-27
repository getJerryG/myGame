<template>
  <div class="market-sentiment-panel">
    <!-- 市场情绪仪表�?-->
    <div class="sentiment-dashboard">
      <h3 class="panel-title">市场情绪</h3>
      <div class="dashboard-container">
        <svg class="gauge" width="200" height="150" viewBox="0 0 200 150">
          <!-- 背景弧线 -->
          <path
            class="gauge-bg"
            d="M 30 120 A 70 70 0 0 1 170 120"
            stroke="rgba(255, 255, 255, 0.1)"
            stroke-width="20"
            fill="none"
          />

          <!-- 红色区域 (危机) -->
          <path
            class="gauge-danger"
            d="M 30 120 A 70 70 0 0 1 80 110"
            stroke="var(--danger-red)"
            stroke-width="20"
            fill="none"
            stroke-linecap="round"
          />

          <!-- 黄色区域 (中立) -->
          <path
            class="gauge-warning"
            d="M 80 110 A 70 70 0 0 1 120 110"
            stroke="#F59E0B"
            stroke-width="20"
            fill="none"
            stroke-linecap="round"
          />

          <!-- 绿色区域 (积极) -->
          <path
            class="gauge-success"
            d="M 120 110 A 70 70 0 0 1 170 120"
            stroke="var(--success-green)"
            stroke-width="20"
            fill="none"
            stroke-linecap="round"
          />

          <!-- 指针 -->
          <line
            class="gauge-needle"
            x1="100"
            y1="120"
            :x2="needleX"
            :y2="needleY"
            stroke="var(--primary-gold)"
            stroke-width="4"
            stroke-linecap="round"
          />

          <!-- 中心�?-->
          <circle
            class="gauge-center"
            cx="100"
            cy="120"
            r="8"
            fill="var(--primary-gold)"
          />
        </svg>

        <div class="sentiment-info">
          <div class="sentiment-value">{{ sentimentValue }}%</div>
          <div class="sentiment-status" :class="sentimentClass">
            {{ sentimentStatus }}
          </div>
        </div>
      </div>
    </div>

    <!-- 最新反馈摘�?-->
    <div class="feedback-summary">
      <h3 class="panel-title">最新反�?/h3>
      <div class="feedback-scroll">
        <div
          v-for="(feedback, index) in recentFeedback"
          :key="index"
          class="feedback-item"
          :class="feedback.type"
        >
          <div class="feedback-icon">{{ feedback.icon }}</div>
          <div class="feedback-content">
            <div class="feedback-text">{{ feedback.text }}</div>
            <div class="feedback-source">{{ feedback.source }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 待处理决策提�?-->
    <div class="pending-decisions">
      <h3 class="panel-title">
        待处理决�?        <span v-if="pendingDecisions.length > 0" class="badge">{{
          pendingDecisions.length
        }}</span>
      </h3>
      <div class="decisions-list">
        <div
          v-for="(decision, index) in pendingDecisions"
          :key="index"
          class="decision-item"
        >
          <div class="decision-icon">{{ decision.icon }}</div>
          <div class="decision-content">
            <div class="decision-title">{{ decision.title }}</div>
            <div class="decision-due">{{ decision.due }}</div>
          </div>
        </div>
        <div v-if="pendingDecisions.length === 0" class="empty-state">
          <span class="empty-icon">�?/span>
          <span class="empty-text">暂无待处理决�?/span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MarketSentimentPanel',
  data() {
    return {
      // 市场情绪�?(0-100)
      sentimentValue: 75,

      // 最近反�?      recentFeedback: [
        {
          id: 1,
          text: '新皮肤特效太酷了�?,
          source: '玩家评论',
          type: 'positive',
          icon: '😊',
        },
        {
          id: 2,
          text: '英雄XX削弱过度，影响游戏体�?,
          source: '论坛反馈',
          type: 'negative',
          icon: '😞',
        },
        {
          id: 3,
          text: '活动奖励很丰厚，值得参与',
          source: '社交媒体',
          type: 'positive',
          icon: '👍',
        },
        {
          id: 4,
          text: '服务器有点卡，希望优�?,
          source: '客服反馈',
          type: 'neutral',
          icon: '😐',
        },
        {
          id: 5,
          text: '新英雄设计很有创�?,
          source: '媒体评价',
          type: 'positive',
          icon: '�?,
        },
      ],

      // 待处理决�?      pendingDecisions: [
        {
          id: 1,
          title: '设置本周登录奖励',
          due: '今天',
          icon: '🎁',
        },
        {
          id: 2,
          title: '调整英雄平衡�?,
          due: '明天',
          icon: '⚖️',
        },
        {
          id: 3,
          title: '策划下周活动',
          due: '2天内',
          icon: '📅',
        },
      ],
    };
  },
  computed: {
    // 情绪状�?    sentimentStatus(): string {
      if (this.sentimentValue >= 70) {
        return '积极';
      } else if (this.sentimentValue >= 40) {
        return '中立';
      } else {
        return '危机';
      }
    },

    // 情绪状态类
    sentimentClass(): string {
      if (this.sentimentValue >= 70) {
        return 'status-positive';
      } else if (this.sentimentValue >= 40) {
        return 'status-warning';
      } else {
        return 'status-danger';
      }
    },

    // 指针位置计算
    needleX(): number {
      const angle = (this.sentimentValue / 100) * Math.PI;
      return 100 + 70 * Math.sin(angle);
    },

    needleY(): number {
      const angle = (this.sentimentValue / 100) * Math.PI;
      return 120 - 70 * Math.cos(angle);
    },
  },
  mounted(): void {
    // 模拟情绪值变�?    this.simulateSentimentChange();
  },
  methods: {
    // 模拟情绪值变�?    simulateSentimentChange(): void {
      setInterval(() => {
        const change = (Math.random() - 0.5) * 5;
        this.sentimentValue = Math.max(
          0,
          Math.min(100, this.sentimentValue + change)
        );
      }, 5000);
    },
  },
};
</script>

<style lang=scss scoped>
.market-sentiment-panel {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.panel-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  background-color: var(--danger-red);
  color: white;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* 市场情绪仪表�? */
.sentiment-dashboard {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.dashboard-container {
  display: flex;
  align-items: center;
  gap: 30px;
}

.gauge {
  flex-shrink: 0;
}

.gauge-needle {
  transform-origin: 100px 120px;
  transition: all 1s ease;
}

.sentiment-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sentiment-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--primary-gold);
}

.sentiment-status {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
}

.status-positive {
  color: var(--success-green);
}

.status-warning {
  color: #f59e0b;
}

.status-danger {
  color: var(--danger-red);
}

/* 最新反馈摘�? */
.feedback-summary {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.feedback-scroll {
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 10px;
}

.feedback-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.feedback-item:hover {
  background-color: rgb(255 255 255 / 10%);
  transform: translateX(5px);
}

.feedback-item.positive {
  border-left: 4px solid var(--success-green);
}

.feedback-item.negative {
  border-left: 4px solid var(--danger-red);
}

.feedback-item.neutral {
  border-left: 4px solid #f59e0b;
}

.feedback-icon {
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}

.feedback-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feedback-text {
  font-size: var(--text-sm);
  color: var(--text-primary);
  line-height: 1.4;
}

.feedback-source {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* 待处理决策提�? */
.pending-decisions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.decisions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.decision-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.decision-item:hover {
  background-color: rgb(255 255 255 / 10%);
  transform: translateX(5px);
}

.decision-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.decision-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.decision-title {
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: var(--font-medium);
}

.decision-due {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 30px 20px;
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.empty-icon {
  font-size: 18px;
}

/* 响应式设�? */
@media (width <= 768px) {
  .market-sentiment-panel {
    padding: 15px;
    gap: 20px;
  }

  .dashboard-container {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .feedback-scroll {
    max-height: 150px;
  }

  .feedback-item {
    padding: 10px;
  }

  .decision-item {
    padding: 10px;
  }
}

/* 横屏手机适配 */
@media (orientation: landscape) and (height <= 600px) {
  .market-sentiment-panel {
    padding: 10px;
    gap: 15px;
  }

  .panel-title {
    font-size: var(--text-base);
  }

  .dashboard-container {
    gap: 20px;
  }

  .gauge {
    width: 150px;
    height: 120px;
  }

  .sentiment-value {
    font-size: var(--text-2xl);
  }

  .feedback-scroll {
    max-height: 120px;
  }

  .feedback-item {
    padding: 8px;
  }

  .decision-item {
    padding: 8px;
  }
}
</style>




