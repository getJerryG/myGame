<template>
  <div class="event-planning-panel">
    <!-- 面板头部 -->
    <div class="panel-header">
      <h3 class="panel-title">活动策划</h3>
      <button
        class="collapse-btn"
        aria-expanded="!isCollapsed"
        @click="toggleCollapse"
      >
        <span class="collapse-icon">{{ isCollapsed ? "▶️" : "🔽" }}</span>
      </button>
    </div>

    <!-- 面板内容 -->
    <div class="panel-content" :class="{ collapsed: isCollapsed }">
      <!-- 活动类型选择器 -->
      <EventTypeSelector
        :event-types="eventTypes"
        :selected-event-type="selectedEventType"
        @type-selected="selectEventType"
      />

      <!-- 活动模板选择 -->
      <div class="template-section">
        <h4 class="section-subtitle">活动模板</h4>
        <div class="template-grid">
          <button
            v-for="template in eventTemplates"
            :key="template.id"
            class="template-card"
            @click="applyTemplate(template)"
          >
            <div class="template-icon">{{ template.icon }}</div>
            <div class="template-name">{{ template.name }}</div>
            <div class="template-desc">{{ template.description }}</div>
          </button>
        </div>
      </div>

      <!-- 快速策划按钮 -->
      <div class="quick-plan-section">
        <button class="quick-plan-btn" @click="quickPlan">
          <span class="btn-icon">⚡</span>
          <span class="btn-text">快速策划</span>
        </button>
      </div>

      <!-- 活动配置表单 -->
      <EventConfigForm
        :event-config="eventConfig"
        @event-saved="saveEvent"
        @preview-requested="handlePreviewRequest"
      />

      <!-- 影响预览区域 -->
      <div class="impact-preview" v-if="showImpactPreview">
        <h4 class="section-subtitle">影响预览</h4>
        <div class="impact-grid">
          <div
            class="impact-item"
            v-for="impact in impactPreview"
            :key="impact.metric"
          >
            <div class="impact-metric">{{ impact.metric }}</div>
            <div
              class="impact-value"
              :class="{
                positive: impact.change > 0,
                negative: impact.change < 0,
              }"
            >
              {{ impact.change > 0 ? "📈" : "📉"
              }}{{ Math.abs(impact.change) }}%
            </div>
            <div class="impact-desc">{{ impact.description }}</div>
          </div>
        </div>
      </div>

      <!-- 历史活动效果 -->
      <EventHistoryList :historical-events="historicalEvents" />
    </div>

    <!-- 活动预览弹窗 -->
    <EventPreviewModal
      :show-preview="showPreview"
      :preview-config="previewConfig"
      :event-types="eventTypes"
      @preview-closed="closePreview"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EventTypeSelector from './EventTypeSelector.vue';
import EventConfigForm from './EventConfigForm.vue';
import EventHistoryList from './EventHistoryList.vue';
import EventPreviewModal from './EventPreviewModal.vue';

// 定义类型接口
interface EventReward {
  type: string;
  name: string;
  quantity: number;
}

interface EventConditions {
  level: boolean;
  rank: boolean;
}

interface EventConfig {
  name: string;
  startDate: string;
  endDate: string;
  type: string;
  rewards: EventReward[];
  conditions: EventConditions;
  levelRequirement: number;
  rankRequirement: string;
  duration?: number;
  target?: string;
}

interface EventTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  config: EventConfig;
}

interface EventType {
  label: string;
  value: string;
  icon: string;
}

interface HistoricalEvent {
  id: number;
  name: string;
  type: string;
  icon: string;
  date: string;
  participationRate: number;
  rating: number;
  revenueIncrease: number;
}

interface ImpactPreview {
  metric: string;
  change: number;
  description: string;
}

// 向父组件传递事件
const emit = defineEmits(['event-saved']);

// 数据
const isCollapsed = ref(false);

// 活动类型
const eventTypes = ref<EventType[]>([
  { label: '限时活动', value: 'limited', icon: '⏱️' },
  { label: '节日活动', value: 'holiday', icon: '🎄' },
  { label: '社区活动', value: 'community', icon: '👥' },
]);

// 活动模板
const eventTemplates = ref<EventTemplate[]>([
  {
    id: 'template1',
    name: '周末狂欢',
    icon: '🎉',
    description: '适合周末的简单活动，提升用户活跃度',
    config: {
      name: '周末狂欢活动',
      type: 'limited',
      rewards: [{ type: 'experience', name: '双倍经验', quantity: 2 }],
      duration: 2,
      target: 'all',
      conditions: {
        level: false,
        rank: false,
      },
      levelRequirement: 10,
      rankRequirement: '钻石',
      startDate: '',
      endDate: '',
    },
  },
  {
    id: 'template2',
    name: '节日特惠',
    icon: '🎁',
    description: '节日期间的促销活动，提升收入',
    config: {
      name: '节日特惠活动',
      type: 'holiday',
      rewards: [{ type: 'discount', name: '皮肤折扣', quantity: 0.8 }],
      duration: 7,
      target: 'all',
      conditions: {
        level: false,
        rank: false,
      },
      levelRequirement: 10,
      rankRequirement: '钻石',
      startDate: '',
      endDate: '',
    },
  },
  {
    id: 'template3',
    name: '新手福利',
    icon: '🌟',
    description: '针对新用户的福利活动，提升留存',
    config: {
      name: '新手福利活动',
      type: 'limited',
      rewards: [{ type: 'currency', name: '金币奖励', quantity: 1000 }],
      duration: 14,
      target: 'new',
      conditions: {
        level: false,
        rank: false,
      },
      levelRequirement: 10,
      rankRequirement: '钻石',
      startDate: '',
      endDate: '',
    },
  },
  {
    id: 'template4',
    name: '社区争霸',
    icon: '🏆',
    description: '社区竞赛活动，提升用户粘性',
    config: {
      name: '社区争霸赛',
      type: 'community',
      rewards: [{ type: 'title', name: '社区王者', quantity: 1 }],
      duration: 10,
      target: 'active',
      conditions: {
        level: false,
        rank: false,
      },
      levelRequirement: 10,
      rankRequirement: '钻石',
      startDate: '',
      endDate: '',
    },
  },
]);

// 选中的活动类型
const selectedEventType = ref('limited');

// 活动配置
const eventConfig = ref<EventConfig>({
  name: '',
  startDate: '',
  endDate: '',
  type: 'limited',
  rewards: [{ type: 'skin', name: '', quantity: 1 }],
  conditions: {
    level: false,
    rank: false,
  },
  levelRequirement: 10,
  rankRequirement: '钻石',
});

// 历史活动数据
const historicalEvents = ref<HistoricalEvent[]>([
  {
    id: 1,
    name: '春节限时活动',
    type: 'holiday',
    icon: '🎄',
    date: '2026-01-20 ~ 2026-02-05',
    participationRate: 85,
    rating: 92,
    revenueIncrease: 35,
  },
  {
    id: 2,
    name: '周末双倍经验',
    type: 'limited',
    icon: '⏱️',
    date: '2026-01-15 ~ 2026-01-17',
    participationRate: 78,
    rating: 85,
    revenueIncrease: 15,
  },
  {
    id: 3,
    name: '社区挑战赛',
    type: 'community',
    icon: '👥',
    date: '2026-01-10 ~ 2026-01-20',
    participationRate: 65,
    rating: 88,
    revenueIncrease: 20,
  },
]);

// 预览弹窗
const showPreview = ref(false);
const previewConfig = ref<EventConfig>({ ...eventConfig.value });

// 影响预览
const showImpactPreview = ref(false);
const impactPreview = ref<ImpactPreview[]>([
  { metric: '用户活跃度', change: 15, description: '预计提升15%的日活跃用户' },
  { metric: '玩家满意度', change: 8, description: '预计提升8%的玩家满意度' },
  { metric: '收入', change: 20, description: '预计提升20%的活动期间收入' },
  { metric: '留存率', change: 5, description: '预计提升5%的7日留存率' },
]);

// 方法
const toggleCollapse = (): void => {
  isCollapsed.value = !isCollapsed.value;
};

// 选择活动类型
const selectEventType = (type: string): void => {
  selectedEventType.value = type;
  eventConfig.value.type = type;
  showImpactPreview.value = true;
  generateImpactPreview(type);
};

// 应用模板
const applyTemplate = (template: EventTemplate): void => {
  eventConfig.value = { ...eventConfig.value, ...template.config };
  selectedEventType.value = template.config.type;
  showImpactPreview.value = true;
  generateImpactPreview(template.config.type);
  alert(`已应用模板：${template.name}`);
};

// 快速策划
const quickPlan = (): void => {
  // 随机选择一个模板
  const randomTemplate =
    eventTemplates.value[
      Math.floor(Math.random() * eventTemplates.value.length)
    ];
  applyTemplate(randomTemplate);
};

// 生成影响预览
const generateImpactPreview = (eventType: string): void => {
  // 根据活动类型生成不同的影响预览
  if (eventType === 'limited') {
    impactPreview.value = [
      {
        metric: '用户活跃度',
        change: 15,
        description: '预计提升15%的日活跃用户',
      },
      {
        metric: '玩家满意度',
        change: 8,
        description: '预计提升8%的玩家满意度',
      },
      { metric: '收入', change: 10, description: '预计提升10%的活动期间收入' },
      { metric: '留存率', change: 5, description: '预计提升5%的7日留存率' },
    ];
  } else if (eventType === 'holiday') {
    impactPreview.value = [
      {
        metric: '用户活跃度',
        change: 25,
        description: '预计提升25%的日活跃用户',
      },
      {
        metric: '玩家满意度',
        change: 15,
        description: '预计提升15%的玩家满意度',
      },
      { metric: '收入', change: 30, description: '预计提升30%的活动期间收入' },
      { metric: '留存率', change: 8, description: '预计提升8%的7日留存率' },
    ];
  } else if (eventType === 'community') {
    impactPreview.value = [
      {
        metric: '用户活跃度',
        change: 20,
        description: '预计提升20%的日活跃用户',
      },
      {
        metric: '玩家满意度',
        change: 12,
        description: '预计提升12%的玩家满意度',
      },
      { metric: '收入', change: 15, description: '预计提升15%的活动期间收入' },
      { metric: '留存率', change: 10, description: '预计提升10%的7日留存率' },
    ];
  }
};

// 处理预览请求
const handlePreviewRequest = (config: EventConfig): void => {
  previewConfig.value = config;
  showPreview.value = true;
};

// 关闭预览
const closePreview = (): void => {
  showPreview.value = false;
};

// 保存活动
const saveEvent = (config: EventConfig): void => {
  // 这里可以添加保存逻辑
  emit('event-saved', config);

  // 显示成功提示
  alert('活动保存成功！');
};
</script>

<style lang="scss" scoped>
.event-planning-panel {
  @include utils.panel-base;

  .panel-header {
    @include utils.panel-header;
  }

  .panel-title {
    @include utils.panel-title;
  }

  .collapse-btn {
    @include utils.collapse-btn;

    .collapse-icon {
      font-size: tokens.$font-size-sm;
    }
  }

  .panel-content {
    @include utils.panel-content;

    &.collapsed {
      max-height: 0;
      padding: 0;
      overflow: hidden;
    }
  }

  .section-subtitle {
    @include utils.subsection-title;
  }

  .template-section {
    margin: tokens.$spacing-lg 0;

    .template-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: tokens.$spacing-md;
      margin-top: tokens.$spacing-sm;
    }

    .template-card {
      @include utils.glass-effect;

      border-radius: tokens.$radius-sm;
      padding: tokens.$spacing-md;
      cursor: pointer;
      transition: all tokens.$transition-normal;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: tokens.$spacing-xs;

      &:hover {
        background: rgb(251 191 36 / 20%);
        border-color: tokens.$primary-gold;
        transform: translateY(-2px);
        box-shadow: tokens.$shadow-gold-lg;
      }

      .template-icon {
        font-size: tokens.$font-size-2xl;
        margin-bottom: tokens.$spacing-xs;
      }

      .template-name {
        font-size: tokens.$font-size-sm;
        font-weight: tokens.$font-weight-semibold;
        color: white;
      }

      .template-desc {
        font-size: tokens.$font-size-xs;
        color: rgb(255 255 255 / 70%);
        text-align: center;
        line-height: 1.3;
      }
    }
  }

  .quick-plan-section {
    @include utils.flex-center;

    margin: tokens.$spacing-lg 0;

    .quick-plan-btn {
      @include utils.btn-primary;

      .btn-icon {
        font-size: tokens.$font-size-base;
      }
    }
  }

  .impact-preview {
    background: rgb(59 130 246 / 10%);
    border: 1px solid rgb(59 130 246 / 30%);
    border-radius: tokens.$radius-sm;
    padding: tokens.$spacing-md;
    margin: tokens.$spacing-lg 0;
    backdrop-filter: blur(10px);

    .impact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: tokens.$spacing-md;
      margin-top: tokens.$spacing-sm;
    }

    .impact-item {
      background: rgb(0 0 0 / 20%);
      border-radius: tokens.$radius-sm;
      padding: tokens.$spacing-sm;
      text-align: center;

      .impact-metric {
        font-size: tokens.$font-size-xs;
        color: rgb(255 255 255 / 80%);
        margin-bottom: tokens.$spacing-xs;
      }

      .impact-value {
        font-size: tokens.$font-size-base;
        font-weight: tokens.$font-weight-bold;
        margin-bottom: tokens.$spacing-xs;

        &.positive {
          color: tokens.$success-green;
          text-shadow: 0 0 4px rgb(16 185 129 / 50%);
        }

        &.negative {
          color: tokens.$danger-red;
          text-shadow: 0 0 4px rgb(239 68 68 / 50%);
        }
      }

      .impact-desc {
        font-size: 10px;
        color: rgb(255 255 255 / 60%);
        line-height: 1.2;
      }
    }
  }
}
</style>
