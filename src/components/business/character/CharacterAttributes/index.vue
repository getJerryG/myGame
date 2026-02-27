<template>
  <div class="attributes-section">
    <h3 class="section-title">能力属�?/h3>
    <div class="attributes-grid">
      <div
        class="attribute-card"
        @mouseenter="
          $emit('show-tooltip', '物理攻击力：影响普通攻击和物理技能伤�?)
        "
        @mouseleave="$emit('hide-tooltip')"
      >
        <div class="attribute-icon">⚔️</div>
        <div class="attribute-value">
          {{ player.stats.attack }}
        </div>
        <div class="attribute-label">攻击</div>
      </div>
      <div
        class="attribute-card"
        @mouseenter="$emit('show-tooltip', '防御力：减少受到的物理伤�?)"
        @mouseleave="$emit('hide-tooltip')"
      >
        <div class="attribute-icon">🛡�?/div>
        <div class="attribute-value">
          {{ player.stats.defense }}
        </div>
        <div class="attribute-label">防御</div>
      </div>
      <div
        class="attribute-card"
        @mouseenter="$emit('show-tooltip', '魔法攻击力：影响魔法技能伤�?)"
        @mouseleave="$emit('hide-tooltip')"
      >
        <div class="attribute-icon">�?/div>
        <div class="attribute-value">
          {{ player.stats.magicAttack }}
        </div>
        <div class="attribute-label">魔法</div>
      </div>
      <div
        class="attribute-card"
        @mouseenter="$emit('show-tooltip', '魔法防御力：减少受到的魔法伤�?)"
        @mouseleave="$emit('hide-tooltip')"
      >
        <div class="attribute-icon">🔮</div>
        <div class="attribute-value">
          {{ player.stats.magicDefense }}
        </div>
        <div class="attribute-label">魔防</div>
      </div>
    </div>
  </div>
</template>

<script setup lang=ts>
defineProps({
  player: {
    type: Object,
    required: true,
  },
});

defineEmits(['show-tooltip', 'hide-tooltip']);
</script>

<style lang=scss scoped>
.attributes-section {
  margin-top: var(--space-4);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.attributes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-3);
}

.attribute-card {
  background-color: rgb(255 255 255 / 5%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  transition: all var(--transition-fast);
  cursor: help;
}

.attribute-card:hover {
  background-color: rgb(255 255 255 / 10%);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.attribute-icon {
  font-size: var(--text-2xl);
  margin-bottom: var(--space-1);
}

.attribute-value {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.attribute-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-transform: capitalize;
}
</style>
