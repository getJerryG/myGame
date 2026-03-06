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
// 导入类型
import type { App } from "../../../types/app";
import type { GameData } from "../../../types/game";
import type { Modal } from "../../../types/modal";
// 导入事件日志服务
import { EventLogService, type Event, type EventFilters } from '@/services/EventLogService';

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

// 事件数据
const events = ref<Event[]>(EventLogService.getEvents());

// 标签页选项
const tabs = EventLogService.getTabs();

// 时间范围选项
const timeRanges = EventLogService.getTimeRanges();

// 事件状态选项
const eventStatuses = EventLogService.getEventStatuses();

// 筛选条件
const selectedFilters = ref<EventFilters>(EventLogService.getDefaultFilters());

// 当前显示的事件
const currentEvents = computed(() => {
  return EventLogService.filterEvents(events.value, activeTab.value, selectedFilters.value);
});

// 获取事件类型标签 - 组件方法，用于模板调用
const getEventTypeLabel = (type: string): string => {
  return EventLogService.getEventTypeLabel(type);
};

// 重置筛选条件
const resetFilters = (): void => {
  selectedFilters.value = EventLogService.resetFilters();
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
