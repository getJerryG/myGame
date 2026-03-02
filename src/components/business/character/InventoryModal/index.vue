<template>
  <GameModal :is-visible="isVisible" title="背包" @close="$emit('close')">
    <div class="full-inventory">
      <div class="inventory-header">
        <h3>我的背包</h3>
        <div class="inventory-count">{{ inventory.length }} 件物品</div>
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
          <p>背包是空的</p>
        </div>
      </div>
    </div>
  </GameModal>
</template>

<script setup lang="ts">
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

<style lang="scss" scoped>
.full-inventory {
  max-height: 500px;
  overflow-y: auto;
}

.inventory-header {
  @include utils.flex-between;

  margin-bottom: tokens.$space-3;

  h3 {
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-semibold;
    color: tokens.$text-primary;
    margin: 0;
  }
}

.inventory-count {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
}

.inventory-list {
  @include utils.flex-col(tokens.$space-2);
}

.inventory-item {
  @include utils.flex-between;

  background-color: tokens.$bg-light;
  border: 1px solid tokens.$border-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$space-2;
  transition: all tokens.$transition-fast;
  cursor: pointer;

  &:hover {
    background-color: tokens.$bg-lighter;
    transform: translateY(-1px);
  }
}

.item-info {
  @include utils.flex-col(tokens.$space-1);
}

.item-name {
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
}

.item-type {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
  text-transform: capitalize;
}

.use-item-btn {
  background-color: tokens.$success-green;
  color: tokens.$text-primary;
  border: none;
  border-radius: tokens.$radius-sm;
  padding: tokens.$space-1 tokens.$space-3;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-medium;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover {
    background-color: tokens.$success;
    transform: scale(1.05);
  }
}

.empty-inventory {
  @include utils.flex-col(tokens.$space-3, center, center);

  padding: tokens.$space-6;
  color: tokens.$text-secondary;
}

.empty-icon {
  font-size: tokens.$font-size-4xl;
}
</style>
