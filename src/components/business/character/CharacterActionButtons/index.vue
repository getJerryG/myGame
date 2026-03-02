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
defineEmits(["toggle-inventory", "show-achievements", "go-to-lottery"]);
</script>

<style lang="scss" scoped>
.action-section {
  margin-top: tokens.$space-4;
}

.section-title {
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
  margin-bottom: tokens.$space-3;
}

.action-buttons {
  @include utils.flex-row(tokens.$space-3, center, flex-start);
}

.action-btn {
  background-color: tokens.$bg-light;
  border: 1px solid tokens.$border-light;
  border-radius: tokens.$radius-lg;
  padding: tokens.$space-3 tokens.$space-4;

  @include utils.flex-col(tokens.$space-1, center, center);

  cursor: pointer;
  transition: all tokens.$transition-fast;
  min-width: 100px;

  &:hover {
    background-color: tokens.$border-light;
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-md;
  }

  &:active {
    transform: translateY(0);
  }
}

.btn-icon {
  font-size: tokens.$font-size-2xl;
}

.btn-text {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
}

.inventory-btn {
  color: tokens.$success-green;
}

.achievement-btn {
  color: tokens.$primary-gold;
}

.lottery-btn {
  color: tokens.$lottery-purple;
}
</style>
