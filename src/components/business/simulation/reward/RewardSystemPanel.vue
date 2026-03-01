<template>
  <div class="reward-system-panel">
    <!-- 面板头部 -->
    <div class="panel-header">
      <h3 class="panel-title">奖励系统</h3>
      <button
        class="collapse-btn"
        aria-expanded="!isCollapsed"
        @click="toggleCollapse"
      >
        <span class="collapse-icon">{{ isCollapsed ? '▶️' : '▼' }}</span>
      </button>
    </div>

    <!-- 面板内容 -->
    <div
      class="panel-content"
      :class="{ collapsed: isCollapsed }"
    >
      <!-- 奖励类型标签页 -->
      <div class="reward-tabs">
        <button
          v-for="tab in rewardTabs"
          :key="tab.value"
          class="reward-tab"
          :class="{ active: activeTab === tab.value }"
          @click="switchTab(tab.value)"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>

      <!-- 奖励配置内容 -->
      <div class="reward-content">
        <!-- 登录奖励配置 -->
        <div
          v-if="activeTab === 'login'"
          class="tab-content"
        >
          <LoginRewardConfig
            :login-rewards="loginRewards"
            @drag-start="onDragStart"
            @drop="onDrop"
            @add-reward="addLoginReward"
            @remove-reward="removeLoginReward"
            @open-editor="openRewardEditor"
          />
        </div>

        <!-- 任务奖励配置 -->
        <div
          v-if="activeTab === 'task'"
          class="tab-content"
        >
          <TaskRewardConfig
            :tasks="tasks"
            @edit-task="editTask"
          />
        </div>

        <!-- 赛季奖励配置 -->
        <div
          v-if="activeTab === 'season'"
          class="tab-content"
        >
          <SeasonRewardConfig
            :ranks="ranks"
            @edit-rank-reward="editRankReward"
          />
        </div>
      </div>

      <!-- 奖励价值计算器 -->
      <div class="calculator-section">
        <h4 class="section-title">奖励价值计算器</h4>
        <div class="calculator-grid">
          <div class="calculator-item">
            <span class="calculator-label">总成本</span>
            <span class="calculator-value">{{ calculateTotalCost() }}点券</span>
          </div>
          <div class="calculator-item">
            <span class="calculator-label">预计留存提升</span>
            <span class="calculator-value">{{ calculateRetentionIncrease() }}%</span>
          </div>
          <div class="calculator-item">
            <span class="calculator-label">预期参与率</span>
            <span class="calculator-value">{{ calculateParticipationRate() }}%</span>
          </div>
          <div class="calculator-item">
            <span class="calculator-label">ROI估算</span>
            <span
              class="calculator-value"
              :class="getROIClass()"
            >
              {{ calculateROI() }}%
            </span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button
          class="btn btn-secondary"
          @click="resetConfig"
        >
          <span class="btn-icon">🔄</span>
          <span class="btn-text">重置配置</span>
        </button>
        <button
          class="btn btn-primary"
          @click="saveConfig"
        >
          <span class="btn-icon">💾</span>
          <span class="btn-text">保存配置</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoginRewardConfig from './LoginRewardConfig.vue';
import TaskRewardConfig from './TaskRewardConfig.vue';
import SeasonRewardConfig from './SeasonRewardConfig.vue';

// 定义事件
const emit = defineEmits(['rewards-updated']);

// 响应式数据
const isCollapsed = ref(false);
const activeTab = ref('login');
const draggedIndex = ref(null);

// 奖励类型标签
const rewardTabs = [
  { value: 'login', label: '登录奖励', icon: '📅' },
  { value: 'task', label: '任务奖励', icon: '📋' },
  { value: 'season', label: '赛季奖励', icon: '🏆' },
];

// 登录奖励数据
const loginRewards = ref([
  {
    day: 1,
    reward: {
      id: 1,
      name: '钻石',
      icon: '💎',
      amount: 100,
      value: 100,
    },
  },
  {
    day: 2,
    reward: {
      id: 2,
      name: '金币',
      icon: '💰',
      amount: 2000,
      value: 50,
    },
  },
  {
    day: 3,
    reward: {
      id: 3,
      name: '皮肤体验卡',
      icon: '🎨',
      amount: 1,
      value: 200,
    },
  },
  {
    day: 4,
    reward: {
      id: 4,
      name: '英雄碎片',
      icon: '🧩',
      amount: 5,
      value: 150,
    },
  },
  {
    day: 5,
    reward: {
      id: 5,
      name: '钻石',
      icon: '💎',
      amount: 200,
      value: 200,
    },
  },
  {
    day: 6,
    reward: {
      id: 6,
      name: '金币',
      icon: '💰',
      amount: 5000,
      value: 125,
    },
  },
  {
    day: 7,
    reward: {
      id: 7,
      name: '限定头像框',
      icon: '🖼️',
      amount: 1,
      value: 300,
    },
  },
]);

// 任务数据
const tasks = ref([
  {
    id: 1,
    name: '每日签到',
    description: '每天登录游戏并签到',
    icon: '📝',
    rewards: [
      { id: 1, name: '金币', icon: '💰', amount: 500, value: 12.5 },
      { id: 2, name: '钻石', icon: '💎', amount: 10, value: 10 },
    ],
  },
  {
    id: 2,
    name: '排位胜利',
    description: '在排位赛中获得3场胜利',
    icon: '🏆',
    rewards: [
      { id: 3, name: '排位币', icon: '🏅', amount: 100, value: 50 },
      { id: 4, name: '英雄碎片', icon: '🧩', amount: 2, value: 60 },
    ],
  },
  {
    id: 3,
    name: '活跃度满',
    description: '每日活跃度达到100',
    icon: '🔥',
    rewards: [
      { id: 5, name: '钻石', icon: '💎', amount: 50, value: 50 },
      { id: 6, name: '皮肤碎片', icon: '🎨', amount: 1, value: 80 },
    ],
  },
]);

// 段位数据
const ranks = ref([
  {
    id: 1,
    name: '荣耀王者',
    icon: '👑',
    rewards: [
      {
        id: 1,
        name: '荣耀王者头像框',
        icon: '🖼️',
        amount: 1,
        value: 500,
      },
      { id: 2, name: '钻石', icon: '💎', amount: 1000, value: 1000 },
      { id: 3, name: '专属皮肤', icon: '🎨', amount: 1, value: 888 },
    ],
  },
  {
    id: 2,
    name: '王者',
    icon: '👑',
    rewards: [
      { id: 4, name: '王者头像框', icon: '🖼️', amount: 1, value: 300 },
      { id: 5, name: '钻石', icon: '💎', amount: 800, value: 800 },
    ],
  },
  {
    id: 3,
    name: '星耀',
    icon: '🌟',
    rewards: [
      { id: 6, name: '星耀头像框', icon: '🖼️', amount: 1, value: 200 },
      { id: 7, name: '钻石', icon: '💎', amount: 600, value: 600 },
    ],
  },
  {
    id: 4,
    name: '钻石',
    icon: '💎',
    rewards: [
      { id: 8, name: '钻石头像框', icon: '🖼️', amount: 1, value: 150 },
      { id: 9, name: '钻石', icon: '💎', amount: 400, value: 400 },
    ],
  },
  {
    id: 5,
    name: '铂金',
    icon: '🥉',
    rewards: [
      { id: 10, name: '铂金头像框', icon: '🖼️', amount: 1, value: 100 },
      { id: 11, name: '钻石', icon: '💎', amount: 200, value: 200 },
    ],
  },
  {
    id: 6,
    name: '黄金及以下',
    icon: '🥇',
    rewards: [
      { id: 12, name: '黄金头像框', icon: '🖼️', amount: 1, value: 50 },
      { id: 13, name: '钻石', icon: '💎', amount: 100, value: 100 },
    ],
  },
]);

// 切换折叠状态
const toggleCollapse = (): void => {
  isCollapsed.value = !isCollapsed.value;
};

// 切换标签页
const switchTab = (tab: string): void => {
  activeTab.value = tab;
};

// 拖拽开始
const onDragStart = (index: number): void => {
  draggedIndex.value = index;
};

// 拖拽结束
const onDrop = (targetIndex: number): void => {
  if (draggedIndex.value !== null && draggedIndex.value !== targetIndex) {
    const draggedItem = loginRewards.value[draggedIndex.value];
    loginRewards.value.splice(draggedIndex.value, 1);
    loginRewards.value.splice(targetIndex, 0, draggedItem);
    // 更新天数
    loginRewards.value.forEach((item, index) => {
      item.day = index + 1;
    });
  }
  draggedIndex.value = null;
};

// 添加登录奖励
const addLoginReward = () => {
  loginRewards.value.push({
    day: loginRewards.value.length + 1,
    reward: {
      id: Date.now(),
      name: '钻石',
      icon: '💎',
      amount: 50,
      value: 50,
    },
  });
};

// 移除登录奖励
const removeLoginReward = (index) => {
  loginRewards.value.splice(index, 1);
  // 更新天数
  loginRewards.value.forEach((item, idx) => {
    item.day = idx + 1;
  });
};

// 打开奖励编辑器
const openRewardEditor = () => {
  // 这里可以实现奖励编辑逻辑
};

// 编辑任务
const editTask = () => {
  // 这里可以实现任务编辑逻辑
};

// 编辑段位奖励
const editRankReward = () => {
  // 这里可以实现段位奖励编辑逻辑
};

// 计算总成本
const calculateTotalCost = () => {
  let total = 0;

  // 计算登录奖励成本
  loginRewards.value.forEach((day) => {
    total += day.reward.value;
  });

  // 计算任务奖励成本
  tasks.value.forEach((task) => {
    task.rewards.forEach((reward) => {
      total += reward.value;
    });
  });

  // 计算赛季奖励成本
  ranks.value.forEach((rank) => {
    rank.rewards.forEach((reward) => {
      total += reward.value;
    });
  });

  return total;
};

// 计算预计留存提升
const calculateRetentionIncrease = () => {
  // 简单估算，实际应该基于历史数据
  const loginRewardDays = loginRewards.value.length;
  return Math.min(loginRewardDays * 2.5, 30).toFixed(1);
};

// 计算预期参与率
const calculateParticipationRate = () => {
  // 简单估算
  return '75.5';
};

// 计算ROI
const calculateROI = () => {
  // 简单估算
  return '245';
};

// 获取ROI样式
const getROIClass = () => {
  const roi = calculateROI();
  if (parseFloat(roi) > 200) return 'positive';
  if (parseFloat(roi) < 100) return 'negative';
  return '';
};

// 重置配置
const resetConfig = () => {
  // 重置逻辑
};

// 保存配置
const saveConfig = () => {
  emit('rewards-updated', {
    loginRewards: loginRewards.value,
    tasks: tasks.value,
    ranks: ranks.value,
  });
  alert('奖励配置已保存！');
};
</script>

<style lang="scss" scoped>
.reward-system-panel {
  @include utils.panel-base;
}

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

.panel-content {
  @include utils.panel-content;

  &.collapsed {
    max-height: 0;
    padding: 0;
    overflow: hidden;
  }
}

/* 奖励类型标签页 */
.reward-tabs {
  @include utils.tabs-container;
}

.reward-tab {
  @include utils.tab-item;

  .tab-icon {
    font-size: tokens.$font-size-base;
  }

  .tab-label {
    @include utils.tab-label;
  }
}

/* 奖励配置内容 */
.reward-content {
  margin-bottom: tokens.$spacing-lg;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 计算器区域 */
.calculator-section {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-lg;
  margin-bottom: tokens.$spacing-lg;

  .section-title {
    @include utils.subsection-title;

    margin-bottom: tokens.$spacing-md;
  }
}

.calculator-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: tokens.$spacing-md;

  @include utils.mobile {
    grid-template-columns: repeat(2, 1fr);
  }
}

.calculator-item {
  @include utils.stat-item;

  text-align: center;
}

.calculator-label {
  @include utils.stat-label;
}

.calculator-value {
  @include utils.stat-value(tokens.$primary-gold);

  &.positive {
    color: tokens.$success;
  }

  &.negative {
    color: tokens.$error;
  }
}

/* 操作按钮 */
.action-buttons {
  @include utils.flex-row(tokens.$spacing-md, center, flex-end);
}

.btn {
  @include utils.btn-base;

  &.btn-primary {
    @include utils.btn-primary;
  }

  &.btn-secondary {
    @include utils.btn-secondary;
  }
}
</style>
