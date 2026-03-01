<template>
  <div class="panel-header">
    <h3 class="panel-title">英雄管理</h3>
    <button
      class="collapse-btn"
      aria-expanded="!isCollapsed"
      @click="toggleCollapse"
    >
      <span class="collapse-icon">{{ isCollapsed ? '▶️' : '◀�? }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isCollapsed: Boolean,
});

const emit = defineEmits(['toggle-collapse']);

function toggleCollapse(): void {
  emit('toggle-collapse');
}
</script>

<style lang="scss" scoped>

.panel-header {
  @include utils.flex-between(center);

  padding: tokens.$spacing-md tokens.$spacing-lg;
  background: linear-gradient(135deg, tokens.$primary-blue 0%, #764ba2 100%);
  border-radius: tokens.$radius-md tokens.$radius-md 0 0;
  color: tokens.$text-primary;
  box-shadow: tokens.$shadow-lg;
}

.panel-title {
  margin: 0;
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.collapse-btn {
  @include utils.collapse-btn;

  color: tokens.$text-primary;
  font-size: tokens.$font-size-base;
  border-radius: 50%;

  &:hover {
    background: tokens.$bg-lighter;
    transform: scale(1.1);
  }
}

.collapse-icon {
  display: inline-block;
  transition: transform tokens.$transition-normal;
}
</style>
