<template>
  <div class="decision-making-container">
    <h2 class="page-title">决策权衡设计</h2>

    <!-- 资源状态 -->
    <div class="resources-grid">
      <div class="resource-card">
        <div class="resource-icon resource-budget">💰</div>
        <div class="resource-info">
          <div class="resource-label">预算</div>
          <div class="resource-value">
            {{ simulationStore.decisionMaking.resources.budget }}
          </div>
        </div>
      </div>

      <div class="resource-card">
        <div class="resource-icon resource-team">👥</div>
        <div class="resource-info">
          <div class="resource-label">团队精力</div>
          <div class="resource-value">
            {{ simulationStore.decisionMaking.resources.teamEffort }}
          </div>
        </div>
      </div>

      <div class="resource-card">
        <div class="resource-icon resource-time">⏱️</div>
        <div class="resource-info">
          <div class="resource-label">可用时间</div>
          <div class="resource-value">{{ simulationStore.decisionMaking.resources.time }} 天</div>
        </div>
      </div>
    </div>

    <div class="decision-grid">
      <!-- 可用决策 -->
      <div class="decision-card">
        <h3 class="card-title">可用决策</h3>

        <div
          v-if="availableDecisions.length === 0"
          class="empty-state"
        >
          暂无可用决策
        </div>

        <div
          v-else
          class="decision-list"
        >
          <div
            v-for="decision in availableDecisions"
            :key="decision.id"
            class="decision-item"
          >
            <div class="decision-header">
              <div class="decision-name">{{ decision.name }}</div>
              <div
                class="decision-status"
                :class="{
                  'status-available': canExecuteDecision(decision.id),
                  'status-unavailable': !canExecuteDecision(decision.id),
                }"
              >
                {{ canExecuteDecision(decision.id) ? '可执行' : '资源不足' }}
              </div>
            </div>

            <div class="decision-desc">
              {{ decision.description }}
            </div>

            <!-- 成本信息 -->
            <div class="cost-section">
              <div class="section-label">成本</div>
              <div class="cost-list">
                <div class="cost-item">💰 {{ decision.cost.budget || 0 }}</div>
                <div class="cost-item">👥 {{ decision.cost.teamEffort || 0 }}</div>
                <div class="cost-item">⏱️ {{ decision.cost.time || 0 }} 天</div>
              </div>
            </div>

            <!-- 预期效果 -->
            <div class="effects-section">
              <div class="section-label">预期效果</div>
              <div class="effects-list">
                <div
                  v-for="(value, key) in decision.expectedEffects"
                  :key="key"
                  class="effect-item"
                >
                  {{ getEffectLabel(key) }}: {{ formatEffectValue(key, value) }}
                </div>
              </div>
            </div>

            <!-- 风险信息 -->
            <div class="risk-section">
              <div class="section-label">风险</div>
              <div
                class="risk-badge"
                :class="{
                  'risk-low': decision.risk.type === 'low',
                  'risk-medium': decision.risk.type === 'medium',
                  'risk-high': decision.risk.type === 'high',
                }"
              >
                {{ decision.risk.type === 'low' ? '低' : decision.risk.type === 'medium' ? '中' : '高' }}风险:
                {{ decision.risk.description }}
              </div>
            </div>

            <!-- 执行按钮 -->
            <button
              @click="executeDecision(decision.id)"
              :disabled="!canExecuteDecision(decision.id)"
              class="btn-execute"
              :class="{
                'btn-available': canExecuteDecision(decision.id),
                'btn-disabled': !canExecuteDecision(decision.id),
              }"
            >
              执行决策
            </button>
          </div>
        </div>
      </div>

      <!-- 决策历史 -->
      <div class="decision-card">
        <h3 class="card-title">决策历史</h3>

        <div
          v-if="decisionHistory.length === 0"
          class="empty-state"
        >
          暂无决策历史
        </div>

        <div
          v-else
          class="history-list"
        >
          <div
            v-for="(history, index) in decisionHistory"
            :key="index"
            class="history-item"
          >
            <div class="history-header">
              <div class="history-name">{{ history.name }}</div>
              <div class="history-date">
                {{ formatDate(history.date) }}
              </div>
            </div>

            <div class="history-type">
              {{ getCategoryLabel(history.type) }}
            </div>

            <!-- 效果对比 -->
            <div class="effects-comparison">
              <div class="section-label">效果对比</div>
              <div class="comparison-list">
                <div
                  v-for="(expectedValue, key) in history.expectedEffects"
                  :key="key"
                  class="comparison-item"
                >
                  <div class="comparison-label">{{ getEffectLabel(key) }}</div>
                  <div class="comparison-values">
                    <div class="expected-value">预期: {{ formatEffectValue(key, expectedValue) }}</div>
                    <div
                      class="actual-value"
                      :class="{
                        'value-better': history.actualEffects[key] >= expectedValue,
                        'value-worse': history.actualEffects[key] < expectedValue,
                      }"
                    >
                      实际:
                      {{ formatEffectValue(key, history.actualEffects[key]) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 决策提示 -->
    <div class="tips-card">
      <div class="tips-content">
        <div class="tips-icon">⚠️</div>
        <div class="tips-text">
          <strong class="tips-title">决策提示</strong>
          <p class="tips-desc">
            每个决策都需要消耗不同的资源，并且带有一定风险。请根据当前游戏状态和可用资源，谨慎做出决策。
            高风险决策可能带来更高收益，但也可能导致负面效果。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSimulationStore } from '../../stores/simulationStore';

const simulationStore = useSimulationStore();

// 获取可用决策
const availableDecisions = computed(() => {
  return simulationStore.decisionMaking.availableDecisions.filter((decision) => decision.isAvailable);
});

// 获取决策历史
const decisionHistory = computed(() => {
  return [...simulationStore.decisionMaking.history].reverse();
});

// 检查是否可以执行决策
const canExecuteDecision = (decisionId: string): boolean => {
  return simulationStore.canExecuteDecision(decisionId);
};

// 执行决策
const executeDecision = (decisionId: string): void => {
  simulationStore.executeDecision(decisionId);
};

// 获取效果标签
const getEffectLabel = (type: string): string => {
  const labels = {
    downloads: '下载量',
    revenue: '收入',
    marketSentiment: '市场情绪',
    dau: '日活用户',
    sevenDayRetention: '7日留存率',
  };
  return labels[type as keyof typeof labels] || type;
};

// 格式化效果值
const formatEffectValue = (type: string, value: number): string => {
  if (type === 'sevenDayRetention') {
    return `${(value * 100).toFixed(1)}%`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};

// 获取分类标签
const getCategoryLabel = (type: string): string => {
  const labels = {
    operation: '运营类',
    content: '内容类',
    optimization: '优化类',
  };
  return labels[type as keyof typeof labels] || type;
};

// 格式化日期
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};
</script>

<style lang="scss" scoped>

.decision-making-container {
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

/* 资源状态 */
.resources-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: tokens.$spacing-md;
  margin-bottom: tokens.$spacing-xl;

  @include utils.mobile {
    grid-template-columns: 1fr;
  }
}

.resource-card {
  background: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  box-shadow: tokens.$shadow-md;
  padding: tokens.$spacing-md;
  @include utils.flex-row(tokens.$spacing-md, center);
  border: 1px solid tokens.$border-light;
}

.resource-icon {
  font-size: tokens.$font-size-2xl;

  &.resource-budget {
    color: tokens.$primary-blue;
  }

  &.resource-team {
    color: tokens.$success;
  }

  &.resource-time {
    color: tokens.$lottery-purple;
  }
}

.resource-info {
  flex: 1;
}

.resource-label {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  margin-bottom: tokens.$spacing-xs;
}

.resource-value {
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
}

/* 决策网格 */
.decision-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: tokens.$spacing-xl;
  margin-bottom: tokens.$spacing-xl;

  @include utils.mobile {
    grid-template-columns: 1fr;
  }
}

.decision-card {
  background: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  box-shadow: tokens.$shadow-md;
  padding: tokens.$spacing-xl;
  border: 1px solid tokens.$border-light;
}

.card-title {
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-semibold;
  margin-bottom: tokens.$spacing-lg;
  color: tokens.$text-primary;
}

.empty-state {
  text-align: center;
  padding: tokens.$spacing-xl 0;
  color: tokens.$text-muted;
}

/* 决策列表 */
.decision-list {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-md;
  max-height: 600px;
  overflow-y: auto;
  @include utils.custom-scrollbar;
}

.decision-item {
  padding: tokens.$spacing-md;
  border-radius: tokens.$radius-md;
  border: 1px solid tokens.$border-light;
  background: tokens.$bg-light;
  transition: all tokens.$transition-fast;

  &:hover {
    border-color: tokens.$primary-blue;
    background: tokens.$bg-lighter;
  }
}

.decision-header {
  @include utils.flex-between;
  margin-bottom: tokens.$spacing-sm;
}

.decision-name {
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
}

.decision-status {
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  border-radius: tokens.$radius-full;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-medium;

  &.status-available {
    background: rgb(16 185 129 / 20%);
    color: tokens.$success;
  }

  &.status-unavailable {
    background: rgb(239 68 68 / 20%);
    color: tokens.$error;
  }
}

.decision-desc {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  margin-bottom: tokens.$spacing-md;
}

/* 成本、效果、风险区域 */
.cost-section,
.effects-section,
.risk-section {
  margin-bottom: tokens.$spacing-md;
}

.section-label {
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-muted;
  margin-bottom: tokens.$spacing-xs;
}

.cost-list {
  @include utils.flex-row(tokens.$spacing-sm, center, flex-start);
  flex-wrap: wrap;
}

.cost-item {
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  background: tokens.$bg-lighter;
  border-radius: tokens.$radius-sm;
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
}

.effects-list {
  @include utils.flex-row(tokens.$spacing-sm, center, flex-start);
  flex-wrap: wrap;
}

.effect-item {
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  background: rgb(59 130 246 / 20%);
  border-radius: tokens.$radius-sm;
  font-size: tokens.$font-size-xs;
  color: tokens.$primary-blue;
}

.risk-badge {
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  border-radius: tokens.$radius-sm;
  font-size: tokens.$font-size-xs;

  &.risk-low {
    background: rgb(16 185 129 / 20%);
    color: tokens.$success;
  }

  &.risk-medium {
    background: rgb(245 158 11 / 20%);
    color: tokens.$warning;
  }

  &.risk-high {
    background: rgb(239 68 68 / 20%);
    color: tokens.$error;
  }
}

/* 执行按钮 */
.btn-execute {
  width: 100%;
  padding: tokens.$spacing-sm tokens.$spacing-md;
  border-radius: tokens.$radius-md;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  border: none;

  &.btn-available {
    background: tokens.$primary-blue;
    color: white;

    &:hover {
      background: tokens.$primary-dark;
    }
  }

  &.btn-disabled {
    background: tokens.$bg-light;
    color: tokens.$text-muted;
    cursor: not-allowed;
  }
}

/* 历史列表 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-md;
  max-height: 500px;
  overflow-y: auto;
  @include utils.custom-scrollbar;
}

.history-item {
  padding: tokens.$spacing-md;
  background: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  border: 1px solid tokens.$border-light;
}

.history-header {
  @include utils.flex-between;
  margin-bottom: tokens.$spacing-xs;
}

.history-name {
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
}

.history-date {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
}

.history-type {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  margin-bottom: tokens.$spacing-sm;
}

/* 效果对比 */
.effects-comparison {
  margin-top: tokens.$spacing-sm;
}

.comparison-list {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-xs;
}

.comparison-item {
  @include utils.flex-between;
}

.comparison-label {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
}

.comparison-values {
  @include utils.flex-row(tokens.$spacing-sm, center);
}

.expected-value {
  font-size: tokens.$font-size-xs;
  color: tokens.$primary-blue;
}

.actual-value {
  font-size: tokens.$font-size-xs;

  &.value-better {
    color: tokens.$success;
  }

  &.value-worse {
    color: tokens.$error;
  }
}

/* 提示卡片 */
.tips-card {
  padding: tokens.$spacing-md;
  background: rgb(245 158 11 / 10%);
  border-left: 4px solid tokens.$warning;
  border-radius: 0 tokens.$radius-md tokens.$radius-md 0;
}

.tips-content {
  @include utils.flex-row(tokens.$spacing-md, center);
}

.tips-icon {
  font-size: tokens.$font-size-xl;
  color: tokens.$warning;
}

.tips-title {
  color: tokens.$warning;
}

.tips-desc {
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-sm;
  margin-top: tokens.$spacing-xs;
  margin-bottom: 0;
}
</style>
