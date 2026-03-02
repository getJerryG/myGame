<template>
  <div class="resource-list-container">
    <!-- 选项卡导航区 -->
    <div class="tabs-navigation">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <!-- 内容展示区 -->
    <div class="tabs-content">
      <!-- 任务列表选项卡 -->
      <div v-show="activeTab === 'tasks'" class="tab-panel">
        <h2 class="section-title">任务列表</h2>
        <div class="task-list">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="task-item"
            :class="task.status"
          >
            <div class="task-header">
              <div class="task-title">
                <span class="task-icon">{{ task.icon }}</span>
                {{ task.title }}
              </div>
              <div class="task-status-badge" :class="task.status">
                <span class="status-text">{{
                  task.status === "completed" ? "已完成" : "进行中"
                }}</span>
              </div>
            </div>
            <div class="task-description">{{ task.description }}</div>
            <div class="task-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: task.progress + '%' }"
                ></div>
                <div class="progress-glow"></div>
              </div>
              <div class="progress-text">{{ task.progress }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷功能选项卡 -->
      <div v-show="activeTab === 'quick-actions'" class="tab-panel">
        <h2 class="section-title">快捷功能</h2>
        <div class="quick-actions-grid">
          <div
            class="quick-action-item"
            @click="handleQuickAction('inventory')"
          >
            <div class="quick-action-icon">🎒</div>
            <div class="quick-action-name">背包</div>
            <div class="quick-action-desc">查看和使用物品</div>
          </div>
          <div
            class="quick-action-item"
            @click="handleQuickAction('achievements')"
          >
            <div class="quick-action-icon">🏆</div>
            <div class="quick-action-name">成就</div>
            <div class="quick-action-desc">查看成就进度</div>
          </div>
          <div class="quick-action-item" @click="handleQuickAction('lottery')">
            <div class="quick-action-icon">🎲</div>
            <div class="quick-action-name">抽奖</div>
            <div class="quick-action-desc">参与抽奖活动</div>
          </div>
          <div class="quick-action-item" @click="handleQuickAction('settings')">
            <div class="quick-action-icon">⚙️</div>
            <div class="quick-action-name">设置</div>
            <div class="quick-action-desc">调整游戏设置</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useGameStore } from "@/stores/gameStore";
import { useRouter } from "vue-router";

const gameStore = useGameStore();
const _router = useRouter();

// 选项卡配置
const tabs = ref([
  { id: "tasks", label: "任务", icon: "📋" },
  { id: "quick-actions", label: "功能", icon: "⚡" },
]);

// 当前激活的选项卡
const activeTab = ref("tasks");

// 模拟任务数据
const tasks = ref([
  {
    id: 1,
    title: "击败10只哥布林",
    description: "在平原地图击败10只哥布林",
    status: "in_progress",
    progress: 70,
    icon: "👾",
  },
  {
    id: 2,
    title: "收集5个宝箱",
    description: "在任意地图收集5个宝箱",
    status: "in_progress",
    progress: 40,
    icon: "📦",
  },
  {
    id: 3,
    title: "到达10级",
    description: "将角色升级到10级",
    status: "completed",
    progress: 100,
    icon: "🏆",
  },
]);

// 处理快捷功能点击
function handleQuickAction(action: string): void {
  switch (action) {
    case "inventory":
      // 这里可以打开背包
      gameStore.setGameMessage("打开背包功能");
      break;
    case "achievements":
      // 这里可以打开成就
      gameStore.setGameMessage("查看成就");
      break;
    case "lottery":
      // 这里可以跳转到抽奖页面
      _router.push("/lottery");
      break;
    case "settings":
      // 这里可以打开设置
      gameStore.setGameMessage("打开设置");
      break;
    default:
      break;
  }
}
</script>

<style lang="scss" scoped>
/* 核心容器样式 */
.resource-list-container {
  padding: 20px;
  font-family: "Comic Sans MS", cursive, sans-serif;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
}

/* 选项卡导航样式 */
.tabs-navigation {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-radius: 15px;
  background: rgb(255 255 255 / 80%);
  padding: 6px;
  box-shadow: 0 4px 15px rgb(0 0 0 / 10%);
  border: 2px solid #e2e8f0;
}

/* 选项卡按钮样式 */
.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%);
  border: 2px solid #cbd5e1;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  flex: 1;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgb(255 255 255 / 40%),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgb(0 0 0 / 15%);
    border-color: #667eea;

    &::before {
      left: 100%;
    }
  }

  /* 选项卡激活状态 */
  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: #667eea;
    box-shadow: 0 6px 20px rgb(102 126 234 / 40%);
    transform: translateY(-2px);

    .tab-icon {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }
}

.tab-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.tab-label {
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 选项卡内容区域 */
.tabs-content {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
  padding-right: 5px;
}

/* 滚动条样式 */
.tabs-content {
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgb(255 255 255 / 50%);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
    border: 2px solid rgb(255 255 255 / 50%);

    &:hover {
      background: linear-gradient(180deg, #764ba2 0%, #667eea 100%);
    }
  }
}

/* 选项卡面板样式 */
.tab-panel {
  animation: panelFadeIn 0.4s ease;
}

@keyframes panelFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 标题样式 */
.section-title {
  font-size: 22px;
  font-weight: bold;
  color: #475569;
  margin-bottom: 20px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 任务列表样式 */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-item {
  background: white;
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #cbd5e1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgb(0 0 0 / 10%);
}

.task-item {
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
    transition: all 0.3s ease;
  }

  &.in_progress {
    border-color: #f59e0b;
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);

    &::before {
      background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b);
    }
  }

  &.completed {
    border-color: #10b981;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);

    &::before {
      background: linear-gradient(90deg, #10b981, #34d399, #10b981);
    }
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgb(0 0 0 / 15%);
    border-color: #667eea;
  }
}

/* 任务头部样式 */
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.task-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: 18px;
  color: #2d3748;
}

.task-icon {
  font-size: 20px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

/* 任务状态徽章样式 */
.task-status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%);

  &.in_progress {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    animation: pulse 2s ease-in-out infinite;
  }

  &.completed {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }
}

/* 任务描述样式 */
.task-description {
  font-size: 15px;
  color: #64748b;
  margin-bottom: 15px;
  line-height: 1.6;
  background: rgb(255 255 255 / 80%);
  padding: 12px;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

/* 任务进度样式 */
.task-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 16px;
  background: rgb(255 255 255 / 80%);
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #cbd5e1;
  position: relative;
  box-shadow: inset 0 2px 8px rgb(0 0 0 / 10%);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.progress-glow {
  position: absolute;
  inset: 0;
  opacity: 0.6;
  filter: blur(6px);
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  z-index: 0;
}

.task-item {
  &.in_progress {
    .progress-fill,
    .progress-glow {
      background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
    }
  }

  &.completed {
    .progress-fill,
    .progress-glow {
      background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
    }
  }
}

.progress-text {
  font-size: 14px;
  font-weight: bold;
  color: #475569;
  min-width: 50px;
  text-align: right;
  text-shadow: 0 1px 2px rgb(255 255 255 / 80%);
}

/* 快捷功能网格样式 */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.quick-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 25px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 2px solid #cbd5e1;
  border-radius: 18px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgb(0 0 0 / 10%);
}

.quick-action-item {
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
    transition: all 0.3s ease;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgb(255 255 255 / 40%),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 15px 35px rgb(0 0 0 / 15%);
    border-color: #667eea;
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);

    &::after {
      left: 100%;
    }

    .quick-action-icon {
      transform: scale(1.2) rotate(10deg);
      animation: spin 0.5s ease;
    }
  }
}

.quick-action-icon {
  font-size: 48px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.quick-action-name {
  font-weight: bold;
  font-size: 18px;
  color: #2d3748;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 1;
}

.quick-action-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.4;
  z-index: 1;
  background: rgb(255 255 255 / 80%);
  padding: 8px 12px;
  border-radius: 10px;
  border-left: 3px solid #667eea;
}

/* 响应式设计 */
@media (width <= 768px) {
  .tabs-navigation {
    flex-direction: column;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
