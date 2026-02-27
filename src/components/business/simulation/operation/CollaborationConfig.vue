<template>
  <div class="collaboration-config">
    <div class="config-section">
      <h4 class="section-title">合作联动配置</h4>
      <p class="section-description">
        选择合适的合作对象和联动方式，提升游戏影响�?      </p>

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
              {{ selectedOptionId === option.id ? '取消' : '选择' }}
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
              <span class="effect-value">{{ option.expected.duration }}�?/span>
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
          <span class="btn-icon">�?/span>
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

<style lang=scss scoped>
.collaboration-config {
  padding: 0;
}

/* 配置区块 */
.config-section {
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  padding: 20px;
}

.section-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 8px;
}

.section-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0 0 20px;
}

/* 合作联动列表 */
.collaboration-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
}

.collab-item {
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  padding: 15px;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.collab-item:hover {
  background-color: rgb(255 255 255 / 10%);
  border-color: var(--border-light);
}

.collab-item.selected {
  background-color: rgb(59 130 246 / 20%);
  border-color: var(--primary-blue);
  box-shadow: 0 2px 8px rgb(59 130 246 / 30%);
}

.collab-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.collab-info {
  display: flex;
  gap: 12px;
  flex: 1;
}

.collab-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.collab-details {
  flex: 1;
}

.collab-name {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: 4px;
}

.collab-type {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.select-btn {
  padding: 6px 12px;
  background-color: rgb(255 255 255 / 10%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.select-btn:hover {
  background-color: rgb(59 130 246 / 20%);
  color: var(--text-primary);
}

.select-btn.active {
  background-color: var(--primary-blue);
  color: white;
  border-color: var(--primary-blue);
}

/* 合作效果 */
.collab-effects {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding-top: 12px;
  border-top: 1px solid rgb(255 255 255 / 10%);
}

.effect-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.effect-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.effect-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
}

/* 操作按钮 */
.collab-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgb(255 255 255 / 10%);
}

/* 响应式设�? */
@media (width <= 768px) {
  .collab-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .collab-effects {
    gap: 15px;
  }

  .collab-actions {
    flex-direction: column;
  }

  .collab-actions .btn {
    width: 100%;
  }
}
</style>
