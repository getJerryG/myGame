<template>
  <div class="metric-card" :aria-label="`${metricName}: ${value}`">
    <div class="metric-header">
      <span class="metric-icon">{{ icon }}</span>
      <span class="metric-name">{{ metricName }}</span>
    </div>
    <div class="metric-value">
      <span class="value">{{ value }}{{ suffix }}</span>
      <span
        class="change"
        :class="{
          positive: change > 0,
          negative: change < 0,
        }"
      >
        {{ change > 0 ? '+' : '' }}{{ Math.abs(change) }}%
      </span>
      <span class="factor-icon" v-if="change > 0">{{ positiveIcon }}</span>
      <span class="factor-icon" v-else-if="change < 0">{{ negativeIcon }}</span>
    </div>
    <div class="metric-trend" v-if="showTrend">
      <div class="mini-trend">
        <svg width="100" height="30" viewBox="0 0 100 30">
          <polyline
            :points="trendPoints"
            fill="none"
            :stroke="trendColor"
            stroke-width="2"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  metricName: string;
  value: number | string;
  suffix?: string;
  icon: string;
  change: number;
  positiveIcon: string;
  negativeIcon: string;
  trendPoints?: string;
  trendColor?: string;
  showTrend?: boolean;
}>();
</script>

<style lang="scss" scoped>
.metric-card {
  background: tokens.$bg-light;
  border: 1px solid tokens.$border-medium;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-lg;
  transition: all tokens.$transition-fast;
  min-width: 200px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  }
}

.metric-header {
  display: flex;
  align-items: center;
  gap: tokens.$spacing-sm;
  margin-bottom: tokens.$spacing-md;

  .metric-icon {
    font-size: 24px;
  }

  .metric-name {
    font-size: tokens.$font-size-sm;
    font-weight: tokens.$font-weight-medium;
    color: tokens.$text-secondary;
  }
}

.metric-value {
  display: flex;
  align-items: center;
  gap: tokens.$spacing-md;
  flex-wrap: wrap;

  .value {
    font-size: tokens.$font-size-2xl;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }

  .change {
    font-size: tokens.$font-size-xs;
    font-weight: tokens.$font-weight-bold;
    padding: tokens.$spacing-xs tokens.$spacing-sm;
    border-radius: tokens.$radius-sm;

    &.positive {
      background: rgb(34 197 94 / 20%);
      color: tokens.$success;
    }

    &.negative {
      background: rgb(239 68 68 / 20%);
      color: tokens.$error;
    }
  }

  .factor-icon {
    font-size: 16px;
  }
}

.metric-trend {
  margin-top: tokens.$spacing-md;

  .mini-trend {
    width: 100%;
    height: 30px;
  }
}
</style>
