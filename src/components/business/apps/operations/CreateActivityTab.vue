<template>
  <div class="create-activity-tab">
    <div class="section-card">
      <h3 class="text-gold">创建新活动</h3>

      <!-- 活动类型选择 -->
      <div class="form-section">
        <h4>活动类型</h4>
        <div class="option-buttons">
          <button
            v-for="type in activityTypes"
            :key="type.id"
            class="option-btn"
            :class="{ active: selectedType === type.id }"
            @click="$emit('update:selectedType', type.id)"
          >
            <span class="option-icon">{{ type.icon }}</span>
            <span class="option-name">{{ type.name }}</span>
          </button>
        </div>
      </div>

      <!-- 活动名称 -->
      <div class="form-section">
        <h4>活动名称</h4>
        <input
          type="text"
          :value="activityName"
          @input="
            $emit(
              'update:activityName',
              ($event.target as HTMLInputElement).value,
            )
          "
          placeholder="请输入活动名称"
          class="input-field"
        />
      </div>

      <!-- 活动描述 -->
      <div class="form-section">
        <h4>活动描述</h4>
        <textarea
          :value="activityDescription"
          @input="
            $emit(
              'update:activityDescription',
              ($event.target as HTMLTextAreaElement).value,
            )
          "
          placeholder="请输入活动描述"
          class="textarea-field"
          rows="3"
        ></textarea>
      </div>

      <!-- 活动时间 -->
      <div class="form-section">
        <h4>活动时间</h4>
        <div class="time-inputs">
          <div class="time-input-group">
            <label>开始时间</label>
            <input
              type="datetime-local"
              :value="startTime"
              @input="
                $emit(
                  'update:startTime',
                  ($event.target as HTMLInputElement).value,
                )
              "
              class="input-field"
            />
          </div>
          <div class="time-input-group">
            <label>结束时间</label>
            <input
              type="datetime-local"
              :value="endTime"
              @input="
                $emit(
                  'update:endTime',
                  ($event.target as HTMLInputElement).value,
                )
              "
              class="input-field"
            />
          </div>
        </div>
      </div>

      <!-- 活动奖励 -->
      <div class="form-section">
        <h4>活动奖励</h4>
        <div class="rewards-inputs">
          <div class="reward-input-group">
            <label>金币奖励</label>
            <input
              type="number"
              :value="goldReward"
              @input="
                $emit(
                  'update:goldReward',
                  Number(($event.target as HTMLInputElement).value),
                )
              "
              placeholder="0"
              class="input-field"
            />
          </div>
          <div class="reward-input-group">
            <label>经验奖励</label>
            <input
              type="number"
              :value="expReward"
              @input="
                $emit(
                  'update:expReward',
                  Number(($event.target as HTMLInputElement).value),
                )
              "
              placeholder="0"
              class="input-field"
            />
          </div>
        </div>
      </div>

      <!-- 确认创建按钮 -->
      <div class="action-section">
        <button
          class="confirm-btn"
          @click="$emit('create')"
          :disabled="!canCreate"
        >
          创建活动
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const activityTypes = [
  { id: 'login', name: '登录活动', icon: '📅' },
  { id: 'recharge', name: '充值活动', icon: '💰' },
  { id: 'consumption', name: '消费活动', icon: '🛒' },
  { id: 'pvp', name: '竞技活动', icon: '⚔️' },
  { id: 'cooperation', name: '合作活动', icon: '🤝' },
  { id: 'festival', name: '节日活动', icon: '🎉' },
];

const props = defineProps<{
  selectedType: string;
  activityName: string;
  activityDescription: string;
  startTime: string;
  endTime: string;
  goldReward: number;
  expReward: number;
}>();

const emit = defineEmits<{
  'update:selectedType': [id: string];
  'update:activityName': [name: string];
  'update:activityDescription': [desc: string];
  'update:startTime': [time: string];
  'update:endTime': [time: string];
  'update:goldReward': [value: number];
  'update:expReward': [value: number];
  create: [];
}>();

const canCreate = computed(() => {
  return (
    props.activityName.trim() !== '' &&
    props.startTime !== '' &&
    props.endTime !== ''
  );
});
</script>

<style lang="scss" scoped>
.create-activity-tab {
  padding: tokens.$spacing-lg;
}

.section-card {
  background: tokens.$bg-light;
  border: 1px solid tokens.$border-medium;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-xl;
}

.text-gold {
  color: tokens.$primary-gold;
  margin: 0 0 tokens.$spacing-lg 0;
  font-size: tokens.$font-size-xl;
}

.form-section {
  margin-bottom: tokens.$spacing-lg;

  h4 {
    margin: 0 0 tokens.$spacing-md 0;
    font-size: tokens.$font-size-base;
    color: tokens.$text-primary;
  }
}

.option-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: tokens.$spacing-md;
}

.option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: tokens.$spacing-md;
  background: tokens.$bg-secondary;
  border: 2px solid tokens.$border-medium;
  border-radius: tokens.$radius-md;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover {
    border-color: tokens.$primary-gold;
    background: rgb(255 193 7 / 10%);
  }

  &.active {
    border-color: tokens.$primary-gold;
    background: rgb(255 193 7 / 20%);
  }

  .option-icon {
    font-size: 32px;
    margin-bottom: tokens.$spacing-sm;
  }

  .option-name {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-primary;
  }
}

.input-field,
.textarea-field {
  width: 100%;
  padding: tokens.$spacing-md;
  background: tokens.$bg-primary;
  border: 1px solid tokens.$border-medium;
  border-radius: tokens.$radius-sm;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-base;

  &:focus {
    outline: none;
    border-color: tokens.$primary-blue;
  }
}

.time-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: tokens.$spacing-md;
}

.time-input-group {
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: tokens.$spacing-xs;
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
  }
}

.rewards-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: tokens.$spacing-md;
}

.reward-input-group {
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: tokens.$spacing-xs;
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
  }
}

.action-section {
  margin-top: tokens.$spacing-xl;
  text-align: center;
}

.confirm-btn {
  padding: tokens.$spacing-md tokens.$spacing-xl;
  background: linear-gradient(
    135deg,
    tokens.$primary-gold 0%,
    color.adjust(tokens.$primary-gold, $lightness: -10%) 100%
  );
  border: none;
  border-radius: tokens.$radius-md;
  color: #fff;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover {
    &:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgb(255 193 7 / 40%);
    }
  }

  &:active {
    &:not(:disabled) {
      transform: translateY(0);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
