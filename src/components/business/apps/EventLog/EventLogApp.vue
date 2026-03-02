<template>
  <div class="event-log-app">
    <div class="app-header">
      <h2>事件日志</h2>
      <button class="filter-btn" @click="showFilterModal = true">筛选</button>
    </div>

    <div class="app-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-btn"
        :class="{ active: activeTab.value === tab.value }"
        @click="activeTab.value = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="app-content">
      <div v-if="currentEvents.length === 0" class="empty-state">
        <p>暂无事件记录</p>
      </div>

      <div v-else class="event-list">
        <div v-for="event in currentEvents" :key="event.id" class="event-item">
          <div class="event-header">
            <div class="event-type" :class="event.type">
              {{ getEventTypeLabel(event.type) }}
            </div>
            <div class="event-date">{{ event.date }}</div>
          </div>

          <div class="event-body">
            <h3 class="event-title">{{ event.name }}</h3>
            <p class="event-description">{{ event.description }}</p>
          </div>

          <div class="event-footer">
            <div class="event-solution">
              <strong>解决方案：</strong>{{ event.solution }}
            </div>
            <div class="event-impact" :class="event.impact.status">
              <strong>影响：</strong>{{ event.impact.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选弹窗 -->
    <div
      v-if="showFilterModal"
      class="modal-overlay"
      @click="showFilterModal = false"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>筛选事件</h3>
          <button class="close-btn" @click="showFilterModal = false">×</button>
        </div>

        <div class="modal-body">
          <div class="filter-options">
            <div class="filter-group">
              <div class="filter-label">时间范围:</div>
              <div class="filter-buttons">
                <button
                  v-for="range in timeRanges"
                  :key="range.value"
                  class="filter-option-btn"
                  :class="{ active: selectedFilters.timeRange === range.value }"
                  @click="selectedFilters.timeRange = range.value"
                >
                  {{ range.label }}
                </button>
              </div>
            </div>

            <div class="filter-group">
              <div class="filter-label">事件状态</div>
              <div class="filter-buttons">
                <button
                  v-for="status in eventStatuses"
                  :key="status.value"
                  class="filter-option-btn"
                  :class="{ active: selectedFilters.status === status.value }"
                  @click="selectedFilters.status = status.value"
                >
                  {{ status.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="reset-btn" @click="resetFilters">重置</button>
          <button class="apply-btn" @click="applyFilters">应用筛选</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// 导入类型
import type { App } from "../../../types/app";
import type { GameData } from "../../../types/game";
import type { Modal } from "../../../types/modal";

// Props定义
defineProps<{
  app: App;
  gameData?: GameData;
  modal?: Modal;
}>();

// 活跃标签页
const activeTab = ref("all");

// 显示筛选弹窗
const showFilterModal = ref(false);

// 获取事件类型标签
const getEventTypeLabel = (type: string): string => {
  const typeMap = {
    technical: "技术事件",
    operation: "运营事件",
    market: "市场事件",
  };
  return typeMap[type as keyof typeof typeMap] || "未知事件";
};

// 事件数据
const events = ref([
  {
    id: 1,
    name: "服务器卡顿问题",
    description: "部分玩家反映游戏服务器卡顿，影响游戏体验",
    type: "technical",
    date: "2024/3/10",
    solution: "紧急扩容服务器，优化网络连接",
    impact: {
      status: "resolved",
      description: "服务器恢复正常，玩家满意度提升",
    },
  },
  {
    id: 2,
    name: "新英雄上线热度爆发",
    description: "新英雄李白上线后，游戏热度大幅提升，超出预期",
    type: "operation",
    date: "2024/3/15",
    solution: "增加服务器资源，确保游戏稳定运行",
    impact: {
      status: "positive",
      description: "游戏热度+30，新增用户5000",
    },
  },
  {
    id: 3,
    name: "竞争对手发布新游戏",
    description: "主要竞争对手发布了一款新的MOBA游戏，可能影响我们的市场份额",
    type: "market",
    date: "2024/3/20",
    solution: "推出新活动和皮肤，增强玩家粘性",
    impact: {
      status: "neutral",
      description: "市场份额保持稳定，玩家流失率在可控范围内",
    },
  },
  {
    id: 4,
    name: "支付系统故障",
    description: "部分玩家无法正常进行支付，影响收入",
    type: "technical",
    date: "2024/3/25",
    solution: "修复支付系统漏洞，恢复支付功能",
    impact: {
      status: "resolved",
      description: "支付功能恢复正常，补偿受影响玩家",
    },
  },
  {
    id: 5,
    name: "玩家大规模投诉",
    description: "由于版本更新问题，导致大量玩家投诉",
    type: "operation",
    date: "2024/3/30",
    solution: "发布道歉公告，发放补偿奖励",
    impact: {
      status: "negative",
      description: "口碑-10，需加强版本测试",
    },
  },
]);

// 标签页选项
const tabs = [
  { label: "全部事件", value: "all" },
  { label: "技术事件", value: "technical" },
  { label: "运营事件", value: "operation" },
  { label: "市场事件", value: "market" },
];

// 时间范围选项
const timeRanges = [
  { label: "全部时间", value: "all" },
  { label: "最近7天", value: "7days" },
  { label: "最近30天", value: "30days" },
  { label: "最近90天", value: "90days" },
];

// 事件状态选项
const eventStatuses = [
  { label: "全部状态", value: "all" },
  { label: "已解决", value: "resolved" },
  { label: "正面影响", value: "positive" },
  { label: "负面影响", value: "negative" },
  { label: "中性", value: "neutral" },
];

// 筛选条件
const selectedFilters = ref({
  timeRange: "all",
  status: "all",
});

// 当前显示的事件
const currentEvents = computed(() => {
  let filteredEvents = events.value;

  // 根据标签页筛选事件类型
  if (activeTab.value !== "all") {
    filteredEvents = filteredEvents.filter(
      (event) => event.type === activeTab.value,
    );
  }

  // 应用筛选条件
  if (selectedFilters.value.status !== "all") {
    filteredEvents = filteredEvents.filter(
      (event) => event.impact.status === selectedFilters.value.status,
    );
  }

  return filteredEvents;
});

// 重置筛选条件
const resetFilters = (): void => {
  selectedFilters.value = {
    timeRange: "all",
    status: "all",
  };
};

// 应用筛选条件
const applyFilters = (): void => {
  showFilterModal.value = false;
};
</script>

<style lang="scss" scoped>
.event-log-app {
  @include utils.flex-col(0, stretch, flex-start);

  height: 100%;
  background-color: tokens.$bg-light;
  color: tokens.$text-primary;

  .app-header {
    padding: tokens.$spacing-md;
    border-bottom: 1px solid rgba(tokens.$primary-blue, 0.2);
    background-color: tokens.$bg-light;

    @include utils.flex-between;

    h2 {
      margin: 0;
      font-size: tokens.$font-size-xl;
      color: tokens.$text-primary;
    }

    .filter-btn {
      padding: tokens.$spacing-sm tokens.$spacing-md;
      background-color: rgba(tokens.$primary-blue, 0.3);
      border: 1px solid rgba(tokens.$primary-blue, 0.5);
      color: tokens.$text-primary;
      border-radius: tokens.$radius-sm;
      cursor: pointer;
      transition: all tokens.$transition-fast;

      &:hover {
        background-color: rgba(tokens.$primary-blue, 0.5);
      }
    }
  }

  .app-tabs {
    @include utils.flex-row(0, center, flex-start);

    background-color: tokens.$bg-light;
    border-bottom: 1px solid rgba(tokens.$primary-blue, 0.2);

    .tab-btn {
      flex: 1;
      padding: tokens.$spacing-md;
      background: transparent;
      border: none;
      color: tokens.$text-muted;
      font-size: tokens.$font-size-sm;
      font-weight: tokens.$font-weight-medium;
      cursor: pointer;
      transition: all tokens.$transition-fast;

      &:hover {
        background-color: rgba(tokens.$primary-blue, 0.2);
        color: tokens.$text-primary;
      }

      &.active {
        background-color: rgba(tokens.$primary-blue, 0.3);
        color: tokens.$text-primary;
        border-bottom: 2px solid tokens.$primary-blue;
      }
    }
  }

  .app-content {
    flex: 1;
    padding: tokens.$spacing-md;
    overflow-y: auto;

    .empty-state {
      @include utils.flex-center;

      height: 200px;
      color: tokens.$text-muted;
      font-size: tokens.$font-size-base;
    }

    .event-list {
      @include utils.flex-col(tokens.$spacing-md);

      .event-item {
        background-color: tokens.$bg-light;
        border: 1px solid rgba(tokens.$primary-blue, 0.2);
        border-radius: tokens.$radius-md;
        padding: tokens.$spacing-md;
        transition: all tokens.$transition-fast;

        &:hover {
          border-color: rgba(tokens.$primary-blue, 0.5);
          box-shadow: 0 0 10px rgba(tokens.$primary-blue, 0.1);
        }

        .event-header {
          @include utils.flex-between;

          margin-bottom: tokens.$spacing-md;

          .event-type {
            padding: tokens.$spacing-xs tokens.$spacing-sm;
            border-radius: tokens.$radius-sm;
            font-size: tokens.$font-size-xs;
            font-weight: tokens.$font-weight-medium;

            &.technical {
              background-color: rgba(tokens.$error, 0.3);
              color: tokens.$error;
            }

            &.operation {
              background-color: rgba(tokens.$primary-blue, 0.3);
              color: tokens.$primary-blue;
            }

            &.market {
              background-color: rgba(tokens.$lottery-purple, 0.3);
              color: tokens.$lottery-purple;
            }
          }

          .event-date {
            font-size: tokens.$font-size-xs;
            color: tokens.$text-muted;
          }
        }

        .event-body {
          margin-bottom: tokens.$spacing-md;

          .event-title {
            margin: 0 0 tokens.$spacing-sm;
            font-size: tokens.$font-size-base;
            color: tokens.$text-primary;
          }

          .event-description {
            margin: 0;
            font-size: tokens.$font-size-sm;
            color: tokens.$text-muted;
            line-height: tokens.$line-height-normal;
          }
        }

        .event-footer {
          @include utils.flex-col(tokens.$spacing-sm);

          .event-solution,
          .event-impact {
            font-size: tokens.$font-size-sm;

            strong {
              color: tokens.$text-primary;
            }
          }

          .event-impact {
            &.resolved {
              color: tokens.$success;
            }

            &.positive {
              color: tokens.$success;
            }

            &.negative {
              color: tokens.$error;
            }

            &.neutral {
              color: tokens.$warning;
            }
          }
        }
      }
    }
  }
}

/* 筛选弹窗样式 */
.modal-overlay {
  @include utils.modal-overlay;
}

.modal-content {
  background-color: tokens.$bg-secondary;
  border: 1px solid rgba(tokens.$primary-blue, 0.3);
  border-radius: tokens.$radius-md;
  width: 90%;
  max-width: 500px;
  box-shadow: tokens.$shadow-xl;

  .modal-header {
    @include utils.flex-between;

    padding: tokens.$spacing-md;
    border-bottom: 1px solid rgba(tokens.$primary-blue, 0.2);

    h3 {
      margin: 0;
      font-size: tokens.$font-size-lg;
      color: tokens.$text-primary;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: tokens.$text-muted;
      font-size: tokens.$font-size-2xl;
      cursor: pointer;
      transition: color tokens.$transition-fast;

      &:hover {
        color: tokens.$text-primary;
      }
    }
  }

  .modal-body {
    padding: tokens.$spacing-md;

    .filter-options {
      @include utils.flex-col(tokens.$spacing-md);

      .filter-group {
        .filter-label {
          display: block;
          margin-bottom: tokens.$spacing-sm;
          font-size: tokens.$font-size-sm;
          font-weight: tokens.$font-weight-medium;
          color: tokens.$text-primary;
        }

        .filter-buttons {
          @include utils.flex-row(tokens.$spacing-sm, center, flex-start);

          flex-wrap: wrap;

          .filter-option-btn {
            padding: tokens.$spacing-sm tokens.$spacing-md;
            background-color: tokens.$bg-light;
            border: 1px solid rgba(tokens.$primary-blue, 0.3);
            color: tokens.$text-muted;
            border-radius: tokens.$radius-sm;
            cursor: pointer;
            transition: all tokens.$transition-fast;

            &:hover {
              border-color: rgba(tokens.$primary-blue, 0.5);
              color: tokens.$text-primary;
            }

            &.active {
              background-color: rgba(tokens.$primary-blue, 0.3);
              border-color: rgba(tokens.$primary-blue, 0.5);
              color: tokens.$text-primary;
            }
          }
        }
      }
    }
  }

  .modal-footer {
    @include utils.flex-row(tokens.$spacing-sm, center, flex-end);

    padding: tokens.$spacing-md;
    border-top: 1px solid rgba(tokens.$primary-blue, 0.2);

    .reset-btn,
    .apply-btn {
      padding: tokens.$spacing-sm tokens.$spacing-md;
      border-radius: tokens.$radius-sm;
      font-size: tokens.$font-size-sm;
      font-weight: tokens.$font-weight-medium;
      cursor: pointer;
      transition: all tokens.$transition-fast;
    }

    .reset-btn {
      background-color: tokens.$bg-light;
      border: 1px solid rgba(tokens.$primary-blue, 0.3);
      color: tokens.$text-muted;

      &:hover {
        border-color: rgba(tokens.$primary-blue, 0.5);
        color: tokens.$text-primary;
      }
    }

    .apply-btn {
      background-color: rgba(tokens.$primary-blue, 0.3);
      border: 1px solid rgba(tokens.$primary-blue, 0.5);
      color: tokens.$text-primary;

      &:hover {
        background-color: rgba(tokens.$primary-blue, 0.5);
      }
    }
  }
}
</style>
