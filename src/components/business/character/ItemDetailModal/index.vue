<template>
  <GameModal
    :is-visible="isVisible"
    :title="selectedItem?.name || '物品详情'"
    @close="$emit('close')"
  >
    <div v-if="selectedItem" class="item-detail">
      <div class="item-header">
        <div class="item-type-badge">{{ selectedItem.type }}</div>
        <h3 class="item-name">{{ selectedItem.name }}</h3>
      </div>
      <div class="item-description">{{ selectedItem.description }}</div>
      <div v-if="selectedItem.effects" class="item-effects">
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
    <div v-else class="empty-detail">
      <div class="empty-icon">📦</div>
      <p>没有选中的物品</p>
    </div>
  </GameModal>
</template>

<script setup lang="ts">
import GameModal from "../GameModal.vue";

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

defineEmits(["close"]);
</script>

<style lang="scss" scoped>
.item-detail {
  @include utils.flex-col(tokens.$space-3);
}

.item-header {
  @include utils.flex-col(tokens.$space-1, flex-start);
}

.item-type-badge {
  align-self: flex-start;
  background-color: rgb(59 130 246 / 20%);
  color: tokens.$primary-blue;
  padding: tokens.$space-1 tokens.$space-2;
  border-radius: tokens.$radius-full;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-medium;
  text-transform: capitalize;
}

.item-name {
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  margin: 0;
}

.item-description {
  color: tokens.$text-secondary;
  line-height: tokens.$line-height-normal;
}

.item-section-title {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
  margin: 0 0 tokens.$space-2;
}

.item-effects {
  margin-top: tokens.$space-1;
}

.effects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: tokens.$space-2;
}

.effect-item {
  @include utils.flex-between;

  background-color: tokens.$bg-light;
  border: 1px solid tokens.$border-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$space-2;
}

.effect-name {
  color: tokens.$text-secondary;
  font-size: tokens.$font-size-sm;
}

.effect-value {
  color: tokens.$primary-gold;
  font-weight: tokens.$font-weight-semibold;
  font-size: tokens.$font-size-sm;
}

.empty-detail {
  @include utils.flex-col(tokens.$space-3, center, center);

  padding: tokens.$space-6;
  color: tokens.$text-secondary;
}

.empty-icon {
  font-size: tokens.$font-size-4xl;
}
</style>
