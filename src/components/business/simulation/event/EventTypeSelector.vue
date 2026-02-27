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

<script setup lang=ts>
// 接收父组件传递的属�?defineProps({
  eventTypes: {
    type: Array,
    default: () => [
      { label: '限时活动', value: 'limited', icon: '�? },
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

<style lang=scss scoped>
.event-type-selector {
  margin-bottom: 25px;
}

.tabs {
  display: flex;
  gap: 10px;
  background-color: rgb(255 255 255 / 5%);
  padding: 4px;
  border-radius: var(--radius-lg);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.tab-btn:hover {
  background-color: rgb(255 255 255 / 10%);
  color: var(--text-primary);
}

.tab-btn.active {
  background: linear-gradient(
    135deg,
    var(--primary-dark-blue) 0%,
    #3b82f6 100%
  );
  color: white;
  box-shadow: 0 2px 8px rgb(59 130 246 / 40%);
}

.tab-icon {
  font-size: 16px;
}
</style>




