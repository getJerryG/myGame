<template>
  <div class="hero-detail-container">
    <!-- 英雄详情 -->
    <div v-if="hero" class="hero-detail">
      <h4 class="section-title">{{ hero.name }} - 详情</h4>

      <!-- 基本信息 -->
      <div class="detail-section">
        <h5>基本信息</h5>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">分类</span>
            <span class="info-value">{{
              getCategoryLabel(hero.category)
            }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">强度</span>
            <span class="info-value">{{ hero.strength }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">出场率</span>
            <span class="info-value">{{ hero.stats.pickRate }}%</span>
          </div>
          <div class="info-item">
            <span class="info-label">Ban率</span>
            <span class="info-value">{{ hero.stats.banRate }}%</span>
          </div>
        </div>
      </div>

      <!-- 近期变化趋势 -->
      <div class="detail-section">
        <h5>近期变化趋势</h5>
        <div class="trend-chart">
          <svg width="100%" height="100" viewBox="0 0 400 100">
            <polyline
              :points="getTrendPoints(hero.stats.winRateTrend)"
              fill="none"
              stroke="#3B82F6"
              stroke-width="2"
            />
            <circle
              v-for="(point, index) in hero.stats.winRateTrend"
              :key="index"
              :cx="(index / (hero.stats.winRateTrend.length - 1)) * 400"
              :cy="100 - (point / 100) * 80"
              r="3"
              fill="#3B82F6"
            />
          </svg>
          <div class="trend-label">胜率趋势（近7天）</div>
        </div>
      </div>

      <!-- 数值调整工�?-->
      <div class="detail-section">
        <h5>数值调整</h5>
        <div class="adjustment-tools">
          <div
            v-for="(stat, key) in hero.stats.adjustable"
            :key="key"
            class="adjustment-item"
          >
            <div class="adjustment-header">
              <span class="adjustment-label">{{ getStatLabel(key) }}</span>
              <span class="adjustment-value">{{ stat.value }}</span>
            </div>
            <div class="adjustment-controls">
              <input
                v-model.number="stat.value"
                type="range"
                :min="stat.min"
                :max="stat.max"
                :step="stat.step"
                class="adjustment-slider"
                @input="updateHeroStats"
              />
              <input
                v-model.number="stat.value"
                type="number"
                :min="stat.min"
                :max="stat.max"
                :step="stat.step"
                class="adjustment-input"
                @input="updateHeroStats"
              />
            </div>
            <div class="adjustment-impact">
              <span class="impact-label">预期胜率变化:</span>
              <span
                class="impact-value"
                :class="{
                  positive: stat.impact > 0,
                  negative: stat.impact < 0,
                }"
              >
                {{ stat.impact > 0 ? "+" : "" }}{{ stat.impact }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 平衡性分�?-->
      <div class="detail-section">
        <h5>平衡性分析</h5>
        <div class="balance-analysis">
          <div
            v-for="suggestion in balanceSuggestions"
            :key="suggestion.id"
            class="analysis-item"
          >
            <div class="analysis-icon">{{ suggestion.icon }}</div>
            <div class="analysis-content">
              <div class="analysis-title">{{ suggestion.title }}</div>
              <div class="analysis-description">
                {{ suggestion.description }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="btn btn-secondary" @click="resetAdjustments">
          <span class="btn-icon">🔄</span>
          <span class="btn-text">重置调整</span>
        </button>
        <button class="btn btn-primary" @click="saveAdjustments">
          <span class="btn-icon">💾</span>
          <span class="btn-text">保存调整</span>
        </button>
      </div>
    </div>

    <!-- 未选择英雄提示 -->
    <div v-else class="hero-detail empty">
      <div class="empty-state">
        <span class="empty-icon">🏆</span>
        <span class="empty-text">请从左侧选择一个英雄查看详情</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 接收父组件传递的属性
const props = defineProps({
  hero: {
    type: Object,
    default: null,
  },
  balanceSuggestions: {
    type: Array,
    default: () => [
      {
        id: 1,
        icon: "📊",
        title: "胜率过高",
        description: "该英雄当前胜率高于平均值，建议适当削弱核心技能伤害",
      },
      {
        id: 2,
        icon: "⚖️",
        title: "出场率分析",
        description: "出场率适中，但Ban率较高，说明英雄强度被认可",
      },
      {
        id: 3,
        icon: "💡",
        title: "调整建议",
        description: "建议微调技能冷却时间，保持英雄竞争力的同时避免过于强势",
      },
    ],
  },
});

// 向父组件传递事件
const emit = defineEmits([
  "stats-updated",
  "adjustments-reset",
  "adjustments-saved",
]);

// 获取分类标签
const getCategoryLabel = (category: string): string => {
  const labels = {
    tank: "坦克",
    warrior: "战士",
    assassin: "刺客",
    mage: "法师",
    marksman: "射手",
    support: "辅助",
  };
  return labels[category] || category;
};

// 获取属性标签
const getStatLabel = (stat: string): string => {
  const labels = {
    attack: "攻击力",
    health: "生命值",
    defense: "防御力",
    attackSpeed: "攻击速度",
    skill1: "技能1伤害",
    skill2: "技能2伤害",
    skill3: "技能3伤害",
  };
  return labels[stat] || stat;
};

// 获取趋势图数据点
const getTrendPoints = (trend: number[]): string => {
  return trend
    .map((value, index) => {
      const x = (index / (trend.length - 1)) * 400;
      const y = 100 - (value / 100) * 80;
      return `${x},${y}`;
    })
    .join(" ");
};

// 更新英雄属性
const updateHeroStats = (): void => {
  emit("stats-updated", props.hero);
};

// 重置调整
const resetAdjustments = (): void => {
  if (props.hero) {
    emit("adjustments-reset");
  }
};

// 保存调整
const saveAdjustments = (): void => {
  if (props.hero) {
    emit("adjustments-saved", props.hero);
  }
};
</script>

<style lang="scss" scoped>
.hero-detail-container {
  @include utils.flex-col(tokens.$spacing-0, stretch, flex-start);

  height: 100%;
}

.hero-detail {
  @include utils.flex-col(tokens.$spacing-lg, stretch, flex-start);

  overflow-y: auto;
  padding-right: tokens.$spacing-sm;
  height: 100%;

  @include utils.custom-scrollbar;

  &.empty {
    @include utils.flex-center;

    background-color: tokens.$bg-light;
    border-radius: tokens.$radius-md;
    border: 2px dashed tokens.$border-light;
    height: 100%;
  }
}

.empty-state {
  @include utils.flex-col(tokens.$spacing-md, center);

  padding: tokens.$spacing-2xl;
  text-align: center;
}

.empty-icon {
  font-size: tokens.$font-size-4xl;
  opacity: 0.5;
}

.empty-text {
  font-size: tokens.$font-size-base;
  color: tokens.$text-muted;
}

.section-title {
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
  margin: 0;
}

.detail-section {
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$spacing-md;

  @include utils.flex-col(tokens.$spacing-3, stretch, flex-start);

  h5 {
    font-size: tokens.$font-size-sm;
    font-weight: tokens.$font-weight-semibold;
    color: tokens.$primary-gold;
    margin: 0;
    padding-bottom: tokens.$spacing-xs;
    border-bottom: 1px solid tokens.$border-light;
  }
}

/* 信息网格 */
.info-grid {
  @include utils.grid-layout(2, tokens.$spacing-sm);
}

.info-item {
  @include utils.flex-between(center);
}

.info-label {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
}

.info-value {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
}

/* 趋势图 */
.trend-chart {
  @include utils.flex-col(tokens.$spacing-sm, stretch, flex-start);

  svg {
    width: 100%;
    height: 100px;
    background-color: tokens.$bg-lighter;
    border-radius: tokens.$radius-sm;
    padding: tokens.$spacing-sm;
  }
}

.trend-label {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
  text-align: center;
}

/* 调整工具 */
.adjustment-tools {
  @include utils.flex-col(tokens.$spacing-md, stretch, flex-start);
}

.adjustment-item {
  @include utils.flex-col(tokens.$spacing-sm, stretch, flex-start);
}

.adjustment-header {
  @include utils.flex-between(center);
}

.adjustment-label {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
}

.adjustment-value {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$primary-gold;
}

.adjustment-controls {
  @include utils.flex-row(tokens.$spacing-md, center);
}

.adjustment-slider {
  @include utils.slider-base;

  flex: 1;
}

.adjustment-input {
  width: 80px;
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  background-color: tokens.$bg-light;
  border: 1px solid tokens.$border-light;
  border-radius: tokens.$radius-sm;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-sm;
  text-align: center;

  &:focus {
    outline: none;
    border-color: tokens.$primary-blue;
    box-shadow: tokens.$shadow-blue;
  }
}

.adjustment-impact {
  @include utils.flex-row(tokens.$spacing-sm, center, flex-end);
}

.impact-label {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
}

.impact-value {
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-semibold;

  &.positive {
    color: tokens.$success;
  }

  &.negative {
    color: tokens.$error;
  }
}

/* 平衡性分析 */
.balance-analysis {
  @include utils.flex-col(tokens.$spacing-3, stretch, flex-start);
}

.analysis-item {
  @include utils.flex-row(tokens.$spacing-3, flex-start);

  padding: tokens.$spacing-sm;
  background-color: tokens.$bg-lighter;
  border-radius: tokens.$radius-md;
  border-left: 4px solid tokens.$primary-blue;
}

.analysis-icon {
  font-size: tokens.$font-size-xl;
  flex-shrink: 0;
  margin-top: 2px;
}

.analysis-content {
  flex: 1;

  @include utils.flex-col(tokens.$spacing-xs, stretch, flex-start);
}

.analysis-title {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
}

.analysis-description {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
  line-height: tokens.$line-height-normal;
}

/* 操作按钮 */
.action-buttons {
  @include utils.flex-row(tokens.$spacing-3, center);

  margin-top: tokens.$spacing-sm;

  .btn {
    @include utils.btn-base;

    flex: 1;

    &.btn-primary {
      @include utils.btn-primary;
    }

    &.btn-secondary {
      @include utils.btn-secondary;
    }
  }
}

.btn-icon {
  font-size: tokens.$font-size-base;
}

.btn-text {
  font-weight: tokens.$font-weight-medium;
}

/* 响应式设计 */
@include utils.mobile {
  .hero-detail {
    height: 600px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;

    .btn {
      width: 100%;
    }
  }
}

/* 横屏手机适配 */
@include utils.landscape-mobile {
  .detail-section {
    padding: tokens.$spacing-sm;
    gap: tokens.$spacing-sm;
  }

  .adjustment-controls {
    gap: tokens.$spacing-sm;
  }

  .adjustment-input {
    width: 60px;
    padding: tokens.$spacing-xs;
  }
}
</style>
