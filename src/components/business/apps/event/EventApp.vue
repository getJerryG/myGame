<template>
  <ApplicationWindow windowTitle="活动">
    <template #sidebar>
      <div class="sidebar-menu">
        <button
          class="menu-item"
          :class="{ active: activeTab === 'new' }"
          @click="activeTab = 'new'"
        >
          <span class="menu-icon">+</span>
          <span class="menu-name">新建活动</span>
        </button>
        <button
          class="menu-item"
          :class="{ active: activeTab === 'manage' }"
          @click="activeTab = 'manage'"
        >
          <span class="menu-icon">📋</span>
          <span class="menu-name">活动管理</span>
        </button>
      </div>
    </template>

    <template #content>
      <div class="event-content">
        <!-- 新建活动 -->
        <div
          v-if="activeTab === 'new'"
          class="tab-content"
        >
          <div class="section">
            <h3 class="text-gold">活动类型</h3>
            <div class="options-grid">
              <button
                v-for="type in eventTypes"
                :key="type.value"
                class="option-btn"
                :class="{ active: selectedEvent.type === type.value }"
                @click="selectedEvent.type = type.value"
              >
                {{ type.label }}
              </button>
            </div>
          </div>

          <div class="section">
            <h3 class="text-gold">活动力度</h3>
            <div class="options-grid">
              <button
                v-for="intensity in eventIntensities"
                :key="intensity.value"
                class="option-btn"
                :class="{ active: selectedEvent.intensity === intensity.value }"
                @click="selectedEvent.intensity = intensity.value"
              >
                {{ intensity.label }}
              </button>
            </div>
          </div>

          <div class="section">
            <h3 class="text-gold">活动周期</h3>
            <div class="info-box">
              <p class="text-gold">{{ getEventDuration() }} 天</p>
            </div>
          </div>

          <div class="action-section">
            <button
              class="confirm-btn"
              @click="createEvent"
            >
              确认开启活动
            </button>
          </div>
        </div>

        <!-- 活动管理 -->
        <div
          v-else-if="activeTab === 'manage'"
          class="tab-content"
        >
          <h3
            class="text-gold"
            style="margin-bottom: 20px"
          >
            活动管理
          </h3>
          <div class="event-list">
            <div
              v-for="event in events"
              :key="event.id"
              class="event-item"
            >
              <div class="event-info">
                <div class="event-name text-gold">{{ event.name }}</div>
                <div class="event-meta">
                  <span class="event-type">{{ event.type }}</span>
                  <span
                    class="event-status"
                    :class="event.status"
                    >{{ event.status }}</span
                  >
                </div>
                <div class="event-time">{{ event.startDate }} �?{{ event.endDate }}</div>
              </div>
              <div class="event-data">
                <div class="data-item">
                  <span class="data-label">热度加成:</span>
                  <span class="data-value text-gold">{{ event.heatBoost }}</span>
                </div>
                <div class="data-item">
                  <span class="data-label">收入加成:</span>
                  <span class="data-value text-gold">{{ event.revenueBoost }}%</span>
                </div>
              </div>
            </div>
            <div
              v-if="events.length === 0"
              class="empty-state"
            >
              <p>暂无活动</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ApplicationWindow>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ApplicationWindow from '@/components/common/window/ApplicationWindow.vue';

// 导入类型
import type { App } from '../../../types/app';
import type { GameData } from '../../../types/game';
import type { Modal } from '../../../types/modal';

// Props定义
defineProps<{
  app: App;
  gameData?: GameData;
  modal?: Modal;
}>();

// 活跃标签
const activeTab = ref('new');

// 活动类型选项
const eventTypes = [
  { label: '新英雄折扣', value: 'hero_discount' },
  { label: '英雄+皮肤礼包', value: 'hero_skin_bundle' },
  { label: '排位加成', value: 'rank_boost' },
  { label: '充值返还', value: 'recharge_bonus' },
  { label: '限定返场', value: 'limited_return' },
  { label: '联动主题活动', value: 'collab_theme' },
  { label: '炸服补偿', value: 'server_crash_compensation' },
];

// 活动力度选项
const eventIntensities = [
  { label: '轻度', value: 'light' },
  { label: '中度', value: 'moderate' },
  { label: '重磅', value: 'heavy' },
];

// 选中的活动配置
const selectedEvent = ref({
  type: 'hero_discount',
  intensity: 'light',
});

// 模拟活动数据
const events = ref([
  {
    id: 1,
    name: '新英雄李白折扣活动',
    type: '新英雄折扣',
    status: '进行中',
    startDate: '2024/1/1',
    endDate: '2024/1/7',
    heatBoost: 10,
    revenueBoost: 5,
  },
  {
    id: 2,
    name: '春节限定皮肤返场',
    type: '限定返场',
    status: '已结束',
    startDate: '2024/2/1',
    endDate: '2024/2/15',
    heatBoost: 30,
    revenueBoost: 15,
  },
]);

// 根据活动力度获取活动持续天数
const getEventDuration = () => {
  const durationMap = {
    light: 3,
    moderate: 5,
    heavy: 7,
  };
  return durationMap[selectedEvent.value.intensity];
};

// 创建活动
const createEvent = () => {
  // 这里应该调用store来创建活动  console.log('创建活动:', selectedEvent.value);
  // 模拟创建成功
  alert('活动创建成功');
};
</script>

<style lang="scss" scoped>
/* 侧边栏菜单 */
.sidebar-menu {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--sidebar-bg, #2a2a3a);
  padding: 16px 0;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: none;
  border: none;
  color: var(--sidebar-text, #aaa);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 16px;
  font-weight: var(--font-semibold, 600);
}

.menu-item:hover {
  background-color: var(--sidebar-hover, rgb(74 158 255 / 10%));
  color: var(--sidebar-hover-text, #4a9eff);
}

.menu-item.active {
  background-color: var(--sidebar-active, rgb(74 158 255 / 20%));
  color: var(--sidebar-active-text, #4a9eff);
  border-right: 3px solid var(--sidebar-active-border, #4a9eff);
}

.menu-icon {
  font-size: 20px;
}

/* 活动内容区域 */
.event-content {
  width: 100%;
  height: 100%;
  padding: 24px;
  background-color: var(--content-bg, #1e1e2e);
  color: var(--text-primary, #fff);
  overflow-y: auto;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 章节样式 */
.section {
  background-color: var(--card-bg, #2a2a3a);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 30%);
}

.section h3 {
  margin: 0 0 20px;
  font-size: 20px;
  color: var(--primary-gold, #ffd700);
  font-weight: var(--font-bold, 700);
}

/* 选项网格 */
.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 16px;
}

/* 选项按钮 */
.option-btn {
  padding: 14px;
  background-color: var(--button-bg, rgb(0 0 0 / 20%));
  border: 1px solid var(--border-color, rgb(74 158 255 / 20%));
  border-radius: 8px;
  color: var(--text-primary, #fff);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: var(--font-semibold, 600);
}

.option-btn:hover {
  background-color: var(--button-hover, rgb(74 158 255 / 20%));
  border-color: var(--primary-color, rgb(74 158 255 / 50%));
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgb(0 0 0 / 30%);
}

.option-btn.active {
  background-color: var(--button-active, rgb(74 158 255 / 30%));
  border-color: var(--primary-color, #4a9eff);
  box-shadow: 0 0 0 2px rgb(74 158 255 / 20%);
  transform: translateY(-2px);
}

/* 信息�? */
.info-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background-color: var(--card-hover, rgb(0 0 0 / 20%));
  border: 1px solid var(--border-color, rgb(74 158 255 / 20%));
  border-radius: 8px;
}

.info-box p {
  margin: 0;
  font-size: 20px;
  font-weight: var(--font-bold, 700);
  color: var(--primary-gold, #ffd700);
}

/* 操作区域 */
.action-section {
  display: flex;
  justify-content: center;
  padding: 24px;
  background-color: var(--card-bg, #2a2a3a);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 30%);
}

.confirm-btn {
  padding: 14px 36px;
  background-color: var(--primary-color, #4a9eff);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: var(--font-bold, 700);
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-btn:hover {
  background-color: var(--primary-hover, #357abd);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgb(74 158 255 / 40%);
}

/* 活动管理样式 */
.event-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 活动�? */
.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--card-bg, #2a2a3a);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--border-color, rgb(74 158 255 / 20%));
  box-shadow: 0 2px 12px rgb(0 0 0 / 30%);
  transition: all 0.2s ease;
}

.event-item:hover {
  border-color: var(--primary-color, rgb(74 158 255 / 50%));
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgb(0 0 0 / 40%);
}

/* 活动信息 */
.event-info {
  flex: 1;
  margin-right: 20px;
}

.event-name {
  font-size: 18px;
  font-weight: var(--font-bold, 700);
  color: var(--primary-gold, #ffd700);
  margin-bottom: 6px;
}

.event-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 6px;
  align-items: center;
}

.event-type {
  font-size: 14px;
  color: var(--text-secondary, #b0b0b0);
}

.event-status {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: var(--font-bold, 700);
}

.event-status.进行中 {
  background-color: var(--success-bg, rgb(46 213 115 / 20%));
  color: var(--success-color, #2ed573);
}

.event-status.已结束 {
  background-color: var(--disabled-bg, rgb(176 176 176 / 20%));
  color: var(--disabled-text, #b0b0b0);
}

.event-time {
  font-size: 13px;
  color: var(--text-secondary, #b0b0b0);
}

/* 活动数据 */
.event-data {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: right;
}

.data-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.data-label {
  font-size: 13px;
  color: var(--text-secondary, #b0b0b0);
}

.data-value {
  font-size: 16px;
  font-weight: var(--font-bold, 700);
  color: var(--primary-gold, #ffd700);
}

/* 空状�? */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220px;
  background-color: var(--card-hover, rgb(0 0 0 / 10%));
  border: 1px dashed var(--border-color, rgb(74 158 255 / 20%));
  border-radius: 8px;
}

.empty-state p {
  margin: 0;
  color: var(--text-secondary, #b0b0b0);
  font-size: 16px;
}

/* 滚动条样�? */
.event-content::-webkit-scrollbar {
  width: 8px;
}

.event-content::-webkit-scrollbar-track {
  background: var(--scrollbar-track, rgb(0 0 0 / 10%));
  border-radius: 4px;
}

.event-content::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb, rgb(74 158 255 / 50%));
  border-radius: 4px;
}

.event-content::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover, rgb(74 158 255 / 70%));
}

/* 响应式设�? */
@media (width <= 768px) {
  .event-content {
    padding: 16px;
  }

  .section {
    padding: 20px;
  }

  .options-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
  }

  .event-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .event-meta {
    flex-wrap: wrap;
  }

  .event-data {
    width: 100%;
    align-items: flex-start;
  }

  .data-item {
    align-items: flex-start;
  }
}
</style>
