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
            <span class="info-label">出场�?/span>
            <span class="info-value">{{ hero.stats.pickRate }}%</span>
          </div>
          <div class="info-item">
            <span class="info-label">Ban�?/span>
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
        <h5>数值调�?/h5>
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
                {{ stat.impact > 0 ? '+' : '' }}{{ stat.impact }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 平衡性分�?-->
      <div class="detail-section">
        <h5>平衡性分�?/h5>
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
        <span class="empty-text">请从左侧选择一个英雄查看详�?/span>
      </div>
    </div>
  </div>
</template>

<script setup lang=ts>
// 接收父组件传递的属�?const props = defineProps({
  hero: {
    type: Object,
    default: null,
  },
  balanceSuggestions: {
    type: Array,
    default: () => [
      {
        id: 1,
        icon: '📊',
        title: '胜率过高',
        description: '该英雄当前胜率高于平均值，建议适当削弱核心技能伤害�?,
      },
      {
        id: 2,
        icon: '⚖️',
        title: '出场率分�?,
        description: '出场率适中，但Ban率较高，说明英雄强度被认可�?,
      },
      {
        id: 3,
        icon: '💡',
        title: '调整建议',
        description: '建议微调技能冷却时间，保持英雄竞争力的同时避免过于强势�?,
      },
    ],
  },
});

// 向父组件传递事�?const emit = defineEmits([
  'stats-updated',
  'adjustments-reset',
  'adjustments-saved',
]);

// 获取分类标签
const getCategoryLabel = (category: string): string => {
  const labels = {
    tank: '坦克',
    warrior: '战士',
    assassin: '刺客',
    mage: '法师',
    marksman: '射手',
    support: '辅助',
  };
  return labels[category] || category;
};

// 获取属性标�?const getStatLabel = (stat: string): string => {
  const labels = {
    attack: '攻击�?,
    health: '生命�?,
    defense: '防御�?,
    attackSpeed: '攻击速度',
    skill1: '技�?伤害',
    skill2: '技�?伤害',
    skill3: '技�?伤害',
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
    .join(' ');
};

// 更新英雄属�?const updateHeroStats = (): void => {
  emit('stats-updated', props.hero);
};

// 重置调整
const resetAdjustments = (): void => {
  if (props.hero) {
    emit('adjustments-reset');
  }
};

// 保存调整
const saveAdjustments = (): void => {
  if (props.hero) {
    emit('adjustments-saved', props.hero);
  }
};
</script>

<style lang=scss scoped>
.hero-detail-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.hero-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  padding-right: 10px;
  height: 100%;
}

.hero-detail.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  border: 2px dashed var(--border-light);
  height: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 40px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

.empty-text {
  font-size: var(--text-base);
  color: var(--text-muted);
}

.detail-section {
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-section h5 {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--primary-gold);
  margin: 0;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border-light);
}

/* 信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.info-value {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

/* 趋势�? */
.trend-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trend-chart svg {
  width: 100%;
  height: 100px;
  background-color: rgb(255 255 255 / 2%);
  border-radius: var(--radius-sm);
  padding: 10px;
}

.trend-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-align: center;
}

/* 调整工具 */
.adjustment-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.adjustment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.adjustment-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.adjustment-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--primary-gold);
}

.adjustment-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.adjustment-slider {
  flex: 1;
  height: 6px;
  background-color: rgb(255 255 255 / 10%);
  border-radius: 3px;
  outline: none;
  appearance: none;
}

.adjustment-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgb(59 130 246 / 40%);
}

.adjustment-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgb(59 130 246 / 40%);
}

.adjustment-input {
  width: 80px;
  padding: 6px 10px;
  background-color: rgb(255 255 255 / 5%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: var(--text-sm);
  text-align: center;
}

.adjustment-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 10%);
}

.adjustment-impact {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  align-items: center;
}

.impact-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.impact-value {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}

.impact-value.positive {
  color: var(--success-green);
}

.impact-value.negative {
  color: var(--danger-red);
}

/* 平衡性分�? */
.balance-analysis {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.analysis-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background-color: rgb(255 255 255 / 2%);
  border-radius: var(--radius-md);
  border-left: 4px solid #3b82f6;
}

.analysis-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.analysis-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.analysis-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.analysis-description {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  line-height: 1.4;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

/* 响应式设�? */
@media (width <= 768px) {
  .hero-detail {
    height: 600px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .btn {
    width: 100%;
  }
}

/* 横屏手机适配 */
@media (orientation: landscape) and (height <= 600px) {
  .detail-section {
    padding: 10px;
    gap: 10px;
  }

  .adjustment-controls {
    gap: 10px;
  }

  .adjustment-input {
    width: 60px;
    padding: 4px 8px;
  }
}
</style>




