<template>
  <div class="planner-info">
    <div class="planner-level">
      <span class="label">策划等级:</span>
      <span class="value">{{ level }}</span>
      <span class="level-badge">🎓</span>
    </div>
    <div class="planner-funds">
      <span class="label">策划资金:</span>
      <span class="value">¥{{ funds }}</span>
      <span class="funds-badge">💰</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  level: string;
  funds: number;
}>();
</script>

<style lang="scss" scoped>
.planner-info {
  display: flex;
  gap: tokens.$spacing-lg;
  align-items: center;

  .planner-level,
  .planner-funds {
    display: flex;
    align-items: center;
    gap: tokens.$spacing-sm;

    .label {
      font-size: tokens.$font-size-sm;
      color: tokens.$text-secondary;
    }

    .value {
      font-size: tokens.$font-size-base;
      font-weight: tokens.$font-weight-bold;
      color: tokens.$text-primary;
    }

    .level-badge,
    .funds-badge {
      font-size: tokens.$font-size-lg;
    }
  }
}
</style>
