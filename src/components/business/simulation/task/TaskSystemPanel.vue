<template>
  <Panel title="任务" collapsible class="task-panel">
    <!-- 每日任务 -->
    <Card class="task-section" variant="info" size="small">
      <template #header>
        <h3 class="section-title">每日任务</h3>
      </template>

      <List
        :items="dailyTasks"
        layout="vertical"
        class="task-list"
        :empty-text="'暂无每日任务'"
        :empty-icon="'📋'"
      >
        <template #item="{ item }">
          <Card
            :variant="item.completed ? 'success' : 'default'"
            size="small"
            class="task-item"
          >
            <div class="task-content">
              <span class="task-icon" aria-hidden="true">{{
                item.icon || "📋"
              }}</span>
              <h4 class="task-title">{{ item.title }}</h4>
              <span class="task-progress-text"
                >{{ item.progress }}/{{ item.target }}</span
              >
            </div>
            <Button
              :variant="item.completed ? 'success' : 'primary'"
              size="small"
              :disabled="item.completed"
            >
              {{ item.completed ? "已完成" : "未完成" }}
            </Button>
          </Card>
        </template>
      </List>
    </Card>

    <!-- 周任务 -->
    <Card class="task-section" variant="warning" size="small">
      <template #header>
        <h3 class="section-title">周任务</h3>
      </template>

      <List
        :items="weeklyTasks"
        layout="vertical"
        class="task-list"
        :empty-text="'暂无周任务'"
        :empty-icon="'📅'"
      >
        <template #item="{ item }">
          <Card
            :variant="item.completed ? 'success' : 'default'"
            size="small"
            class="task-item"
          >
            <div class="task-content">
              <span class="task-icon" aria-hidden="true">{{
                item.icon || "📅"
              }}</span>
              <h4 class="task-title">{{ item.title }}</h4>
              <span class="task-progress-text"
                >{{ item.progress }}/{{ item.target }}</span
              >
            </div>
            <Button
              :variant="item.completed ? 'success' : 'primary'"
              size="small"
              :disabled="item.completed"
            >
              {{ item.completed ? "已完成" : "未完成" }}
            </Button>
          </Card>
        </template>
      </List>
    </Card>

    <!-- 月度任务 -->
    <Card class="task-section" variant="primary" size="small">
      <template #header>
        <h3 class="section-title">月度任务</h3>
      </template>

      <List
        :items="monthlyTasks"
        layout="vertical"
        class="task-list"
        :empty-text="'暂无月度任务'"
        :empty-icon="'📊'"
      >
        <template #item="{ item }">
          <Card
            :variant="item.completed ? 'success' : 'default'"
            size="small"
            class="task-item"
          >
            <div class="task-content">
              <span class="task-icon" aria-hidden="true">{{
                item.icon || "📊"
              }}</span>
              <h4 class="task-title">{{ item.title }}</h4>
              <span class="task-progress-text"
                >{{ item.progress }}/{{ item.target }}</span
              >
            </div>
            <Button
              :variant="item.completed ? 'success' : 'primary'"
              size="small"
              :disabled="item.completed"
            >
              {{ item.completed ? "已完成" : "未完成" }}
            </Button>
          </Card>
        </template>
      </List>
    </Card>
  </Panel>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Panel from "@/components/common/Panel/index.vue";
import Card from "@/components/common/Card/index.vue";
import List from "@/components/common/List/index.vue";
import Button from "@/components/common/Button/index.vue";

interface Task {
  id: string;
  title: string;
  icon?: string;
  progress: number;
  target: number;
  completed: boolean;
}

interface Tasks {
  daily?: Task[];
  weekly?: Task[];
  monthly?: Task[];
}

const props = defineProps<{
  tasks: Tasks;
}>();

// 计算属性：每日任务
const dailyTasks = computed(() => {
  return props.tasks.daily || [];
});

// 计算属性：周任务
const weeklyTasks = computed(() => {
  return props.tasks.weekly || [];
});

// 计算属性：月度任务
const monthlyTasks = computed(() => {
  return props.tasks.monthly || [];
});
</script>

<style lang="scss" scoped>
/* 任务面板 */
.task-panel {
  width: 100%;
}

/* 任务区域 */
.task-section {
  margin-bottom: tokens.$spacing-md;

  h4 {
    margin: 0;
  }
}

.section-title {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
  margin: 0;
}

/* 任务列表 */
.task-list {
  .list__item {
    padding: 0;
    border-bottom: none;

    &:hover {
      background-color: transparent;
    }
  }

  .list__empty {
    text-align: center;
    padding: tokens.$spacing-lg;
  }
}

/* 任务项 */
.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: tokens.$spacing-xs;

  &:hover {
    transform: translateY(-1px);
  }
}

/* 任务内容 */
.task-content {
  display: flex;
  align-items: center;
  gap: tokens.$spacing-sm;
  flex: 1;
}

/* 任务图标 */
.task-icon {
  font-size: tokens.$font-size-base;
  background: tokens.$border-light;
  border-radius: tokens.$radius-sm;
  padding: tokens.$spacing-xs;
  color: tokens.$text-muted;
  flex-shrink: 0;

  /* 已完成任务的图标样式 */
  .task-item:has(.btn--success) & {
    background: tokens.$success;
    color: white;
  }
}

/* 任务标题 */
.task-title {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
  margin: 0;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 任务进度文本 */
.task-progress-text {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
  flex-shrink: 0;
}

/* 响应式设计 */
@include utils.mobile {
  .task-content {
    gap: tokens.$spacing-xs;
  }

  .task-title {
    font-size: tokens.$font-size-xs;
  }

  .task-progress-text {
    font-size: tokens.$font-size-xs;
  }
}
</style>
