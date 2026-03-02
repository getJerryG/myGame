<template>
  <div class="event-config">
    <h4 class="section-title">活动配置</h4>
    <form class="config-form">
      <!-- 预设事件模板 -->
      <div class="form-group">
        <label class="form-label">快速配置</label>
        <select
          v-model="selectedTemplate"
          class="form-select"
          @change="applyTemplate"
        >
          <option value="">选择预设模板</option>
          <option value="dailyCheckIn">每日签到活动</option>
          <option value="weekendEvent">周末狂欢活动</option>
          <option value="holidayCelebration">节日庆典活动</option>
          <option value="newHeroLaunch">新英雄上线活动</option>
        </select>
      </div>

      <!-- 活动名称 -->
      <div class="form-group">
        <label
          for="event-name"
          class="form-label"
          >活动名称</label
        >
        <input
          id="event-name"
          v-model="localConfig.name"
          type="text"
          class="form-input"
          placeholder="输入活动名称"
        />
      </div>

      <!-- 时间范围设置 -->
      <div class="form-row">
        <div class="form-group">
          <label
            for="start-date"
            class="form-label"
            >开始日期</label
          >
          <input
            id="start-date"
            v-model="localConfig.startDate"
            type="date"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label
            for="end-date"
            class="form-label"
            >结束日期</label
          >
          <input
            id="end-date"
            v-model="localConfig.endDate"
            type="date"
            class="form-input"
          />
        </div>
      </div>

      <!-- 奖励设置 -->
      <div class="form-group">
        <label class="form-label">奖励设置</label>
        <div class="rewards-container">
          <div
            v-for="(reward, index) in localConfig.rewards"
            :key="index"
            class="reward-item"
          >
            <select
              v-model="reward.type"
              class="form-select"
            >
              <option value="skin">皮肤</option>
              <option value="hero">英雄</option>
              <option value="currency">游戏币</option>
              <option value="item">道具</option>
            </select>
            <select
              v-model="reward.name"
              class="form-input"
              v-if="reward.type === 'currency'"
            >
              <option value="金币">金币</option>
              <option value="钻石">钻石</option>
              <option value="点券">点券</option>
            </select>
            <input
              v-else
              v-model="reward.name"
              type="text"
              class="form-input"
              placeholder="奖励名称"
            />
            <input
              v-model="reward.quantity"
              type="number"
              class="form-input small"
              placeholder="数量"
              min="1"
            />
            <button
              type="button"
              class="remove-btn"
              @click="removeReward(index)"
            >
              ✕
            </button>
          </div>
          <button
            type="button"
            class="add-reward-btn"
            @click="addReward"
          >
            <span class="btn-icon">+</span>
            <span class="btn-text">添加奖励</span>
          </button>
        </div>
      </div>

      <!-- 参与条件 -->
      <div class="form-group">
        <label class="form-label">参与条件</label>
        <div class="conditions-container">
          <div class="condition-item">
            <label class="checkbox-label">
              <input
                v-model="localConfig.conditions.level"
                type="checkbox"
              />
              <span class="label-text">等级限制</span>
            </label>
            <input
              v-if="localConfig.conditions.level"
              v-model="localConfig.levelRequirement"
              type="number"
              class="form-input small"
              min="1"
              placeholder="最低等级"
            />
          </div>
        </div>
      </div>

      <!-- 预览按钮 -->
      <div class="form-actions">
        <button
          type="button"
          class="btn btn-secondary"
          @click="previewEvent"
        >
          <span class="btn-icon">👁️</span>
          <span class="btn-text">预览活动</span>
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="saveEvent"
        >
          <span class="btn-icon">💾</span>
          <span class="btn-text">保存活动</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// 接收父组件传递的属�?const props = defineProps({
  eventConfig: {
    type: Object,
    default: () => ({
      name: '',
      startDate: '',
      endDate: '',
      rewards: [{ type: 'skin', name: '', quantity: 1 }],
      conditions: {
        level: false,
      },
      levelRequirement: 10,
    }),
  },
});

// 向父组件传递事�?const emit = defineEmits(['event-saved', 'preview-requested']);

// 本地配置副本
const localConfig = ref({ ...props.eventConfig });

// 选中的模�?const selectedTemplate = ref('');

// 预设事件模板
const eventTemplates = {
  dailyCheckIn: {
    name: '每日签到活动',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    rewards: [
      { type: 'currency', name: '金币', quantity: 100 },
      { type: 'currency', name: '钻石', quantity: 10 },
    ],
    conditions: {
      level: false,
    },
    levelRequirement: 10,
  },
  weekendEvent: {
    name: '周末狂欢活动',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    rewards: [
      { type: 'currency', name: '钻石', quantity: 50 },
      { type: 'item', name: '经验卡', quantity: 5 },
    ],
    conditions: {
      level: false,
    },
    levelRequirement: 15,
  },
  holidayCelebration: {
    name: '节日庆典活动',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    rewards: [
      { type: 'skin', name: '节日限定', quantity: 1 },
      { type: 'currency', name: '钻石', quantity: 100 },
    ],
    conditions: {
      level: true,
    },
    levelRequirement: 20,
  },
  newHeroLaunch: {
    name: '新英雄上线活动',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    rewards: [
      { type: 'hero', name: '新英雄', quantity: 1 },
      { type: 'item', name: '英雄体验卡', quantity: 7 },
    ],
    conditions: {
      level: true,
    },
    levelRequirement: 15,
  },
};

// 监听父组件配置变化，更新本地副本
watch(
  () => props.eventConfig,
  (newConfig) => {
    localConfig.value = { ...newConfig };
  },
  { deep: true }
);

// 应用模板
const applyTemplate = (): void => {
  if (selectedTemplate.value && eventTemplates[selectedTemplate.value]) {
    localConfig.value = { ...eventTemplates[selectedTemplate.value] };
  }
};

// 添加奖励
const addReward = (): void => {
  localConfig.value.rewards.push({ type: 'skin', name: '', quantity: 1 });
};

// 删除奖励
const removeReward = (index: number): void => {
  if (localConfig.value.rewards.length > 1) {
    localConfig.value.rewards.splice(index, 1);
  }
};

// 预览活动
const previewEvent = (): void => {
  emit('preview-requested', { ...localConfig.value });
};

// 保存活动
const saveEvent = (): void => {
  emit('event-saved', { ...localConfig.value });
};
</script>

<style lang="scss" scoped>
.event-config {
  margin-bottom: tokens.$spacing-lg;

  .config-form {
    @include utils.flex-col(tokens.$spacing-lg, stretch, flex-start);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: tokens.$spacing-md;
  }

  .form-group {
    @include utils.flex-col(tokens.$spacing-xs, stretch, flex-start);
  }

  .form-label {
    font-size: tokens.$font-size-sm;
    font-weight: tokens.$font-weight-medium;
    color: tokens.$text-secondary;
  }

  .form-input {
    @include utils.input-base;

    &.small {
      max-width: 120px;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .form-select {
    @include utils.select-base;

    &.small {
      max-width: 150px;
    }
  }

  .rewards-container {
    @include utils.flex-col(tokens.$spacing-sm, stretch, flex-start);

    .reward-item {
      @include utils.flex-row(tokens.$spacing-sm, center, flex-start);

      padding: tokens.$spacing-sm;
      background-color: tokens.$bg-light;
      border-radius: tokens.$radius-md;

      .form-select {
        flex: 0 0 120px;
      }

      .form-input {
        flex: 1;
      }
    }

    .remove-btn {
      padding: 6px 10px;
      background-color: rgb(239 68 68 / 20%);
      border: 1px solid tokens.$danger-red;
      border-radius: tokens.$radius-md;
      color: tokens.$danger-red;
      cursor: pointer;
      transition: all tokens.$transition-fast;
      font-size: tokens.$font-size-sm;

      &:hover {
        background-color: rgb(239 68 68 / 30%);
      }
    }

    .add-reward-btn {
      @include utils.flex-row(tokens.$spacing-sm, center, center);

      padding: tokens.$spacing-sm;
      background-color: rgb(16 185 129 / 20%);
      border: 1px dashed tokens.$success-green;
      border-radius: tokens.$radius-md;
      color: tokens.$success-green;
      cursor: pointer;
      transition: all tokens.$transition-fast;
      font-size: tokens.$font-size-sm;
      font-weight: tokens.$font-weight-medium;

      &:hover {
        background-color: rgb(16 185 129 / 30%);
        border-style: solid;
      }
    }
  }

  .conditions-container {
    @include utils.flex-col(tokens.$spacing-md, stretch, flex-start);

    .condition-item {
      @include utils.flex-row(tokens.$spacing-md, center, flex-start);

      padding: tokens.$spacing-sm;
      background-color: tokens.$bg-light;
      border-radius: tokens.$radius-md;
    }

    .checkbox-label {
      @include utils.flex-row(tokens.$spacing-sm, center, flex-start);

      cursor: pointer;
      flex: 1;
      font-size: tokens.$font-size-sm;
      color: tokens.$text-secondary;

      input {
        &[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: tokens.$primary-blue;
        }
      }
    }
  }

  .form-actions {
    @include utils.flex-row(tokens.$spacing-md, center, flex-end);

    margin-top: tokens.$spacing-sm;

    .btn {
      @include utils.btn-base;

      &.btn-primary {
        @include utils.btn-primary;
      }

      &.btn-secondary {
        @include utils.btn-secondary;
      }
    }
  }
}

/* 响应式设�? */
@include utils.mobile {
  .event-config {
    .form-row {
      grid-template-columns: 1fr;
    }

    .reward-item {
      flex-direction: column;
      align-items: stretch;

      .form-select,
      .form-input {
        width: 100%;
        max-width: none;

        &.small {
          width: 100%;
          max-width: none;
        }
      }
    }

    .condition-item {
      flex-direction: column;
      align-items: stretch;
      gap: tokens.$spacing-sm;

      .form-input,
      .form-select {
        &.small {
          width: 100%;
          max-width: none;
        }
      }
    }

    .form-actions {
      flex-direction: column;

      .btn {
        width: 100%;
      }
    }
  }
}
</style>
