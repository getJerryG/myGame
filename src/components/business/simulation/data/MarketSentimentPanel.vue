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
            stroke="tokens.$warning"
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
      <h3 class="panel-title">最新反馈</h3>
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
        待处理决策
        <span v-if="pendingDecisions.length > 0" class="badge">{{
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
          <span class="empty-icon">✓</span>
          <span class="empty-text">暂无待处理决策</span>
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

      // 最近反馈
      recentFeedback: [
        {
          id: 1,
          text: '新皮肤特效太酷了！',
          source: '玩家评论',
          type: 'positive',
          icon: '😊',
        },
        {
          id: 2,
          text: '英雄XX削弱过度，影响游戏体验',
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
          text: '服务器有点卡，希望优化',
          source: '客服反馈',
          type: 'neutral',
          icon: '😐',
        },
        {
          id: 5,
          text: '新英雄设计很有创意',
          source: '媒体评价',
          type: 'positive',
          icon: '⭐',
        },
      ],

      // 待处理决策
      pendingDecisions: [
        {
          id: 1,
          title: '设置本周登录奖励',
          due: '今天',
          icon: '🎁',
        },
        {
          id: 2,
          title: '调整英雄平衡性',
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
    // 情绪状�?
    sentimentStatus(): string {
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
    // 模拟情绪值变�?
    this.simulateSentimentChange();
  },
  methods: {
    // 模拟情绪值变�?
    simulateSentimentChange(): void {
      setInterval(() => {
        const change = (Math.random() - 0.5) * 5;
        this.sentimentValue = Math.max(
          0,
          Math.min(100, this.sentimentValue + change),
        );
      }, 5000);
    },
  },
};
</script>

<style lang="scss" scoped>
.market-sentiment-panel {
  @include utils.panel-base;

  padding: tokens.$spacing-lg;

  @include utils.flex-col(tokens.$spacing-xl, stretch, flex-start);

  .panel-title {
    @include utils.panel-title;

    display: flex;
    align-items: center;
    gap: tokens.$spacing-sm;
  }

  .badge {
    @include utils.badge-notification;
  }

  /* 市场情绪仪表�? */
  .sentiment-dashboard {
    @include utils.flex-col(tokens.$spacing-md, stretch, flex-start);

    .dashboard-container {
      @include utils.flex-row(tokens.$spacing-xl, center, flex-start);

      @include utils.mobile {
        flex-direction: column;
        text-align: center;
        gap: tokens.$spacing-lg;
      }
    }

    .gauge {
      flex-shrink: 0;

      .gauge-needle {
        transform-origin: 100px 120px;
        transition: all 1s ease;
      }
    }

    .sentiment-info {
      @include utils.flex-col(tokens.$spacing-xs, flex-start, flex-start);

      @include utils.mobile {
        align-items: center;
      }

      .sentiment-value {
        font-size: tokens.$font-size-3xl;
        font-weight: tokens.$font-weight-bold;
        color: tokens.$primary-gold;
      }

      .sentiment-status {
        font-size: tokens.$font-size-base;
        font-weight: tokens.$font-weight-medium;

        &.status-positive {
          color: tokens.$success-green;
        }

        &.status-warning {
          color: tokens.$warning;
        }

        &.status-danger {
          color: tokens.$danger-red;
        }
      }
    }
  }

  /* 最新反馈摘�? */
  .feedback-summary {
    @include utils.flex-col(tokens.$spacing-md, stretch, flex-start);

    .feedback-scroll {
      max-height: 200px;
      overflow-y: auto;

      @include utils.flex-col(tokens.$spacing-sm, stretch, flex-start);

      padding-right: tokens.$spacing-sm;

      @include utils.custom-scrollbar;
    }

    .feedback-item {
      @include utils.flex-row(tokens.$spacing-md, flex-start, flex-start);

      padding: tokens.$spacing-sm;
      background-color: tokens.$bg-light;
      border-radius: tokens.$radius-md;
      transition: all tokens.$transition-fast;

      &:hover {
        background-color: tokens.$bg-lighter;
        transform: translateX(5px);
      }

      &.positive {
        border-left: 4px solid tokens.$success-green;
      }

      &.negative {
        border-left: 4px solid tokens.$danger-red;
      }

      &.neutral {
        border-left: 4px solid tokens.$warning;
      }

      .feedback-icon {
        font-size: tokens.$font-size-lg;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .feedback-content {
        flex: 1;

        @include utils.flex-col(tokens.$spacing-xs, stretch, flex-start);

        .feedback-text {
          font-size: tokens.$font-size-sm;
          color: tokens.$text-primary;
          line-height: 1.4;
        }

        .feedback-source {
          font-size: tokens.$font-size-xs;
          color: tokens.$text-muted;
        }
      }
    }
  }

  /* 待处理决策提�? */
  .pending-decisions {
    @include utils.flex-col(tokens.$spacing-md, stretch, flex-start);

    .decisions-list {
      @include utils.flex-col(tokens.$spacing-sm, stretch, flex-start);
    }

    .decision-item {
      @include utils.flex-row(tokens.$spacing-md, center, flex-start);

      padding: tokens.$spacing-sm;
      background-color: tokens.$bg-light;
      border-radius: tokens.$radius-md;
      transition: all tokens.$transition-fast;

      &:hover {
        background-color: tokens.$bg-lighter;
        transform: translateX(5px);
      }

      .decision-icon {
        font-size: tokens.$font-size-lg;
        flex-shrink: 0;
      }

      .decision-content {
        flex: 1;

        @include utils.flex-col(tokens.$spacing-xs, stretch, flex-start);

        .decision-title {
          font-size: tokens.$font-size-sm;
          color: tokens.$text-primary;
          font-weight: tokens.$font-weight-medium;
        }

        .decision-due {
          font-size: tokens.$font-size-xs;
          color: tokens.$text-muted;
        }
      }
    }

    .empty-state {
      @include utils.flex-center;

      gap: tokens.$spacing-md;
      padding: tokens.$spacing-xl tokens.$spacing-lg;
      background-color: tokens.$bg-light;
      border-radius: tokens.$radius-md;
      color: tokens.$text-muted;
      font-size: tokens.$font-size-sm;

      .empty-icon {
        font-size: tokens.$font-size-lg;
      }
    }
  }
}

/* 横屏手机适配 */
@include utils.landscape-mobile {
  .market-sentiment-panel {
    padding: tokens.$spacing-sm;
    gap: tokens.$spacing-md;

    .panel-title {
      font-size: tokens.$font-size-base;
    }

    .dashboard-container {
      gap: tokens.$spacing-lg;
    }

    .gauge {
      width: 150px;
      height: 120px;
    }

    .sentiment-value {
      font-size: tokens.$font-size-2xl;
    }

    .feedback-scroll {
      max-height: 120px;
    }

    .feedback-item,
    .decision-item {
      padding: tokens.$spacing-xs;
    }
  }
}
</style>
