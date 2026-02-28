<template>
  <div class="skin-development-app">
    <!-- 应用头部 -->
    <div class="app-header">
      <h2 class="app-title">皮肤开发</h2>
      <button
        class="close-btn"
        @click="closeApp"
      >
        ×
      </button>
    </div>

    <!-- 应用内容 -->
    <div class="app-content">
      <!-- 皮肤列表 -->
      <div class="skin-list-section">
        <h3 class="section-title">皮肤列表</h3>
        <div class="skin-grid">
          <div
            v-for="skin in skins"
            :key="skin.id"
            class="skin-card"
            :class="{ selected: selectedSkin?.id === skin.id }"
            @click="selectSkin(skin)"
          >
            <div class="skin-preview">{{ skin.preview }}</div>
            <div class="skin-info">
              <div class="skin-name">{{ skin.name }}</div>
              <div class="skin-hero">{{ skin.heroName }}</div>
            </div>
            <div
              class="skin-rarity"
              :class="skin.rarity"
            >
              {{ getRarityText(skin.rarity) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 皮肤详情 -->
      <div
        v-if="selectedSkin"
        class="skin-detail-section"
      >
        <div class="detail-preview">{{ selectedSkin.preview }}</div>
        <div class="detail-info">
          <h3 class="detail-name">{{ selectedSkin.name }}</h3>
          <div class="detail-hero">所属英雄: {{ selectedSkin.heroName }}</div>
          <div
            class="detail-rarity"
            :class="selectedSkin.rarity"
          >
            {{ getRarityText(selectedSkin.rarity) }}
          </div>
          <div class="detail-description">{{ selectedSkin.description }}</div>
        </div>
        <div class="detail-actions">
          <button
            class="action-btn edit"
            @click="editSkin"
          >
            编辑皮肤
          </button>
          <button
            class="action-btn preview"
            @click="previewSkin"
          >
            预览效果
          </button>
        </div>
      </div>

      <div
        v-else
        class="no-selection"
      >
        <div class="no-selection-icon">🎨</div>
        <p>请选择一款皮肤查看详情</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 皮肤数据
interface Skin {
  id: number;
  name: string;
  heroName: string;
  preview: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
}

const skins = ref<Skin[]>([
  {
    id: 1,
    name: '经典皮肤',
    heroName: '战士',
    preview: '⚔️',
    rarity: 'common',
    description: '战士的默认外观，简洁而实用。',
  },
  {
    id: 2,
    name: '火焰法师',
    heroName: '法师',
    preview: '🔥',
    rarity: 'rare',
    description: '法师的火焰主题皮肤，燃烧吧！',
  },
  {
    id: 3,
    name: '暗影刺客',
    heroName: '刺客',
    preview: '🌑',
    rarity: 'epic',
    description: '刺客的暗影主题皮肤，潜行于黑暗之中。',
  },
  {
    id: 4,
    name: '黄金圣骑士',
    heroName: '坦克',
    preview: '👑',
    rarity: 'legendary',
    description: '坦克的黄金主题皮肤，闪耀着神圣的光芒。',
  },
  {
    id: 5,
    name: '森林射手',
    heroName: '射手',
    preview: '🌲',
    rarity: 'rare',
    description: '射手的森林主题皮肤，与自然融为一体。',
  },
]);

// 选中的皮肤
const selectedSkin = ref<Skin | null>(null);

// 获取稀有度文本
const getRarityText = (rarity: string): string => {
  const rarityMap: Record<string, string> = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说',
  };
  return rarityMap[rarity] || rarity;
};

// 选择皮肤
const selectSkin = (skin: Skin) => {
  selectedSkin.value = skin;
};

// 编辑皮肤
const editSkin = () => {
  alert('编辑皮肤功能开发中...');
};

// 预览皮肤
const previewSkin = () => {
  alert('预览皮肤功能开发中...');
};

// 关闭应用
const closeApp = () => {
  window.history.back();
};
</script>

<style lang="scss" scoped>

.skin-development-app {
  @include utils.flex-col(tokens.$spacing-0, stretch, flex-start);
  height: 100%;
  background-color: tokens.$bg-lighter;
  border-radius: tokens.$radius-lg;
  overflow: hidden;
}

.app-header {
  @include utils.flex-between;
  padding: tokens.$spacing-md tokens.$spacing-lg;
  background: linear-gradient(135deg, tokens.$lottery-purple 0%, #7c3aed 100%);
  color: tokens.$text-primary;

  .app-title {
    margin: 0;
    font-size: tokens.$font-size-xl;
    font-weight: tokens.$font-weight-bold;
  }

  .close-btn {
    background: none;
    border: none;
    color: tokens.$text-primary;
    font-size: tokens.$font-size-2xl;
    cursor: pointer;
    width: 32px;
    height: 32px;
    @include utils.flex-center;
    border-radius: 50%;
    transition: all tokens.$transition-normal;

    &:hover {
      background-color: rgb(255 255 255 / 20%);
    }
  }
}

.app-content {
  @include utils.flex-row(tokens.$spacing-0, stretch, flex-start);
  flex: 1;
  overflow: hidden;
}

.skin-list-section {
  width: 300px;
  @include utils.flex-col(tokens.$spacing-0, stretch, flex-start);
  border-right: 1px solid tokens.$border-light;
  background-color: tokens.$bg-light;

  .section-title {
    margin: 0;
    padding: tokens.$spacing-md;
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-semibold;
    color: tokens.$text-primary;
    background-color: tokens.$bg-lighter;
    border-bottom: 1px solid tokens.$border-light;
  }
}

.skin-grid {
  @include utils.flex-col(tokens.$spacing-0, stretch, flex-start);
  overflow-y: auto;
  flex: 1;
}

.skin-card {
  @include utils.flex-row(tokens.$spacing-md, center, flex-start);
  padding: tokens.$spacing-md;
  cursor: pointer;
  transition: all tokens.$transition-normal;
  border-bottom: 1px solid tokens.$border-light;

  &:hover {
    background-color: tokens.$bg-lighter;
  }

  &.selected {
    background-color: rgb(139 92 246 / 20%);
    border-left: 4px solid tokens.$lottery-purple;
  }

  .skin-preview {
    font-size: tokens.$font-size-3xl;
  }

  .skin-info {
    @include utils.flex-col(tokens.$spacing-xs, flex-start, center);
    flex: 1;

    .skin-name {
      font-size: tokens.$font-size-base;
      font-weight: tokens.$font-weight-semibold;
      color: tokens.$text-primary;
    }

    .skin-hero {
      font-size: tokens.$font-size-sm;
      color: tokens.$text-muted;
    }
  }

  .skin-rarity {
    padding: tokens.$spacing-xs tokens.$spacing-sm;
    border-radius: tokens.$radius-sm;
    font-size: tokens.$font-size-xs;
    font-weight: tokens.$font-weight-bold;

    &.common {
      background-color: tokens.$gray-500;
      color: tokens.$text-primary;
    }

    &.rare {
      background-color: tokens.$primary;
      color: tokens.$text-primary;
    }

    &.epic {
      background-color: tokens.$lottery-purple;
      color: tokens.$text-primary;
    }

    &.legendary {
      background: linear-gradient(135deg, tokens.$primary-gold 0%, #f59e0b 100%);
      color: tokens.$gray-900;
    }
  }
}

.skin-detail-section {
  flex: 1;
  @include utils.flex-col(tokens.$spacing-lg, center, center);
  padding: tokens.$spacing-xl;
  overflow-y: auto;

  .detail-preview {
    font-size: 120px;
    margin-bottom: tokens.$spacing-lg;
    animation: float 3s ease-in-out infinite;
  }

  .detail-info {
    @include utils.flex-col(tokens.$spacing-md, center, center);
    text-align: center;

    .detail-name {
      margin: 0;
      font-size: tokens.$font-size-2xl;
      font-weight: tokens.$font-weight-bold;
      color: tokens.$text-primary;
    }

    .detail-hero {
      font-size: tokens.$font-size-base;
      color: tokens.$text-muted;
    }

    .detail-rarity {
      padding: tokens.$spacing-xs tokens.$spacing-md;
      border-radius: tokens.$radius-full;
      font-size: tokens.$font-size-sm;
      font-weight: tokens.$font-weight-bold;

      &.common {
        background-color: tokens.$gray-500;
        color: tokens.$text-primary;
      }

      &.rare {
        background-color: tokens.$primary;
        color: tokens.$text-primary;
      }

      &.epic {
        background-color: tokens.$lottery-purple;
        color: tokens.$text-primary;
      }

      &.legendary {
        background: linear-gradient(135deg, tokens.$primary-gold 0%, #f59e0b 100%);
        color: tokens.$gray-900;
      }
    }

    .detail-description {
      font-size: tokens.$font-size-base;
      color: tokens.$text-primary;
      line-height: tokens.$line-height-normal;
      max-width: 400px;
    }
  }

  .detail-actions {
    @include utils.flex-row(tokens.$spacing-md, center, center);
    margin-top: tokens.$spacing-xl;

    .action-btn {
      padding: tokens.$spacing-md tokens.$spacing-xl;
      font-size: tokens.$font-size-base;
      font-weight: tokens.$font-weight-semibold;
      border: none;
      border-radius: tokens.$radius-md;
      cursor: pointer;
      transition: all tokens.$transition-normal;
      min-width: 120px;

      &.edit {
        background: linear-gradient(135deg, tokens.$lottery-purple 0%, #7c3aed 100%);
        color: tokens.$text-primary;
        box-shadow: 0 4px 15px rgb(139 92 246 / 40%);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgb(139 92 246 / 60%);
        }
      }

      &.preview {
        background-color: tokens.$bg-light;
        color: tokens.$text-primary;
        border: 2px solid tokens.$border-light;

        &:hover {
          background-color: tokens.$bg-lighter;
          border-color: tokens.$lottery-purple;
        }
      }
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

.no-selection {
  flex: 1;
  @include utils.flex-col(tokens.$spacing-md, center, center);
  color: tokens.$text-muted;

  .no-selection-icon {
    font-size: 80px;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: tokens.$font-size-lg;
  }
}

/* 响应式设计 */
@media (width <= 768px) {
  .app-content {
    flex-direction: column;
  }

  .skin-list-section {
    width: 100%;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid tokens.$border-light;
  }

  .skin-grid {
    flex-direction: row;
    flex-wrap: wrap;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .skin-card {
    min-width: 150px;
    border-bottom: none;
    border-right: 1px solid tokens.$border-light;
  }

  .detail-preview {
    font-size: 80px !important;
  }

  .detail-actions {
    flex-direction: column;
    width: 100%;

    .action-btn {
      width: 100%;
    }
  }
}
</style>
