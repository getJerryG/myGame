<template>
  <div
    v-if="showNotification"
    class="notification-popup"
    :class="notification.type"
  >
    <div class="notification-content">
      <div class="notification-header">
        <span class="notification-icon">{{ getEventIcon(notification.type) }}</span>
        <h3 class="notification-title">{{ notification.title }}</h3>
        <button
          class="notification-close"
          aria-label="关闭通知"
          @click="closeNotification"
        >
          ×
        </button>
      </div>
      <p class="notification-message">{{ notification.message }}</p>
      <div class="notification-footer">
        <span class="notification-time">{{ formatDate(notification.date || currentDate) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref } from 'vue';

// 定义日期类型接口
interface GameDate {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
}

// 定义通知类型接口
interface Notification {
  title: string;
  message: string;
  type: 'positive' | 'negative' | 'neutral' | 'info';
  date?: GameDate;
}

// 定义组件属�?defineProps<{
  showNotification: boolean;
  notification: Notification;
  currentDate: GameDate;
}>();

// 定义事件
const emit = defineEmits<{
  (e: 'close'): void;
}>();

// 关闭通知
const closeNotification = (): void => {
  emit('close');
};

// 格式化日�?const formatDate = (date: GameDate): string => {
  // 添加空值检查，确保date是一个对�?  if (!date || typeof date !== 'object') {
    return '加载�?.';
  }

  if (date.hour !== undefined) {
    return `${String(date.year || 0).padStart(2, '0')}�?{String(date.month || 0).padStart(2, '0')}�?{String(date.day || 0).padStart(2, '0')}�?${String(date.hour || 0).padStart(2, '0')}:${String(date.minute || 0).padStart(2, '0')}:${String(date.second || 0).padStart(2, '0')}`;
  }
  return `${String(date.year || 0).padStart(2, '0')}�?{String(date.month || 0).padStart(2, '0')}�?{String(date.day || 0).padStart(2, '0')}日`;
};

// 获取事件图标
const getEventIcon = (type: 'positive' | 'negative' | 'neutral' | 'info'): string => {
  const icons = {
    positive: '😊',
    negative: '😞',
    neutral: '😐',
    info: 'ℹ️',
  };
  return icons[type] || '📢';
};
</script>

<style lang="scss" scoped>
/* 系统通知弹窗 */
.notification-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 20%);
  max-width: 400px;
  z-index: 1000;
  animation: slideInRight 0.3s ease;
  border-left: 4px solid #3498db;
}

.notification-popup.positive {
  border-left-color: #10b981;
}

.notification-popup.negative {
  border-left-color: #ef4444;
}

.notification-popup.neutral {
  border-left-color: #3b82f6;
}

.notification-content {
  padding: 20px;
}

.notification-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
}

.notification-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.notification-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  flex: 1;
}

.notification-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #94a3b8;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
}

.notification-close:hover {
  color: #64748b;
}

.notification-message {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 12px;
  line-height: 1.4;
}

.notification-footer {
  display: flex;
  justify-content: flex-end;
}

.notification-time {
  font-size: 12px;
  color: #94a3b8;
}

/* 动画效果 */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 响应式设�? */
@media (width <= 768px) {
  .notification-popup {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }

  .notification-content {
    padding: 15px;
  }

  .notification-title {
    font-size: 14px;
  }

  .notification-message {
    font-size: 13px;
    margin-bottom: 10px;
  }

  .notification-time {
    font-size: 11px;
  }
}

/* 横屏手机适配 */
@media (orientation: landscape) and (height <= 600px) {
  .notification-popup {
    top: 10px;
    right: 10px;
    max-width: 300px;
  }

  .notification-content {
    padding: 15px;
  }

  .notification-title {
    font-size: 14px;
  }

  .notification-message {
    font-size: 13px;
    margin-bottom: 10px;
  }

  .notification-time {
    font-size: 11px;
  }
}
</style>


