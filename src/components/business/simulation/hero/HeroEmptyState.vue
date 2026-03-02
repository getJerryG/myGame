<template>
  <div class="empty-state">
    <div class="empty-icon">👥</div>
    <p>没有符合条件的英雄</p>
    <button class="reset-btn" @click="$emit('reset')">重置筛选条件</button>
  </div>
</template>

<script setup lang="ts">
const _emit = defineEmits<{
  reset: [];
}>();
</script>

<style lang="scss" scoped>
.empty-state {
  text-align: center;
  padding: tokens.$spacing-xl;

  .empty-icon {
    font-size: 64px;
    margin-bottom: tokens.$spacing-md;
  }

  p {
    font-size: tokens.$font-size-base;
    color: tokens.$text-secondary;
    margin: 0 0 tokens.$spacing-lg 0;
  }

  .reset-btn {
    padding: tokens.$spacing-sm tokens.$spacing-lg;
    background: tokens.$primary-blue;
    border: none;
    border-radius: tokens.$radius-md;
    color: #fff;
    font-size: tokens.$font-size-sm;
    font-weight: tokens.$font-weight-bold;
    cursor: pointer;
    transition: all tokens.$transition-fast;

    &:hover {
      background: color.adjust(tokens.$primary-blue, $lightness: -10%);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}
</style>
