<template>
  <div class="task-center-app">
    <!-- 应用头部 -->
    <div class="app-header">
      <h2>任务中心</h2>
    </div>

    <!-- 标签页导�?-->
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

    <!-- 标签页内�?-->
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
              <div
                class="task-status"
                :class="task.status"
              >
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

        <div
          v-if="currentTasks.length === 0"
          class="empty-state"
        >
          <p>暂无任务</p>
        </div>
      </div>

      <!-- 一键领取按�?-->
      <div class="action-section">
        <button
          class="claim-all-btn"
          :disabled="!hasCompletedTasks"
          @click="claimAllTasks"
        >
          一键领取所有奖�?
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 导入类型
import type { App } from '../../../types/app';
import type { GameData } from '../../../types/game';
import type { Modal } from '../../../types/modal';

// 导入store
import { useSimulationTaskSystemStore } from '@/stores/simulation/simulationTaskSystemStore';

// Props定义
const props = defineProps<{
  app: App;
  gameData?: GameData;
  modal?: Modal;
}>();

// 使用任务系统store
const taskSystemStore = useSimulationTaskSystemStore();

// 活跃标签页
const activeTab = ref('daily');

// 任务状态标签映射
const getStatusLabel = (status: string) => {
  const statusMap = {
    pending: '未完成',
    in_progress: '进行中',
    completed: '已完成',
    rewarded: '已领取',
  };
  return statusMap[status as keyof typeof statusMap] || '未知状态';
};

// 当前显示的任务
const currentTasks = computed(() => {
  switch (activeTab.value) {
    case 'daily':
      return taskSystemStore.getDailyTasks;
    case 'main':
      return taskSystemStore.getMainTasks;
    case 'achievement':
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
const getTaskProgress = (task: any) => {
  if (!task.conditions || task.conditions.length === 0) {
    return 0;
  }

  const totalProgress = task.conditions.reduce((sum: number, cond: any) => {
    return sum + cond.current / cond.target;
  }, 0);

  return Math.min(100, Math.round((totalProgress / task.conditions.length) * 100));
};

// 获取任务进度文本
const getTaskProgressText = (task: any) => {
  if (!task.conditions || task.conditions.length === 0) {
    return '';
  }

  return task.conditions.map((cond: any) => `${cond.current}/${cond.target}`).join(', ');
};

// 获取奖励显示
const getRewardDisplay = (task: any) => {
  const rewards = [];
  if (task.reward.money) {
    rewards.push({ icon: '💰', amount: task.reward.money });
  }
  if (task.reward.reputation) {
    rewards.push({ icon: '🏆', amount: task.reward.reputation });
  }
  if (task.reward.exp) {
    rewards.push({ icon: '📊', amount: task.reward.exp });
  }
  return rewards;
};

// 领取单个任务奖励
const claimTask = (taskId: string) => {
  taskSystemStore.claimTaskReward(taskId);
};

// 一键领取所有奖励
const claimAllTasks = () => {
  const completedTasks = taskSystemStore.getCompletedTasks;
  completedTasks.forEach((task) => {
    taskSystemStore.claimTaskReward(task.id);
  });
};
</script>

<style lang="scss" scoped>
.task-center-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: rgb(26 26 46 / 50%);
  color: var(--text-primary);
}

// 任务列表样式
.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(0 0 0 / 10%);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgb(74 158 255 / 20%);
  transition: all 0.2s ease;

  &:hover {
    border-color: rgb(74 158 255 / 50%);
    transform: translateY(-2px);
  }

  &.completed {
    border-color: rgb(46 213 115 / 30%);
    background-color: rgb(46 213 115 / 5%);
  }

  &.claimed {
    opacity: 0.7;
    border-color: rgb(176 176 176 / 30%);
  }
}

.task-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .task-name {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
  }

  .task-status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;

    &.pending {
      background-color: rgb(255 215 0 / 20%);
      color: #ffd700;
    }

    &.completed {
      background-color: rgb(46 213 115 / 20%);
      color: #2ed573;
    }

    &.claimed {
      background-color: rgb(176 176 176 / 20%);
      color: #b0b0b0;
    }
  }
}

.task-description {
  font-size: 14px;
  color: #b0b0b0;
  line-height: 1.4;
}

.task-progress {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-bar {
  height: 6px;
  background-color: rgb(0 0 0 / 20%);
  border-radius: 3px;
  overflow: hidden;

  .progress-fill {
    height: 100%;
    background-color: #4a9eff;
    border-radius: 3px;
    transition: width 0.3s ease;
  }
}

.progress-text {
  font-size: 12px;
  color: #b0b0b0;
  text-align: right;
}

.task-rewards {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.rewards-list {
  display: flex;
  gap: 8px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: rgb(0 0 0 / 20%);
  border-radius: 4px;

  .reward-icon {
    font-size: 16px;
  }

  .reward-amount {
    font-size: 14px;
    font-weight: bold;
    color: #fff;
  }
}

.claim-btn {
  padding: 8px 16px;
  background-color: #2ed573;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #20c997;
    transform: translateY(-1px);
  }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: rgb(0 0 0 / 10%);
  border: 1px dashed rgb(74 158 255 / 20%);
  border-radius: 8px;

  p {
    margin: 0;
    color: #b0b0b0;
    font-size: 16px;
  }
}

// 一键领取按钮样式
.action-section {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: rgb(0 0 0 / 10%);
  border-radius: 8px;
}

.claim-all-btn {
  padding: 12px 32px;
  background-color: #4a9eff;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #357abd;
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: #b0b0b0;
    cursor: not-allowed;
    opacity: 0.7;
  }
}
</style>
