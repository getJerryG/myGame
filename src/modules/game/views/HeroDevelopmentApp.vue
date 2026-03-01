<template>
  <div class="hero-development-app">
    <!-- 应用头部 -->
    <div class="app-header">
      <h2 class="app-title">英雄开发</h2>
      <button
        class="close-btn"
        @click="closeApp"
      >
        ×
      </button>
    </div>

    <!-- 应用内容 -->
    <div class="app-content">
      <!-- 英雄列表 -->
      <div class="hero-list-section">
        <h3 class="section-title">英雄列表</h3>
        <div class="hero-grid">
          <div
            v-for="hero in heroes"
            :key="hero.id"
            class="hero-card"
            :class="{ selected: selectedHero?.id === hero.id }"
            @click="selectHero(hero)"
          >
            <div class="hero-avatar">{{ hero.avatar }}</div>
            <div class="hero-info">
              <div class="hero-name">{{ hero.name }}</div>
              <div class="hero-level">Lv.{{ hero.level }}</div>
            </div>
            <div
              class="hero-rarity"
              :class="hero.rarity"
            >
              {{ getRarityText(hero.rarity) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 英雄详情 -->
      <div
        v-if="selectedHero"
        class="hero-detail-section"
      >
        <div class="detail-header">
          <div class="detail-avatar">{{ selectedHero.avatar }}</div>
          <div class="detail-info">
            <h3 class="detail-name">{{ selectedHero.name }}</h3>
            <div
              class="detail-rarity"
              :class="selectedHero.rarity"
            >
              {{ getRarityText(selectedHero.rarity) }}
            </div>
          </div>
        </div>

        <div class="detail-stats">
          <div class="stat-item">
            <span class="stat-label">等级</span>
            <span class="stat-value">{{ selectedHero.level }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">攻击力</span>
            <span class="stat-value">{{ selectedHero.attack }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">防御力</span>
            <span class="stat-value">{{ selectedHero.defense }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">生命值</span>
            <span class="stat-value">{{ selectedHero.hp }}</span>
          </div>
        </div>

        <div class="detail-actions">
          <button
            class="action-btn upgrade"
            @click="upgradeHero"
          >
            升级英雄
          </button>
          <button
            class="action-btn skill"
            @click="openSkillPanel"
          >
            技能管理
          </button>
        </div>
      </div>

      <div
        v-else
        class="no-selection"
      >
        <div class="no-selection-icon">👆</div>
        <p>请选择一位英雄查看详情</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 英雄数据
interface Hero {
  id: number;
  name: string;
  avatar: string;
  level: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  attack: number;
  defense: number;
  hp: number;
}

const heroes = ref<Hero[]>([
  { id: 1, name: '战士', avatar: '⚔️', level: 10, rarity: 'common', attack: 100, defense: 80, hp: 1000 },
  { id: 2, name: '法师', avatar: '🔮', level: 15, rarity: 'rare', attack: 150, defense: 50, hp: 800 },
  { id: 3, name: '刺客', avatar: '🗡️', level: 12, rarity: 'epic', attack: 180, defense: 60, hp: 900 },
  { id: 4, name: '坦克', avatar: '🛡️', level: 20, rarity: 'legendary', attack: 80, defense: 200, hp: 2000 },
  { id: 5, name: '射手', avatar: '🏹', level: 8, rarity: 'common', attack: 120, defense: 40, hp: 700 },
]);

// 选中的英雄
const selectedHero = ref<Hero | null>(null);

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

// 选择英雄
const selectHero = (hero: Hero) => {
  selectedHero.value = hero;
};

// 升级英雄
const upgradeHero = () => {
  if (selectedHero.value) {
    selectedHero.value.level++;
    selectedHero.value.attack += 10;
    selectedHero.value.defense += 5;
    selectedHero.value.hp += 100;
  }
};

// 打开技能面板
const openSkillPanel = () => {
  // TODO: 实现技能面板
  alert('技能面板功能开发中...');
};

// 关闭应用
const closeApp = () => {
  // TODO: 实现关闭应用逻辑
  window.history.back();
};
</script>

<style lang="scss" scoped>

.hero-development-app {
  @include utils.flex-col(tokens.$spacing-0, stretch, flex-start);

  height: 100%;
  background-color: tokens.$bg-lighter;
  border-radius: tokens.$radius-lg;
  overflow: hidden;
}

.app-header {
  @include utils.flex-between;

  padding: tokens.$spacing-md tokens.$spacing-lg;
  background: linear-gradient(135deg, tokens.$primary 0%, tokens.$primary-dark 100%);
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

.hero-list-section {
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

.hero-grid {
  @include utils.flex-col(tokens.$spacing-0, stretch, flex-start);

  overflow-y: auto;
  flex: 1;
}

.hero-card {
  @include utils.flex-row(tokens.$spacing-md, center, flex-start);

  padding: tokens.$spacing-md;
  cursor: pointer;
  transition: all tokens.$transition-normal;
  border-bottom: 1px solid tokens.$border-light;

  &:hover {
    background-color: tokens.$bg-lighter;
  }

  &.selected {
    background-color: rgb(74 158 255 / 20%);
    border-left: 4px solid tokens.$primary;
  }

  .hero-avatar {
    font-size: tokens.$font-size-3xl;
  }

  .hero-info {
    @include utils.flex-col(tokens.$spacing-xs, flex-start, center);

    flex: 1;

    .hero-name {
      font-size: tokens.$font-size-base;
      font-weight: tokens.$font-weight-semibold;
      color: tokens.$text-primary;
    }

    .hero-level {
      font-size: tokens.$font-size-sm;
      color: tokens.$text-muted;
    }
  }

  .hero-rarity {
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

.hero-detail-section {
  flex: 1;

  @include utils.flex-col(tokens.$spacing-lg, stretch, flex-start);

  padding: tokens.$spacing-xl;
  overflow-y: auto;
}

.detail-header {
  @include utils.flex-row(tokens.$spacing-lg, center, flex-start);

  padding-bottom: tokens.$spacing-lg;
  border-bottom: 1px solid tokens.$border-light;

  .detail-avatar {
    font-size: 80px;
  }

  .detail-info {
    @include utils.flex-col(tokens.$spacing-sm, flex-start, center);

    .detail-name {
      margin: 0;
      font-size: tokens.$font-size-2xl;
      font-weight: tokens.$font-weight-bold;
      color: tokens.$text-primary;
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
  }
}

.detail-stats {
  @include utils.grid-layout(2, tokens.$spacing-md);

  .stat-item {
    @include utils.flex-between;

    padding: tokens.$spacing-md;
    background-color: tokens.$bg-light;
    border-radius: tokens.$radius-md;
    border: 1px solid tokens.$border-light;

    .stat-label {
      font-size: tokens.$font-size-base;
      color: tokens.$text-muted;
    }

    .stat-value {
      font-size: tokens.$font-size-lg;
      font-weight: tokens.$font-weight-bold;
      color: tokens.$text-primary;
    }
  }
}

.detail-actions {
  @include utils.flex-row(tokens.$spacing-md, center, center);

  margin-top: auto;

  .action-btn {
    padding: tokens.$spacing-md tokens.$spacing-xl;
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-semibold;
    border: none;
    border-radius: tokens.$radius-md;
    cursor: pointer;
    transition: all tokens.$transition-normal;
    flex: 1;

    &.upgrade {
      background: linear-gradient(135deg, tokens.$success 0%, #059669 100%);
      color: tokens.$text-primary;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgb(16 185 129 / 40%);
      }
    }

    &.skill {
      background: linear-gradient(135deg, tokens.$primary 0%, tokens.$primary-dark 100%);
      color: tokens.$text-primary;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgb(74 158 255 / 40%);
      }
    }
  }
}

.no-selection {
  flex: 1;

  @include utils.flex-col(tokens.$spacing-md, center, center);

  color: tokens.$text-muted;

  .no-selection-icon {
    font-size: 60px;
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

  .hero-list-section {
    width: 100%;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid tokens.$border-light;
  }

  .hero-grid {
    flex-flow: row wrap;
    overflow: auto hidden;
  }

  .hero-card {
    min-width: 150px;
    border-bottom: none;
    border-right: 1px solid tokens.$border-light;
  }

  .detail-stats {
    grid-template-columns: 1fr;
  }

  .detail-actions {
    flex-direction: column;

    .action-btn {
      width: 100%;
    }
  }
}
</style>
