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
            <span class="price-label">预计价格：</span>
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
          <label class="setting-label">快速配置</label>
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
          <label class="setting-label">销售周期</label>
          <select v-model="releaseConfig.duration" class="setting-select">
            <option value="7">7天</option>
            <option value="14">14天</option>
            <option value="30">30天</option>
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
          <div class="prediction-label">预计销量</div>
          <div class="prediction-value">{{ getPredictedSales() }}万</div>
          <div class="prediction-change" :class="getSalesChangeClass()">
            {{ getSalesChange() }}
          </div>
        </div>

        <div class="prediction-item">
          <div class="prediction-label">预计收入</div>
          <div class="prediction-value">{{ getPredictedRevenue() }}万</div>
          <div class="prediction-change" :class="getRevenueChangeClass()">
            {{ getRevenueChange() }}
          </div>
        </div>

        <div class="prediction-item">
          <div class="prediction-label">玩家满意度</div>
          <div class="prediction-value">{{ getPredictedSatisfaction() }}%</div>
          <div class="prediction-change" :class="getSatisfactionChangeClass()">
            {{ getSatisfactionChange() }}
          </div>
        </div>

        <div class="prediction-chart">
          <h6>预计销量趋势</h6>
          <svg width="100%" height="100" viewBox="0 0 400 100">
            <polyline
              :points="getTrendPoints(predictedTrend)"
              fill="none"
              :stroke="tokens.$primary - gold"
              stroke-width="2"
            />
            <circle
              v-for="(point, index) in predictedTrend"
              :key="index"
              :cx="(index / (predictedTrend.length - 1)) * 400"
              :cy="100 - (point / 100) * 80"
              r="3"
              :fill="tokens.$primary - gold"
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
      <span class="empty-text">请从左侧选择一个皮肤进行发布设置</span>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const emit = defineEmits(["skin-released"]);

// 快速配置选项
const quickConfig = ref("");

// 发布配置
const releaseConfig = ref({
  date: new Date().toISOString().split("T")[0],
  duration: "14",
  isLimited: false,
  discount: 80,
});

// 快速配置方案
const configPresets = {
  standard: {
    duration: "permanent",
    isLimited: false,
    discount: 80,
  },
  limited: {
    duration: "30",
    isLimited: true,
    discount: 70,
  },
  premium: {
    duration: "14",
    isLimited: true,
    discount: 60,
  },
};

// 监听皮肤变化，重置发布配置
watch(
  () => props.skin,
  () => {
    resetReleaseConfig();
  },
);

// 重置发布配置
const resetReleaseConfig = (): void => {
  quickConfig.value = "";
  releaseConfig.value = {
    date: new Date().toISOString().split("T")[0],
    duration: "14",
    isLimited: props.skin?.quality === "limited",
    discount: 80,
  };
};

// 应用快速配置
const applyQuickConfig = (): void => {
  if (quickConfig.value && configPresets[quickConfig.value]) {
    releaseConfig.value = {
      ...releaseConfig.value,
      ...configPresets[quickConfig.value],
    };
  }
};

// 获取品质标签
const getQualityLabel = (quality: string): string => {
  const labels: Record<string, string> = {
    brave: "勇者",
    epic: "史诗",
    legend: "传说",
    limited: "限定",
  };
  return labels[quality] || quality;
};

// 获取折扣后的价格
const getDiscountedPrice = (): number => {
  if (!props.skin) return 0;
  return Math.round((props.skin.price * releaseConfig.value.discount) / 100);
};

// 获取预测销量
const getPredictedSales = (): number => {
  if (!props.skin) return 0;
  const baseSales = props.skin.expected.sales;
  const discountFactor = 1 + (100 - releaseConfig.value.discount) * 0.01;
  const limitedFactor = releaseConfig.value.isLimited ? 1.3 : 1;
  return Math.round(baseSales * discountFactor * limitedFactor * 0.1) * 10;
};

// 获取预测收入
const getPredictedRevenue = (): number => {
  if (!props.skin) return 0;
  const sales = getPredictedSales();
  const price = getDiscountedPrice();
  return Math.round((sales * price) / 10000);
};

// 获取预测满意度
const getPredictedSatisfaction = (): number => {
  if (!props.skin) return 0;
  return props.skin.expected.satisfaction;
};

// 获取销量变化
const getSalesChange = (): string => {
  if (!props.skin) return "";
  const baseSales = props.skin.expected.sales;
  const predictedSales = getPredictedSales();
  const change = (((predictedSales - baseSales) / baseSales) * 100).toFixed(0);
  return change > 0 ? `+${change}%` : `${change}%`;
};

// 获取销量变化样式
const getSalesChangeClass = (): string => {
  if (!props.skin) return "";
  const baseSales = props.skin.expected.sales;
  const predictedSales = getPredictedSales();
  return predictedSales > baseSales
    ? "positive"
    : predictedSales < baseSales
      ? "negative"
      : "";
};

// 获取收入变化
const getRevenueChange = (): string => {
  if (!props.skin) return "";
  const baseRevenue = (props.skin.expected.sales * props.skin.price) / 10000;
  const predictedRevenue = getPredictedRevenue();
  const change = (
    ((predictedRevenue - baseRevenue) / baseRevenue) *
    100
  ).toFixed(0);
  return change > 0 ? `+${change}%` : `${change}%`;
};

// 获取收入变化样式
const getRevenueChangeClass = (): string => {
  if (!props.skin) return "";
  const baseRevenue = (props.skin.expected.sales * props.skin.price) / 10000;
  const predictedRevenue = getPredictedRevenue();
  return predictedRevenue > baseRevenue
    ? "positive"
    : predictedRevenue < baseRevenue
      ? "negative"
      : "";
};

// 获取满意度变化
const getSatisfactionChange = (): string => {
  return "0%";
};

// 获取满意度变化样式
const getSatisfactionChangeClass = (): string => {
  return "";
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

// 确认发布
const confirmRelease = (): void => {
  if (!props.skin) return;
  emit("skin-released", {
    skin: props.skin,
    config: releaseConfig.value,
  });
  alert("皮肤发布计划已确认！");
};
</script>

<style lang="scss" scoped>
/* 皮肤详情 */
.skin-detail {
  @include utils.flex-col(tokens.$spacing-lg, stretch);

  overflow-y: auto;
  padding-right: tokens.$spacing-md;

  &.empty {
    @include utils.flex-center;

    background-color: tokens.$bg-light;
    border-radius: tokens.$radius-md;
    border: 2px dashed tokens.$border-light;
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

/* 详情区块 */
.detail-section {
  @include utils.config-section;
  @include utils.flex-col(tokens.$spacing-md, stretch);

  h5 {
    @include utils.subsection-title;

    padding-bottom: tokens.$spacing-sm;
    border-bottom: 1px solid tokens.$border-light;
  }

  h6 {
    font-size: tokens.$font-size-xs;
    font-weight: tokens.$font-weight-medium;
    color: tokens.$text-secondary;
    margin: 0 0 tokens.$spacing-sm;
  }
}

/* 皮肤头部信息 */
.skin-header {
  @include utils.flex-row(tokens.$spacing-lg, center);
}

.skin-avatar-large {
  font-size: tokens.$font-size-5xl;
  flex-shrink: 0;
}

.skin-basic-info {
  flex: 1;

  @include utils.flex-col(tokens.$spacing-xs, stretch);
}

.skin-title {
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  margin: 0;
}

.skin-subtitle {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
}

.skin-price {
  @include utils.flex-row(tokens.$spacing-sm, center);
}

.price-label {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-muted;
}

.price-value {
  @include utils.value-text(tokens.$font-size-base);
}

/* 皮肤特效 */
.skin-effects {
  @include utils.flex-col(tokens.$spacing-sm, stretch);
}

.effects-list {
  @include utils.flex-col(tokens.$spacing-xs, stretch);
}

.effect-item {
  @include utils.flex-row(tokens.$spacing-sm, center);

  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: rgb(255 255 255 / 2%);
  border-radius: tokens.$radius-sm;
}

.effect-icon {
  font-size: tokens.$font-size-base;
  flex-shrink: 0;
}

.effect-description {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  flex: 1;
}

/* 发布设置 */
.release-settings {
  @include utils.flex-col(tokens.$spacing-md, stretch);
}

.setting-item {
  @include utils.flex-col(tokens.$spacing-xs, stretch);
}

.setting-label {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  font-weight: tokens.$font-weight-medium;
}

.setting-input,
.setting-select {
  @include utils.input-base;
}

.setting-checkbox {
  @include utils.flex-row(tokens.$spacing-sm, center);

  input {
    &[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: tokens.$primary-gold;
    }
  }

  label {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
    cursor: pointer;
  }
}

/* 折扣控制 */
.discount-control {
  @include utils.flex-row(tokens.$spacing-lg, center);

  margin-bottom: tokens.$spacing-sm;
}

.discount-slider {
  @include utils.slider-base;
}

.discount-value {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$primary-gold;
  min-width: 40px;
  text-align: center;
}

/* 价格预览 */
.price-preview {
  @include utils.flex-row(12px, center);
}

.price-original {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-muted;
  text-decoration: line-through;
}

.price-discounted {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$primary-gold;
}

/* 市场预测 */
.market-prediction {
  @include utils.flex-col(tokens.$spacing-md, stretch);
}

.prediction-item {
  @include utils.flex-row(tokens.$spacing-md, center);

  padding: tokens.$spacing-md;
  background-color: rgb(255 255 255 / 2%);
  border-radius: tokens.$radius-md;
}

.prediction-label {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  width: 100px;
}

.prediction-value {
  flex: 1;

  @include utils.value-text(tokens.$font-size-base);
}

.prediction-change {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-semibold;
  min-width: 60px;
  text-align: right;

  &.positive {
    color: tokens.$success-green;
  }

  &.negative {
    color: tokens.$danger-red;
  }
}

/* 预测图表 */
.prediction-chart {
  margin-top: tokens.$spacing-sm;

  svg {
    width: 100%;
    height: 100px;
    background-color: rgb(255 255 255 / 2%);
    border-radius: tokens.$radius-sm;
    padding: tokens.$spacing-md;
  }
}

/* 操作按钮 */
.action-buttons {
  @include utils.flex-row(tokens.$spacing-md, center, flex-end);

  .btn {
    &-primary {
      @include utils.btn-primary;
    }

    &-secondary {
      @include utils.btn-secondary;
    }
  }
}
</style>
