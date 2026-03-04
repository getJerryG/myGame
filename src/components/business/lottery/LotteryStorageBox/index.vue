<template>
  <div class="storage-box-panel">
    <div class="panel-header" @click="toggleStorageBox">
      <h3>收纳箱</h3>
      <span class="total-decompose-points">
        总分解积分 <span class="points-value">+{{ totalDecomposePoints }}</span>
      </span>
      <span class="toggle-icon">{{ isStorageBoxOpen ? "▼" : "▶" }}</span>
    </div>
    <button
      v-if="isStorageBoxOpen"
      class="decompose-all-button"
      :disabled="lotteryStore.storageBox.length === 0"
      @click="handleDecomposeAll"
    >
      全部分解
    </button>
    <div v-if="isStorageBoxOpen" class="storage-list">
      <div v-if="organizedStorageBox.length === 0" class="empty-message">
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
              :disabled="
                decomposeQuantities[index] <= 0 ||
                decomposeQuantities[index] > item.totalCount
              "
              @click="handleDecompose(item, index)"
            >
              分解
            </button>
          </div>
          <div class="decompose-reward">
            可获�?
            <span class="reward-points"
              >+{{
                calculateDecomposePoints(item, decomposeQuantities[index])
              }}积分</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLotteryStore } from "@/stores/lotteryStore";
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

  // 转换为数组
  return Array.from(map.values());
});

// 监听收纳盒变化，重置分解数量数组
watch(
  () => organizedStorageBox.value,
  () => {
    decomposeQuantities.value = new Array(
      organizedStorageBox.value.length,
    ).fill(1);
  },
  { immediate: true },
);

// 切换收纳盒展开状态
const toggleStorageBox = (): void => {
  isStorageBoxOpen.value = !isStorageBoxOpen.value;
};

// 验证分解数量
const validateDecomposeQuantity = (
  item: OrganizedStorageItem,
  index: number,
): void => {
  if (decomposeQuantities.value[index] < 1) {
    decomposeQuantities.value[index] = 1;
  } else if (decomposeQuantities.value[index] > item.totalCount) {
    decomposeQuantities.value[index] = item.totalCount;
  }
};

// 计算分解积分
const calculateDecomposePoints = (
  item: OrganizedStorageItem,
  quantity: number,
): number => {
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
  background-color: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  box-shadow: tokens.$shadow-md;
  border: 1px solid tokens.$border-light;
}

.panel-header {
  @include utils.flex-between;

  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: tokens.$bg-light;
  border-bottom: 1px solid tokens.$border-light;
  cursor: pointer;
  user-select: none;

  h3 {
    margin: 0;
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-semibold;
    color: tokens.$text-primary;
  }
}

.total-decompose-points {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
}

.points-value {
  color: tokens.$warning;
  font-weight: tokens.$font-weight-bold;
}

.toggle-icon {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
  transition: transform tokens.$transition-fast;
}

.decompose-all-button {
  margin: tokens.$spacing-sm tokens.$spacing-md;
  padding: tokens.$spacing-sm;
  background-color: tokens.$warning;
  color: tokens.$bg-dark;
  border: none;
  border-radius: tokens.$radius-sm;
  cursor: pointer;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  transition: all tokens.$transition-fast;

  &:hover {
    &:not(:disabled) {
      background-color: #d97706;
      transform: translateY(-1px);
    }
  }

  &:disabled {
    background-color: tokens.$gray-400;
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.storage-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 tokens.$spacing-md tokens.$spacing-md;
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-sm;

  @include utils.custom-scrollbar;
}

.empty-message {
  text-align: center;
  color: tokens.$text-muted;
  padding: tokens.$spacing-lg 0;
  font-style: italic;
}

.storage-item {
  background-color: tokens.$bg-light;
  border: 1px solid tokens.$border-light;
  border-radius: tokens.$radius-sm;
  padding: tokens.$spacing-sm;
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-xs;
  transition: all tokens.$transition-fast;

  &:hover {
    border-color: tokens.$border-medium;
    transform: translateY(-1px);
  }
}

.storage-content {
  @include utils.flex-between;
}

.storage-name {
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
}

.storage-value {
  color: tokens.$text-secondary;
  font-weight: tokens.$font-weight-bold;
}

.decompose-section {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-xs;
}

.decompose-controls {
  @include utils.flex-row(tokens.$spacing-sm, center);
}

.decompose-quantity {
  width: 60px;
  padding: tokens.$spacing-xs;
  border: 1px solid tokens.$border-light;
  border-radius: tokens.$radius-sm;
  font-size: tokens.$font-size-sm;
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
  background-color: tokens.$success;
  color: white;
  border: none;
  border-radius: tokens.$radius-sm;
  cursor: pointer;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  transition: all tokens.$transition-fast;

  &:hover {
    &:not(:disabled) {
      background-color: #059669;
      transform: translateY(-1px);
    }
  }

  &:disabled {
    background-color: tokens.$gray-400;
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.decompose-reward {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
}

.reward-points {
  color: tokens.$warning;
  font-weight: tokens.$font-weight-bold;
}
</style>
