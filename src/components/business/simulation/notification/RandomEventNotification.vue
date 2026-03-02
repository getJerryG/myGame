<template>
  <div class="random-event-container">
    <div
      class="random-event-notification"
      v-if="showNotification && currentEvent"
    >
      <div class="notification-header">
        <h3>{{ currentEvent.title }}</h3>
        <button class="close-btn" @click="closeNotification">×</button>
      </div>

      <div class="notification-body">
        <p class="event-description">{{ currentEvent.description }}</p>

        <!-- 英雄强度推荐事件内容 -->
        <div
          v-if="currentEvent.type === 'hero_strength_recommendation'"
          class="recommendation-list"
        >
          <h4>各职业强势英雄推�?/h4>
          <div class="recommendation-grid">
            <div
              v-for="recommendation in currentEvent.data"
              :key="recommendation.profession"
              class="recommendation-card"
            >
              <div
                class="profession-badge"
                :style="{
                  backgroundColor: getProfessionColor(
                    recommendation.profession
                  ),
                }"
              >
                {{ recommendation.profession }}
              </div>
              <div class="hero-info">
                <h5>{{ recommendation.heroName }}</h5>
                <div class="strength-score">
                  <span class="score-label">强度评分:</span>
                  <span class="score-value"
                    >{{
                      (recommendation.strengthScore * 100).toFixed(1)
                    }}/100</span
                  >
                </div>
                <p class="recommendation-reason">{{ recommendation.reason }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="event-meta">
          <span class="event-time">{{
            formatEventTime(currentEvent.timestamp)
          }}</span>
          <span class="event-expiration">
            {{
              currentEvent.isActive
                ? `有效期至: ${formatEventTime(currentEvent.expirationTime)}`
                : '已过期'
            }}
          </span>
        </div>
      </div>

      <div class="notification-footer">
        <button class="action-btn" @click="dismissEvent">知道了</button>
        <button
          v-if="currentEvent.isActive"
          class="action-btn primary"
          @click="viewDetails"
        >
          查看详情
        </button>
      </div>
    </div>

    <!-- 事件列表按钮 -->
    <div
      class="event-list-btn"
      v-if="activeEvents.length > 0"
      @click="toggleEventList"
    >
      <span class="event-count">{{ activeEvents.length }}</span>
      <span class="btn-icon">📢</span>
    </div>

    <!-- 事件列表弹窗 -->
    <div class="event-list-overlay" v-if="showEventList">
      <div class="event-list-modal">
        <div class="event-list-header">
          <h3>近期事件</h3>
          <button class="close-btn" @click="toggleEventList">×</button>
        </div>

        <div class="event-list-content">
          <div
            v-for="event in activeEvents"
            :key="event.id"
            class="event-item"
            @click="selectEvent(event)"
          >
            <div class="event-item-header">
              <h4>{{ event.title }}</h4>
              <span class="event-status" :class="{ active: event.isActive }">
              {{ event.isActive ? '进行中' : '已过期' }}
            </span>
            </div>
            <p class="event-item-description">{{ event.description }}</p>
            <span class="event-item-time">{{
              formatEventTime(event.timestamp)
            }}</span>
          </div>

          <div v-if="activeEvents.length === 0" class="empty-events">
            <p>暂无近期事件</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { RandomEvent } from "@/utils/RandomEvents";
import { randomEventManager } from "@/utils/RandomEvents";
import { getHeroesFromStorage } from "@/utils/HeroSkinManager";

// Props
const props = defineProps<{
  autoShow?: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: "eventClicked", event: RandomEvent): void;
  (e: "closed"): void;
}>();

// 状态管理
const showNotification = ref(false);
const showEventList = ref(false);
const currentEvent = ref<RandomEvent | null>(null);
const activeEvents = ref<RandomEvent[]>([]);

// 计算属性：获取活跃事件
const calculateActiveEvents = (): RandomEvent[] => {
  const heroes = getHeroesFromStorage();
  return randomEventManager.checkAndGenerateEvents(heroes);
};

// 打开通知
const openNotification = (event: RandomEvent): void => {
  currentEvent.value = event;
  showNotification.value = true;
};

// 关闭通知
const closeNotification = (): void => {
  showNotification.value = false;
  currentEvent.value = null;
  emit("closed");
};

// 切换事件列表
const toggleEventList = (): void => {
  showEventList.value = !showEventList.value;
  // 更新活跃事件列表
  if (showEventList.value) {
    activeEvents.value = calculateActiveEvents();
  }
};

// 选择事件
const selectEvent = (event: RandomEvent): void => {
  openNotification(event);
  showEventList.value = false;
};

// 关闭事件
const dismissEvent = (): void => {
  closeNotification();
};

// 查看详情
const viewDetails = (): void => {
  if (currentEvent.value) {
    emit("eventClicked", currentEvent.value);
    closeNotification();
  }
};

// 格式化事件时间
const formatEventTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 获取职业颜色
const getProfessionColor = (profession: string): string => {
  const professionColors: Record<string, string> = {
    warrior: "#FF9800",
    mage: "#9C27B0",
    shooter: "#2196F3",
    assassin: "#F44336",
    support: "#8BC34A",
    tank: "#4CAF50",
  };
  return professionColors[profession] || "#4a9eff";
};

// 初始化事件检查
const initEventCheck = (): void => {
  // 获取活跃事件
  activeEvents.value = calculateActiveEvents();

  // 如果有活跃事件且设置了自动显示，则显示第一个事件
  if (props.autoShow && activeEvents.value.length > 0) {
    openNotification(activeEvents.value[0]);
  }
};

// 定期检查事件更新
let eventCheckInterval: number | null = null;

// 组件挂载时初始化
onMounted(() => {
  initEventCheck();
  // 每小时检查一次事件更新
  eventCheckInterval = window.setInterval(() => {
    const updatedEvents = calculateActiveEvents();
    if (updatedEvents.length > activeEvents.value.length) {
      // 有新事件，显示通知
      const existingEventIds = new Set(activeEvents.value.map((e) => e.id));
      const newEvents = updatedEvents.filter(
        (event) => !existingEventIds.has(event.id)
      );
      if (newEvents.length > 0) {
        openNotification(newEvents[0]);
      }
      activeEvents.value = updatedEvents;
    }
  }, 3600000); // 1小时
});

// 组件卸载时清理
onUnmounted(() => {
  if (eventCheckInterval) {
    clearInterval(eventCheckInterval);
  }
});
</script>

<style lang=scss scoped>
.random-event-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 400px;
  max-height: 80vh;
  background-color: #2a2a3a;
  border: 1px solid #333;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 50%);
  z-index: 1000;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #333;
  border-bottom: 1px solid #444;
}

.notification-header {
  h3 {
    margin: 0;
    font-size: 18px;
    color: #4a9eff;
  }
}

.close-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
}

.notification-body {
  padding: 16px;
  overflow-y: auto;
  max-height: 60vh;
}

.event-description {
  margin: 0 0 16px;
  color: #fff;
  line-height: 1.5;
}

/* 英雄强度推荐样式 */
.recommendation-list {
  h4 {
    margin: 0 0 16px;
    font-size: 16px;
    color: #4a9eff;
  }
}

.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.recommendation-card {
  background-color: rgb(0 0 0 / 20%);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.profession-badge {
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  align-self: flex-start;
  margin-bottom: 8px;
}

.hero-info {
  h5 {
    margin: 0 0 8px;
    font-size: 14px;
    color: #fff;
  }
}

.strength-score {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.score-label {
  color: #aaa;
  margin-right: 8px;
}

.score-value {
  color: #4a9eff;
  font-weight: bold;
}

.recommendation-reason {
  margin: 0;
  font-size: 13px;
  color: #ccc;
  line-height: 1.4;
}

/* 事件元信�? */
.event-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #888;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgb(255 255 255 / 10%);
}

/* 通知底部 */
.notification-footer {
  display: flex;
  gap: 8px;
  padding: 16px;
  background-color: rgb(0 0 0 / 20%);
  border-top: 1px solid #444;
}

.action-btn {
  flex: 1;
  padding: 8px 16px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.action-btn {
  &:hover {
    background-color: #444;
  }

  &.primary {
    background-color: #4a9eff;

    &:hover {
      background-color: #357abd;
    }
  }
}

/* 事件列表按钮 */
.event-list-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #4a9eff;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgb(74 158 255 / 40%);
  transition: all 0.2s ease;
  z-index: 999;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgb(74 158 255 / 60%);
  }
}

.event-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #f44336;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

.btn-icon {
  font-size: 24px;
}

/* 事件列表弹窗 */
.event-list-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.event-list-modal {
  width: 500px;
  max-height: 80vh;
  background-color: #2a2a3a;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 50%);
  overflow: hidden;
}

.event-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #333;
  border-bottom: 1px solid #444;

  h3 {
    margin: 0;
    font-size: 18px;
    color: #4a9eff;
  }
}

.event-list-content {
  padding: 16px;
  overflow-y: auto;
  max-height: 60vh;
}

.event-item {
  background-color: rgb(0 0 0 / 20%);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgb(0 0 0 / 30%);
    transform: translateX(4px);
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    h4 {
      margin: 0;
      font-size: 16px;
      color: #fff;
    }
  }

  &-description {
    margin: 0 0 8px;
    font-size: 14px;
    color: #ccc;
    line-height: 1.4;
  }

  &-time {
    font-size: 12px;
    color: #888;
  }
}

.event-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: bold;

  &.active {
    background-color: #4caf50;
    color: white;
  }

  &:not(.active) {
    background-color: #666;
    color: white;
  }
}

.empty-events {
  text-align: center;
  padding: 32px;
  color: #888;
}

/* 滚动条样�? */
.notification-body,
.event-list-content {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgb(0 0 0 / 20%);
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(74 158 255 / 50%);
    border-radius: 3px;

    &:hover {
      background: rgb(74 158 255 / 70%);
    }
  }
}

/* 响应式设�? */
.random-event-notification,
.recommendation-grid,
.event-list-modal {
  @media (width <= tokens.$breakpoint-md) {
    .random-event-notification {
      width: calc(100% - 40px);
      right: 20px;
      left: 20px;
    }

    .recommendation-grid {
      grid-template-columns: 1fr;
    }

    .event-list-modal {
      width: calc(100% - 40px);
    }
  }
}
</style>
