<template>
  <div class="history-effects">
    <h4 class="section-title">历史活动效果</h4>
    <div class="history-list">
      <div
        v-for="event in historicalEvents"
        :key="event.id"
        class="history-item"
      >
        <div class="history-header">
          <span class="history-icon">{{ event.icon }}</span>
          <span class="history-name">{{ event.name }}</span>
          <span class="history-date">{{ event.date }}</span>
        </div>
        <div class="history-stats">
          <div class="stat-item">
            <span class="stat-label">参与率</span>
            <span class="stat-value">{{ event.participationRate }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">好评率</span>
            <span class="stat-value">{{ event.rating }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">收入提升</span>
            <span class="stat-value">{{ event.revenueIncrease }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 接收父组件传递的属性
defineProps({
  historicalEvents: {
    type: Array,
    default: () => [
      {
        id: 1,
        name: "春节限时活动",
        type: "holiday",
        icon: "🎄",
        date: "2026-01-20 ~ 2026-02-05",
        participationRate: 85,
        rating: 92,
        revenueIncrease: 35,
      },
      {
        id: 2,
        name: "周末双倍经验",
        type: "limited",
        icon: "⏱️",
        date: "2026-01-15 ~ 2026-01-17",
        participationRate: 78,
        rating: 85,
        revenueIncrease: 15,
      },
      {
        id: 3,
        name: "社区挑战赛",
        type: "community",
        icon: "👥",
        date: "2026-01-10 ~ 2026-01-20",
        participationRate: 65,
        rating: 88,
        revenueIncrease: 20,
      },
    ],
  },
});
</script>

<style lang="scss" scoped>
.history-effects {
  margin-top: tokens.$spacing-lg;

  .history-list {
    @include utils.flex-col(tokens.$spacing-md, stretch, flex-start);

    max-height: 300px;
    overflow-y: auto;
    padding-right: tokens.$spacing-sm;
  }

  .history-item {
    padding: tokens.$spacing-md;
    background-color: tokens.$bg-light;
    border-radius: tokens.$radius-md;
    border-left: 4px solid tokens.$primary-blue;
    transition: all tokens.$transition-fast;

    &:hover {
      background-color: tokens.$bg-lighter;
      transform: translateX(5px);
    }
  }

  .history-header {
    @include utils.flex-row(tokens.$spacing-md, center, flex-start);

    margin-bottom: tokens.$spacing-sm;
  }

  .history-icon {
    font-size: tokens.$font-size-lg;
    flex-shrink: 0;
  }

  .history-name {
    flex: 1;
    font-size: tokens.$font-size-sm;
    font-weight: tokens.$font-weight-medium;
    color: tokens.$text-primary;
  }

  .history-date {
    font-size: tokens.$font-size-xs;
    color: tokens.$text-muted;
    flex-shrink: 0;
  }

  .history-stats {
    @include utils.flex-row(tokens.$spacing-xl, flex-start, flex-start);
  }

  .stat-item {
    @include utils.stat-item;

    .stat-label {
      @include utils.stat-label;
    }

    .stat-value {
      @include utils.stat-value(tokens.$primary-gold);
    }
  }
}

/* 响应式设�? */
@media (width <= 768px) {
  .history-effects {
    .history-stats {
      flex-wrap: wrap;
      gap: tokens.$spacing-md;
    }
  }
}
</style>
