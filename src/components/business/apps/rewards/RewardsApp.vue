<template>
  <div class="rewards-app">
    <!-- 左侧菜单�?-->
    <div class="modal-sidebar">
      <div
        class="sidebar-item"
        v-for="module in app.modules"
        :key="module.id"
        :class="{ active: activeModule === module.id }"
        @click="switchModule(module.id)"
      >
        <span class="sidebar-item-icon">{{ getModuleIcon(module.id) }}</span>
        <span class="sidebar-item-name">{{ module.name }}</span>
      </div>
    </div>

    <!-- 右侧内容�?-->
    <div class="modal-main">
      <!-- 核心数据概览 -->
      <div class="content-header">
        <h2>{{ currentModule.name }}</h2>
        <div
          class="module-core-data"
          v-if="app.coreData"
        >
          <div
            class="core-data-item"
            v-for="(value, key) in app.coreData"
            :key="key"
          >
            <span class="core-data-label">{{ getCoreDataLabel(key) }}:</span>
            <span class="core-data-value">{{ value }}</span>
          </div>
        </div>
      </div>

      <!-- 模块内容 -->
      <div class="content-body">
        <!-- 任务系统模块 -->
        <div
          v-if="activeModule === 'task-system'"
          class="module-content"
        >
          <h3>任务系统</h3>
          <div class="tasks-grid">
            <div class="tasks-section">
              <h4>日常任务 ({{ gameData?.tasks?.daily?.length || 0 }})</h4>
              <div
                class="task-item"
                v-if="gameData?.tasks?.daily?.length === 0"
              >
                暂无日常任务
              </div>
              <div
                class="task-item"
                v-for="(task, index) in gameData?.tasks?.daily"
                :key="index"
              >
                {{ task?.name || '未命名任务' }}
              </div>
            </div>

            <div class="tasks-section">
              <h4>周任务 ({{ gameData?.tasks?.weekly?.length || 0 }})</h4>
              <div
                class="task-item"
                v-if="gameData?.tasks?.weekly?.length === 0"
              >
                暂无周任务
              </div>
              <div
                class="task-item"
                v-for="(task, index) in gameData?.tasks?.weekly"
                :key="index"
              >
                {{ task?.name || '未命名任务' }}
              </div>
            </div>

            <div class="tasks-section">
              <h4>月任务 ({{ gameData?.tasks?.monthly?.length || 0 }})</h4>
              <div
                class="task-item"
                v-if="gameData?.tasks?.monthly?.length === 0"
              >
                暂无月任务
              </div>
              <div
                class="task-item"
                v-for="(task, index) in gameData?.tasks?.monthly"
                :key="index"
              >
                {{ task?.name || '未命名任务' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 奖励管理模块 -->
        <div
          v-else-if="activeModule === 'reward-management'"
          class="module-content"
        >
          <h3>奖励管理</h3>
          <p>奖励管理功能开发中...</p>
        </div>

        <!-- 成就系统模块 -->
        <div
          v-else-if="activeModule === 'achievement-system'"
          class="module-content"
        >
          <h3>成就系统</h3>
          <p>成就系统功能开发中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  app: {
    type: Object,
    required: true,
  },
  gameData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:activeModule']);

// 活跃模块状�?const activeModule = ref(props.app.modules[0].id);

// 当前激活的模块
const currentModule = computed(() => {
  return props.app.modules.find((m) => m.id === activeModule.value) || props.app.modules[0];
});

// 切换模块
const switchModule = (moduleId: string): void => {
  activeModule.value = moduleId;
  emit('update:activeModule', moduleId);
};

// 获取模块图标
const getModuleIcon = (moduleId: string): string => {
  const icons = {
    'task-system': '📝',
    'reward-management': '🎁',
    'achievement-system': '🏆',
  };
  return icons[moduleId] || '📦';
};

// 获取核心数据标签
const getCoreDataLabel = (key: string): string => {
  const labels = {
    tasks: '任务',
    rewards: '奖励',
  };
  return labels[key] || key;
};
</script>

<style lang="scss" scoped>
.rewards-app {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 左侧菜单栏样式 */
.modal-sidebar {
  width: 200px;
  background-color: rgb(0 0 0 / 20%);
  border-right: 1px solid #333;
  overflow-y: auto;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #b0b0b0;
  border-left: 3px solid transparent;
}

.sidebar-item:hover {
  background-color: rgb(74 158 255 / 20%);
  color: #fff;
}

.sidebar-item.active {
  background-color: rgb(74 158 255 / 30%);
  color: #fff;
  border-left-color: #4a9eff;
}

.sidebar-item-icon {
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.sidebar-item-name {
  font-size: 14px;
  font-weight: 500;
}

/* 右侧内容区域样式 */
.modal-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: rgb(26 26 46 / 50%);
}

.content-header {
  padding: 16px;
  border-bottom: 1px solid #333;
  background-color: rgb(0 0 0 / 10%);
}

.content-header h2 {
  margin: 0 0 12px;
  font-size: 20px;
  color: #fff;
}

.module-core-data {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.core-data-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.core-data-label {
  color: #b0b0b0;
}

.core-data-value {
  color: #4a9eff;
  font-weight: bold;
}

.content-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  color: #fff;
}

.module-content {
  background-color: rgb(0 0 0 / 10%);
  border-radius: 8px;
  padding: 20px;
  min-height: 200px;
}

.module-content h3 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #4a9eff;
}

.module-content h4 {
  margin: 0 0 12px;
  font-size: 16px;
  color: #fff;
}

.module-content p {
  margin: 0 0 16px;
  color: #b0b0b0;
  line-height: 1.6;
}

/* 任务列表样式 */
.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.tasks-section {
  background-color: rgb(0 0 0 / 20%);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgb(74 158 255 / 20%);
}

.task-item {
  padding: 8px 12px;
  margin: 8px 0;
  background-color: rgb(0 0 0 / 20%);
  border-radius: 4px;
  color: #b0b0b0;
  font-size: 14px;
  transition: all 0.2s ease;
}

.task-item:hover {
  background-color: rgb(74 158 255 / 20%);
  color: #fff;
}
</style>
