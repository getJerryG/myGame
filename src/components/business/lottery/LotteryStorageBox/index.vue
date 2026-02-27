<template>
  <div class="storage-box-panel">
    <div
      class="panel-header"
      @click="toggleStorageBox"
    >
      <h3>收纳箱</h3>
      <span class="total-decompose-points">
        总分解积分 <span class="points-value">+{{ totalDecomposePoints }}</span>
      </span>
      <span class="toggle-icon">{{ isStorageBoxOpen ? '▼' : '▶' }}</span>
    </div>
    <button
      v-if="isStorageBoxOpen"
      class="decompose-all-button"
      :disabled="lotteryStore.storageBox.length === 0"
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
        收纳盒是空的，快去抽奖吧�?
      </div>
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
              v-model.number="decomposeQuantities[index]"
              type="number"
              class="decompose-quantity"
              placeholder="数量"
              :min="1"
              :max="item.totalCount"
              @input="validateDecomposeQuantity(item, index)"
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
import { computed, ref, watch } from 'vue';
import { useLotteryStore } from '@/stores/lotteryStore';
// import type { GeneratedReward } from '../../stores/lottery/lottery-rewards';

const lotteryStore = useLotteryStore();

// 收纳盒展开状�?const isStorageBoxOpen = ref(true);

// 分解数量映射
const decomposeQuantities = ref<number[]>([]);

// 组织后的收纳盒物品类型
interface OrganizedStorageItem {
  type: string;
  displayName: string;
  pointsValue: number;
  count: number;
  totalCount: number;
  name: string;
  skinName?: string;
}

// 计算总分解积分
const totalDecomposePoints = computed(() => {
  return lotteryStore.storageBox.reduce((total, item) => {
    return total + item.pointsValue * item.count;
  }, 0);
});

// 按类型和名称组织收纳盒物品
const organizedStorageBox = computed<OrganizedStorageItem[]>(() => {
  const map = new Map<string, OrganizedStorageItem>();

  // 遍历所有物品，按类型和名称分组
  lotteryStore.storageBox.forEach((item) => {
    const key = `${item.type}-${item.displayName}`;
    if (map.has(key)) {
      const existingItem = map.get(key)!;
      existingItem.totalCount += item.count;
    } else {
      map.set(key, { ...item, totalCount: item.count });
    }
  });

  // 转换为数�?  return Array.from(map.values());
});

// 监听收纳盒变化，重置分解数量数组
watch(
  () => organizedStorageBox.value,
  () => {
    decomposeQuantities.value = new Array(organizedStorageBox.value.length).fill(1);
  },
  { immediate: true }
);

// 切换收纳盒展开状态
const toggleStorageBox = (): void => {
  isStorageBoxOpen.value = !isStorageBoxOpen.value;
};

// 验证分解数量
const validateDecomposeQuantity = (item: OrganizedStorageItem, index: number): void => {
  if (decomposeQuantities.value[index] < 1) {
    decomposeQuantities.value[index] = 1;
  } else if (decomposeQuantities.value[index] > item.totalCount) {
    decomposeQuantities.value[index] = item.totalCount;
  }
};

// 计算分解积分
const calculateDecomposePoints = (item: OrganizedStorageItem, quantity: number): number => {
  return item.pointsValue * quantity;
};

// 处理分解单个物品
const handleDecompose = (item: OrganizedStorageItem, index: number): void => {
  const quantity = decomposeQuantities.value[index];
  if (quantity <= 0 || quantity > item.totalCount) return;

  lotteryStore.decomposeItem(item.type, item.displayName, quantity);
};

// 处理全部分解
const handleDecomposeAll = (): void => {
  lotteryStore.decomposeAll();
};
</script>

<style lang="scss" scoped>
.storage-box-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  user-select: none;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.total-decompose-points {
  font-size: 14px;
  color: #666;
}

.points-value {
  color: #ff6b35;
  font-weight: bold;
}

.toggle-icon {
  font-size: 12px;
  color: #666;
  transition: transform 0.2s;
}

.decompose-all-button {
  margin: 10px 15px;
  padding: 8px;
  background-color: #ff6b35;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.decompose-all-button:hover:not(:disabled) {
  background-color: #ff5722;
}

.decompose-all-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.storage-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 15px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-message {
  text-align: center;
  color: #999;
  padding: 20px 0;
  font-style: italic;
}

.storage-item {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.storage-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.storage-name {
  font-weight: 500;
  color: #333;
}

.storage-value {
  color: #666;
  font-weight: bold;
}

.decompose-section {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.decompose-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.decompose-quantity {
  width: 60px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}

.decompose-button {
  padding: 5px 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.decompose-button:hover:not(:disabled) {
  background-color: #45a049;
}

.decompose-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.decompose-reward {
  font-size: 12px;
  color: #666;
}

.reward-points {
  color: #ff6b35;
  font-weight: bold;
}
</style>
