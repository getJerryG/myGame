<template>
  <section
    class="task-panel"
    aria-labelledby="task-system-title"
  >
    <div class="panel-header">
      <h2
        id="task-system-title"
        class="panel-title"
      >
        任务
      </h2>
      <button
        class="collapse-btn"
        aria-expanded="!isCollapsed"
        @click="toggleCollapse"
      >
        <span class="collapse-icon">{{ isCollapsed ? '▶️' : '▼' }}</span>
      </button>
    </div>

    <div
      class="panel-content"
      :class="{ collapsed: isCollapsed }"
    >
      <!-- 每日任务 -->
      <div class="task-section">
        <h3 class="section-title">每日任务</h3>
        <div
          v-if="dailyTasks.length === 0"
          class="empty-tasks"
          aria-label="暂无每日任务"
        >
          <p>暂无每日任务</p>
        </div>
        <div
          v-for="task in dailyTasks"
          :key="task.id"
          class="task-bubble"
          :class="{ completed: task.completed }"
          :aria-label="task.title + (task.completed ? ' 已完成' : ' 进度: ' + task.progress + '/' + task.target)"
        >
          <span
            class="task-icon"
            aria-hidden="true"
            >{{ task.icon || '📋' }}</span
          >
          <h4 class="task-title">{{ task.title }}</h4>
          <span class="task-progress-text">{{ task.progress }}/{{ task.target }}</span>
          <button class="task-status-btn">{{ task.completed ? '已完成' : '未完成' }}</button>
        </div>
      </div>

      <!-- 周任务 -->
      <div class="task-section">
        <h3 class="section-title">周任务</h3>
        <div
          v-if="weeklyTasks.length === 0"
          class="empty-tasks"
          aria-label="暂无周任务"
        >
          <p>暂无周任务</p>
        </div>
        <div
          v-for="task in weeklyTasks"
          :key="task.id"
          class="task-bubble"
          :class="{ completed: task.completed }"
          :aria-label="task.title + (task.completed ? ' 已完成' : ' 进度: ' + task.progress + '/' + task.target)"
        >
          <span
            class="task-icon"
            aria-hidden="true"
            >{{ task.icon || '📅' }}</span
          >
          <h4 class="task-title">{{ task.title }}</h4>
          <span class="task-progress-text">{{ task.progress }}/{{ task.target }}</span>
          <button class="task-status-btn">{{ task.completed ? '已完成' : '未完成' }}</button>
        </div>
      </div>

      <!-- 月度任务 -->
      <div class="task-section">
        <h3 class="section-title">月度任务</h3>
        <div
          v-if="monthlyTasks.length === 0"
          class="empty-tasks"
          aria-label="暂无月度任务"
        >
          <p>暂无月度任务</p>
        </div>
        <div
          v-for="task in monthlyTasks"
          :key="task.id"
          class="task-bubble"
          :class="{ completed: task.completed }"
          :aria-label="task.title + (task.completed ? ' 已完成' : ' 进度: ' + task.progress + '/' + task.target)"
        >
          <span
            class="task-icon"
            aria-hidden="true"
            >{{ task.icon || '📊' }}</span
          >
          <h4 class="task-title">{{ task.title }}</h4>
          <span class="task-progress-text">{{ task.progress }}/{{ task.target }}</span>
          <button class="task-status-btn">{{ task.completed ? '已完成' : '未完成' }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
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

<style lang="scss" scoped>

/* 任务面板 */
.task-panel {
  background: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  box-shadow: tokens.$shadow-md;
  overflow: hidden;
  border: 1px solid tokens.$border-light;
}

/* 面板头部 */
.panel-header {
  @include utils.panel-header;
}

.panel-title {
  @include utils.panel-title;
}

.collapse-btn {
  @include utils.collapse-btn;
}

.collapse-icon {
  font-size: tokens.$font-size-sm;
}

/* 面板内容 */
.panel-content {
  @include utils.panel-content;

  &.collapsed {
    max-height: 0;
    padding: 0;
    overflow: hidden;
  }
}

/* 任务区域 */
.task-section {
  margin-bottom: tokens.$spacing-lg;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-muted;
  margin-bottom: tokens.$spacing-md;
}

/* 任务卡片 */
.task-bubble {
  @include utils.flex-row(tokens.$spacing-md, center);

  background: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-sm tokens.$spacing-md;
  border: 1px solid tokens.$border-light;
  transition: all tokens.$transition-normal;
  margin-bottom: tokens.$spacing-sm;

  &:hover {
    background: tokens.$bg-lighter;
    box-shadow: tokens.$shadow-md;
    transform: translateY(-1px);
  }

  &.completed {
    background: rgb(16 185 129 / 10%);
    border-color: tokens.$success;
  }
}

.task-icon {
  font-size: tokens.$font-size-base;
  background: tokens.$border-light;
  border-radius: tokens.$radius-sm;
  padding: tokens.$spacing-xs;
  color: tokens.$text-muted;
  flex-shrink: 0;

  .task-bubble.completed & {
    background: tokens.$success;
    color: white;
  }
}

.task-title {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
  margin: 0;
  flex: 1;

  @include utils.text-truncate;
}

/* 任务进度文本 */
.task-progress-text {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
  flex-shrink: 0;
}

/* 任务状态按钮 */
.task-status-btn {
  padding: tokens.$spacing-xs tokens.$spacing-md;
  border: none;
  border-radius: tokens.$radius-full;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-medium;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  flex-shrink: 0;
}

.task-bubble:not(.completed) .task-status-btn {
  background-color: tokens.$primary-blue;
  color: white;

  &:hover {
    background-color: tokens.$primary-dark;
  }
}

.task-bubble.completed .task-status-btn {
  background-color: tokens.$success;
  color: white;

  &:hover {
    background-color: tokens.$success-green;
  }
}

.empty-tasks {
  text-align: center;
  padding: tokens.$spacing-xl tokens.$spacing-lg;
  color: tokens.$text-muted;
  background: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  border: 1px dashed tokens.$border-light;

  p {
    margin: 0;
  }
}

/* 响应式设计 */
@include utils.mobile {
  .panel-header {
    padding: tokens.$spacing-sm tokens.$spacing-md;
  }

  .panel-content {
    padding: tokens.$spacing-md;
  }

  .task-bubble {
    padding: tokens.$spacing-sm;
  }

  .task-title {
    font-size: tokens.$font-size-xs;
  }
}

/* 横屏手机适配 */
@include utils.landscape-mobile {
  .panel-header {
    padding: tokens.$spacing-sm;
  }

  .panel-title {
    font-size: tokens.$font-size-sm;
  }

  .panel-content {
    padding: tokens.$spacing-sm;
  }

  .task-section {
    margin-bottom: tokens.$spacing-md;
  }

  .section-title {
    font-size: tokens.$font-size-xs;
    margin-bottom: tokens.$spacing-sm;
  }

  .task-bubble {
    padding: tokens.$spacing-sm;
  }

  .task-title {
    font-size: tokens.$font-size-xs;
  }

  .empty-tasks {
    padding: tokens.$spacing-lg tokens.$spacing-md;
  }
}
</style>
