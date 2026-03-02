<template>
  <ApplicationWindow windowTitle="运营活动">
    <template #sidebar>
      <div class="sidebar-menu">
        <button
          class="menu-item"
          :class="{ active: activeTab === 'create' }"
          @click="activeTab = 'create'"
        >
          <span class="menu-icon">📝</span>
          <span class="menu-name">创建活动</span>
        </button>
        <button
          class="menu-item"
          :class="{ active: activeTab === 'manage' }"
          @click="activeTab = 'manage'"
        >
          <span class="menu-icon">📋</span>
          <span class="menu-name">活动管理</span>
        </button>
        <button
          class="menu-item"
          :class="{ active: activeTab === 'stats' }"
          @click="activeTab = 'stats'"
        >
          <span class="menu-icon">📊</span>
          <span class="menu-name">活动统计</span>
        </button>
      </div>
    </template>

    <template #content>
      <div class="operations-content">
        <!-- 创建活动标签页 -->
        <CreateActivityTab
          v-if="activeTab === 'create'"
          v-model:selected-type="selectedType"
          v-model:activity-name="activityName"
          v-model:activity-description="activityDescription"
          v-model:start-time="startTime"
          v-model:end-time="endTime"
          v-model:gold-reward="goldReward"
          v-model:exp-reward="expReward"
          @create="handleCreateActivity"
        />

        <!-- 活动管理标签页 -->
        <ActivityManagementTab
          v-else-if="activeTab === 'manage'"
          :activities="activities"
          @start="handleStartActivity"
          @end="handleEndActivity"
          @delete="handleDeleteActivity"
        />

        <!-- 活动统计标签页 -->
        <ActivityStatisticsTab
          v-else-if="activeTab === 'stats'"
          :stats="computedStats"
          :participation-trend="participationTrend"
        />
      </div>
    </template>
  </ApplicationWindow>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ApplicationWindow from '@/components/common/window/ApplicationWindow.vue';
import CreateActivityTab from './CreateActivityTab.vue';
import ActivityManagementTab from './ActivityManagementTab.vue';
import ActivityStatisticsTab from './ActivityStatisticsTab.vue';

import type { Activity } from './ActivityManagementTab.vue';
import type { ActivityStats } from './ActivityStatisticsTab.vue';

// 状态管理
const activeTab = ref<string>('create');
const selectedType = ref<string>('login');
const activityName = ref<string>('');
const activityDescription = ref<string>('');
const startTime = ref<string>('');
const endTime = ref<string>('');
const goldReward = ref<number>(0);
const expReward = ref<number>(0);

// 活动列表
const activities = ref<Activity[]>([
  {
    id: '1',
    name: '新春登录送好礼',
    type: 'login',
    description: '新春期间每天登录即可领取丰厚奖励',
    icon: '🧧',
    status: 'ongoing',
    startTime: '2026-02-01T00:00',
    endTime: '2026-02-15T23:59',
    goldReward: 1000,
    expReward: 500,
  },
  {
    id: '2',
    name: '充值返利活动',
    type: 'recharge',
    description: '充值任意金额即可获得 100% 返利',
    icon: '💎',
    status: 'upcoming',
    startTime: '2026-02-20T00:00',
    endTime: '2026-02-28T23:59',
    goldReward: 0,
    expReward: 0,
  },
]);

// 统计数据
const baseStats = ref<ActivityStats>({
  totalActivities: 15,
  ongoingActivities: 3,
  completedActivities: 12,
  totalParticipants: 12580,
});

// 参与趋势数据
const participationTrend = ref<number[]>([
  30, 45, 60, 55, 70, 85, 90, 75, 80, 95, 100, 85,
]);

// 计算属性
const computedStats = computed<ActivityStats>(() => {
  const ongoing = activities.value.filter((a) => a.status === 'ongoing').length;
  const completed = activities.value.filter(
    (a) => a.status === 'completed',
  ).length;
  const total = activities.value.length;

  return {
    totalActivities: total,
    ongoingActivities: ongoing,
    completedActivities: completed,
    totalParticipants: baseStats.value.totalParticipants,
  };
});

// 事件处理函数
const handleCreateActivity = () => {
  if (!activityName.value || !startTime.value || !endTime.value) {
    alert('请填写完整的活动信息');
    return;
  }

  const newActivity: Activity = {
    id: Date.now().toString(),
    name: activityName.value,
    type: selectedType.value,
    description: activityDescription.value,
    icon: getIconForType(selectedType.value),
    status: 'upcoming',
    startTime: startTime.value,
    endTime: endTime.value,
    goldReward: goldReward.value,
    expReward: expReward.value,
  };

  activities.value.push(newActivity);
  alert('活动创建成功！');
  resetForm();
  activeTab.value = 'manage';
};

const handleStartActivity = (id: string) => {
  const activity = activities.value.find((a) => a.id === id);
  if (activity) {
    activity.status = 'ongoing';
    alert(`活动"${activity.name}"已开始`);
  }
};

const handleEndActivity = (id: string) => {
  const activity = activities.value.find((a) => a.id === id);
  if (activity) {
    activity.status = 'completed';
    alert(`活动"${activity.name}"已结束`);
  }
};

const handleDeleteActivity = (id: string) => {
  if (confirm('确定要删除此活动吗？')) {
    activities.value = activities.value.filter((a) => a.id !== id);
    alert('活动已删除');
  }
};

const resetForm = () => {
  activityName.value = '';
  activityDescription.value = '';
  startTime.value = '';
  endTime.value = '';
  goldReward.value = 0;
  expReward.value = 0;
};

const getIconForType = (type: string): string => {
  const icons: Record<string, string> = {
    login: '📅',
    recharge: '💎',
    consumption: '🛒',
    pvp: '⚔️',
    cooperation: '🤝',
    festival: '🎉',
  };
  return icons[type] || '🎯';
};
</script>

<style lang="scss" scoped>
.sidebar-menu {
  display: flex;
  flex-direction: column;
  padding: tokens.$spacing-md 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: tokens.$spacing-md;
  padding: tokens.$spacing-md tokens.$spacing-lg;
  background: transparent;
  border: none;
  border-radius: tokens.$radius-md;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  text-align: left;
  margin: 0 tokens.$spacing-sm;

  &:hover {
    background: rgb(255 193 7 / 10%);
  }

  &.active {
    background: rgb(255 193 7 / 20%);
    color: tokens.$primary-gold;
  }

  .menu-icon {
    font-size: tokens.$font-size-lg;
  }

  .menu-name {
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-medium;
  }
}

.operations-content {
  padding: tokens.$spacing-lg;
  height: 100%;
  overflow: auto;
}
</style>
