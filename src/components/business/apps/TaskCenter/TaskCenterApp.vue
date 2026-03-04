<template>
  <div class="task-center-app">
    <!-- 应用头部 -->
    <div class="app-header">
      <h2>任务中心</h2>
    </div>

    <!-- 标签页导航-->
    <div class="app-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'daily' }"
        @click="activeTab = 'daily'"
      >
        日常任务
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'main' }"
        @click="activeTab = 'main'"
      >
        主线任务
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'achievement' }"
        @click="activeTab = 'achievement'"
      >
        成就任务
      </button>
    </div>

    <!-- 标签页内容-->
    <div class="app-content">
      <!-- 任务列表 -->
      <div class="task-list">
        <div
          v-for="task in currentTasks"
          :key="task.id"
          class="task-item"
          :class="{
            completed: task.status === 'completed',
            claimed: task.status === 'rewarded',
          }"
        >
          <div class="task-info">
            <div class="task-header">
              <div class="task-name">{{ task.name }}</div>
              <div class="task-status" :class="task.status">
                {{ getStatusLabel(task.status) }}
              </div>
            </div>

            <div class="task-description">{{ task.description }}</div>

            <div
              class="task-progress"
              v-if="task.conditions && task.conditions.length > 0"
            >
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: `${getTaskProgress(task)}%` }"
                ></div>
              </div>
              <div class="progress-text">{{ getTaskProgressText(task) }}</div>
            </div>
          </div>

          <div class="task-rewards">
            <div class="rewards-list">
              <div
                v-for="(reward, index) in getRewardDisplay(task)"
                :key="index"
                class="reward-item"
              >
                <span class="reward-icon">{{ reward.icon }}</span>
                <span class="reward-amount">{{ reward.amount }}</span>
              </div>
            </div>

            <button
              v-if="task.status === 'completed'"
              class="claim-btn"
              @click="claimTask(task.id)"
            >
              领取奖励
            </button>
          </div>
        </div>

        <div v-if="currentTasks.length === 0" class="empty-state">
          <p>暂无任务</p>
        </div>
      </div>

      <!-- 一键领取按钮-->
      <div class="action-section">
        <button
          class="claim-all-btn"
          :disabled="!hasCompletedTasks"
          @click="claimAllTasks"
        >
          一键领取所有奖励
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入类型
import type { App } from "../../../types/app";
import type { GameData } from "../../../types/game";
import type { Modal } from "../../../types/modal";

// 导入store
import { useSimulationTaskSystemStore } from "@/stores/simulation/simulationTaskSystemStore";

// Props定义
const _props = defineProps<{
  app: App;
  gameData?: GameData;
  modal?: Modal;
}>();

// 使用任务系统store
const taskSystemStore = useSimulationTaskSystemStore();

// 活跃标签页
const activeTab = ref("daily");

// 定义组件内部使用的任务类型
interface TaskCenterTask {
  id: string;
  name: string;
  description: string;
  status: string;
  conditions?: Array<{ current: number; target: number }>;
  reward?: { money?: number; reputation?: number; exp?: number };
}

// 任务状态标签映射
const getStatusLabel = (status: string): string => {
  const statusMap = {
    pending: "未完成",
    inProgress: "进行中",
    completed: "已完成",
    rewarded: "已领取",
  };
  return statusMap[status as keyof typeof statusMap] || "未知状态";
};

// 当前显示的任务
const currentTasks = computed(() => {
  switch (activeTab.value) {
    case "daily":
      return taskSystemStore.getDailyTasks;
    case "main":
      return taskSystemStore.getMainTasks;
    case "achievement":
      return taskSystemStore.getAchievementTasks;
    default:
      return [];
  }
});

// 是否有可领取的任务
const hasCompletedTasks = computed(() => {
  return taskSystemStore.getCompletedTasks.length > 0;
});

// 获取任务进度百分比
const getTaskProgress = (task: TaskCenterTask): number => {
  if (!task.conditions || task.conditions.length === 0) {
    return 0;
  }

  const totalProgress = task.conditions.reduce(
    (sum: number, cond: { current: number; target: number }) => {
      return sum + cond.current / cond.target;
    },
    0,
  );

  return Math.min(
    100,
    Math.round((totalProgress / task.conditions.length) * 100),
  );
};

// 获取任务进度文本
const getTaskProgressText = (task: TaskCenterTask): string => {
  if (!task.conditions || task.conditions.length === 0) {
    return "";
  }

  return task.conditions
    .map(
      (cond: { current: number; target: number }) =>
        `${cond.current}/${cond.target}`,
    )
    .join(", ");
};

// 获取奖励显示
const getRewardDisplay = (
  task: TaskCenterTask,
): Array<{ icon: string; amount: number }> => {
  const rewards = [];
  if (task.reward?.money) {
    rewards.push({ icon: "💰", amount: task.reward.money });
  }
  if (task.reward?.reputation) {
    rewards.push({ icon: "🏆", amount: task.reward.reputation });
  }
  if (task.reward?.exp) {
    rewards.push({ icon: "📊", amount: task.reward.exp });
  }
  return rewards;
};

// 领取单个任务奖励
const claimTask = (taskId: string): void => {
  taskSystemStore.claimTaskReward(taskId);
};

// 一键领取所有奖励
const claimAllTasks = (): void => {
  const completedTasks = taskSystemStore.getCompletedTasks;
  completedTasks.forEach((task) => {
    taskSystemStore.claimTaskReward(task.id);
  });
};
</script>

<style lang="scss" scoped>
.task-center-app {
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

// 任务列表样式
.task-list {
  @include utils.flex-col(tokens.$spacing-md);
}

.task-item {
  @include utils.flex-between;

  background-color: tokens.$bg-light;
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-md;
  border: 1px solid tokens.$border-light;
  transition: all tokens.$transition-fast;

  &:hover {
    border-color: tokens.$primary-blue;
    transform: translateY(-2px);
  }

  &.completed {
    border-color: rgb(16 185 129 / 30%);
    background-color: rgb(16 185 129 / 5%);
  }

  &.claimed {
    opacity: 0.7;
    border-color: tokens.$border-medium;
  }
}

.task-info {
  flex: 1;

  @include utils.flex-col(tokens.$space-2);
}

.task-header {
  @include utils.flex-between;

  .task-name {
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }

  .task-status {
    padding: tokens.$space-1 tokens.$space-2;
    border-radius: tokens.$radius-sm;
    font-size: tokens.$font-size-xs;
    font-weight: tokens.$font-weight-bold;

    &.pending {
      background-color: rgb(251 191 36 / 20%);
      color: tokens.$primary-gold;
    }

    &.completed {
      background-color: rgb(16 185 129 / 20%);
      color: tokens.$success;
    }

    &.claimed {
      background-color: tokens.$bg-tertiary;
      color: tokens.$text-muted;
    }
  }
}

.task-description {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  line-height: tokens.$line-height-normal;
}

.task-progress {
  @include utils.flex-col(tokens.$space-1);
}

.progress-bar {
  @include utils.progress-bar;

  .progress-fill {
    @include utils.progress-fill(tokens.$primary-blue);
  }
}

.progress-text {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
  text-align: right;
}

.task-rewards {
  @include utils.flex-col(tokens.$spacing-md, flex-end);
}

.rewards-list {
  @include utils.flex-row(tokens.$space-2);
}

.reward-item {
  @include utils.flex-row(tokens.$space-1, center);

  padding: tokens.$space-1 tokens.$space-2;
  background-color: tokens.$bg-dark;
  border-radius: tokens.$radius-sm;

  .reward-icon {
    font-size: tokens.$font-size-base;
  }

  .reward-amount {
    font-size: tokens.$font-size-sm;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }
}

.claim-btn {
  padding: tokens.$space-2 tokens.$space-4;
  background-color: tokens.$success;
  border: none;
  border-radius: tokens.$radius-md;
  color: white;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-bold;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover {
    background-color: tokens.$secondary-dark;
    transform: translateY(-1px);
  }
}

.empty-state {
  @include utils.flex-center;

  height: 200px;
  background-color: tokens.$bg-light;
  border: 1px dashed tokens.$border-light;
  border-radius: tokens.$radius-md;

  p {
    margin: 0;
    color: tokens.$text-secondary;
    font-size: tokens.$font-size-base;
  }
}

// 一键领取按钮样式
.action-section {
  @include utils.flex-center;

  padding: tokens.$spacing-lg;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  margin-top: tokens.$spacing-lg;
}

.claim-all-btn {
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
    &:not(:disabled) {
      background-color: tokens.$primary-dark;
      transform: translateY(-1px);
    }
  }

  &:disabled {
    background-color: tokens.$bg-tertiary;
    cursor: not-allowed;
    opacity: 0.7;
  }
}
</style>
