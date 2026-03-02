<template>
  <div class="attributes-section">
    <h3 class="section-title">能力属性</h3>
    <div class="attributes-grid">
      <div
        class="attribute-card"
        @mouseenter="
          $emit('show-tooltip', '物理攻击力：影响普通攻击和物理技能伤害')
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
        @mouseenter="$emit('show-tooltip', '防御力：减少受到的物理伤害')"
        @mouseleave="$emit('hide-tooltip')"
      >
        <div class="attribute-icon">🛡️</div>
        <div class="attribute-value">
          {{ player.stats.defense }}
        </div>
        <div class="attribute-label">防御</div>
      </div>
      <div
        class="attribute-card"
        @mouseenter="$emit('show-tooltip', '魔法攻击力：影响魔法技能伤害')"
        @mouseleave="$emit('hide-tooltip')"
      >
        <div class="attribute-icon">🔥</div>
        <div class="attribute-value">
          {{ player.stats.magicAttack }}
        </div>
        <div class="attribute-label">魔法</div>
      </div>
      <div
        class="attribute-card"
        @mouseenter="$emit('show-tooltip', '魔法防御力：减少受到的魔法伤害')"
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

<script setup lang="ts">
defineProps({
  player: {
    type: Object,
    required: true,
  },
});

defineEmits(["show-tooltip", "hide-tooltip"]);
</script>

<style lang="scss" scoped>
.attributes-section {
  margin-top: tokens.$space-4;
}

.section-title {
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
  margin-bottom: tokens.$space-3;
}

.attributes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: tokens.$space-3;
}

.attribute-card {
  @include utils.flex-col(tokens.$space-1, center, flex-start);

  background-color: tokens.$bg-light;
  border: 1px solid tokens.$border-light;
  border-radius: tokens.$radius-lg;
  padding: tokens.$space-3;
  transition: all tokens.$transition-fast;
  cursor: help;

  &:hover {
    background-color: tokens.$bg-lighter;
    transform: translateY(-2px);
    box-shadow: tokens.$shadow-md;
  }
}

.attribute-icon {
  font-size: tokens.$font-size-2xl;
  margin-bottom: tokens.$space-1;
}

.attribute-value {
  font-size: tokens.$font-size-xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
}

.attribute-label {
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  text-transform: capitalize;
}
</style>
