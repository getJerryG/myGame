<template>
  <ApplicationWindow windowTitle="活动">
    <template #sidebar>
      <div class="sidebar-menu">
        <button class="menu-item" :class="{ active: activeTab === 'new' }" @click="activeTab = 'new'">
          <span class="menu-icon">+</span>
          <span class="menu-name">新建活动</span>
        </button>
        <button class="menu-item" :class="{ active: activeTab === 'manage' }" @click="activeTab = 'manage'">
          <span class="menu-icon">📋</span>
          <span class="menu-name">活动管理</span>
        </button>
      </div>
    </template>

    <template #content>
      <div class="event-content">
        <!-- 新建活动 -->
        <div v-if="activeTab === 'new'" class="tab-content">
          <div class="section">
            <h3 class="text-gold">活动类型</h3>
            <div class="options-grid">
              <button v-for="type in eventTypes" :key="type.value" class="option-btn"
                :class="{ active: selectedEvent.type === type.value }" @click="selectedEvent.type = type.value">
                {{ type.label }}
              </button>
            </div>
          </div>

          <div class="section">
            <h3 class="text-gold">活动力度</h3>
            <div class="options-grid">
              <button v-for="intensity in eventIntensities" :key="intensity.value" class="option-btn"
                :class="{ active: selectedEvent.intensity === intensity.value }"
                @click="selectedEvent.intensity = intensity.value">
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
            <button class="confirm-btn" @click="createEvent">
              确认开启活动
            </button>
          </div>
        </div>

        <!-- 活动管理 -->
        <div v-else-if="activeTab === 'manage'" class="tab-content">
          <h3 class="text-gold" style="margin-bottom: 20px">活动管理</h3>
          <div class="event-list">
            <div v-for="event in events" :key="event.id" class="event-item">
              <div class="event-info">
                <div class="event-name text-gold">{{ event.name }}</div>
                <div class="event-meta">
                  <span class="event-type">{{ event.type }}</span>
                  <span class="event-status" :class="event.status">{{
                    event.status
                    }}</span>
                </div>
                <div class="event-time">
                  {{ event.startDate }} 至 {{ event.endDate }}
                </div>
              </div>
              <div class="event-data">
                <div class="data-item">
                  <span class="data-label">热度加成:</span>
                  <span class="data-value text-gold">{{
                    event.heatBoost
                    }}</span>
                </div>
                <div class="data-item">
                  <span class="data-label">收入加成:</span>
                  <span class="data-value text-gold">{{ event.revenueBoost }}%</span>
                </div>
              </div>
            </div>
            <div v-if="events.length === 0" class="empty-state">
              <p>暂无活动</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ApplicationWindow>
</template>

<script setup lang="ts">
import ApplicationWindow from "@/components/common/window/ApplicationWindow.vue";

// 导入类型
import type { App } from "../../../types/app";
import type { GameData } from "../../../types/game";
import type { Modal } from "../../../types/modal";

// Props定义
defineProps<{
  app: App;
  gameData?: GameData;
  modal?: Modal;
}>();

// 活跃标签
const activeTab = ref("new");

// 活动类型选项
const eventTypes = [
  { label: "新英雄折扣", value: "hero_discount" },
  { label: "英雄+皮肤礼包", value: "hero_skin_bundle" },
  { label: "排位加成", value: "rank_boost" },
  { label: "充值返还", value: "recharge_bonus" },
  { label: "限定返场", value: "limited_return" },
  { label: "联动主题活动", value: "collab_theme" },
  { label: "炸服补偿", value: "server_crash_compensation" },
];

// 活动力度选项
const eventIntensities = [
  { label: "轻度", value: "light" },
  { label: "中度", value: "moderate" },
  { label: "重磅", value: "heavy" },
];

// 选中的活动配置
const selectedEvent = ref({
  type: "hero_discount",
  intensity: "light",
});

// 模拟活动数据
const events = ref([
  {
    id: 1,
    name: "新英雄李白折扣活动",
    type: "新英雄折扣",
    status: "进行中",
    startDate: "2024/1/1",
    endDate: "2024/1/7",
    heatBoost: 10,
    revenueBoost: 5,
  },
  {
    id: 2,
    name: "春节限定皮肤返场",
    type: "限定返场",
    status: "已结束",
    startDate: "2024/2/1",
    endDate: "2024/2/15",
    heatBoost: 30,
    revenueBoost: 15,
  },
]);

// 根据活动力度获取活动持续天数
const getEventDuration = (): number => {
  const durationMap = {
    light: 3,
    moderate: 5,
    heavy: 7,
  };
  return durationMap[selectedEvent.value.intensity];
};

// 创建活动
const createEvent = (): void => {
  // 这里应该调用store来创建活动
  // 模拟创建成功
  alert("活动创建成功");
};
</script>

<style lang="scss" scoped>
/* 侧边栏菜单 */
.sidebar-menu {
  @include utils.flex-col(0, stretch, flex-start);

  width: 100%;
  height: 100%;
  background-color: tokens.$bg-secondary;
  padding: tokens.$spacing-md 0;
  overflow-y: auto;
}

.menu-item {
  @include utils.flex-row(tokens.$spacing-md, center, flex-start);

  padding: tokens.$spacing-md tokens.$spacing-lg;
  background: none;
  border: none;
  color: tokens.$text-muted;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  text-align: left;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-semibold;

  &:hover {
    background-color: rgba(tokens.$primary-blue, 0.1);
    color: tokens.$primary-blue;
  }

  &.active {
    background-color: rgba(tokens.$primary-blue, 0.2);
    color: tokens.$primary-blue;
    border-right: 3px solid tokens.$primary-blue;
  }
}

.menu-icon {
  font-size: tokens.$font-size-xl;
}

/* 活动内容区域 */
.event-content {
  width: 100%;
  height: 100%;
  padding: tokens.$spacing-lg;
  background-color: tokens.$bg-primary;
  color: tokens.$text-primary;
  overflow-y: auto;

  @include utils.custom-scrollbar;
}

.tab-content {
  @include utils.flex-col(tokens.$spacing-lg);
}

/* 章节样式 */
.section {
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-lg;
  box-shadow: tokens.$shadow-md;

  h3 {
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-xl;
    color: tokens.$primary-gold;
    font-weight: tokens.$font-weight-bold;
  }
}

/* 选项网格 */
.options-grid {
  @include utils.grid-auto-fill(130px, tokens.$spacing-md);
}

/* 选项按钮 */
.option-btn {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: tokens.$bg-light;
  border: 1px solid rgba(tokens.$primary-blue, 0.2);
  border-radius: tokens.$radius-md;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-sm;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  font-weight: tokens.$font-weight-semibold;

  &:hover {
    background-color: rgba(tokens.$primary-blue, 0.2);
    border-color: rgba(tokens.$primary-blue, 0.5);
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-md;
  }

  &.active {
    background-color: rgba(tokens.$primary-blue, 0.3);
    border-color: tokens.$primary-blue;
    box-shadow: 0 0 0 2px rgba(tokens.$primary-blue, 0.2);
    transform: translateY(-2px);
  }
}

/* 信息框 */
.info-box {
  @include utils.flex-center;

  height: 60px;
  background-color: tokens.$bg-light;
  border: 1px solid rgba(tokens.$primary-blue, 0.2);
  border-radius: tokens.$radius-md;

  p {
    margin: 0;
    font-size: tokens.$font-size-xl;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$primary-gold;
  }
}

/* 操作区域 */
.action-section {
  @include utils.flex-center;

  padding: tokens.$spacing-lg;
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-md;
  box-shadow: tokens.$shadow-md;
}

.confirm-btn {
  padding: tokens.$spacing-sm tokens.$spacing-xl;
  background-color: tokens.$primary-blue;
  border: none;
  border-radius: tokens.$radius-md;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover {
    background-color: tokens.$primary-dark;
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-blue;
  }
}

/* 活动管理样式 */
.event-list {
  @include utils.flex-col(tokens.$spacing-md);
}

/* 活动项 */
.event-item {
  @include utils.flex-between;

  background-color: tokens.$bg-secondary;
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-md;
  border: 1px solid rgba(tokens.$primary-blue, 0.2);
  box-shadow: tokens.$shadow-md;
  transition: all tokens.$transition-fast;

  &:hover {
    border-color: rgba(tokens.$primary-blue, 0.5);
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-lg;
  }
}

/* 活动信息 */
.event-info {
  flex: 1;
  margin-right: tokens.$spacing-md;
}

.event-name {
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$primary-gold;
  margin-bottom: tokens.$spacing-xs;
}

.event-meta {
  @include utils.flex-row(tokens.$spacing-md, center, flex-start);

  margin-bottom: tokens.$spacing-xs;
}

.event-type {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-muted;
}

.event-status {
  font-size: tokens.$font-size-xs;
  padding: 3px tokens.$spacing-sm;
  border-radius: tokens.$radius-full;
  font-weight: tokens.$font-weight-bold;

  &.进行中 {
    background-color: rgba(tokens.$success, 0.2);
    color: tokens.$success;
  }

  &.已结束 {
    background-color: rgba(tokens.$gray-500, 0.2);
    color: tokens.$text-muted;
  }
}

.event-time {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
}

/* 活动数据 */
.event-data {
  @include utils.flex-col(tokens.$spacing-sm, flex-end);

  text-align: right;
}

.data-item {
  @include utils.flex-col(tokens.$spacing-xs, flex-end);
}

.data-label {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
}

.data-value {
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$primary-gold;
}

/* 空状态 */
.empty-state {
  @include utils.flex-center;

  height: 220px;
  background-color: tokens.$bg-light;
  border: 1px dashed rgba(tokens.$primary-blue, 0.2);
  border-radius: tokens.$radius-md;

  p {
    margin: 0;
    color: tokens.$text-muted;
    font-size: tokens.$font-size-base;
  }
}

/* 响应式设计 */
@include utils.mobile {
  .event-content {
    padding: tokens.$spacing-md;
  }

  .section {
    padding: tokens.$spacing-md;
  }

  .options-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: tokens.$spacing-sm;
  }

  .event-item {
    flex-direction: column;
    align-items: flex-start;
    gap: tokens.$spacing-md;
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
