<template>
  <div class="activity-statistics-tab">
    <h3 class="text-gold">活动统计</h3>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-value">{{ stats.totalActivities }}</div>
        <div class="stat-label">总活动数</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-value">{{ stats.ongoingActivities }}</div>
        <div class="stat-label">进行中</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-value">{{ stats.completedActivities }}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-value">{{ stats.totalParticipants }}</div>
        <div class="stat-label">总参与人数</div>
      </div>
    </div>

    <div class="chart-section">
      <h4>活动参与趋势</h4>
      <div class="chart-placeholder">
        <div class="chart-bars">
          <div
            v-for="(value, index) in participationTrend"
            :key="index"
            class="chart-bar"
            :style="{ height: `${value}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ActivityStats {
  totalActivities: number;
  ongoingActivities: number;
  completedActivities: number;
  totalParticipants: number;
}

defineProps<{
  stats: ActivityStats;
  participationTrend: number[];
}>();
</script>

<style lang="scss" scoped>
.activity-statistics-tab {
  padding: tokens.$spacing-lg;
}

.text-gold {
  color: tokens.$primary-gold;
  margin: 0 0 tokens.$spacing-xl 0;
  font-size: tokens.$font-size-xl;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: tokens.$spacing-lg;
  margin-bottom: tokens.$spacing-xl;
}

.stat-card {
  background: tokens.$bg-light;
  border: 1px solid tokens.$border-medium;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-xl;
  text-align: center;
  transition: all tokens.$transition-fast;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgb(0 0 0 / 15%);
  }

  .stat-icon {
    font-size: 48px;
    margin-bottom: tokens.$spacing-md;
  }

  .stat-value {
    font-size: tokens.$font-size-3xl;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$primary-gold;
    margin-bottom: tokens.$spacing-xs;
  }

  .stat-label {
    font-size: tokens.$font-size-sm;
    color: tokens.$text-secondary;
  }
}

.chart-section {
  background: tokens.$bg-light;
  border: 1px solid tokens.$border-medium;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-xl;

  h4 {
    margin: 0 0 tokens.$spacing-lg 0;
    font-size: tokens.$font-size-lg;
    color: tokens.$text-primary;
  }
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: tokens.$spacing-sm;
  height: 100%;
  width: 100%;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(180deg, tokens.$primary-gold 0%, color.adjust(tokens.$primary-gold, $lightness: -20%) 100%);
  border-radius: tokens.$radius-sm tokens.$radius-sm 0 0;
  min-height: 4px;
  transition: height tokens.$transition-fast;

  &:hover {
    background: linear-gradient(180deg, color.adjust(tokens.$primary-gold, $lightness: 10%) 0%, tokens.$primary-gold 100%);
  }
}
</style>
