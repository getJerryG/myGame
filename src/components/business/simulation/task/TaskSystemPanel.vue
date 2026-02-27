<template>
  <section class="task-panel" aria-labelledby="task-system-title">
    <div class="panel-header">
      <h2 id="task-system-title" class="panel-title">任务</h2>
      <button
        class="collapse-btn"
        aria-expanded="!isCollapsed"
        @click="toggleCollapse"
      >
        <span class="collapse-icon">{{ isCollapsed ? '▶️' : '�? }}</span>
      </button>
    </div>

    <div class="panel-content" :class="{ collapsed: isCollapsed }">
      <!-- 每日任务 -->
      <div class="task-section">
        <h3 class="section-title">每日任务</h3>
        <div v-if="dailyTasks.length === 0" class="empty-tasks" aria-label="暂无每日任务">
          <p>暂无每日任务</p>
        </div>
        <div
          v-for="task in dailyTasks"
          :key="task.id"
          class="task-bubble"
          :class="{ completed: task.completed }"
          :aria-label="
            task.title +
            (task.completed
              ? ' 已完�?
              : ' 进度: ' + task.progress + '/' + task.target)
          "
        >
          <span class="task-icon" aria-hidden="true">{{ task.icon || '📋' }}</span>
          <h4 class="task-title">{{ task.title }}</h4>
          <span class="task-progress-text">{{ task.progress }}/{{ task.target }}</span>
          <button class="task-status-btn">{{ task.completed ? '已完�? : '未完�? }}</button>
        </div>
      </div>

      <!-- 周任�?-->
      <div class="task-section">
        <h3 class="section-title">周任�?/h3>
        <div v-if="weeklyTasks.length === 0" class="empty-tasks" aria-label="暂无周任�?
        >
          <p>暂无周任�?/p>
        </div>
        <div
          v-for="task in weeklyTasks"
          :key="task.id"
          class="task-bubble"
          :class="{ completed: task.completed }"
          :aria-label="
            task.title +
            (task.completed
              ? ' 已完�?
              : ' 进度: ' + task.progress + '/' + task.target)
          "
        >
          <span class="task-icon" aria-hidden="true">{{ task.icon || '📅' }}</span>
          <h4 class="task-title">{{ task.title }}</h4>
          <span class="task-progress-text">{{ task.progress }}/{{ task.target }}</span>
          <button class="task-status-btn">{{ task.completed ? '已完�? : '未完�? }}</button>
        </div>
      </div>

      <!-- 月度任务 -->
      <div class="task-section">
        <h3 class="section-title">月度任务</h3>
        <div v-if="monthlyTasks.length === 0" class="empty-tasks" aria-label="暂无月度任务">
          <p>暂无月度任务</p>
        </div>
        <div
          v-for="task in monthlyTasks"
          :key="task.id"
          class="task-bubble"
          :class="{ completed: task.completed }"
          :aria-label="
            task.title +
            (task.completed
              ? ' 已完�?
              : ' 进度: ' + task.progress + '/' + task.target)
          "
        >
          <span class="task-icon" aria-hidden="true">{{ task.icon || '📊' }}</span>
          <h4 class="task-title">{{ task.title }}</h4>
          <span class="task-progress-text">{{ task.progress }}/{{ task.target }}</span>
          <button class="task-status-btn">{{ task.completed ? '已完�? : '未完�? }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang=ts>
export default {
  name: 'TaskSystemPanel',
  props: {
    tasks: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isCollapsed: false,
    };
  },
  computed: {
    dailyTasks() {
      return this.tasks.daily || [];
    },
    weeklyTasks() {
      return this.tasks.weekly || [];
    },
    monthlyTasks() {
      return this.tasks.monthly || [];
    },
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<style lang=scss scoped>
/* 任务面板 */
.task-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

/* 面板头部 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 8px 8px 0 0;
}

.panel-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.collapse-btn:hover {
  background-color: #f1f5f9;
}

.collapse-icon {
  font-size: 14px;
}

/* 面板内容 */
.panel-content {
  padding: 20px;
  background: white;
  border-radius: 0 0 8px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.panel-content.collapsed {
  max-height: 0;
  padding: 0;
  overflow: hidden;
}

/* 任务区域 */
.task-section {
  margin-bottom: 20px;
}

.task-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 12px;
}

/* 任务卡片 */
.task-bubble {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px 15px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  margin-bottom: 10px;
  gap: 12px;
}

.task-bubble:hover {
  background: white;
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
  transform: translateY(-1px);
}

.task-bubble.completed {
  background: #f0fdf4;
  border-color: #dcfce7;
}

.task-icon {
  font-size: 16px;
  background: #e2e8f0;
  border-radius: 6px;
  padding: 6px;
  color: #64748b;
  flex-shrink: 0;
}

.task-bubble.completed .task-icon {
  background: #dcfce7;
  color: #16a34a;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 任务进度文本 */
.task-progress-text {
  font-size: 12px;
  color: #64748b;
  flex-shrink: 0;
}

/* 任务状态按�? */
.task-status-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.task-bubble:not(.completed) .task-status-btn {
  background-color: #3b82f6;
  color: white;
}

.task-bubble:not(.completed) .task-status-btn:hover {
  background-color: #2563eb;
}

.task-bubble.completed .task-status-btn {
  background-color: #10b981;
  color: white;
}

.task-bubble.completed .task-status-btn:hover {
  background-color: #059669;
}

.empty-tasks {
  text-align: center;
  padding: 30px 20px;
  color: #94a3b8;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
}

.empty-tasks p {
  margin: 0;
}

/* 响应式设�? */
@media (width <= 768px) {
  .panel-header {
    padding: 12px 15px;
  }

  .panel-content {
    padding: 15px;
  }

  .task-bubble {
    padding: 12px;
  }

  .task-title {
    font-size: 13px;
  }

  .task-description {
    font-size: 12px;
    margin-bottom: 8px;
  }
}

/* 横屏手机适配 */
@media (orientation: landscape) and (height <= 600px) {
  .panel-header {
    padding: 10px 12px;
  }

  .panel-title {
    font-size: 14px;
  }

  .panel-content {
    padding: 12px;
  }

  .task-section {
    margin-bottom: 15px;
  }

  .section-title {
    font-size: 13px;
    margin-bottom: 8px;
  }

  .task-bubble {
    padding: 12px;
  }

  .task-title {
    font-size: 13px;
  }

  .task-description {
    font-size: 12px;
    margin-bottom: 8px;
  }

  .progress-track {
    height: 4px;
  }

  .progress-text {
    font-size: 11px;
  }

  .task-reward {
    margin-top: 8px;
    padding-top: 8px;
  }

  .reward-text {
    font-size: 11px;
  }

  .empty-tasks {
    padding: 20px 15px;
  }
}
</style>
