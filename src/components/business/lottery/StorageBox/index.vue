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
/* 收纳盒面�? */
.storage-box-panel {
  background-color: #f0f8ff;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  flex-shrink: 0;
}

/* 面板头部 */
.storage-box-panel .panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  background-color: #e3f2fd;
  border-bottom: 1px solid #bbdefb;
  height: 50px;
  flex-shrink: 0;
}

.storage-box-panel .panel-header h3 {
  margin: 0;
  color: #2196f3;
  font-size: 16px;
  line-height: 20px;
}

/* 总分解积�? */
.total-decompose-points {
  font-size: 12px;
  color: #4caf50;
  margin-right: auto;
  margin-left: 10px;
  white-space: nowrap;
}

.points-value {
  font-weight: bold;
  font-size: 14px;
  color: #4caf50;
}

/* 展开/折叠图标 */
.toggle-icon {
  font-size: 12px;
  color: #64b5f6;
  transition: transform 0.3s;
}

/* 全部分解按钮 */
.decompose-all-button {
  margin: 0 15px 15px;
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  height: 40px;
  flex-shrink: 0;
}

.decompose-all-button:hover:not(:disabled) {
  background-color: #d32f2f;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgb(0 0 0 / 15%);
}

.decompose-all-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 收纳盒列�? */
.storage-list {
  overflow-y: auto;
  padding: 0 15px 15px;
  min-height: 0;
  max-height: 400px;
}

/* 空状�? */
.empty-message {
  text-align: center;
  color: #666;
  padding: 20px;
  font-style: italic;
  background-color: white;
  border-radius: 5px;
  margin-top: 15px;
}

/* 收纳�? */
.storage-item {
  background-color: white;
  padding: 8px;
  border-radius: 5px;
  margin-top: 10px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  transition: transform 0.2s;
}

.storage-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgb(0 0 0 / 15%);
}

/* 收纳项内�? */
.storage-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.storage-name {
  font-weight: bold;
  color: #333;
}

.storage-value {
  color: #2196f3;
  font-weight: bold;
}

/* 分解功能 */
.decompose-section {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #e0e0e0;
}

.decompose-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
  align-items: center;
}

.decompose-quantity {
  width: 60px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
}

.decompose-button {
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.decompose-button:hover:not(:disabled) {
  background-color: #d32f2f;
  transform: translateY(-1px);
}

.decompose-button:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
  transform: none;
}

.decompose-reward {
  font-size: 11px;
  color: #666;
  margin-top: 5px;
}

.reward-points {
  color: #4caf50;
  font-weight: bold;
}
</style>


