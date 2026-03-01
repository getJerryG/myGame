<template>
  <div class="operation-permissions-container">
    <h2 class="page-title">操作权限管理</h2>

    <div class="permissions-grid">
      <!-- 已解锁操作 -->
      <div class="permission-card unlocked">
        <h3 class="card-title">
          <span class="title-icon">✅</span> 已解锁操作
          <span class="title-count">({{ unlockedOperations.length }}/{{ totalOperations }})</span>
        </h3>

        <div
          v-if="unlockedOperations.length === 0"
          class="empty-state"
        >
          暂无解锁的操作
        </div>
        <div
          v-else
          class="operations-list"
        >
          <div
            v-for="operation in unlockedOperations"
            :key="operation.id"
            class="operation-item unlocked"
          >
            <div class="operation-name">{{ operation.name }}</div>
            <div class="operation-description">
              {{ operation.description }}
            </div>
            <div class="operation-meta">第{{ operation.unlockDay }}天解锁</div>
          </div>
        </div>
      </div>

      <!-- 待解锁操作 -->
      <div class="permission-card locked">
        <h3 class="card-title"><span class="title-icon">🔒</span> 待解锁操作</h3>

        <div
          v-if="lockedOperations.length === 0"
          class="empty-state"
        >
          所有操作已解锁
        </div>
        <div
          v-else
          class="operations-list"
        >
          <div
            v-for="operation in lockedOperations"
            :key="operation.id"
            class="operation-item locked"
          >
            <div class="operation-name">{{ operation.name }}</div>
            <div class="operation-description">
              {{ operation.description }}
            </div>
            <div class="progress-container">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: `${calculateUnlockProgress(operation)}%` }"
                ></div>
              </div>
              <div class="progress-text">
                {{ simulationStore.gameState.dayCount }}/{{ operation.unlockDay }}
                天
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作分类统计 -->
    <div class="stats-section">
      <h3 class="section-title">操作分类统计</h3>

      <div class="stats-grid">
        <div
          v-for="category in categories"
          :key="category.value"
          class="stat-card"
          :class="category.value"
        >
          <div class="stat-number">
            {{ getCategoryCount(category.value) }}
          </div>
          <div class="stat-label">{{ category.label }}</div>
        </div>
      </div>
    </div>

    <!-- 解锁提示 -->
    <div class="tips-section">
      <div class="tips-content">
        <div class="tips-icon">💡</div>
        <div class="tips-text">
          <strong class="tips-title">解锁提示</strong>
          <p class="tips-description">
            随着游戏天数的增加，会自动解锁更多高级操作。请合理规划游戏运营策略，充分利用已解锁的操作提升游戏表现。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSimulationStore } from '../../stores/simulationStore';

// 定义类型接口
interface OperationPermission {
  id: string;
  name: string;
  description: string;
  category: string;
  unlockDay: number;
  isUnlocked: boolean;
}

interface OperationCategory {
  value: string;
  label: string;
}

const simulationStore = useSimulationStore();

// 操作分类
const categories = ref<OperationCategory[]>([
  { value: 'content', label: '内容更新' },
  { value: 'operation', label: '运营策略' },
  { value: 'marketing', label: '市场推广' },
  { value: 'optimization', label: '游戏优化' },
]);

// 已解锁操作
const unlockedOperations = computed<OperationPermission[]>(() => {
  return simulationStore.operationPermissions.operations.filter((op) => op.isUnlocked);
});

// 待解锁操作
const lockedOperations = computed<OperationPermission[]>(() => {
  return simulationStore.operationPermissions.operations.filter((op) => !op.isUnlocked);
});

// 总操作数
const totalOperations = computed(() => {
  return simulationStore.operationPermissions.operations.length;
});

// 计算解锁进度
const calculateUnlockProgress = (operation: OperationPermission): number => {
  return Math.min(100, Math.round((simulationStore.gameState.dayCount / operation.unlockDay) * 100));
};

// 获取分类操作数
const getCategoryCount = (category: string): number => {
  return simulationStore.operationPermissions.operations.filter((op) => op.category === category).length;
};
</script>

<style lang="scss" scoped>

.operation-permissions-container {
  max-width: tokens.$max-content-width;
  margin: 0 auto;
  padding: tokens.$spacing-lg;
}

.page-title {
  font-size: tokens.$font-size-2xl;
  font-weight: tokens.$font-weight-bold;
  margin-bottom: tokens.$spacing-xl;
  color: tokens.$text-primary;
}

.permissions-grid {
  @include utils.grid-layout(2, tokens.$spacing-lg);

  margin-bottom: tokens.$spacing-xl;

  @include utils.mobile {
    grid-template-columns: 1fr;
  }
}

.permission-card {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-lg;
  border: 1px solid tokens.$border-light;

  &.unlocked {
    border-left: 4px solid tokens.$success;
  }

  &.locked {
    border-left: 4px solid tokens.$primary-blue;
  }
}

.card-title {
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-semibold;
  margin-bottom: tokens.$spacing-md;

  @include utils.flex-row(tokens.$spacing-sm, center);
}

.title-icon {
  font-size: tokens.$font-size-lg;
}

.title-count {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-muted;
  margin-left: auto;
}

.empty-state {
  text-align: center;
  padding: tokens.$spacing-2xl;
  color: tokens.$text-muted;
}

.operations-list {
  @include utils.flex-col(tokens.$spacing-md, stretch);
}

.operation-item {
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-md;

  &.unlocked {
    background-color: rgb(16 185 129 / 10%);
    border: 1px solid rgb(16 185 129 / 20%);

    .operation-name {
      color: tokens.$success;
    }

    .operation-description {
      color: tokens.$text-secondary;
    }

    .operation-meta {
      color: tokens.$success;
    }
  }

  &.locked {
    background-color: tokens.$bg-lighter;
    border: 1px solid tokens.$border-light;

    .operation-name {
      color: tokens.$text-primary;
    }

    .operation-description {
      color: tokens.$text-secondary;
    }
  }
}

.operation-name {
  font-weight: tokens.$font-weight-medium;
  margin-bottom: tokens.$spacing-xs;
}

.operation-description {
  font-size: tokens.$font-size-sm;
  margin-bottom: tokens.$spacing-sm;
}

.operation-meta {
  font-size: tokens.$font-size-xs;
}

.progress-container {
  @include utils.flex-row(tokens.$spacing-sm, center);
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: tokens.$bg-lighter;
  border-radius: tokens.$radius-sm;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, tokens.$primary-blue, tokens.$primary-light);
  border-radius: tokens.$radius-sm;
  transition: width tokens.$transition-normal;
}

.progress-text {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
  min-width: 60px;
  text-align: right;
}

.stats-section {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-lg;
  margin-bottom: tokens.$spacing-lg;
  border: 1px solid tokens.$border-light;
}

.section-title {
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-semibold;
  margin-bottom: tokens.$spacing-md;
  color: tokens.$text-primary;
}

.stats-grid {
  @include utils.grid-layout(4, tokens.$spacing-md);

  @include utils.mobile {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  text-align: center;
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-md;

  &.content {
    background-color: rgb(59 130 246 / 10%);
    color: tokens.$primary-blue;
  }

  &.operation {
    background-color: rgb(16 185 129 / 10%);
    color: tokens.$success;
  }

  &.marketing {
    background-color: rgb(139 92 246 / 10%);
    color: tokens.$lottery-purple;
  }

  &.optimization {
    background-color: rgb(245 158 11 / 10%);
    color: tokens.$warning;
  }
}

.stat-number {
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-bold;
}

.stat-label {
  font-size: tokens.$font-size-sm;
  margin-top: tokens.$spacing-xs;
}

.tips-section {
  background-color: rgb(245 158 11 / 10%);
  border-left: 4px solid tokens.$warning;
  border-radius: 0 tokens.$radius-md tokens.$radius-md 0;
  padding: tokens.$spacing-md;
}

.tips-content {
  @include utils.flex-row(tokens.$spacing-md, flex-start);
}

.tips-icon {
  font-size: tokens.$font-size-xl;
  color: tokens.$warning;
  flex-shrink: 0;
}

.tips-text {
  flex: 1;
}

.tips-title {
  color: tokens.$warning;
  font-weight: tokens.$font-weight-semibold;
}

.tips-description {
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-sm;
  margin-top: tokens.$spacing-xs;
  margin-bottom: 0;
}
</style>
