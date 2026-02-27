<template>
  <div class="login-reward-config">
    <div class="config-section">
      <h4 class="section-title">登录奖励配置</h4>
      <p class="section-description">设置连续登录奖励，激励玩家保持活�?/p>

      <!-- 奖励序列配置 -->
      <div class="reward-sequence">
        <h5>奖励序列</h5>
        <div class="sequence-container">
          <div
            v-for="(day, index) in loginRewards"
            :key="index"
            class="day-item"
            :class="{ draggable: index > 0 }"
            :draggable="index > 0"
            @dragstart="onDragStart($event, index)"
            @dragover.prevent
            @drop="onDrop($event, index)"
          >
            <div class="day-header">
              <span class="day-number">第{{ index + 1 }}�?/span>
              <button
                v-if="index > 0"
                class="remove-btn"
                @click="removeLoginReward(index)"
              >
                �?              </button>
            </div>
            <div class="reward-preview">
              <span class="reward-icon">{{ day.reward.icon }}</span>
              <div class="reward-info">
                <div class="reward-name">{{ day.reward.name }}</div>
                <div class="reward-amount">{{ day.reward.amount }}�?/div>
              </div>
            </div>
            <button class="edit-btn" @click="openRewardEditor(day, index)">
              编辑
            </button>
          </div>

          <!-- 添加奖励按钮 -->
          <div class="day-item add-item" @click="addLoginReward">
            <span class="add-icon">+</span>
            <span class="add-label">添加奖励</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang=ts>
import { ref, watch } from 'vue';

const props = defineProps({
  loginRewards: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:loginRewards']);

// 本地副本
const localLoginRewards = ref([...props.loginRewards]);

// 拖拽状�?const draggedIndex = ref(null);

// 监听props变化，更新本地状�?watch(
  () => props.loginRewards,
  (newRewards) => {
    localLoginRewards.value = [...newRewards];
  },
  { deep: true }
);

// 监听本地状态变化，通知父组�?watch(
  localLoginRewards,
  (newRewards) => {
    emit('update:loginRewards', [...newRewards]);
  },
  { deep: true }
);

// 拖拽开�?function onDragStart(event: DragEvent, index: number): void {
  draggedIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
  }
}

// 拖拽结束
function onDrop(event: DragEvent, targetIndex: number): void {
  if (draggedIndex.value !== null && draggedIndex.value !== targetIndex) {
    const draggedItem = localLoginRewards.value[draggedIndex.value];
    localLoginRewards.value.splice(draggedIndex.value, 1);
    localLoginRewards.value.splice(targetIndex, 0, draggedItem);
    // 更新天数
    localLoginRewards.value.forEach((item, index) => {
      item.day = index + 1;
    });
  }
  draggedIndex.value = null;
}

// 添加登录奖励
function addLoginReward(): void {
  localLoginRewards.value.push({
    day: localLoginRewards.value.length + 1,
    reward: {
      id: Date.now(),
      name: '钻石',
      icon: '💎',
      amount: 50,
      value: 50,
    },
  });
}

// 移除登录奖励
function removeLoginReward(index: number): void {
  localLoginRewards.value.splice(index, 1);
  // 更新天数
  localLoginRewards.value.forEach((item, idx) => {
    item.day = idx + 1;
  });
}

// 打开奖励编辑�?function openRewardEditor(): void {
  // 这里可以实现奖励编辑逻辑
}
</script>

<style lang=scss scoped>
.login-reward-config {
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

/* 登录奖励序列 */
.reward-sequence {
  margin-top: 20px;
}

.reward-sequence h5 {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--primary-gold);
  margin: 0 0 15px;
}

.sequence-container {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.day-item {
  width: 120px;
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.day-item:hover {
  background-color: rgb(255 255 255 / 10%);
  border-color: var(--border-light);
  transform: translateY(-2px);
}

.day-item.draggable:hover {
  cursor: grab;
}

.day-item.draggable:active {
  cursor: grabbing;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.day-number {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: var(--primary-gold);
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-muted);
  transition: color var(--transition-fast);
  padding: 2px;
}

.remove-btn:hover {
  color: var(--danger-red);
}

.reward-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.reward-icon {
  font-size: 24px;
}

.reward-info {
  text-align: center;
}

.reward-name {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.reward-amount {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.edit-btn {
  padding: 6px 12px;
  background-color: rgb(255 255 255 / 10%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.edit-btn:hover {
  background-color: rgb(59 130 246 / 20%);
  color: var(--text-primary);
}

/* 添加奖励按钮 */
.add-item {
  border: 2px dashed var(--border-light);
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.add-item:hover {
  border-color: var(--primary-gold);
  background-color: rgb(251 191 36 / 10%);
}

.add-icon {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-muted);
}

.add-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* 响应式设�? */
@media (width <= 768px) {
  .sequence-container {
    justify-content: center;
  }

  .day-item {
    width: 100px;
    padding: 10px;
  }
}
</style>




