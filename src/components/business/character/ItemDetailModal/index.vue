<template>
  <GameModal
    :is-visible="isVisible"
    :title="selectedItem?.name || '物品详情'"
    @close="$emit('close')"
  >
    <div
      v-if="selectedItem"
      class="item-detail"
    >
      <div class="item-header">
        <div class="item-type-badge">{{ selectedItem.type }}</div>
        <h3 class="item-name">{{ selectedItem.name }}</h3>
      </div>
      <div class="item-description">{{ selectedItem.description }}</div>
      <div
        v-if="selectedItem.effects"
        class="item-effects"
      >
        <h4 class="item-section-title">效果</h4>
        <div class="effects-grid">
          <div
            v-for="(value, key) in selectedItem.effects"
            :key="key"
            class="effect-item"
          >
            <span class="effect-name">{{ key }}:</span>
            <span class="effect-value">{{ value }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="empty-detail"
    >
      <div class="empty-icon">📦</div>
      <p>没有选中的物�?/p></p>
    </div>
  </GameModal>
</template>

<script setup lang="ts">
import GameModal from '../GameModal.vue';

defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  selectedItem: {
    type: Object,
    default: null,
  },
});

defineEmits(['close']);
</script>

<style lang="scss" scoped>
.item-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.item-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.item-type-badge {
  align-self: flex-start;
  background-color: rgb(59 130 246 / 20%);
  color: #3b82f6;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  text-transform: capitalize;
}

.item-name {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.item-description {
  color: var(--text-secondary);
  line-height: 1.5;
}

.item-section-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  margin-bottom: var(--space-2);
}

.item-effects {
  margin-top: var(--space-1);
}

.effects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-2);
}

.effect-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(255 255 255 / 5%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: var(--space-2);
}

.effect-name {
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.effect-value {
  color: var(--primary-gold);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
}

.empty-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  gap: var(--space-3);
  color: var(--text-secondary);
}

.empty-icon {
  font-size: var(--text-4xl);
}
</style>
