<template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">📊 游戏策划大师</h2>
    </div>
    <ul class="menu">
      <!-- 数据洞察 -->
      <li class="menu-item">
        <div
          class="menu-link"
          :class="{ active: activeMainMenu === 'data' }"
          @click="toggleSubMenu('data')"
        >
          <span class="menu-icon">📊</span>
          <span class="menu-text">数据洞察</span>
          <span
            class="menu-arrow"
            :class="{ rotated: openSubMenus.includes('data') }"
            >▼</span
          >
          >
        </div>
        <ul v-if="openSubMenus.includes('data')" class="sub-menu">
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'coreData' }"
              @click="navigateTo('data', 'coreData')"
            >
              <span class="sub-menu-icon">🔢</span>
              <span class="sub-menu-text">核心数据</span>
            </a>
          </li>
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'revenueAnalysis' }"
              @click="navigateTo('data', 'revenueAnalysis')"
            >
              <span class="sub-menu-icon">💰</span>
              <span class="sub-menu-text">收入分析</span>
            </a>
          </li>
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'userProfile' }"
              @click="navigateTo('data', 'userProfile')"
            >
              <span class="sub-menu-icon">👥</span>
              <span class="sub-menu-text">用户画像</span>
            </a>
          </li>
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'dataTrends' }"
              @click="navigateTo('data', 'dataTrends')"
            >
              <span class="sub-menu-icon">📈</span>
              <span class="sub-menu-text">数据趋势</span>
            </a>
          </li>
        </ul>
      </li>

      <!-- 运营管理 -->
      <li class="menu-item">
        <div
          class="menu-link"
          :class="{ active: activeMainMenu === 'operations' }"
          @click="toggleSubMenu('operations')"
        >
          <span class="menu-icon">⚙️</span>
          <span class="menu-text">运营管理</span>
          <span
            class="menu-arrow"
            :class="{ rotated: openSubMenus.includes('operations') }"
            >▼</span
          >
          >
        </div>
        <ul v-if="openSubMenus.includes('operations')" class="sub-menu">
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'eventPlanning' }"
              @click="navigateTo('operations', 'eventPlanning')"
            >
              <span class="sub-menu-icon">🎪</span>
              <span class="sub-menu-text">活动策划</span>
            </a>
          </li>
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'operationStrategy' }"
              @click="navigateTo('operations', 'operationStrategy')"
            >
              <span class="sub-menu-icon">📋</span>
              <span class="sub-menu-text">运营策略</span>
            </a>
          </li>
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'marketSentiment' }"
              @click="navigateTo('operations', 'marketSentiment')"
            >
              <span class="sub-menu-icon">💬</span>
              <span class="sub-menu-text">市场舆情</span>
            </a>
          </li>
        </ul>
      </li>

      <!-- 内容管理 -->
      <li class="menu-item">
        <div
          class="menu-link"
          :class="{ active: activeMainMenu === 'content' }"
          @click="toggleSubMenu('content')"
        >
          <span class="menu-icon">🎮</span>
          <span class="menu-text">内容管理</span>
          <span
            class="menu-arrow"
            :class="{ rotated: openSubMenus.includes('content') }"
            >▼</span
          >
          >
        </div>
        <ul v-if="openSubMenus.includes('content')" class="sub-menu">
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'heroManagement' }"
              @click="navigateTo('content', 'heroManagement')"
            >
              <span class="sub-menu-icon">🦸</span>
              <span class="sub-menu-text">英雄管理</span>
            </a>
          </li>
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'skinRelease' }"
              @click="navigateTo('content', 'skinRelease')"
            >
              <span class="sub-menu-icon">🧵</span>
              <span class="sub-menu-text">皮肤发布</span>
            </a>
          </li>
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'gameOptimization' }"
              @click="navigateTo('content', 'gameOptimization')"
            >
              <span class="sub-menu-icon">⚡</span>
              <span class="sub-menu-text">游戏优化</span>
            </a>
          </li>
        </ul>
      </li>

      <!-- 奖励系统 -->
      <li class="menu-item">
        <div
          class="menu-link"
          :class="{ active: activeMainMenu === 'rewards' }"
          @click="toggleSubMenu('rewards')"
        >
          <span class="menu-icon">🎁</span>
          <span class="menu-text">奖励系统</span>
          <span
            class="menu-arrow"
            :class="{ rotated: openSubMenus.includes('rewards') }"
            >▼</span
          >
          >
        </div>
        <ul v-if="openSubMenus.includes('rewards')" class="sub-menu">
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'taskSystem' }"
              @click="navigateTo('rewards', 'taskSystem')"
            >
              <span class="sub-menu-icon">📝</span>
              <span class="sub-menu-text">任务系统</span>
            </a>
          </li>
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'rewardManagement' }"
              @click="navigateTo('rewards', 'rewardManagement')"
            >
              <span class="sub-menu-icon">🎯</span>
              <span class="sub-menu-text">奖励管理</span>
            </a>
          </li>
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'achievementSystem' }"
              @click="navigateTo('rewards', 'achievementSystem')"
            >
              <span class="sub-menu-icon">🌟</span>
              <span class="sub-menu-text">成就系统</span>
            </a>
          </li>
        </ul>
      </li>

      <!-- 任务中心 -->
      <li class="menu-item">
        <div
          class="menu-link"
          :class="{ active: activeMainMenu === 'tasks' }"
          @click="toggleSubMenu('tasks')"
        >
          <span class="menu-icon">📋</span>
          <span class="menu-text">任务中心</span>
          <span
            class="menu-arrow"
            :class="{ rotated: openSubMenus.includes('tasks') }"
            >▼</span
          >
          >
        </div>
        <ul v-if="openSubMenus.includes('tasks')" class="sub-menu">
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'dailyTasks' }"
              @click="navigateTo('tasks', 'dailyTasks')"
            >
              <span class="sub-menu-icon">📅</span>
              <span class="sub-menu-text">每日任务</span>
            </a>
          </li>
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'weeklyTasks' }"
              @click="navigateTo('tasks', 'weeklyTasks')"
            >
              <span class="sub-menu-icon">📆</span>
              <span class="sub-menu-text">每周任务</span>
            </a>
          </li>
          <li class="sub-menu-item">
            <a
              class="sub-menu-link"
              :class="{ active: activeSubMenu === 'achievementTasks' }"
              @click="navigateTo('tasks', 'achievementTasks')"
            >
              <span class="sub-menu-icon">🏆</span>
              <span class="sub-menu-text">成就任务</span>
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
// 接收父组件传递的属性
defineProps({
  openSubMenus: {
    type: Array,
    default: () => ["data"],
  },
  activeMainMenu: {
    type: String,
    default: "data",
  },
  activeSubMenu: {
    type: String,
    default: "coreData",
  },
  pageTitles: {
    type: Object,
    required: true,
  },
  mainMenuNames: {
    type: Object,
    required: true,
  },
});

// 向父组件传递事件
const emit = defineEmits(["toggle-submenu", "navigate"]);

// 切换子菜单展开/收起
const toggleSubMenu = (menuName: string): void => {
  emit("toggle-submenu", menuName);
};

// 导航到指定菜单
const navigateTo = (mainMenu: string, subMenu: string): void => {
  emit("navigate", mainMenu, subMenu);
};
</script>

<style lang="scss" scoped>
.sidebar {
  width: tokens.$sidebar-width;
  background-color: tokens.$bg-dark;
  color: tokens.$text-primary;
  height: 100vh;

  @include utils.flex-col(tokens.$spacing-0, stretch, flex-start);

  box-shadow: tokens.$shadow-md;
}

.sidebar-header {
  padding: tokens.$spacing-lg;
  background-color: tokens.$bg-tertiary;
  border-bottom: 1px solid tokens.$border-medium;
}

.sidebar-title {
  margin: 0;
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;

  @include utils.custom-scrollbar;
}

.menu-item {
  border-bottom: 1px solid tokens.$border-medium;
}

.menu-link {
  @include utils.flex-row(tokens.$spacing-sm, center);

  padding: tokens.$spacing-md tokens.$spacing-lg;
  cursor: pointer;
  transition: background-color tokens.$transition-normal;
  position: relative;

  &:hover {
    background-color: tokens.$bg-medium;
  }

  &.active {
    background-color: tokens.$bg-tertiary;
    border-left: 4px solid tokens.$primary;
  }
}

.menu-icon {
  margin-right: tokens.$spacing-sm;
  font-size: tokens.$font-size-lg;
}

.menu-text {
  flex: 1;
  font-size: tokens.$font-size-base;
}

.menu-arrow {
  transition: transform tokens.$transition-normal;
  font-size: tokens.$font-size-xs;

  &.rotated {
    transform: rotate(90deg);
  }
}

.sub-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: tokens.$bg-medium;
}

.sub-menu-item {
  border-bottom: 1px solid tokens.$border-dark;
}

.sub-menu-link {
  @include utils.flex-row(tokens.$spacing-sm, center);

  padding: tokens.$spacing-sm tokens.$spacing-lg tokens.$spacing-sm 45px;
  cursor: pointer;
  transition: background-color tokens.$transition-normal;
  text-decoration: none;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-sm;

  &:hover {
    background-color: tokens.$bg-dark;
  }

  &.active {
    background-color: tokens.$bg-tertiary;
    border-left: 4px solid tokens.$primary;
  }
}

.sub-menu-icon {
  margin-right: tokens.$spacing-sm;
  font-size: tokens.$font-size-sm;
}

.sub-menu-text {
  flex: 1;
}
</style>
