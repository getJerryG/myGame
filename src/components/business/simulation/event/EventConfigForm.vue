<template>
  <div class="event-config">
    <h4 class="section-title">活动配置</h4>
    <form class="config-form">
      <!-- 预设事件模板 -->
      <div class="form-group">
        <label class="form-label">快速配�?/label>
        <select
          v-model="selectedTemplate"
          class="form-select"
          @change="applyTemplate"
        >
          <option value="">选择预设模板</option>
          <option value="dailyCheckIn">每日签到活动</option>
          <option value="weekendEvent">周末狂欢活动</option>
          <option value="holidayCelebration">节日庆典活动</option>
          <option value="newHeroLaunch">新英雄上线活�?/option>
        </select>
      </div>

      <!-- 活动名称 -->
      <div class="form-group">
        <label for="event-name" class="form-label">活动名称</label>
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
          <label for="start-date" class="form-label">开始日�?/label>
          <input
            id="start-date"
            v-model="localConfig.startDate"
            type="date"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="end-date" class="form-label">结束日期</label>
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
            <select v-model="reward.type" class="form-select">
              <option value="skin">皮肤</option>
              <option value="hero">英雄</option>
              <option value="currency">游戏�?/option>
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
              �?            </button>
          </div>
          <button type="button" class="add-reward-btn" @click="addReward">
            <span class="btn-icon">�?/span>
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
              <input v-model="localConfig.conditions.level" type="checkbox" />
              <span class="label-text">等级限制</span>
            </label>
            <input
              v-if="localConfig.conditions.level"
              v-model="localConfig.levelRequirement"
              type="number"
              class="form-input small"
              min="1"
              placeholder="最低等�?
            />
          </div>
        </div>
      </div>

      <!-- 预览按钮 -->
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="previewEvent">
          <span class="btn-icon">👁�?/span>
          <span class="btn-text">预览活动</span>
        </button>
        <button type="button" class="btn btn-primary" @click="saveEvent">
          <span class="btn-icon">💾</span>
          <span class="btn-text">保存活动</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang=ts>
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
      { type: 'item', name: '经验�?, quantity: 5 },
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
    name: '新英雄上线活�?,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    rewards: [
      { type: 'hero', name: '新英�?, quantity: 1 },
      { type: 'item', name: '英雄体验�?, quantity: 7 },
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

<style lang=scss scoped>
.event-config {
  margin-bottom: 25px;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.form-input {
  padding: 10px 12px;
  background-color: rgb(255 255 255 / 5%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 10%);
}

.form-input.small {
  max-width: 120px;
}

.form-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-select {
  padding: 10px 12px;
  background-color: rgb(255 255 255 / 5%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 10%);
}

.form-select.small {
  max-width: 150px;
}

/* 奖励设置 */
.rewards-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reward-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px;
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
}

.reward-item .form-select {
  flex: 0 0 120px;
}

.reward-item .form-input {
  flex: 1;
}

.remove-btn {
  padding: 6px 10px;
  background-color: rgb(239 68 68 / 20%);
  border: 1px solid var(--danger-red);
  border-radius: var(--radius-md);
  color: var(--danger-red);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--text-sm);
}

.remove-btn:hover {
  background-color: rgb(239 68 68 / 30%);
}

.add-reward-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: rgb(16 185 129 / 20%);
  border: 1px dashed var(--success-green);
  border-radius: var(--radius-md);
  color: var(--success-green);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.add-reward-btn:hover {
  background-color: rgb(16 185 129 / 30%);
  border-style: solid;
}

/* 参与条件 */
.conditions-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.condition-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex: 1;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.checkbox-label input[type='checkbox'] {
  width: 16px;
  height: 16px;
  accent-color: #3b82f6;
}

/* 表单操作按钮 */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 10px;
}

/* 响应式设�? */
@media (width <= 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .reward-item {
    flex-direction: column;
    align-items: stretch;
  }

  .reward-item .form-select,
  .reward-item .form-input,
  .reward-item .form-input.small {
    width: 100%;
    max-width: none;
  }

  .condition-item {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .condition-item .form-input.small,
  .condition-item .form-select.small {
    width: 100%;
    max-width: none;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>




