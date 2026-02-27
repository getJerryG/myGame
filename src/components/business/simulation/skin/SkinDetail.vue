<template>
  <div v-if="skin" class="skin-detail">
    <!-- 皮肤基本信息 -->
    <div class="detail-section">
      <div class="skin-header">
        <div class="skin-avatar-large">{{ skin.avatar }}</div>
        <div class="skin-basic-info">
          <h4 class="skin-title">{{ skin.name }}</h4>
          <div class="skin-subtitle">
            {{ skin.heroName }} - {{ getQualityLabel(skin.quality) }}
          </div>
          <div class="skin-price">
            <span class="price-label">预计价格�?/span>
            <span class="price-value">{{ skin.price }}点券</span>
          </div>
        </div>
      </div>

      <!-- 皮肤特效描述 -->
      <div class="skin-effects">
        <h5>皮肤特效</h5>
        <div class="effects-list">
          <div
            v-for="(effect, index) in skin.effects"
            :key="index"
            class="effect-item"
          >
            <span class="effect-icon">{{ effect.icon }}</span>
            <span class="effect-description">{{ effect.description }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 发布设置 -->
    <div class="detail-section">
      <h5>发布设置</h5>
      <div class="release-settings">
        <!-- 快速配置选项 -->
        <div class="setting-item">
          <label class="setting-label">快速配�?/label>
          <select
            v-model="quickConfig"
            class="setting-select"
            @change="applyQuickConfig"
          >
            <option value="">选择配置方案</option>
            <option value="standard">标准发布</option>
            <option value="limited">限时发售</option>
            <option value="premium">豪华首发</option>
          </select>
        </div>

        <div class="setting-item">
          <label class="setting-label">发布日期</label>
          <input
            v-model="releaseConfig.date"
            type="date"
            class="setting-input"
          />
        </div>

        <div class="setting-item">
          <label class="setting-label">销售周�?/label>
          <select v-model="releaseConfig.duration" class="setting-select">
            <option value="7">7�?/option>
            <option value="14">14�?/option>
            <option value="30">30�?/option>
            <option value="permanent">永久</option>
          </select>
        </div>

        <div class="setting-item">
          <label class="setting-label">首周折扣</label>
          <div class="discount-control">
            <input
              v-model.number="releaseConfig.discount"
              type="range"
              min="50"
              max="100"
              step="5"
              class="discount-slider"
            />
            <span class="discount-value">{{ releaseConfig.discount }}%</span>
          </div>
          <div class="price-preview">
            <span class="price-original">{{ skin.price }}点券</span>
            <span class="price-discounted">{{ getDiscountedPrice() }}点券</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 市场预测 -->
    <div class="detail-section">
      <h5>市场预测</h5>
      <div class="market-prediction">
        <div class="prediction-item">
          <div class="prediction-label">预计销�?/div>
          <div class="prediction-value">{{ getPredictedSales() }}�?/div>
          <div class="prediction-change" :class="getSalesChangeClass()">
            {{ getSalesChange() }}
          </div>
        </div>

        <div class="prediction-item">
          <div class="prediction-label">预计收入</div>
          <div class="prediction-value">{{ getPredictedRevenue() }}�?/div>
          <div class="prediction-change" :class="getRevenueChangeClass()">
            {{ getRevenueChange() }}
          </div>
        </div>

        <div class="prediction-item">
          <div class="prediction-label">玩家满意�?/div>
          <div class="prediction-value">{{ getPredictedSatisfaction() }}%</div>
          <div class="prediction-change" :class="getSatisfactionChangeClass()">
            {{ getSatisfactionChange() }}
          </div>
        </div>

        <div class="prediction-chart">
          <h6>预计销量趋�?/h6>
          <svg width="100%" height="100" viewBox="0 0 400 100">
            <polyline
              :points="getTrendPoints(predictedTrend)"
              fill="none"
              stroke="#FBBF24"
              stroke-width="2"
            />
            <circle
              v-for="(point, index) in predictedTrend"
              :key="index"
              :cx="(index / (predictedTrend.length - 1)) * 400"
              :cy="100 - (point / 100) * 80"
              r="3"
              fill="#FBBF24"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button class="btn btn-secondary" @click="resetReleaseConfig">
        <span class="btn-icon">🔄</span>
        <span class="btn-text">重置设置</span>
      </button>
      <button class="btn btn-primary" @click="confirmRelease">
        <span class="btn-icon">📅</span>
        <span class="btn-text">确认发布</span>
      </button>
    </div>
  </div>

  <!-- 未选择皮肤提示 -->
  <div v-else class="skin-detail empty">
    <div class="empty-state">
      <span class="empty-icon">🎨</span>
      <span class="empty-text">请从左侧选择一个皮肤进行发布设�?/span>
    </div>
  </div>
</template>

<script setup lang=ts>
import { ref, watch } from 'vue';

const props = defineProps({
  skin: {
    type: Object,
    default: null,
  },
  predictedTrend: {
    type: Array,
    default: () => [10, 30, 60, 85, 95, 80, 60, 40, 25, 15],
  },
});

const emit = defineEmits(['skin-released']);

// 快速配置选项
const quickConfig = ref('');

// 发布配置
const releaseConfig = ref({
  date: new Date().toISOString().split('T')[0],
  duration: '14',
  isLimited: false,
  discount: 80,
});

// 快速配置方�?const configPresets = {
  standard: {
    duration: 'permanent',
    isLimited: false,
    discount: 80,
  },
  limited: {
    duration: '30',
    isLimited: true,
    discount: 70,
  },
  premium: {
    duration: '14',
    isLimited: true,
    discount: 60,
  },
};

// 监听皮肤变化，重置发布配�?watch(
  () => props.skin,
  () => {
    resetReleaseConfig();
  }
);

// 重置发布配置
const resetReleaseConfig = () => {
  quickConfig.value = '';
  releaseConfig.value = {
    date: new Date().toISOString().split('T')[0],
    duration: '14',
    isLimited: props.skin?.quality === 'limited',
    discount: 80,
  };
};

// 应用快速配�?const applyQuickConfig = () => {
  if (quickConfig.value && configPresets[quickConfig.value]) {
    releaseConfig.value = {
      ...releaseConfig.value,
      ...configPresets[quickConfig.value],
    };
  }
};

// 获取品质标签
const getQualityLabel = (quality) => {
  const labels = {
    brave: '勇�?,
    epic: '史诗',
    legend: '传说',
    limited: '限定',
  };
  return labels[quality] || quality;
};

// 获取折扣后的价格
const getDiscountedPrice = () => {
  if (!props.skin) return 0;
  return Math.round((props.skin.price * releaseConfig.value.discount) / 100);
};

// 获取预测销�?const getPredictedSales = () => {
  if (!props.skin) return 0;
  const baseSales = props.skin.expected.sales;
  const discountFactor = 1 + (100 - releaseConfig.value.discount) * 0.01;
  const limitedFactor = releaseConfig.value.isLimited ? 1.3 : 1;
  return Math.round(baseSales * discountFactor * limitedFactor * 0.1) * 10;
};

// 获取预测收入
const getPredictedRevenue = () => {
  if (!props.skin) return 0;
  const sales = getPredictedSales();
  const price = getDiscountedPrice();
  return Math.round((sales * price) / 10000);
};

// 获取预测满意�?const getPredictedSatisfaction = () => {
  if (!props.skin) return 0;
  return props.skin.expected.satisfaction;
};

// 获取销量变�?const getSalesChange = () => {
  if (!props.skin) return '';
  const baseSales = props.skin.expected.sales;
  const predictedSales = getPredictedSales();
  const change = (((predictedSales - baseSales) / baseSales) * 100).toFixed(0);
  return change > 0 ? `+${change}%` : `${change}%`;
};

// 获取销量变化样�?const getSalesChangeClass = () => {
  if (!props.skin) return '';
  const baseSales = props.skin.expected.sales;
  const predictedSales = getPredictedSales();
  return predictedSales > baseSales
    ? 'positive'
    : predictedSales < baseSales
      ? 'negative'
      : '';
};

// 获取收入变化
const getRevenueChange = () => {
  if (!props.skin) return '';
  const baseRevenue = (props.skin.expected.sales * props.skin.price) / 10000;
  const predictedRevenue = getPredictedRevenue();
  const change = (
    ((predictedRevenue - baseRevenue) / baseRevenue) *
    100
  ).toFixed(0);
  return change > 0 ? `+${change}%` : `${change}%`;
};

// 获取收入变化样式
const getRevenueChangeClass = () => {
  if (!props.skin) return '';
  const baseRevenue = (props.skin.expected.sales * props.skin.price) / 10000;
  const predictedRevenue = getPredictedRevenue();
  return predictedRevenue > baseRevenue
    ? 'positive'
    : predictedRevenue < baseRevenue
      ? 'negative'
      : '';
};

// 获取满意度变�?const getSatisfactionChange = () => {
  return '0%';
};

// 获取满意度变化样�?const getSatisfactionChangeClass = () => {
  return '';
};

// 获取趋势图数据点
const getTrendPoints = (trend) => {
  return trend
    .map((value, index) => {
      const x = (index / (trend.length - 1)) * 400;
      const y = 100 - (value / 100) * 80;
      return `${x},${y}`;
    })
    .join(' ');
};

// 确认发布
const confirmRelease = () => {
  if (!props.skin) return;
  emit('skin-released', {
    skin: props.skin,
    config: releaseConfig.value,
  });
  alert('皮肤发布计划已确认！');
};
</script>

<style lang=scss scoped>
/* 皮肤详情 */
.skin-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  padding-right: 10px;
}

.skin-detail.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  border: 2px dashed var(--border-light);
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

/* 详情区块 */
.detail-section {
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-section h5 {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--primary-gold);
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-light);
}

.detail-section h6 {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  margin: 0 0 10px;
}

/* 皮肤头部信息 */
.skin-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.skin-avatar-large {
  font-size: 64px;
  flex-shrink: 0;
}

.skin-basic-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skin-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.skin-subtitle {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.skin-price {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-label {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.price-value {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--primary-gold);
}

/* 皮肤特效 */
.skin-effects {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.effects-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.effect-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background-color: rgb(255 255 255 / 2%);
  border-radius: var(--radius-sm);
}

.effect-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.effect-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  flex: 1;
}

/* 发布设置 */
.release-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.setting-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

.setting-input,
.setting-select {
  padding: 10px 12px;
  background-color: rgb(255 255 255 / 5%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
}

.setting-input:focus,
.setting-select:focus {
  outline: none;
  border-color: var(--primary-gold);
  box-shadow: 0 0 0 3px rgb(251 191 36 / 10%);
}

.setting-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-checkbox input[type='checkbox'] {
  width: 16px;
  height: 16px;
  accent-color: var(--primary-gold);
}

.setting-checkbox label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  cursor: pointer;
}

/* 折扣控制 */
.discount-control {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 8px;
}

.discount-slider {
  flex: 1;
  height: 6px;
  background-color: rgb(255 255 255 / 10%);
  border-radius: 3px;
  outline: none;
  appearance: none;
}

.discount-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--primary-gold);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgb(251 191 36 / 40%);
}

.discount-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: var(--primary-gold);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgb(251 191 36 / 40%);
}

.discount-value {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--primary-gold);
  min-width: 40px;
  text-align: center;
}

/* 价格预览 */
.price-preview {
  display: flex;
  gap: 12px;
  align-items: center;
}

.price-original {
  font-size: var(--text-sm);
  color: var(--text-muted);
  text-decoration: line-through;
}

.price-discounted {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--primary-gold);
}

/* 市场预测 */
.market-prediction {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.prediction-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  background-color: rgb(255 255 255 / 2%);
  border-radius: var(--radius-md);
}

.prediction-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  width: 100px;
}

.prediction-value {
  flex: 1;
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--primary-gold);
}

.prediction-change {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  min-width: 60px;
  text-align: right;
}

.prediction-change.positive {
  color: var(--success-green);
}

.prediction-change.negative {
  color: var(--danger-red);
}

/* 预测图表 */
.prediction-chart {
  margin-top: 10px;
}

.prediction-chart svg {
  width: 100%;
  height: 100px;
  background-color: rgb(255 255 255 / 2%);
  border-radius: var(--radius-sm);
  padding: 10px;
}
</style>




