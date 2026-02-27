<template>
  <div class="task-reward-config">
    <div class="config-section">
      <h4 class="section-title">任务奖励配置</h4>
      <p class="section-description">设置各类任务的奖励，鼓励玩家参与游戏活动</p>

      <!-- 任务列表 -->
      <div class="task-list">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="task-item"
        >
          <div class="task-header">
            <div class="task-info">
              <span class="task-icon">{{ task.icon }}</span>
              <div class="task-details">
                <div class="task-name">{{ task.name }}</div>
                <div class="task-description">{{ task.description }}</div>
              </div>
            </div>
            <div class="task-actions">
              <button
                class="btn btn-sm btn-secondary"
                @click="editTask(task)"
              >
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
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  padding: 20px;
}

.section-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 8px;
}

.section-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0 0 20px;
}

/* 任务列表 */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-item {
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  padding: 15px;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.task-item:hover {
  background-color: rgb(255 255 255 / 10%);
  border-color: var(--border-light);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.task-info {
  display: flex;
  gap: 12px;
  flex: 1;
}

.task-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.task-details {
  flex: 1;
}

.task-name {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: 4px;
}

.task-description {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  line-height: 1.4;
}

.task-actions {
  flex-shrink: 0;
}

.task-rewards {
  margin-top: 10px;
}

.task-rewards h6 {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  margin: 0 0 8px;
}

.rewards-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.reward-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: rgb(255 255 255 / 10%);
  border-radius: 12px;
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

/* 响应式设�? */
@media (width <= 768px) {
  .task-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .task-actions {
    width: 100%;
  }

  .task-actions .btn {
    width: 100%;
  }

  .rewards-list {
    justify-content: center;
  }
}
</style>
