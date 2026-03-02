<template>
  <div class="dynamic-events-container">
    <h2 class="page-title">动态事件系统</h2>

    <div class="events-grid">
      <!-- 当前事件 -->
      <div class="event-panel">
        <h3 class="panel-header-title">
          <span class="header-icon">⚠️</span> 当前事件
          <span class="event-count"
            >({{ simulationStore.dynamicEvents.currentEvents.length }}个)</span
          >
        </h3>

        <div
          v-if="simulationStore.dynamicEvents.currentEvents.length === 0"
          class="empty-events"
        >
          暂无当前事件
        </div>

        <div v-else class="events-list">
          <div
            v-for="event in simulationStore.dynamicEvents.currentEvents"
            :key="event.id"
            class="event-card"
            :class="[
              event.type === 'positive'
                ? 'positive'
                : event.type === 'negative'
                  ? 'negative'
                  : 'neutral',
            ]"
          >
            <div class="event-header">
              <div
                class="event-title"
                :class="{
                  'text-positive': event.type === 'positive',
                  'text-negative': event.type === 'negative',
                  'text-neutral': event.type === 'neutral',
                }"
              >
                {{ event.title }}
              </div>
              <div
                class="severity-badge"
                :class="{
                  low: event.severity === 'low',
                  medium: event.severity === 'medium',
                  high: event.severity === 'high',
                }"
              >
                {{
                  event.severity === "low"
                    ? "低"
                    : event.severity === "medium"
                      ? "中"
                      : "高"
                }}影响
              </div>
            </div>

            <div
              class="event-description"
              :class="{
                'text-positive': event.type === 'positive',
                'text-negative': event.type === 'negative',
                'text-neutral': event.type === 'neutral',
              }"
            >
              {{ event.description }}
            </div>

            <!-- 效果信息 -->
            <div class="effects-section">
              <div
                class="effects-label"
                :class="{
                  'text-positive': event.type === 'positive',
                  'text-negative': event.type === 'negative',
                  'text-neutral': event.type === 'neutral',
                }"
              >
                效果
              </div>
              <div class="effects-list">
                <div
                  v-for="(value, key) in event.effects"
                  :key="key"
                  class="effect-tag"
                  :class="{
                    positive: value > 0,
                    negative: value < 0,
                  }"
                >
                  {{ getEffectLabel(key) }}: {{ formatEffectValue(key, value) }}
                </div>
              </div>
            </div>

            <!-- 持续时间 -->
            <div class="duration-section">
              <div class="duration-label">持续时间</div>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :class="{
                    positive: event.type === 'positive',
                    negative: event.type === 'negative',
                    neutral: event.type === 'neutral',
                  }"
                  :style="{
                    width: `${(event.remainingDays / event.duration) * 100}%`,
                  }"
                ></div>
              </div>
              <div class="duration-info">
                <span>剩余 {{ event.remainingDays }} 天</span>
                <span>共 {{ event.duration }} 天</span>
              </div>
            </div>

            <!-- 处理按钮 -->
            <button
              v-if="!event.handled && event.type === 'negative'"
              @click="handleEvent(event.id)"
              class="handle-btn"
            >
              立即处理
            </button>
            <div v-else-if="event.handled" class="handled-badge">✓ 已处理</div>
          </div>
        </div>
      </div>

      <!-- 历史事件 -->
      <div class="history-panel">
        <h3 class="panel-header-title">
          <span class="header-icon">📜</span> 历史事件
          <span class="event-count"
            >({{ simulationStore.dynamicEvents.history.length }}个)</span
          >
        </h3>

        <div
          v-if="simulationStore.dynamicEvents.history.length === 0"
          class="empty-events"
        >
          暂无历史事件
        </div>

        <div v-else class="history-list">
          <div
            v-for="(event, index) in sortedHistory"
            :key="index"
            class="history-card"
          >
            <div class="history-header">
              <div
                class="history-title"
                :class="{
                  'text-positive': event.type === 'positive',
                  'text-negative': event.type === 'negative',
                  'text-neutral': event.type === 'neutral',
                }"
              >
                {{ event.title }}
              </div>
              <div
                class="type-badge"
                :class="{
                  positive: event.type === 'positive',
                  negative: event.type === 'negative',
                  neutral: event.type === 'neutral',
                }"
              >
                {{
                  event.type === "positive"
                    ? "正面"
                    : event.type === "negative"
                      ? "负面"
                      : "中性"
                }}
              </div>
            </div>

            <div class="history-date">{{ formatDate(event.date) }}</div>

            <!-- 效果信息 -->
            <div class="effects-section">
              <div class="effects-label">效果</div>
              <div class="effects-list">
                <div
                  v-for="(value, key) in event.effects"
                  :key="key"
                  class="effect-tag"
                  :class="{
                    positive: value > 0,
                    negative: value < 0,
                  }"
                >
                  {{ getEffectLabel(key) }}: {{ formatEffectValue(key, value) }}
                </div>
              </div>
            </div>

            <div v-if="event.handled" class="handled-badge">✓ 已处理</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 事件提示 -->
    <div class="tips-panel">
      <div class="tips-content">
        <div class="tips-icon">💡</div>
        <div class="tips-text">
          <strong>事件系统说明</strong>
          <p>
            游戏每天有10%的概率触发随机事件，事件可能带来正面或负面影响。负面事件可以立即处理以减轻其影响。
            事件持续一段时间后会自动结束，其效果也会随之消失。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSimulationStore } from "../../stores/simulationStore";

const simulationStore = useSimulationStore();

// 获取排序后的历史事件（最新的在前）
const sortedHistory = computed(() => {
  return [...simulationStore.dynamicEvents.history].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
});

// 获取效果标签
const getEffectLabel = (type: string): string => {
  const labels = {
    downloads: "下载量",
    revenue: "收入",
    marketSentiment: "市场情绪",
    dau: "日活用户",
    sevenDayRetention: "7日留存率",
  };
  return labels[type as keyof typeof labels] || type;
};

// 格式化效果值
const formatEffectValue = (type: string, value: number): string => {
  if (type === "sevenDayRetention") {
    return `${(value * 100).toFixed(1)}%`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};

// 处理事件
const handleEvent = (eventId: string): void => {
  simulationStore.handleEvent(eventId);
};

// 格式化日期
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};
</script>

<style lang="scss" scoped>
.dynamic-events-container {
  max-width: tokens.$max-content-width;
  margin: 0 auto;
  padding: tokens.$spacing-lg;

  .page-title {
    font-size: tokens.$font-size-2xl;
    font-weight: tokens.$font-weight-bold;
    margin-bottom: tokens.$spacing-xl;
    color: tokens.$text-primary;
  }

  .events-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: tokens.$spacing-lg;
    margin-bottom: tokens.$spacing-lg;

    @include utils.mobile {
      grid-template-columns: 1fr;
    }
  }

  .event-panel,
  .history-panel {
    background: white;
    border-radius: tokens.$radius-lg;
    box-shadow: tokens.$shadow-md;
    padding: tokens.$spacing-lg;

    .panel-header-title {
      font-size: tokens.$font-size-xl;
      font-weight: tokens.$font-weight-semibold;
      margin-bottom: tokens.$spacing-md;
      display: flex;
      align-items: center;
      gap: tokens.$spacing-sm;
      color: tokens.$gray-800;

      .header-icon {
        color: tokens.$primary-blue;
      }

      .event-count {
        font-size: tokens.$font-size-sm;
        color: tokens.$gray-600;
        font-weight: tokens.$font-weight-normal;
      }
    }

    .empty-events {
      text-align: center;
      padding: tokens.$spacing-2xl 0;
      color: tokens.$gray-500;
    }

    .events-list,
    .history-list {
      display: flex;
      flex-direction: column;
      gap: tokens.$spacing-md;
    }

    .event-card,
    .history-card {
      padding: tokens.$spacing-md;
      border-radius: tokens.$radius-md;
      border: 1px solid;
      transition: all tokens.$transition-fast;

      &.positive {
        background: rgb(16 185 129 / 5%);
        border-color: tokens.$success-green;
      }

      &.negative {
        background: rgb(239 68 68 / 5%);
        border-color: tokens.$danger-red;
      }

      &.neutral {
        background: rgb(148 163 184 / 5%);
        border-color: tokens.$border-light;
      }
    }

    .event-header,
    .history-header {
      @include utils.flex-between(flex-start);

      margin-bottom: tokens.$spacing-sm;

      .event-title,
      .history-title {
        font-weight: tokens.$font-weight-medium;
      }

      .severity-badge {
        padding: 2px 8px;
        border-radius: tokens.$radius-sm;
        font-size: tokens.$font-size-xs;
        font-weight: tokens.$font-weight-medium;

        &.low {
          background: rgb(16 185 129 / 10%);
          color: tokens.$success-green;
        }

        &.medium {
          background: rgb(245 158 11 / 10%);
          color: tokens.$warning;
        }

        &.high {
          background: rgb(239 68 68 / 10%);
          color: tokens.$danger-red;
        }
      }

      .type-badge {
        padding: 2px 8px;
        border-radius: tokens.$radius-sm;
        font-size: tokens.$font-size-xs;

        &.positive {
          background: rgb(16 185 129 / 10%);
          color: tokens.$success-green;
        }

        &.negative {
          background: rgb(239 68 68 / 10%);
          color: tokens.$danger-red;
        }

        &.neutral {
          background: rgb(148 163 184 / 10%);
          color: tokens.$gray-600;
        }
      }
    }

    .event-description,
    .history-date {
      font-size: tokens.$font-size-sm;
      margin-bottom: tokens.$spacing-sm;
      color: tokens.$gray-600;
    }

    .text-positive {
      color: tokens.$success-green;
    }

    .text-negative {
      color: tokens.$danger-red;
    }

    .text-neutral {
      color: tokens.$gray-700;
    }

    .effects-section {
      margin-bottom: tokens.$spacing-md;

      .effects-label {
        font-size: tokens.$font-size-xs;
        font-weight: tokens.$font-weight-medium;
        margin-bottom: tokens.$spacing-xs;
        color: tokens.$gray-700;
      }

      .effects-list {
        display: flex;
        flex-wrap: wrap;
        gap: tokens.$spacing-xs;
      }

      .effect-tag {
        padding: 2px 8px;
        border-radius: tokens.$radius-sm;
        font-size: tokens.$font-size-xs;

        &.positive {
          background: rgb(16 185 129 / 10%);
          color: tokens.$success-green;
        }

        &.negative {
          background: rgb(239 68 68 / 10%);
          color: tokens.$danger-red;
        }
      }
    }

    .duration-section {
      margin-bottom: tokens.$spacing-md;

      .duration-label {
        font-size: tokens.$font-size-xs;
        font-weight: tokens.$font-weight-medium;
        margin-bottom: tokens.$spacing-xs;
        color: tokens.$gray-700;
      }

      .progress-bar {
        width: 100%;
        height: 6px;
        background: tokens.$gray-200;
        border-radius: tokens.$radius-sm;
        overflow: hidden;

        .progress-fill {
          height: 100%;
          border-radius: tokens.$radius-sm;
          transition: width tokens.$transition-normal;

          &.positive {
            background: tokens.$success-green;
          }

          &.negative {
            background: tokens.$danger-red;
          }

          &.neutral {
            background: tokens.$gray-600;
          }
        }
      }

      .duration-info {
        display: flex;
        justify-content: space-between;
        font-size: tokens.$font-size-xs;
        color: tokens.$gray-500;
        margin-top: tokens.$spacing-xs;
      }
    }

    .handle-btn {
      width: 100%;
      padding: tokens.$spacing-sm tokens.$spacing-md;
      border-radius: tokens.$radius-md;
      background: tokens.$danger-red;
      color: white;
      border: none;
      cursor: pointer;
      font-size: tokens.$font-size-sm;
      transition: all tokens.$transition-fast;

      &:hover {
        background: #dc2626;
      }
    }

    .handled-badge {
      text-align: center;
      padding: tokens.$spacing-sm 0;
      color: tokens.$success-green;
      font-size: tokens.$font-size-sm;
    }
  }

  .history-list {
    max-height: 500px;
    overflow-y: auto;

    @include utils.custom-scrollbar;
  }

  .tips-panel {
    background: linear-gradient(
      135deg,
      tokens.$tips-bg-start 0%,
      tokens.$tips-bg-end 100%
    );
    border-left: 4px solid tokens.$tips-border;
    border-radius: 0 tokens.$radius-md tokens.$radius-md 0;
    padding: tokens.$spacing-md;

    .tips-content {
      display: flex;
      align-items: flex-start;
      gap: tokens.$spacing-md;

      .tips-icon {
        font-size: tokens.$font-size-xl;
        color: tokens.$primary-blue;
        flex-shrink: 0;
      }

      .tips-text {
        strong {
          color: tokens.$gray-800;
          display: block;
          margin-bottom: tokens.$spacing-xs;
        }

        p {
          margin: 0;
          font-size: tokens.$font-size-sm;
          color: tokens.$gray-600;
          line-height: 1.5;
        }
      }
    }
  }
}
</style>
