<template>
  <GameModal :is-visible="isVisible" title="背包" @close="$emit('close')">
    <div class="full-inventory">
      <div class="inventory-header">
        <h3>我的背包</h3>
        <div class="inventory-count">{{ inventory.length }} 件物�?/div>
      </div>
      <div class="inventory-list">
        <div
          v-for="item in inventory"
          :key="item.id"
          class="inventory-item"
          @click="$emit('show-item-detail', item)"
        >
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-type">{{ item.type }}</span>
          </div>
          <button
            class="use-item-btn"
            title="使用物品"
            @click.stop="$emit('use-item', item.id)"
          >
            使用
          </button>
        </div>
        <div v-if="inventory.length === 0" class="empty-inventory">
          <div class="empty-icon">🎒</div>
          <p>背包是空�?/p>
        </div>
      </div>
    </div>
  </GameModal>
</template>

<script setup lang=ts>
import GameModal from '../../../common/GameModal/index.vue';

defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  inventory: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['close', 'show-item-detail', 'use-item']);
</script>

<style lang=scss scoped>
.full-inventory {
  max-height: 500px;
  overflow-y: auto;
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.inventory-header h3 {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.inventory-count {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.inventory-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.inventory-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(255 255 255 / 5%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: var(--space-2);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.inventory-item:hover {
  background-color: rgb(255 255 255 / 10%);
  transform: translateY(-1px);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.item-name {
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.item-type {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  text-transform: capitalize;
}

.use-item-btn {
  background-color: var(--success-green);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.use-item-btn:hover {
  background-color: #059669;
  transform: scale(1.05);
}

.empty-inventory {
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
