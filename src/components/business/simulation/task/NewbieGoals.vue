<template>
  <div class="newbie-goals-container">
    <h2 class="page-title">新手目标</h2>

    <div class="goals-card">
      <!-- 目标进度统计 -->
      <div class="progress-section">
        <div class="progress-header">
          <div class="progress-title">完成进度</div>
          <div class="progress-count">
            {{ completedCount }}/{{ totalGoals }} 个目标
          </div>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- 目标列表 -->
      <div class="goals-list">
        <div
          v-for="goal in simulationStore.newbieGoals.goals"
          :key="goal.id"
          class="goal-item"
          :class="{
            completed: goal.isCompleted,
          }"
        >
          <div class="goal-content">
            <div class="goal-main">
              <div
                class="goal-number"
                :class="{
                  'number-completed': goal.isCompleted,
                  'number-pending': !goal.isCompleted,
                }"
              >
                <span v-if="goal.isCompleted">✓</span>
                <span v-else>{{
                  simulationStore.newbieGoals.goals.indexOf(goal) + 1
                }}</span>
              </div>
              <div class="goal-info">
                <div class="goal-title">{{ goal.title }}</div>
                <div class="goal-description">
                  {{ goal.description }}
                </div>

                <!-- 进度显示（如果是数据类型目标）-->
                <div
                  v-if="goal.type === 'data' || goal.type === 'time'"
                  class="goal-progress"
                >
                  <div class="progress-bar-small">
                    <div
                      class="progress-fill-small"
                      :style="{ width: `${calculateGoalProgress(goal)}%` }"
                    ></div>
                  </div>
                  <div class="progress-values">
                    <span>{{ getCurrentValue(goal) }}</span>
                    <span>{{ goal.target }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 奖励和操作按钮 -->
            <div class="goal-actions">
              <!-- 奖励显示 -->
              <div class="goal-rewards">
                <span class="reward-item">{{ goal.reward.coins }} 💎</span>
                <span class="reward-item">{{ goal.reward.diamonds }} 💰</span>
              </div>

              <!-- 操作按钮 -->
              <button
                v-if="goal.isCompleted"
                @click="claimReward(goal.id)"
                class="btn-claim"
              >
                领取奖励
              </button>
              <button v-else disabled class="btn-disabled">未完成</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 完成所有目标提示 -->
      <div v-if="completedCount === totalGoals" class="completion-notice">
        <div class="notice-content">
          <div class="notice-icon">🎉</div>
          <div class="notice-text">
            <strong class="notice-title">恭喜完成所有新手目标！</strong>
            <p class="notice-desc">
              已解锁中期权限，可以开始更高级的运营操作了。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSimulationStore } from "../../stores/simulationStore";

// 定义类型接口
interface NewbieGoalReward {
  coins: number;
  diamonds: number;
}

interface NewbieGoal {
  id: string;
  title: string;
  description: string;
  type: string;
  target: number;
  isCompleted: boolean;
  reward: NewbieGoalReward;
}

const simulationStore = useSimulationStore();

// 计算已完成目标数量
const completedCount = computed(() => {
  return simulationStore.newbieGoals.goals.filter((goal) => goal.isCompleted)
    .length;
});

// 计算总目标数量
const totalGoals = computed(() => {
  return simulationStore.newbieGoals.goals.length;
});

// 计算进度百分比
const progressPercentage = computed(() => {
  return Math.round((completedCount.value / totalGoals.value) * 100);
});

// 计算单个目标的进度
const calculateGoalProgress = (goal: NewbieGoal): number => {
  const current = getCurrentValue(goal);
  return Math.min(100, Math.round((current / goal.target) * 100));
};

// 获取当前值
const getCurrentValue = (goal: NewbieGoal): number => {
  switch (goal.id) {
    case "goal5": // 累计下载量
      return simulationStore.businessData.downloads;
    case "goal6": // 市场情绪
      return simulationStore.businessData.marketSentiment;
    case "goal7": // 连续7天运营
      return simulationStore.gameState.dayCount;
    default:
      return 0;
  }
};

// 领取奖励
const claimReward = (goalId: string): void => {
  simulationStore.claimNewbieGoalReward(goalId);
  // 这里可以添加奖励领取成功的提示
};
</script>

<style lang="scss" scoped>
.newbie-goals-container {
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

.goals-card {
  background: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  box-shadow: tokens.$shadow-md;
  padding: tokens.$spacing-xl;
  border: 1px solid tokens.$border-light;
}

/* 进度统计 */
.progress-section {
  margin-bottom: tokens.$spacing-xl;
}

.progress-header {
  @include utils.flex-between;

  margin-bottom: tokens.$spacing-sm;
}

.progress-title {
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
}

.progress-count {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-muted;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-full;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    tokens.$primary-blue 0%,
    tokens.$primary-light 100%
  );
  border-radius: tokens.$radius-full;
  transition: width tokens.$transition-normal;
}

/* 目标列表 */
.goals-list {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-md;
}

.goal-item {
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-md;
  border: 2px solid tokens.$border-light;
  background: tokens.$bg-light;
  transition: all tokens.$transition-fast;

  &:hover {
    border-color: tokens.$primary-blue;
    background: tokens.$bg-lighter;
  }

  &.completed {
    border-color: tokens.$success;
    background: rgb(16 185 129 / 10%);
  }
}

.goal-content {
  @include utils.flex-between;

  gap: tokens.$spacing-md;
}

.goal-main {
  @include utils.flex-row(tokens.$spacing-md, flex-start);

  flex: 1;
}

.goal-number {
  width: 24px;
  height: 24px;
  border-radius: tokens.$radius-full;

  @include utils.flex-center;

  flex-shrink: 0;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-bold;

  &.number-completed {
    background: tokens.$success;
    color: white;
  }

  &.number-pending {
    background: tokens.$border-light;
    color: tokens.$text-muted;
  }
}

.goal-info {
  flex: 1;
}

.goal-title {
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
  margin-bottom: tokens.$spacing-xs;
}

.goal-description {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
}

.goal-progress {
  margin-top: tokens.$spacing-sm;
}

.progress-bar-small {
  width: 100%;
  height: 6px;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-full;
  overflow: hidden;
}

.progress-fill-small {
  height: 100%;
  background: tokens.$primary-blue;
  border-radius: tokens.$radius-full;
  transition: width tokens.$transition-normal;
}

.progress-values {
  @include utils.flex-between;

  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
  margin-top: tokens.$spacing-xs;
}

/* 奖励和操作 */
.goal-actions {
  @include utils.flex-col(tokens.$spacing-sm, flex-end);
}

.goal-rewards {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;

  .reward-item {
    margin-right: tokens.$spacing-sm;

    &:last-child {
      margin-right: 0;
    }
  }
}

.btn-claim {
  padding: tokens.$spacing-xs tokens.$spacing-md;
  background: tokens.$success;
  color: white;
  font-size: tokens.$font-size-xs;
  border-radius: tokens.$radius-md;
  border: none;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover {
    background: tokens.$success-green;
  }
}

.btn-disabled {
  padding: tokens.$spacing-xs tokens.$spacing-md;
  background: tokens.$bg-light;
  color: tokens.$text-muted;
  font-size: tokens.$font-size-xs;
  border-radius: tokens.$radius-md;
  border: none;
  cursor: not-allowed;
}

/* 完成提示 */
.completion-notice {
  margin-top: tokens.$spacing-xl;
  padding: tokens.$spacing-md;
  background: rgb(16 185 129 / 10%);
  border-left: 4px solid tokens.$success;
  border-radius: 0 tokens.$radius-md tokens.$radius-md 0;
}

.notice-content {
  @include utils.flex-row(tokens.$spacing-md, center);
}

.notice-icon {
  font-size: tokens.$font-size-xl;
  color: tokens.$success;
}

.notice-title {
  color: tokens.$success;
}

.notice-desc {
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-sm;
  margin-top: tokens.$spacing-xs;
  margin-bottom: 0;
}

/* 响应式设计 */
@include utils.mobile {
  .newbie-goals-container {
    padding: tokens.$spacing-md;
  }

  .goals-card {
    padding: tokens.$spacing-md;
  }

  .goal-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .goal-actions {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
