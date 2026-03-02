<template>
  <!-- 顶部核心数据区域 -->
  <header class="simulation-header">
    <TopCoreData
      :game-state="gameState"
      :business-data="businessData"
      :assessment="assessment"
      :is-simulating="isSimulating"
      :simulation-progress="simulationProgress"
      @next-day="$emit('next-day')"
    />
  </header>
</template>

<script setup lang="ts">
import TopCoreData from './TopCoreData.vue';

// 接收父组件传递的属�?defineProps({
  gameState: {
    type: Object,
    required: true,
  },
  businessData: {
    type: Object,
    required: true,
  },
  assessment: {
    type: Object,
    required: true,
  },
  isSimulating: {
    type: Boolean,
    default: false,
  },
  simulationProgress: {
    type: Number,
    default: 0,
  },
});

// 向父组件传递事�?defineEmits(['next-day']);
</script>

<style lang="scss" scoped>
.simulation-header {
  background-color: tokens.$bg-dark;
  padding: tokens.$spacing-sm tokens.$spacing-lg;
  box-shadow: tokens.$shadow-lg;
  z-index: tokens.$z-sticky;
  border-radius: 0 0 tokens.$radius-sm tokens.$radius-sm;
  border-bottom: 2px solid tokens.$primary-gold;
}
</style>
