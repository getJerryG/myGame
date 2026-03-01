<template>
  <div class="storage-box-panel">
    <div
      class="panel-header"
      @click="toggleStorageBox"
    >
      <h3>收纳�?/h3>
      <span class="total-decompose-points">
        总分解积�?        <span class="points-value">+{{ totalDecomposePoints }}</span>
      </span>
      <span class="toggle-icon">{{ isStorageBoxOpen ? '�? : '�? }}</span>
    </div>
    <button
      v-if="isStorageBoxOpen"
      class="decompose-all-button"
      :disabled="organizedStorageBox.length === 0"
      @click="handleDecomposeAll"
    >
      全部分解
    </button>
    <div
      v-if="isStorageBoxOpen"
      class="storage-list"
    >
      <div
        v-if="organizedStorageBox.length === 0"
        class="empty-message"
      >
        收纳盒是空的，快去抽奖吧�?      </div>
      <div
        v-for="(item, index) in organizedStorageBox"
        v-else
        :key="item.type + '-' + item.displayName + '-' + index"
        class="storage-item"
      >
        <div class="storage-content">
          <span class="storage-name">{{ item.displayName }}</span>
          <span class="storage-value">x{{ item.totalCount }}</span>
        </div>
        <!-- 分解功能 -->
        <div class="decompose-section">
          <div class="decompose-controls">
            <input
              :value="decomposeQuantities[index]"
              type="number"
              class="decompose-quantity"
              placeholder="数量"
              :min="1"
              :max="item.totalCount"
              @input="handleQuantityChange($event, item, index)"
            />
            <button
              class="decompose-button"
              :disabled="decomposeQuantities[index] <= 0 || decomposeQuantities[index] > item.totalCount"
              @click="handleDecompose(item, index)"
            >
              分解
            </button>
          </div>
          <div class="decompose-reward">
            可获�?
            <span class="reward-points">+{{ calculateDecomposePoints(item, decomposeQuantities[index]) }}积分</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 接收props
defineProps({
  organizedStorageBox: {
    type: Array,
    required: true,
  },
  isStorageBoxOpen: {
    type: Boolean,
    required: true,
  },
  decomposeQuantities: {
    type: Array,
    required: true,
  },
  totalDecomposePoints: {
    type: Number,
    required: true,
  },
});

// 定义emit事件
const emit = defineEmits(['toggle-storage-box', 'decompose-all', 'decompose-item', 'validate-decompose-quantity']);

// 切换收纳盒展开/折叠状�?function toggleStorageBox(): void {
  emit('toggle-storage-box');
}

// 全部分解
function handleDecomposeAll(): void {
  emit('decompose-all');
}

// 定义存储物品类型
interface StorageItem {
  type: 'skin_fragment' | 'item' | 'permanent_skin';
  displayName: string;
  totalCount: number;
  skinName?: string;
}

// 计算分解积分
function calculateDecomposePoints(item: StorageItem, quantity = 1): number {
  if (!quantity || quantity <= 0) return 0;

  let totalPoints = 0;

  // 根据物品类型和名称确定分解积�?  if (item.type === 'skin_fragment') {
    totalPoints = quantity * 5; // 每组5积分
  } else if (item.type === 'item') {
    totalPoints = quantity * 5; // 每组5积分
  } else if (item.type === 'permanent_skin') {
    if (item.skinName === '伴生皮肤') {
      totalPoints = quantity * 10;
    } else if (item.skinName === '勇者皮�?) {
      totalPoints = quantity * 20;
    } else if (item.skinName === '史诗皮肤') {
      totalPoints = quantity * 40;
    }
  }

  return totalPoints;
}

// 处理分解操作
function handleDecompose(item: StorageItem, index: number): void {
  emit('decompose-item', item, index);
}

// 处理数量变化
function handleQuantityChange(event: Event, item: StorageItem, index: number): void {
  const value = parseInt((event.target as HTMLInputElement).value, 10) || 0;
  emit('update:decomposeQuantities', {
    index,
    value,
  });
  validateDecomposeQuantity(item, index);
}

// 验证分解数量
function validateDecomposeQuantity(item: StorageItem, index: number): void {
  emit('validate-decompose-quantity', item, index);
}
</script>

<style lang="scss" scoped>

/* 收纳盒面板 */
.storage-box-panel {
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  margin-bottom: tokens.$spacing-lg;
  overflow: hidden;
  box-shadow: tokens.$shadow-md;
  border: 1px solid tokens.$border-light;
  flex-shrink: 0;
}

/* 面板头部 */
.panel-header {
  @include utils.flex-between;

  padding: tokens.$spacing-md;
  cursor: pointer;
  background-color: tokens.$bg-light;
  border-bottom: 1px solid tokens.$border-light;
  height: 50px;
  flex-shrink: 0;

  h3 {
    margin: 0;
    color: tokens.$primary-blue;
    font-size: tokens.$font-size-base;
    line-height: 20px;
  }
}

/* 总分解积分 */
.total-decompose-points {
  font-size: tokens.$font-size-xs;
  color: tokens.$success;
  margin-right: auto;
  margin-left: tokens.$spacing-sm;
  white-space: nowrap;
}

.points-value {
  font-weight: tokens.$font-weight-bold;
  font-size: tokens.$font-size-sm;
  color: tokens.$success;
}

/* 展开/折叠图标 */
.toggle-icon {
  font-size: tokens.$font-size-xs;
  color: tokens.$primary-light;
  transition: transform tokens.$transition-normal;
}

/* 全部分解按钮 */
.decompose-all-button {
  margin: 0 tokens.$spacing-md tokens.$spacing-md;
  background-color: tokens.$error;
  color: white;
  border: none;
  padding: tokens.$spacing-sm tokens.$spacing-md;
  border-radius: tokens.$radius-sm;
  cursor: pointer;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  transition: all tokens.$transition-normal;
  height: 40px;
  flex-shrink: 0;

  &:hover {
    &:not(:disabled) {
      background-color: #dc2626;
      transform: translateY(-1px);
      box-shadow: tokens.$shadow-md;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
}

/* 收纳盒列表 */
.storage-list {
  overflow-y: auto;
  padding: 0 tokens.$spacing-md tokens.$spacing-md;
  min-height: 0;
  max-height: 400px;

  @include utils.custom-scrollbar;
}

/* 空状态 */
.empty-message {
  text-align: center;
  color: tokens.$text-secondary;
  padding: tokens.$spacing-lg;
  font-style: italic;
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-md;
  margin-top: tokens.$spacing-md;
}

/* 收纳项 */
.storage-item {
  background-color: tokens.$bg-secondary;
  padding: tokens.$spacing-sm;
  border-radius: tokens.$radius-md;
  margin-top: tokens.$spacing-sm;
  box-shadow: tokens.$shadow-sm;
  border: 1px solid tokens.$border-light;
  transition: all tokens.$transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-md;
    border-color: tokens.$border-medium;
  }
}

/* 收纳项内容 */
.storage-content {
  @include utils.flex-between;
}

.storage-name {
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
}

.storage-value {
  color: tokens.$primary-blue;
  font-weight: tokens.$font-weight-bold;
}

/* 分解功能 */
.decompose-section {
  margin-top: tokens.$spacing-sm;
  padding-top: tokens.$spacing-sm;
  border-top: 1px dashed tokens.$border-light;
}

.decompose-controls {
  @include utils.flex-row(tokens.$spacing-sm, center);

  margin-bottom: tokens.$spacing-xs;
}

.decompose-quantity {
  width: 60px;
  padding: tokens.$spacing-xs;
  border: 1px solid tokens.$border-light;
  border-radius: tokens.$radius-sm;
  font-size: tokens.$font-size-xs;
  text-align: center;
  background-color: tokens.$bg-primary;
  color: tokens.$text-primary;

  &:focus {
    outline: none;
    border-color: tokens.$primary-gold;
  }
}

.decompose-button {
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  background-color: tokens.$error;
  color: white;
  border: none;
  border-radius: tokens.$radius-sm;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-medium;
  cursor: pointer;
  transition: all tokens.$transition-normal;

  &:hover {
    &:not(:disabled) {
      background-color: #dc2626;
      transform: translateY(-1px);
    }
  }

  &:disabled {
    background-color: tokens.$gray-400;
    cursor: not-allowed;
    transform: none;
  }
}

.decompose-reward {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
  margin-top: tokens.$spacing-xs;
}

.reward-points {
  color: tokens.$success;
  font-weight: tokens.$font-weight-bold;
}
</style>


