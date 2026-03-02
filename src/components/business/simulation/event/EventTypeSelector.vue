<template>
  <div class="event-type-selector">
    <h4 class="section-title">活动类型</h4>
    <div class="tabs">
      <button
        v-for="type in eventTypes"
        :key="type.value"
        class="tab-btn"
        :class="{ active: selectedEventType === type.value }"
        @click="selectEventType(type.value)"
      >
        <span class="tab-icon">{{ type.icon }}</span>
        <span class="tab-text">{{ type.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 接收父组件传递的属�?defineProps({
  eventTypes: {
    type: Array,
    default: () => [
      { label: '限时活动', value: 'limited', icon: '⏱️' },
      { label: '节日活动', value: 'holiday', icon: '🎄' },
      { label: '社区活动', value: 'community', icon: '👥' },
    ],
  },
  selectedEventType: {
    type: String,
    default: 'limited',
  },
});

// 向父组件传递事�?const emit = defineEmits(['type-selected']);

// 选择活动类型
const selectEventType = (type: string): void => {
  emit('type-selected', type);
};
</script>

<style lang="scss" scoped>
.event-type-selector {
  margin-bottom: tokens.$spacing-lg;

  .tabs {
    @include utils.flex-row(tokens.$spacing-sm, center, flex-start);

    background-color: tokens.$bg-light;
    padding: tokens.$spacing-xs;
    border-radius: tokens.$radius-lg;
  }

  .tab-btn {
    flex: 1;

    @include utils.flex-row(tokens.$spacing-sm, center, center);

    padding: tokens.$spacing-sm tokens.$spacing-md;
    background: none;
    border: none;
    border-radius: tokens.$radius-md;
    color: tokens.$text-secondary;
    cursor: pointer;
    transition: all tokens.$transition-normal;
    font-size: tokens.$font-size-sm;
    font-weight: tokens.$font-weight-medium;

    &:hover {
      background-color: tokens.$bg-lighter;
      color: tokens.$text-primary;
    }

    &.active {
      background: linear-gradient(135deg, tokens.$bg-dark 0%, tokens.$primary-blue 100%);
      color: white;
      box-shadow: tokens.$shadow-blue;
    }
  }

  .tab-icon {
    font-size: tokens.$font-size-base;
  }
}
</style>
