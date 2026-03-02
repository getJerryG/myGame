<template>
  <div class="collaboration-config">
    <div class="config-section">
      <h4 class="section-title">合作联动配置</h4>
      <p class="section-description">
        选择合适的合作对象和联动方式，提升游戏影响力
      </p>

      <!-- 合作联动列表 -->
      <div class="collaboration-list">
        <div
          v-for="option in options"
          :key="option.id"
          class="collab-item"
          :class="{ selected: selectedOptionId === option.id }"
          @click="selectCollaboration(option)"
        >
          <div class="collab-header">
            <div class="collab-info">
              <span class="collab-icon">{{ option.icon }}</span>
              <div class="collab-details">
                <div class="collab-name">{{ option.name }}</div>
                <div class="collab-type">{{ option.type }}</div>
              </div>
            </div>
            <button
              class="select-btn"
              :class="{ active: selectedOptionId === option.id }"
              @click.stop="toggleCollaboration(option)"
            >
              {{ selectedOptionId === option.id ? "取消" : "选择" }}
            </button>
          </div>

          <!-- 合作效果预览 -->
          <div class="collab-effects">
            <div class="effect-item">
              <span class="effect-label">预计效果</span>
              <span class="effect-value">{{ option.expected.effect }}</span>
            </div>
            <div class="effect-item">
              <span class="effect-label">预计成本</span>
              <span class="effect-value">{{ option.expected.cost }}万元</span>
            </div>
            <div class="effect-item">
              <span class="effect-label">持续时间</span>
              <span class="effect-value">{{ option.expected.duration }}天</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="collab-actions">
        <button class="btn btn-secondary" @click="resetSelection">
          <span class="btn-icon">🔄</span>
          <span class="btn-text">重置选择</span>
        </button>
        <button
          class="btn btn-primary"
          :disabled="!selectedOptionId"
          @click="confirmCollaboration"
        >
          <span class="btn-icon">✅</span>
          <span class="btn-text">确认合作</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 合作选项类型定义
interface CollaborationOption {
  id: string;
  name: string;
  type: string;
  icon: string;
  expected: {
    effect: string;
    cost: number;
    duration: number;
  };
}

defineProps({
  options: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits([
  'select-option',
  'confirm-collaboration',
  'reset-selection',
]);

// 选中的合作选项
const selectedOptionId = ref<string | null>(null);
const selectedOption = ref<CollaborationOption | null>(null);

// 选择合作
function selectCollaboration(option: CollaborationOption): void {
  selectedOptionId.value = option.id;
  selectedOption.value = option;
  emit('select-option', option);
}

// 切换合作选择
function toggleCollaboration(option: CollaborationOption): void {
  if (selectedOptionId.value === option.id) {
    selectedOptionId.value = null;
    selectedOption.value = null;
  } else {
    selectedOptionId.value = option.id;
    selectedOption.value = option;
    emit('select-option', option);
  }
}

// 确认合作
function confirmCollaboration(): void {
  if (selectedOption.value) {
    emit('confirm-collaboration', selectedOption.value);
    selectedOptionId.value = null;
    selectedOption.value = null;
  }
}

// 重置选择
function resetSelection(): void {
  selectedOptionId.value = null;
  selectedOption.value = null;
  emit('reset-selection');
}
</script>

<style lang="scss" scoped>
.collaboration-config {
  padding: 0;
}

/* 配置区块 */
.config-section {
  @include utils.config-section;
}

.section-title {
  @include utils.section-title;
}

.section-description {
  @include utils.section-description;
}

/* 合作联动列表 */
.collaboration-list {
  @include utils.flex-col(tokens.$spacing-md, stretch);

  margin-bottom: tokens.$spacing-xl;
}

.collab-item {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;
  transition: all tokens.$transition-fast;
  border: 1px solid transparent;

  &:hover {
    background-color: tokens.$bg-lighter;
    border-color: tokens.$border-light;
  }

  &.selected {
    background-color: rgb(59 130 246 / 20%);
    border-color: tokens.$primary-blue;
    box-shadow: tokens.$shadow-blue;
  }
}

.collab-header {
  @include utils.flex-between(flex-start);

  margin-bottom: tokens.$spacing-md;
}

.collab-info {
  @include utils.flex-row(tokens.$spacing-sm, center);

  flex: 1;
}

.collab-icon {
  font-size: tokens.$font-size-xl;
  flex-shrink: 0;
}

.collab-details {
  flex: 1;
}

.collab-name {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
  margin-bottom: tokens.$spacing-xs;
}

.collab-type {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
}

.select-btn {
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  background-color: tokens.$bg-lighter;
  border: 1px solid tokens.$border-light;
  border-radius: tokens.$radius-sm;
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover {
    background-color: rgb(59 130 246 / 20%);
    color: tokens.$text-primary;
  }

  &.active {
    background-color: tokens.$primary-blue;
    color: white;
    border-color: tokens.$primary-blue;
  }
}

/* 合作效果 */
.collab-effects {
  @include utils.flex-row(tokens.$spacing-xl, center);

  flex-wrap: wrap;
  padding-top: tokens.$spacing-sm;
  border-top: 1px solid rgb(255 255 255 / 10%);
}

.effect-item {
  @include utils.stat-item;
}

.effect-label {
  @include utils.stat-label;
}

.effect-value {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-secondary;
}

/* 操作按钮 */
.collab-actions {
  @include utils.flex-row(tokens.$spacing-md, center, flex-end);

  margin-top: tokens.$spacing-lg;
  padding-top: tokens.$spacing-lg;
  border-top: 1px solid rgb(255 255 255 / 10%);

  .btn {
    &-primary {
      @include utils.btn-primary;
    }

    &-secondary {
      @include utils.btn-secondary;
    }
  }
}

/* 响应式设计 */
@include utils.mobile {
  .collab-header {
    flex-direction: column;
    align-items: flex-start;
    gap: tokens.$spacing-sm;
  }

  .collab-effects {
    gap: tokens.$spacing-md;
  }

  .collab-actions {
    flex-direction: column;

    .btn {
      width: 100%;
    }
  }
}
</style>
