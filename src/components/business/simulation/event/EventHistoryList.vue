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
            <span class="stat-label">参与�?/span>
            <span class="stat-value">{{ event.participationRate }}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">好评�?/span>
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

<script setup lang=ts>
// 接收父组件传递的属�?defineProps({
  historicalEvents: {
    type: Array,
    default: () => [
      {
        id: 1,
        name: '春节限时活动',
        type: 'holiday',
        icon: '🎄',
        date: '2026-01-20 �?2026-02-05',
        participationRate: 85,
        rating: 92,
        revenueIncrease: 35,
      },
      {
        id: 2,
        name: '周末双倍经�?,
        type: 'limited',
        icon: '�?,
        date: '2026-01-15 �?2026-01-17',
        participationRate: 78,
        rating: 85,
        revenueIncrease: 15,
      },
      {
        id: 3,
        name: '社区挑战�?,
        type: 'community',
        icon: '👥',
        date: '2026-01-10 �?2026-01-20',
        participationRate: 65,
        rating: 88,
        revenueIncrease: 20,
      },
    ],
  },
});
</script>

<style lang=scss scoped>
.history-effects {
  margin-top: 25px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
}

.history-item {
  padding: 15px;
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  border-left: 4px solid #3b82f6;
  transition: all var(--transition-fast);
}

.history-item:hover {
  background-color: rgb(255 255 255 / 10%);
  transform: translateX(5px);
}

.history-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.history-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.history-name {
  flex: 1;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.history-date {
  font-size: var(--text-xs);
  color: var(--text-muted);
  flex-shrink: 0;
}

.history-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.stat-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--primary-gold);
}

/* 响应式设�? */
@media (width <= 768px) {
  .history-stats {
    flex-wrap: wrap;
    gap: 15px;
  }
}
</style>




