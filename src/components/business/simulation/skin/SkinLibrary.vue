<template>
  <div class="skin-library">
    <!-- 品质筛选标签 -->
    <div class="quality-tabs">
      <button
        v-for="quality in qualities"
        :key="quality.value"
        class="quality-tab"
        :class="{ active: selectedQuality === quality.value }"
        @click="selectQuality(quality.value)"
      >
        <span class="tab-icon">{{ quality.icon }}</span>
        <span class="tab-label">{{ quality.label }}</span>
        <span class="tab-count">({{ getSkinCountByQuality(quality.value) }})</span>
      </button>
    </div>

    <!-- 皮肤列表 -->
    <div class="skin-list">
      <div
        v-for="skin in filteredSkins"
        :key="skin.id"
        class="skin-item"
        :class="{ active: selectedSkinId === skin.id }"
        @click="selectSkin(skin)"
      >
        <div class="skin-preview">
          <span class="skin-avatar">{{ skin.avatar }}</span>
          <div
            class="skin-quality-badge"
            :class="skin.quality"
          >
            {{ getQualityLabel(skin.quality) }}
          </div>
        </div>
        <div class="skin-info">
          <div class="skin-name">{{ skin.name }}</div>
          <div class="skin-hero">{{ skin.heroName }}</div>
          <div class="skin-stats">
            <span class="stat-item">
              <span class="stat-label">预计销量</span>
              <span class="stat-value">{{ skin.expected.sales }}万</span>
            </span>
            <span class="stat-item">
              <span class="stat-label">满意度</span>
              <span class="stat-value">{{ skin.expected.satisfaction }}%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  skins: {
    type: Array,
    default: () => [],
  },
  qualities: {
    type: Array,
    default: () => [],
  },
  selectedSkinId: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(['select-skin', 'quality-change']);

const selectedQuality = computed({
  get: () => props.qualities.find((q) => q.value === 'all')?.value || 'all',
  set: (value) => emit('quality-change', value),
});

// 筛选后的皮肤列表
const filteredSkins = computed(() => {
  if (selectedQuality.value === 'all') {
    return props.skins;
  }
  return props.skins.filter((skin) => skin.quality === selectedQuality.value);
});

// 选择品质
const selectQuality = (quality) => {
  emit('quality-change', quality);
};

// 选择皮肤
const selectSkin = (skin) => {
  emit('select-skin', skin);
};

// 获取品质标签
const getQualityLabel = (quality) => {
  const labels = {
    brave: '勇者',
    epic: '史诗',
    legend: '传说',
    limited: '限定',
  };
  return labels[quality] || quality;
};

// 根据品质获取皮肤数量
const getSkinCountByQuality = (quality) => {
  if (quality === 'all') {
    return props.skins.length;
  }
  return props.skins.filter((skin) => skin.quality === quality).length;
};
</script>

<style lang="scss" scoped>

/* 品质筛选标签 */
.quality-tabs {
  @include utils.flex-row(tokens.$spacing-sm, center);
  margin-bottom: tokens.$spacing-lg;
  overflow-x: auto;
  padding-bottom: tokens.$spacing-sm;
}

.quality-tab {
  @include utils.flex-row(tokens.$spacing-sm, center);
  padding: tokens.$spacing-sm tokens.$spacing-md;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  border: 1px solid transparent;
  white-space: nowrap;

  &:hover {
    background-color: tokens.$bg-lighter;
    transform: translateY(-2px);
  }

  &.active {
    background-color: rgb(251 191 36 / 20%);
    border-color: tokens.$primary-gold;
    box-shadow: tokens.$shadow-gold;
  }
}

.tab-icon {
  font-size: tokens.$font-size-base;
}

.tab-label {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-secondary;
}

.tab-count {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-muted;
}

/* 皮肤列表 */
.skin-list {
  flex: 1;
  overflow-y: auto;
  @include utils.flex-col(tokens.$spacing-md, stretch);
  padding-right: tokens.$spacing-md;
}

.skin-item {
  @include utils.flex-row(tokens.$spacing-md, center);
  padding: tokens.$spacing-md;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  border: 1px solid transparent;

  &:hover {
    background-color: tokens.$bg-lighter;
    transform: translateX(5px);
    border-color: tokens.$border-light;
  }

  &.active {
    background-color: rgb(251 191 36 / 20%);
    border-color: tokens.$primary-gold;
    box-shadow: tokens.$shadow-gold;
  }
}

.skin-preview {
  position: relative;
  flex-shrink: 0;
}

.skin-avatar {
  font-size: tokens.$font-size-3xl;
  display: block;
}

.skin-quality-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  border-radius: tokens.$radius-full;
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-bold;
  color: white;
  min-width: 40px;
  text-align: center;

  &.brave {
    background-color: tokens.$success;
  }

  &.epic {
    background-color: tokens.$lottery-purple;
  }

  &.legend {
    background-color: tokens.$warning;
  }

  &.limited {
    background-color: tokens.$error;
  }
}

.skin-info {
  flex: 1;
  @include utils.flex-col(tokens.$spacing-xs, stretch);
}

.skin-name {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
}

.skin-hero {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-secondary;
}

.skin-stats {
  @include utils.flex-row(tokens.$spacing-md, center);
  margin-top: tokens.$spacing-xs;
}

.stat-item {
  @include utils.stat-item;
}

.stat-label {
  @include utils.stat-label;
}

.stat-value {
  @include utils.stat-value;
}
</style>
