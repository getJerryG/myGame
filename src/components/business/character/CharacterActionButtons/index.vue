<template>
  <div class="action-section">
    <h3 class="section-title">游戏功能</h3>
    <div class="action-buttons">
      <button
        class="action-btn inventory-btn"
        title="打开背包"
        @click="$emit('toggle-inventory')"
      >
        <div class="btn-icon">🎒</div>
        <div class="btn-text">背包</div>
      </button>
      <button
        class="action-btn achievement-btn"
        title="查看成就"
        @click="$emit('show-achievements')"
      >
        <div class="btn-icon">🏆</div>
        <div class="btn-text">成就</div>
      </button>
      <button
        class="action-btn lottery-btn"
        title="进入抽奖界面"
        @click="$emit('go-to-lottery')"
      >
        <div class="btn-icon">🎲</div>
        <div class="btn-text">抽奖</div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['toggle-inventory', 'show-achievements', 'go-to-lottery']);
</script>

<style lang="scss" scoped>
.action-section {
  margin-top: var(--space-4);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.action-buttons {
  display: flex;
  gap: var(--space-3);
}

.action-btn {
  background-color: var(--bg-light);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 100px;
}

.action-btn:hover {
  background-color: var(--border-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.action-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: var(--text-2xl);
}

.btn-text {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.inventory-btn {
  color: var(--success-green);
}

.achievement-btn {
  color: var(--primary-gold);
}

.lottery-btn {
  color: #8b5cf6;
}
</style>
