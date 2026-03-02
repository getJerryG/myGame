<template>
  <div class="task-reward-config">
    <div class="config-section">
      <h4 class="section-title">任务奖励配置</h4>
      <p class="section-description">
        设置各类任务的奖励，鼓励玩家参与游戏活动
      </p>

      <!-- 任务列表 -->
      <div class="task-list">
        <div v-for="task in tasks" :key="task.id" class="task-item">
          <div class="task-header">
            <div class="task-info">
              <span class="task-icon">{{ task.icon }}</span>
              <div class="task-details">
                <div class="task-name">{{ task.name }}</div>
                <div class="task-description">{{ task.description }}</div>
              </div>
            </div>
            <div class="task-actions">
              <button class="btn btn-sm btn-secondary" @click="editTask(task)">
                编辑
              </button>
            </div>
          </div>
          <div class="task-rewards">
            <h6>奖励</h6>
            <div class="rewards-list">
              <span
                v-for="(reward, index) in task.rewards"
                :key="index"
                class="reward-tag"
              >
                {{ reward.icon }} {{ reward.name }} × {{ reward.amount }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  tasks: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['edit-task']);

// 编辑任务
function editTask(task) {
  emit('edit-task', task);
}
</script>

<style lang="scss" scoped>
.task-reward-config {
  padding: 0;
}

/* 配置区块 */
.config-section {
  @include utils.config-section;
}

.section-title {
  @include utils.section-title;
}

.section-description {
  @include utils.section-description;
}

/* 任务列表 */
.task-list {
  @include utils.flex-col(tokens.$spacing-md, stretch);
}

.task-item {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;
  transition: all tokens.$transition-fast;
  border: 1px solid transparent;

  &:hover {
    background-color: tokens.$bg-lighter;
    border-color: tokens.$border-light;
  }
}

.task-header {
  @include utils.flex-between(flex-start);

  margin-bottom: tokens.$spacing-md;
}

.task-info {
  @include utils.flex-row(tokens.$spacing-sm, center);

  flex: 1;
}

.task-icon {
  font-size: tokens.$font-size-xl;
  flex-shrink: 0;
}

.task-details {
  flex: 1;
}

.task-name {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
  margin-bottom: tokens.$spacing-xs;
}

.task-description {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
  line-height: 1.4;
}

.task-actions {
  flex-shrink: 0;
}

.btn-secondary {
  @include utils.btn-secondary;

  padding: tokens.$spacing-xs tokens.$spacing-sm;
  font-size: tokens.$font-size-xs;
}

.task-rewards {
  margin-top: tokens.$spacing-sm;

  h6 {
    font-size: tokens.$font-size-xs;
    font-weight: tokens.$font-weight-medium;
    color: tokens.$text-secondary;
    margin: 0 0 tokens.$spacing-sm;
  }
}

.rewards-list {
  display: flex;
  flex-wrap: wrap;
  gap: tokens.$spacing-sm;
}

.reward-tag {
  @include utils.flex-row(tokens.$spacing-xs, center);

  padding: tokens.$spacing-xs tokens.$spacing-sm;
  background-color: tokens.$bg-lighter;
  border-radius: tokens.$radius-full;
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
}

/* 响应式设计 */
@include utils.mobile {
  .task-header {
    flex-direction: column;
    align-items: flex-start;
    gap: tokens.$spacing-sm;
  }

  .task-actions {
    width: 100%;

    .btn {
      width: 100%;
    }
  }

  .rewards-list {
    justify-content: center;
  }
}
</style>
