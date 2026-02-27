<template>
  <div class="skin-library">
    <!-- 品质筛选标�?-->
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
        <span class="tab-count"
          >({{ getSkinCountByQuality(quality.value) }})</span
        >
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
          <div class="skin-quality-badge" :class="skin.quality">
            {{ getQualityLabel(skin.quality) }}
          </div>
        </div>
        <div class="skin-info">
          <div class="skin-name">{{ skin.name }}</div>
          <div class="skin-hero">{{ skin.heroName }}</div>
          <div class="skin-stats">
            <span class="stat-item">
              <span class="stat-label">预计销�?/span>
              <span class="stat-value">{{ skin.expected.sales }}�?/span>
            </span>
            <span class="stat-item">
              <span class="stat-label">满意�?/span>
              <span class="stat-value">{{ skin.expected.satisfaction }}%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang=ts>
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

// 筛选后的皮肤列�?const filteredSkins = computed(() => {
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
    brave: '勇�?,
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

<style lang=scss scoped>
/* 品质筛选标�? */
.quality-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.quality-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
  white-space: nowrap;
}

.quality-tab:hover {
  background-color: rgb(255 255 255 / 10%);
  transform: translateY(-2px);
}

.quality-tab.active {
  background-color: rgb(251 191 36 / 20%);
  border-color: var(--primary-gold);
  box-shadow: 0 2px 8px rgb(251 191 36 / 30%);
}

.tab-icon {
  font-size: 16px;
}

.tab-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.tab-count {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* 皮肤列表 */
.skin-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 10px;
}

.skin-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: rgb(255 255 255 / 5%);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.skin-item:hover {
  background-color: rgb(255 255 255 / 10%);
  transform: translateX(5px);
  border-color: var(--border-light);
}

.skin-item.active {
  background-color: rgb(251 191 36 / 20%);
  border-color: var(--primary-gold);
  box-shadow: 0 2px 8px rgb(251 191 36 / 30%);
}

.skin-preview {
  position: relative;
  flex-shrink: 0;
}

.skin-avatar {
  font-size: 48px;
  display: block;
}

.skin-quality-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: white;
  min-width: 40px;
  text-align: center;
}

.skin-quality-badge.brave {
  background-color: #10b981;
}

.skin-quality-badge.epic {
  background-color: #8b5cf6;
}

.skin-quality-badge.legend {
  background-color: #f59e0b;
}

.skin-quality-badge.limited {
  background-color: #ef4444;
}

.skin-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skin-name {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.skin-hero {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.skin-stats {
  display: flex;
  gap: 15px;
  margin-top: 4px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.stat-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--primary-gold);
}
</style>




