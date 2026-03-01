<template>
  <div class="login-reward-config">
    <div class="config-section">
      <h4 class="section-title">登录奖励配置</h4>
      <p class="section-description">设置连续登录奖励，激励玩家保持活跃</p>

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
              <span class="day-number">第{{ index + 1 }}天</span>
              <button
                v-if="index > 0"
                class="remove-btn"
                @click="removeLoginReward(index)"
              >
                ×
              </button>
            </div>
            <div class="reward-preview">
              <span class="reward-icon">{{ day.reward.icon }}</span>
              <div class="reward-info">
                <div class="reward-name">{{ day.reward.name }}</div>
                <div class="reward-amount">{{ day.reward.amount }}个</div>
              </div>
            </div>
            <button
              class="edit-btn"
              @click="openRewardEditor(day, index)"
            >
              编辑
            </button>
          </div>

          <!-- 添加奖励按钮 -->
          <div
            class="day-item add-item"
            @click="addLoginReward"
          >
            <span class="add-icon">+</span>
            <span class="add-label">添加奖励</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

// 拖拽状态
const draggedIndex = ref(null);

// 监听props变化，更新本地状态
watch(
  () => props.loginRewards,
  (newRewards) => {
    localLoginRewards.value = [...newRewards];
  },
  { deep: true }
);

// 监听本地状态变化，通知父组件
watch(
  localLoginRewards,
  (newRewards) => {
    emit('update:loginRewards', [...newRewards]);
  },
  { deep: true }
);

// 拖拽开始
function onDragStart(event: DragEvent, index: number): void {
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

// 打开奖励编辑器
function openRewardEditor(): void {
  // 这里可以实现奖励编辑逻辑
}
</script>

<style lang="scss" scoped>

.login-reward-config {
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

/* 登录奖励序列 */
.reward-sequence {
  margin-top: tokens.$spacing-lg;

  h5 {
    @include utils.subsection-title;
  }
}

.sequence-container {
  display: flex;
  gap: tokens.$spacing-md;
  flex-wrap: wrap;
  margin-bottom: tokens.$spacing-lg;
}

.day-item {
  width: 120px;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;

  @include utils.flex-col(tokens.$spacing-sm, center);

  transition: all tokens.$transition-fast;
  border: 1px solid transparent;

  &:hover {
    background-color: tokens.$bg-lighter;
    border-color: tokens.$border-light;
    transform: translateY(-2px);
  }

  &.draggable {
    &:hover {
      cursor: grab;
    }

    &:active {
      cursor: grabbing;
    }
  }
}

.day-header {
  @include utils.flex-between;

  width: 100%;
}

.day-number {
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$primary-gold;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: tokens.$font-size-base;
  color: tokens.$text-muted;
  transition: color tokens.$transition-fast;
  padding: tokens.$spacing-xs;

  &:hover {
    color: tokens.$danger-red;
  }
}

.reward-preview {
  @include utils.flex-col(tokens.$spacing-xs, center);
}

.reward-icon {
  font-size: tokens.$font-size-2xl;
}

.reward-info {
  text-align: center;
}

.reward-name {
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
}

.reward-amount {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
}

.edit-btn {
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
}

/* 添加奖励按钮 */
.add-item {
  border: 2px dashed tokens.$border-light;
  background-color: transparent;

  @include utils.flex-col(tokens.$spacing-sm, center, center);

  min-height: 150px;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover {
    border-color: tokens.$primary-gold;
    background-color: rgb(251 191 36 / 10%);
  }
}

.add-icon {
  font-size: tokens.$font-size-2xl;
  font-weight: bold;
  color: tokens.$text-muted;
}

.add-label {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
}

/* 响应式设计 */
@include utils.mobile {
  .sequence-container {
    justify-content: center;
  }

  .day-item {
    width: 100px;
    padding: tokens.$spacing-sm;
  }
}
</style>
