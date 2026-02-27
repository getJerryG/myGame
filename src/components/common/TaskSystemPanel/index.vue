<template>
  <div class="task-system-panel">
    <!-- 任务系统标题栏 -->
    <div class="task-system-header">
      <div class="task-system-title">任务系统</div>
      <div class="task-system-controls">
        <button
          class="control-btn"
          @click="toggleTaskPanel"
        >
          {{ isPanelOpen ? '收起' : '展开' }}
        </button>
      </div>
    </div>

    <!-- 任务系统面板 -->
    <div
      class="task-system-content"
      v-show="isPanelOpen"
    >
      <!-- 任务列表 -->
      <div class="task-list">
        <!-- 成长任务 -->
        <div
          class="task-section"
          v-if="growthTasks.length > 0"
        >
          <div class="section-header">
            <span class="section-title">成长任务</span>
          </div>
          <div class="section-tasks">
            <div
              v-for="task in growthTasks"
              :key="task.id"
              class="task-item"
              :class="{
                completed: task.status === 'completed',
              }"
            >
              <div class="task-info">
                <div class="task-title">{{ task.title }}</div>
                <div class="task-description">{{ task.description }}</div>
                <div class="task-progress">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: `${(task.progress / task.targetProgress) * 100}%` }"
                    ></div>
                  </div>
                  <span class="progress-text">{{ task.progress }}/{{ task.targetProgress }}</span>
                </div>
              </div>
              <div class="task-rewards">
                <div
                  class="reward-item"
                  v-for="reward in task.rewards"
                  :key="reward.type + reward.amount"
                >
                  {{ reward.amount }} {{ reward.type === 'funds' ? '资金' : reward.type === 'exp' ? '经验' : '其他' }}
                </div>
              </div>
              <div class="task-actions">
                <button
                  class="action-btn"
                  v-if="task.status === 'completed'"
                  @click="claimReward(task.id)"
                >
                  领取
                </button>
                <button
                  class="action-btn"
                  v-else
                  @click="startTask(task.id)"
                  :disabled="task.status === 'in_progress'"
                >
                  {{ task.status === 'in_progress' ? '进行中' : '开始' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 日常任务 -->
        <div
          class="task-section"
          v-if="dailyTasks.length > 0"
        >
          <div class="section-header">
            <span class="section-title">日常任务</span>
          </div>
          <div class="section-tasks">
            <div
              v-for="task in dailyTasks"
              :key="task.id"
              class="task-item"
              :class="{
                completed: task.status === 'completed',
              }"
            >
              <div class="task-info">
                <div class="task-title">{{ task.title }}</div>
                <div class="task-description">{{ task.description }}</div>
                <div class="task-progress">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: `${task.progress}%` }"
                    ></div>
                  </div>
                  <span class="progress-text">{{ task.progress }}%</span>
                </div>
              </div>
              <div class="task-rewards">
                <div
                  class="reward-item"
                  v-for="reward in task.rewards"
                  :key="reward.type"
                >
                  {{ reward.amount }} {{ reward.type === 'money' ? '资金' : '经验' }}
                </div>
              </div>
              <div class="task-actions">
                <button
                  class="action-btn"
                  v-if="task.status === 'completed'"
                  @click="claimReward(task.id)"
                >
                  领取
                </button>
                <button
                  class="action-btn"
                  v-else
                  @click="startTask(task.id)"
                  :disabled="task.status === 'in_progress'"
                >
                  {{ task.status === 'in_progress' ? '进行中' : '开始' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import { useSimulationStore } from '@/stores/simulationStore';
import { useSimulationTaskSystemStore } from '@/stores/simulation/simulationTaskSystemStore';

// 注入父组件提供的经验管理方法
const addExp = inject('addExp', (_amount: number) => {});
// 获取模拟系统 store
const simulationStore = useSimulationStore();
// 获取任务系统 store
const taskSystemStore = useSimulationTaskSystemStore();
// 注入父组件提供的策划资金
const 策划资金 = inject('策划资金', ref(0));
// 注入父组件提供的更新应用数据方法
const updateAppData = inject('updateAppData', () => {});

// 面板展开状态
const isPanelOpen = ref(true);

// 切换面板展开/收起
const toggleTaskPanel = () => {
  isPanelOpen.value = !isPanelOpen.value;
};

// 计算属性：成长任务
const growthTasks = computed(() => {
  return taskSystemStore.getGrowthTasks.filter((task) => task.status === 'pending' || task.status === 'completed');
});

// 计算属性：日常任务
const dailyTasks = computed(() => {
  return taskSystemStore.getDailyTasks.filter((task) => task.status === 'pending' || task.status === 'completed');
});

// 开始任务
const startTask = (taskId: string) => {
  // 在真实的任务系统中，任务进度应该由用户活动触发
  // 这里我们模拟进度增长
  const task = taskSystemStore.getTaskById(taskId);
  if (task?.status === 'pending') {
    // 模拟进度增长
    const interval = setInterval(() => {
      if (task.progress < task.targetProgress) {
        taskSystemStore.updateTaskProgress(taskId, task.progress + 1);
      } else {
        clearInterval(interval);
      }
    }, 500);
  }
};

// 领取奖励
const claimReward = (taskId: string) => {
  const task = taskSystemStore.getTaskById(taskId);
  if (task?.status === 'completed') {
    // 获取奖励列表
    const rewards = taskSystemStore.claimTaskReward(taskId);

    if (rewards) {
      // 发放奖励
      rewards.forEach((reward) => {
        if (reward.type === 'exp') {
          // 发放经验奖励
          addExp(reward.amount);
        } else if (reward.type === 'funds') {
          // 发放资金奖励
          if (simulationStore.simulation) {
            // 如果Simulation实例存在，调用updatePlannerFunds方法
            simulationStore.simulation.updatePlannerFunds(reward.amount);
          } else {
            // 如果Simulation实例不存在，直接更新策划资金
            策划资金.value += reward.amount;
            updateAppData();
          }
        }
      });

      // 打印领取奖励信息
      console.log('领取奖励:', rewards);
    }
  }
};
</script>

<style lang="scss" scoped>
.task-system-panel {
  position: fixed;
  right: 20px;
  top: 50px;
  width: 320px;
  background-color: rgb(26 26 46 / 95%);
  border-radius: 8px;
  box-shadow: 0 0 20px rgb(0 0 0 / 50%);
  z-index: 1000;
  overflow: hidden;
}

.task-system-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: rgb(74 158 255 / 10%);
  border-bottom: 1px solid rgb(74 158 255 / 30%);
}

.task-system-title {
  color: #4a9eff;
  font-size: 16px;
  font-weight: bold;
}

.task-system-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  padding: 4px 8px;
  background-color: rgb(74 158 255 / 20%);
  color: #4a9eff;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background-color: rgb(74 158 255 / 40%);
}

.task-system-content {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-section {
  background-color: rgb(0 0 0 / 20%);
  border-radius: 8px;
  overflow: hidden;
}

.section-header {
  padding: 12px 16px;
  background-color: rgb(74 158 255 / 10%);
  border-bottom: 1px solid rgb(74 158 255 / 30%);
}

.section-title {
  color: #4a9eff;
  font-size: 14px;
  font-weight: bold;
}

.section-tasks {
  padding: 8px;
}

.task-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background-color: rgb(0 0 0 / 30%);
  border-radius: 6px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.task-item:hover {
  background-color: rgb(0 0 0 / 40%);
}

.task-item.completed {
  opacity: 0.7;
}

.task-info {
  flex: 1;
}

.task-title {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

.task-description {
  color: #aaa;
  font-size: 12px;
  margin-bottom: 8px;
  line-height: 1.4;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background-color: rgb(255 255 255 / 20%);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4a9eff;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  color: #4a9eff;
  font-size: 12px;
  font-weight: bold;
}

.task-rewards {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.reward-item {
  padding: 4px 8px;
  background-color: rgb(82 196 26 / 20%);
  color: #52c41a;
  font-size: 12px;
  border-radius: 12px;
}

.task-actions {
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  padding: 6px 12px;
  background-color: #4a9eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: #357abd;
}

.action-btn:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

/* 滚动条样式 */
.task-system-content::-webkit-scrollbar {
  width: 6px;
}

.task-system-content::-webkit-scrollbar-track {
  background: rgb(0 0 0 / 20%);
  border-radius: 3px;
}

.task-system-content::-webkit-scrollbar-thumb {
  background: rgb(74 158 255 / 50%);
  border-radius: 3px;
}

.task-system-content::-webkit-scrollbar-thumb:hover {
  background: rgb(74 158 255 / 80%);
}
</style>
