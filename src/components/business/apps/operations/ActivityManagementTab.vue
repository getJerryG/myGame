<template>
  <div class="activity-management-tab">
    <h3 class="text-gold">活动管理</h3>
    <div class="activity-list">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="activity-card"
      >
        <div class="activity-header">
          <div class="activity-icon">{{ activity.icon }}</div>
          <div class="activity-info">
            <h4 class="text-gold">{{ activity.name }}</h4>
            <p class="activity-type">{{ getActivityTypeName(activity.type) }}</p>
          </div>
          <div class="activity-status">
            <span
              class="status-badge"
              :class="activity.status"
            >
              {{ getStatusLabel(activity.status) }}
            </span>
          </div>
        </div>

        <div class="activity-description">{{ activity.description }}</div>

        <div class="activity-time">
          <div class="time-item">
            <span class="time-label">开始:</span>
            <span class="time-value">{{ formatTime(activity.startTime) }}</span>
          </div>
          <div class="time-item">
            <span class="time-label">结束:</span>
            <span class="time-value">{{ formatTime(activity.endTime) }}</span>
          </div>
        </div>

        <div class="activity-rewards">
          <div class="reward-item">
            <span class="reward-label">金币:</span>
            <span class="reward-value text-gold">{{ activity.goldReward }}</span>
          </div>
          <div class="reward-item">
            <span class="reward-label">经验:</span>
            <span class="reward-value text-gold">{{ activity.expReward }}</span>
          </div>
        </div>

        <div class="activity-actions">
          <button
            v-if="activity.status === 'upcoming'"
            class="action-btn start"
            @click="$emit('start', activity.id)"
          >
            开始活动
          </button>
          <button
            v-else-if="activity.status === 'ongoing'"
            class="action-btn end"
            @click="$emit('end', activity.id)"
          >
            结束活动
          </button>
          <button
            class="action-btn delete"
            @click="$emit('delete', activity.id)"
          >
            删除
          </button>
        </div>
      </div>

      <div
        v-if="activities.length === 0"
        class="empty-state"
      >
        <p>暂无活动，前往"创建活动"页创建</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Activity {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  startTime: string;
  endTime: string;
  goldReward: number;
  expReward: number;
}

const activityTypeNames: Record<string, string> = {
  login: '登录活动',
  recharge: '充值活动',
  consumption: '消费活动',
  pvp: '竞技活动',
  cooperation: '合作活动',
  festival: '节日活动',
};

const statusLabels: Record<string, string> = {
  upcoming: '未开始',
  ongoing: '进行中',
  completed: '已完成',
};

const props = defineProps<{
  activities: Activity[];
}>();

const emit = defineEmits<{
  start: [id: string];
  end: [id: string];
  delete: [id: string];
}>();

const getActivityTypeName = (type: string): string => {
  return activityTypeNames[type] || type;
};

const getStatusLabel = (status: string): string => {
  return statusLabels[status] || status;
};

const formatTime = (timeStr: string): string => {
  if (!timeStr) return '';
  const date = new Date(timeStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
</script>

<style lang="scss" scoped>
.activity-management-tab {
  padding: tokens.$spacing-lg;
}

.text-gold {
  color: tokens.$primary-gold;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-lg;
}

.activity-card {
  background: tokens.$bg-light;
  border: 1px solid tokens.$border-medium;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-lg;
  transition: all tokens.$transition-fast;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  }
}

.activity-header {
  display: flex;
  align-items: center;
  gap: tokens.$spacing-md;
  margin-bottom: tokens.$spacing-md;

  .activity-icon {
    font-size: 32px;
  }

  .activity-info {
    flex: 1;

    h4 {
      margin: 0 0 tokens.$spacing-xs 0;
      font-size: tokens.$font-size-lg;
    }

    .activity-type {
      margin: 0;
      font-size: tokens.$font-size-sm;
      color: tokens.$text-secondary;
    }
  }
}

.status-badge {
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  border-radius: tokens.$radius-sm;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-bold;

  &.upcoming {
    background: rgb(59 130 246 / 20%);
    color: tokens.$info;
  }

  &.ongoing {
    background: rgb(34 197 94 / 20%);
    color: tokens.$success;
  }

  &.completed {
    background: rgb(107 114 128 / 20%);
    color: tokens.$text-secondary;
  }
}

.activity-description {
  margin: tokens.$spacing-md 0;
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  line-height: 1.6;
}

.activity-time {
  display: flex;
  gap: tokens.$spacing-lg;
  margin-bottom: tokens.$spacing-md;
}

.time-item {
  display: flex;
  gap: tokens.$spacing-xs;
  font-size: tokens.$font-size-sm;

  .time-label {
    color: tokens.$text-secondary;
  }

  .time-value {
    color: tokens.$text-primary;
    font-weight: tokens.$font-weight-medium;
  }
}

.activity-rewards {
  display: flex;
  gap: tokens.$spacing-lg;
  margin-bottom: tokens.$spacing-md;
}

.reward-item {
  display: flex;
  gap: tokens.$spacing-xs;
  font-size: tokens.$font-size-sm;

  .reward-label {
    color: tokens.$text-secondary;
  }

  .reward-value {
    font-weight: tokens.$font-weight-bold;
  }
}

.activity-actions {
  display: flex;
  gap: tokens.$spacing-sm;
}

.action-btn {
  padding: tokens.$spacing-xs tokens.$spacing-md;
  border: none;
  border-radius: tokens.$radius-sm;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-bold;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &.start {
    background: tokens.$success;
    color: #fff;

    &:hover {
      background: color.adjust(tokens.$success, $lightness: -10%);
    }
  }

  &.end {
    background: tokens.$warning;
    color: #fff;

    &:hover {
      background: color.adjust(tokens.$warning, $lightness: -10%);
    }
  }

  &.delete {
    background: tokens.$error;
    color: #fff;

    &:hover {
      background: color.adjust(tokens.$error, $lightness: -10%);
    }
  }
}

.empty-state {
  text-align: center;
  padding: tokens.$spacing-xl;
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-base;
}
</style>
