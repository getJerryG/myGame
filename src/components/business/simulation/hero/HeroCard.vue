<template>
  <div
    class="hero-card"
    :class="{
      selected: isSelected,
      [hero.category]: true,
      [`strength-${hero.strength}`]: true,
    }"
    @click="$emit('select', hero)"
  >
    <div class="hero-card-header">
      <div class="hero-name-rank">
        <h4 class="hero-name">{{ hero.name }}</h4>
        <div class="hero-rank" :class="`rank-${hero.strength}`">
          {{ hero.strength }}
        </div>
      </div>
      <div class="hero-category-badge" :class="hero.category">
        {{ hero.category }}
      </div>
    </div>

    <div class="hero-card-body">
      <div class="hero-avatar-placeholder">
        <span class="hero-avatar-icon">👤</span>
      </div>

      <div class="hero-stats-overview">
        <div class="stat-item">
          <span class="stat-label">胜率</span>
          <span class="stat-value">{{ hero.winRate }}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">出场率</span>
          <span class="stat-value">{{ hero.pickRate }}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Ban 率</span>
          <span class="stat-value">{{ hero.banRate }}%</span>
        </div>
      </div>
    </div>

    <div class="hero-card-actions">
      <button
        class="action-btn view-btn"
        @click.stop="$emit('view-details', hero)"
      >
        详情
      </button>
      <button
        class="action-btn add-btn"
        @click.stop="$emit('add-to-team', hero)"
      >
        加入队伍
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Hero {
  id: string;
  name: string;
  category: string;
  strength: number;
  winRate: number;
  pickRate: number;
  banRate: number;
}

const props = defineProps<{
  hero: Hero;
  isSelected?: boolean;
}>();

const emit = defineEmits<{
  select: [hero: Hero];
  'view-details': [hero: Hero];
  'add-to-team': [hero: Hero];
}>();
</script>

<style lang="scss" scoped>
.hero-card {
  background: tokens.$bg-light;
  border: 2px solid tokens.$border-medium;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-md;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  margin-bottom: tokens.$spacing-md;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
    border-color: tokens.$primary-blue;
  }

  &.selected {
    border-color: tokens.$primary-gold;
    background: rgb(255 193 7 / 10%);
    box-shadow: 0 4px 16px rgb(255 193 7 / 20%);
  }
}

.hero-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: tokens.$spacing-md;

  .hero-name-rank {
    display: flex;
    align-items: center;
    gap: tokens.$spacing-sm;

    .hero-name {
      margin: 0;
      font-size: tokens.$font-size-base;
      font-weight: tokens.$font-weight-bold;
      color: tokens.$text-primary;
    }

    .hero-rank {
      padding: tokens.$spacing-xs tokens.$spacing-sm;
      background: tokens.$bg-secondary;
      border-radius: tokens.$radius-sm;
      font-size: tokens.$font-size-xs;
      font-weight: tokens.$font-weight-bold;

      &.rank-S {
        background: tokens.$error;
        color: #fff;
      }

      &.rank-A {
        background: tokens.$primary-gold;
        color: #fff;
      }

      &.rank-B {
        background: tokens.$info;
        color: #fff;
      }

      &.rank-C {
        background: tokens.$text-secondary;
        color: #fff;
      }
    }
  }

  .hero-category-badge {
    padding: tokens.$spacing-xs tokens.$spacing-sm;
    background: tokens.$bg-secondary;
    border-radius: tokens.$radius-sm;
    font-size: tokens.$font-size-xs;
    font-weight: tokens.$font-weight-medium;

    &.assassin {
      background: tokens.$error;
      color: #fff;
    }

    &.marksman {
      background: tokens.$success;
      color: #fff;
    }

    &.mage {
      background: tokens.$primary-blue;
      color: #fff;
    }

    &.tank {
      background: tokens.$warning;
      color: #fff;
    }
  }
}

.hero-card-body {
  margin-bottom: tokens.$spacing-md;

  .hero-avatar-placeholder {
    width: 60px;
    height: 60px;
    background: tokens.$bg-secondary;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto tokens.$spacing-md;

    .hero-avatar-icon {
      font-size: 32px;
    }
  }

  .hero-stats-overview {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: tokens.$spacing-xs;

    .stat-item {
      text-align: center;

      .stat-label {
        display: block;
        font-size: tokens.$font-size-xs;
        color: tokens.$text-secondary;
        margin-bottom: tokens.$spacing-xs;
      }

      .stat-value {
        display: block;
        font-size: tokens.$font-size-sm;
        font-weight: tokens.$font-weight-bold;
        color: tokens.$text-primary;
      }
    }
  }
}

.hero-card-actions {
  display: flex;
  gap: tokens.$spacing-xs;

  .action-btn {
    flex: 1;
    padding: tokens.$spacing-xs tokens.$spacing-sm;
    border: none;
    border-radius: tokens.$radius-sm;
    font-size: tokens.$font-size-xs;
    font-weight: tokens.$font-weight-bold;
    cursor: pointer;
    transition: all tokens.$transition-fast;

    &.view-btn {
      background: tokens.$primary-blue;
      color: #fff;

      &:hover {
        background: color.adjust(tokens.$primary-blue, $lightness: -10%);
      }
    }

    &.add-btn {
      background: tokens.$success;
      color: #fff;

      &:hover {
        background: color.adjust(tokens.$success, $lightness: -10%);
      }
    }
  }
}
</style>
