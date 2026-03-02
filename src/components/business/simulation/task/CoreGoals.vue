<template>
  <div class="core-goals-container">
    <h2 class="page-title">核心目标升级</h2>

    <!-- 阶段导航 -->
    <div class="stage-nav">
      <div class="stage-header">
        <div class="stage-title">当前阶段</div>
        <div class="stage-count">
          第{{ simulationStore.coreGoals.currentStage }}个月目标
        </div>
      </div>

      <div class="stage-progress">
        <!-- 进度线 -->
        <div class="progress-line"></div>

        <!-- 阶段节点 -->
        <div class="stage-nodes">
          <div
            v-for="stage in simulationStore.coreGoals.stages"
            :key="stage.id"
            class="stage-node-wrapper"
          >
            <div
              class="stage-node"
              :class="[
                stage.completed
                  ? 'node-completed'
                  : simulationStore.coreGoals.currentStage === stage.month
                    ? 'node-current'
                    : 'node-pending',
              ]"
              @click="goToStage(stage.month)"
            >
              {{ stage.month }}
            </div>
            <div
              class="stage-name"
              :class="stage.completed ? 'name-completed' : 'name-pending'"
            >
              {{ stage.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 当前阶段目标 -->
    <div class="current-stage-card">
      <h3 class="card-title">
        {{ currentStage?.name }}（第{{ currentStage?.month }}个月）
      </h3>

      <div v-if="!currentStage" class="empty-state">暂无目标</div>

      <div v-else class="goals-list">
        <div
          v-for="(goal, index) in currentStage.goals"
          :key="index"
          class="goal-item"
          :class="[goal.completed ? 'goal-completed' : 'goal-pending']"
        >
          <div class="goal-header">
            <div class="goal-label">{{ getGoalLabel(goal.type) }}</div>
            <div
              class="goal-status"
              :class="goal.completed ? 'status-completed' : 'status-pending'"
            >
              {{
                goal.completed
                  ? "✓ 已完成"
                  : `${formatValue(goal.current)}/${formatValue(goal.target)}`
              }}
            </div>
          </div>

          <div class="progress-bar">
            <div
              class="progress-fill"
              :class="goal.completed ? 'fill-completed' : 'fill-pending'"
              :style="{ width: `${calculateGoalProgress(goal)}%` }"
            ></div>
          </div>

          <div class="progress-values">
            <div>{{ formatValue(goal.current) }}</div>
            <div>{{ formatValue(goal.target) }}</div>
          </div>
        </div>
      </div>

      <!-- 阶段奖励 -->
      <div v-if="currentStage && !currentStage.completed" class="stage-rewards">
        <div class="rewards-title">阶段奖励</div>
        <div class="rewards-list">
          <div>• 解锁新的高级操作</div>
          <div>• 获得额外的运营资源</div>
          <div>• 提升游戏评级</div>
        </div>
      </div>

      <!-- 完成提示 -->
      <div
        v-if="currentStage && currentStage.completed"
        class="completion-notice"
      >
        <div class="notice-title">🎉 阶段目标已完成！</div>
        <div class="notice-desc">已自动升级到下一阶段目标</div>
      </div>
    </div>

    <!-- 历史阶段记录 -->
    <div class="history-card">
      <h3 class="card-title">历史阶段记录</h3>

      <div v-if="completedStages.length === 0" class="empty-state">
        暂无完成的阶段
      </div>

      <div v-else class="history-list">
        <div
          v-for="stage in completedStages"
          :key="stage.id"
          class="history-item"
        >
          <div class="history-header">
            <div class="history-name">{{ stage.name }}</div>
            <div class="history-month">第{{ stage.month }}个月完成</div>
          </div>
          <div class="history-progress">
            完成了{{ completedGoalsCount(stage) }}/{{
              stage.goals.length
            }}个目标
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useSimulationStore } from "../../stores/simulationStore";

// 定义类型接口
interface CoreGoal {
  type: string;
  current: number;
  target: number;
  completed: boolean;
}

interface CoreGoalStage {
  id: string;
  month: number;
  name: string;
  goals: CoreGoal[];
  completed: boolean;
}

const simulationStore = useSimulationStore();

// 获取当前阶段
const currentStage = computed<CoreGoalStage | undefined>(() => {
  return simulationStore.coreGoals.stages.find(
    (stage) => stage.month === simulationStore.coreGoals.currentStage,
  );
});

// 获取已完成阶段
const completedStages = computed<CoreGoalStage[]>(() => {
  return simulationStore.coreGoals.stages.filter((stage) => stage.completed);
});

// 跳转到指定阶段
const goToStage = (_month: number): void => {
  // 这里可以添加跳转到指定阶段的逻辑
  // console.log(`跳转到第${_month}个月阶段`);
};

// 获取目标标签
const getGoalLabel = (type: string): string => {
  const labels = {
    downloads: "累计下载量",
    dau: "日活跃用户",
    revenue: "总收入",
    marketSentiment: "市场情绪",
  };
  return labels[type as keyof typeof labels] || type;
};

// 格式化数值
const formatValue = (value: number): string => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};

// 计算目标进度
const calculateGoalProgress = (goal: CoreGoal): number => {
  return Math.min(100, Math.round((goal.current / goal.target) * 100));
};

// 计算已完成目标数量
const completedGoalsCount = (stage: CoreGoalStage): number => {
  return stage.goals.filter((goal: CoreGoal) => goal.completed).length;
};

// 监听游戏状态变化，更新核心目标进度
watch(
  () => simulationStore.gameState.dayCount,
  () => {
    simulationStore.updateCoreGoalsProgress();
  },
);
</script>

<style lang="scss" scoped>
.core-goals-container {
  max-width: tokens.$max-content-width;
  margin: 0 auto;
  padding: tokens.$spacing-lg;
}

.page-title {
  font-size: tokens.$font-size-2xl;
  font-weight: tokens.$font-weight-bold;
  margin-bottom: tokens.$spacing-xl;
  color: tokens.$text-primary;
}

/* 阶段导航 */
.stage-nav {
  margin-bottom: tokens.$spacing-xl;
}

.stage-header {
  @include utils.flex-between;

  margin-bottom: tokens.$spacing-md;
}

.stage-title {
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
}

.stage-count {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-muted;
}

.stage-progress {
  position: relative;
}

.progress-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: tokens.$bg-light;
  transform: translateY(-50%);
  z-index: 0;
}

.stage-nodes {
  @include utils.flex-between;

  position: relative;
  z-index: 1;
}

.stage-node-wrapper {
  @include utils.flex-col(tokens.$spacing-xs, center, center);
}

.stage-node {
  width: 40px;
  height: 40px;
  border-radius: tokens.$radius-full;

  @include utils.flex-center;

  font-weight: tokens.$font-weight-bold;
  cursor: pointer;
  transition: all tokens.$transition-normal;

  &.node-completed {
    background: tokens.$success;
    color: white;
    box-shadow: tokens.$shadow-lg;
    transform: scale(1.1);
  }

  &.node-current {
    background: tokens.$primary-blue;
    color: white;
    box-shadow: tokens.$shadow-blue;
  }

  &.node-pending {
    background: tokens.$border-light;
    color: tokens.$text-muted;
  }
}

.stage-name {
  font-size: tokens.$font-size-xs;
  text-align: center;
  width: 80px;

  @include utils.text-truncate;

  &.name-completed {
    color: tokens.$success;
  }

  &.name-pending {
    color: tokens.$text-muted;
  }
}

/* 当前阶段卡片 */
.current-stage-card,
.history-card {
  background: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  box-shadow: tokens.$shadow-md;
  padding: tokens.$spacing-xl;
  margin-bottom: tokens.$spacing-lg;
  border: 1px solid tokens.$border-light;
}

.card-title {
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-semibold;
  margin-bottom: tokens.$spacing-lg;
  color: tokens.$text-primary;
}

.empty-state {
  text-align: center;
  padding: tokens.$spacing-xl 0;
  color: tokens.$text-muted;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-lg;
}

.goal-item {
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-md;
  border: 1px solid tokens.$border-light;
  transition: all tokens.$transition-fast;

  &.goal-completed {
    border-color: tokens.$success;
    background: rgb(16 185 129 / 10%);
  }

  &.goal-pending {
    border-color: tokens.$border-light;
    background: tokens.$bg-light;
  }
}

.goal-header {
  @include utils.flex-between;

  margin-bottom: tokens.$spacing-sm;
}

.goal-label {
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
}

.goal-status {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-semibold;

  &.status-completed {
    color: tokens.$success;
  }

  &.status-pending {
    color: tokens.$primary-blue;
  }
}

.progress-bar {
  width: 100%;
  height: 12px;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-full;
  overflow: hidden;
  margin-bottom: tokens.$spacing-xs;
}

.progress-fill {
  height: 100%;
  border-radius: tokens.$radius-full;
  transition: width tokens.$transition-normal;

  &.fill-completed {
    background: tokens.$success;
  }

  &.fill-pending {
    background: tokens.$primary-blue;
  }
}

.progress-values {
  @include utils.flex-between;

  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
}

/* 阶段奖励 */
.stage-rewards {
  margin-top: tokens.$spacing-xl;
  padding: tokens.$spacing-md;
  background: rgb(59 130 246 / 10%);
  border-radius: tokens.$radius-md;
}

.rewards-title {
  font-weight: tokens.$font-weight-medium;
  color: tokens.$primary-blue;
  margin-bottom: tokens.$spacing-sm;
}

.rewards-list {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-xs;
}

/* 完成提示 */
.completion-notice {
  margin-top: tokens.$spacing-xl;
  padding: tokens.$spacing-md;
  background: rgb(16 185 129 / 10%);
  border-left: 4px solid tokens.$success;
  border-radius: 0 tokens.$radius-md tokens.$radius-md 0;
}

.notice-title {
  font-weight: tokens.$font-weight-medium;
  color: tokens.$success;
}

.notice-desc {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  margin-top: tokens.$spacing-xs;
}

/* 历史记录 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-md;
}

.history-item {
  padding: tokens.$spacing-md;
  background: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  border: 1px solid tokens.$border-light;
}

.history-header {
  @include utils.flex-between;

  margin-bottom: tokens.$spacing-xs;
}

.history-name {
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
}

.history-month {
  font-size: tokens.$font-size-sm;
  color: tokens.$success;
}

.history-progress {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
}

/* 响应式设计 */
@include utils.mobile {
  .core-goals-container {
    padding: tokens.$spacing-md;
  }

  .current-stage-card,
  .history-card {
    padding: tokens.$spacing-md;
  }

  .stage-node {
    width: 32px;
    height: 32px;
    font-size: tokens.$font-size-sm;
  }

  .stage-name {
    width: 60px;
    font-size: 10px;
  }
}
</style>
