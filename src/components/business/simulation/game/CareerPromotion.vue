<template>
  <div class="career-promotion-container">
    <h2 class="page-title">职级晋升系统</h2>

    <!-- 当前职级信息 -->
    <div class="level-card">
      <h3 class="card-title">当前职级</h3>

      <div class="level-content">
        <!-- 职级徽章 -->
        <div class="level-badge">
          <div class="badge-icon">🏆</div>
          <div class="badge-name">
            {{ currentLevel.name }}
          </div>
          <div class="badge-level">
            第{{ simulationStore.careerSystem.currentLevel }}级 / 共{{
              totalLevels
            }}级
          </div>
        </div>

        <!-- 职级效果 -->
        <div class="level-effects">
          <div class="effect-item">
            <div class="effect-label">可用预算</div>
            <div class="effect-value effect-budget">
              💰 {{ simulationStore.decisionMaking.resources.budget }}
            </div>
          </div>
          <div class="effect-item">
            <div class="effect-label">团队精力</div>
            <div class="effect-value effect-team">
              👥 {{ simulationStore.decisionMaking.resources.teamEffort }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 晋升进度 -->
    <div v-if="nextLevel" class="progress-card">
      <h3 class="card-title">晋升进度</h3>

      <div class="progress-content">
        <!-- 总体进度 -->
        <div class="overall-progress">
          <div class="progress-header">
            <div class="progress-label">晋升到{{ nextLevel.name }}进度</div>
            <div class="progress-percent">
              {{ promotionProgress?.average }}%
            </div>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill gradient-fill"
              :style="{ width: `${promotionProgress?.average}%` }"
            ></div>
          </div>
        </div>

        <!-- 详细进度 -->
        <div class="detail-progress">
          <div class="detail-item">
            <div class="detail-header">
              <div class="detail-label">运营天数</div>
              <div class="detail-value">
                {{ simulationStore.gameState.dayCount }}/{" }{{
                  nextLevel.requirements.dayCount
                }}
                天
              </div>
            </div>
            <div class="progress-bar small">
              <div
                class="progress-fill blue-fill"
                :style="{ width: `${promotionProgress?.dayCount}%` }"
              ></div>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-header">
              <div class="detail-label">累计下载</div>
              <div class="detail-value">
                {{ formatValue(simulationStore.businessData.downloads) }}/{" }{{
                  formatValue(nextLevel.requirements.downloads)
                }}
              </div>
            </div>
            <div class="progress-bar small">
              <div
                class="progress-fill green-fill"
                :style="{ width: `${promotionProgress?.downloads}%` }"
              ></div>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-header">
              <div class="detail-label">总收入</div>
              <div class="detail-value">
                {{ formatValue(simulationStore.businessData.totalRevenue) }}/{"
                }{{ formatValue(nextLevel.requirements.revenue) }}
              </div>
            </div>
            <div class="progress-bar small">
              <div
                class="progress-fill yellow-fill"
                :style="{ width: `${promotionProgress?.revenue}%` }"
              ></div>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-header">
              <div class="detail-label">市场情绪</div>
              <div class="detail-value">
                {{ simulationStore.businessData.marketSentiment }}/{" }{{
                  nextLevel.requirements.marketSentiment
                }}
              </div>
            </div>
            <div class="progress-bar small">
              <div
                class="progress-fill purple-fill"
                :style="{ width: `${promotionProgress?.marketSentiment}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- 晋升按钮 -->
        <div class="promote-action">
          <button
            @click="promoteLevel"
            :disabled="!canPromote"
            class="btn-promote"
          >
            <span v-if="canPromote">🚀 立即晋升</span>
            <span v-else>🔒 条件未满足</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 下一级信息 -->
    <div v-if="nextLevel" class="next-level-card">
      <h3 class="card-title">下一级：{{ nextLevel.name }}</h3>

      <div class="next-level-grid">
        <!-- 解锁操作 -->
        <div class="unlock-section">
          <div class="section-label">解锁操作</div>
          <div class="unlock-list">
            <div
              v-for="(operation, index) in nextLevel.unlockedOperations"
              :key="index"
              class="unlock-item"
            >
              <span class="unlock-icon">✓</span>
              {{ getOperationName(operation) }}
            </div>
          </div>
        </div>

        <!-- 职级效果 -->
        <div class="effects-section">
          <div class="section-label">职级效果</div>
          <div class="effects-list">
            <div class="effect-row">
              <span class="effect-icon">💰</span>
              <span>预算: {{ nextLevel.effects.budget }}</span>
            </div>
            <div class="effect-row">
              <span class="effect-icon">👥</span>
              <span>团队精力: {{ nextLevel.effects.teamEffort }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 已达最高级 -->
    <div v-else class="max-level-card">
      <div class="max-level-content">
        <div class="max-icon">🎉</div>
        <div class="max-title">恭喜！已达最高职级</div>
        <div class="max-desc">您已经成为策划总监，实现了终极目标。</div>
      </div>
    </div>

    <!-- 职级说明 -->
    <div class="tips-card">
      <div class="tips-content">
        <div class="tips-icon">💡</div>
        <div class="tips-text">
          <strong class="tips-title">职级说明</strong>
          <p class="tips-desc">
            职级晋升需要满足运营天数、累计下载量、总收入和市场情绪等条件。晋升后将获得更多预算和团队精力，
            同时解锁更多高级操作权限。达到策划总监级别后，您将获得游戏的终极权限。
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

// 获取当前职级
const currentLevel = computed(() => {
  return simulationStore.getCurrentCareerLevel();
});

// 获取下一级职级
const nextLevel = computed(() => {
  return simulationStore.getNextCareerLevel();
});

// 总级别数
const totalLevels = computed(() => {
  return simulationStore.careerSystem.levels.length;
});

// 是否可以晋升
const canPromote = computed(() => {
  return simulationStore.canPromoteCareerLevel();
});

// 获取晋升进度
const promotionProgress = computed(() => {
  return simulationStore.getCareerPromotionProgress();
});

// 执行晋升
const promoteLevel = (): void => {
  simulationStore.promoteCareerLevel();
};

// 格式化数值
const formatValue = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};

// 获取操作名称
const getOperationName = (operationKey: string): string => {
  const operationNames: Record<string, string> = {
    releaseCommonSkin: '发布普通皮肤',
    improveDailyReward: '设置日常登录奖励',
    fixBug: '修复基础BUG',
    releaseLimitedSkin: '发布限定皮肤',
    heroAdjustment: '英雄调整',
    channelPromotion: '渠道投放',
    eventPlanning: '活动策划',
    heroRedesign: '英雄重做',
    crossBrandCooperation: '跨界合作',
    tournamentHolding: '赛事举办',
  };
  return operationNames[operationKey] || operationKey;
};
</script>

<style lang="scss" scoped>
.career-promotion-container {
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

/* 卡片通用样式 */
.level-card,
.progress-card,
.next-level-card,
.max-level-card {
  background: tokens.$bg-secondary;
  border-radius: tokens.$radius-lg;
  box-shadow: tokens.$shadow-md;
  padding: tokens.$spacing-xl;
  margin-bottom: tokens.$spacing-lg;
  border: 1px solid tokens.$border-light;
}

.card-title {
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-semibold;
  margin-bottom: tokens.$spacing-lg;
  color: tokens.$text-primary;
}

/* 当前职级 */
.level-content {
  @include utils.flex-between;

  @include utils.mobile {
    flex-direction: column;
    gap: tokens.$spacing-lg;
  }
}

.level-badge {
  text-align: center;

  @include utils.mobile {
    text-align: left;
  }
}

.badge-icon {
  font-size: tokens.$font-size-4xl;
  margin-bottom: tokens.$spacing-sm;
}

.badge-name {
  font-size: tokens.$font-size-2xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$primary-blue;
  margin-bottom: tokens.$spacing-xs;
}

.badge-level {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-muted;
}

.level-effects {
  @include utils.flex-row(tokens.$spacing-xl, center);
}

.effect-item {
  text-align: center;
}

.effect-label {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  margin-bottom: tokens.$spacing-xs;
}

.effect-value {
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-bold;

  &.effect-budget {
    color: tokens.$primary-blue;
  }

  &.effect-team {
    color: tokens.$success;
  }
}

/* 晋升进度 */
.progress-content {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-lg;
}

.overall-progress {
  margin-bottom: tokens.$spacing-md;
}

.progress-header {
  @include utils.flex-between;

  margin-bottom: tokens.$spacing-sm;
}

.progress-label {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
}

.progress-percent {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-muted;
}

.progress-bar {
  width: 100%;
  height: 16px;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-full;
  overflow: hidden;

  &.small {
    height: 8px;
  }
}

.progress-fill {
  height: 100%;
  border-radius: tokens.$radius-full;
  transition: width tokens.$transition-normal;

  &.gradient-fill {
    background: linear-gradient(
      90deg,
      tokens.$primary-blue 0%,
      tokens.$lottery-purple 100%
    );
  }

  &.blue-fill {
    background: tokens.$primary-blue;
  }

  &.green-fill {
    background: tokens.$success;
  }

  &.yellow-fill {
    background: tokens.$warning;
  }

  &.purple-fill {
    background: tokens.$lottery-purple;
  }
}

/* 详细进度 */
.detail-progress {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-md;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-xs;
}

.detail-header {
  @include utils.flex-between;
}

.detail-label {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-secondary;
}

.detail-value {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-primary;
}

/* 晋升按钮 */
.promote-action {
  margin-top: tokens.$spacing-md;
}

.btn-promote {
  width: 100%;
  padding: tokens.$spacing-md;
  background: linear-gradient(
    135deg,
    tokens.$primary-blue 0%,
    tokens.$lottery-purple 100%
  );
  color: white;
  font-weight: tokens.$font-weight-medium;
  border-radius: tokens.$radius-md;
  border: none;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover {
    &:not(:disabled) {
      box-shadow: tokens.$shadow-lg;
      transform: translateY(-2px);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* 下一级信息 */
.next-level-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: tokens.$spacing-lg;

  @include utils.mobile {
    grid-template-columns: 1fr;
  }
}

.section-label {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-secondary;
  margin-bottom: tokens.$spacing-sm;
}

.unlock-list {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-xs;
}

.unlock-item {
  @include utils.flex-row(tokens.$spacing-sm, center);

  font-size: tokens.$font-size-sm;
  color: tokens.$primary-blue;
}

.unlock-icon {
  color: tokens.$success;
}

.effects-list {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-xs;
}

.effect-row {
  @include utils.flex-row(tokens.$spacing-sm, center);

  font-size: tokens.$font-size-sm;
  color: tokens.$text-primary;
}

.effect-icon {
  color: tokens.$primary-blue;
}

/* 最高级提示 */
.max-level-content {
  text-align: center;
  padding: tokens.$spacing-xl 0;
}

.max-icon {
  font-size: tokens.$font-size-5xl;
  margin-bottom: tokens.$spacing-md;
}

.max-title {
  font-size: tokens.$font-size-2xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$success;
  margin-bottom: tokens.$spacing-sm;
}

.max-desc {
  color: tokens.$text-secondary;
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

/* 响应式设计 */
@include utils.mobile {
  .career-promotion-container {
    padding: tokens.$spacing-md;
  }

  .level-card,
  .progress-card,
  .next-level-card,
  .max-level-card {
    padding: tokens.$spacing-md;
  }

  .level-effects {
    width: 100%;
    justify-content: space-around;
  }
}
</style>
