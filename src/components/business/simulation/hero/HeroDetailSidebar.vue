<template>
  <div class="hero-detail-sidebar">
    <div class="sidebar-header">
      <h4>英雄详情</h4>
      <button class="close-detail-btn" @click="$emit('close')">×</button>
    </div>
    <div class="sidebar-content">
      <!-- 英雄基本信息 -->
      <div class="hero-basic-info">
        <div class="hero-detail-avatar">
          <span class="hero-detail-icon">👤</span>
        </div>
        <div class="hero-detail-header">
          <h3>{{ hero.name }}</h3>
          <div class="hero-detail-categories">
            <span
              class="detail-category-badge"
              :class="hero.category"
            >
              {{ hero.category }}
            </span>
            <span
              class="detail-strength-badge"
              :class="`rank-${hero.strength}`"
            >
              {{ hero.strength }}
            </span>
          </div>
        </div>
      </div>

      <!-- 英雄详细属性 -->
      <div class="hero-detail-stats">
        <h5>详细属性</h5>
        <div class="stats-grid">
          <div class="stat-detail-item">
            <span class="stat-detail-label">胜率</span>
            <div class="stat-bar-container">
              <div
                class="stat-bar"
                :style="{ width: hero.winRate + '%' }"
              ></div>
              <span class="stat-detail-value"
                >{{ hero.winRate }}%</span
              >
            </div>
          </div>
          <div class="stat-detail-item">
            <span class="stat-detail-label">出场率</span>
            <div class="stat-bar-container">
              <div
                class="stat-bar pick-rate-bar"
                :style="{ width: hero.pickRate + '%' }"
              ></div>
              <span class="stat-detail-value"
                >{{ hero.pickRate }}%</span
              >
            </div>
          </div>
          <div class="stat-detail-item">
            <span class="stat-detail-label">Ban 率</span>
            <div class="stat-bar-container">
              <div
                class="stat-bar ban-rate-bar"
                :style="{ width: hero.banRate + '%' }"
              ></div>
              <span class="stat-detail-value"
                >{{ hero.banRate }}%</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 英雄技能概览 -->
      <div class="hero-skills-overview">
        <h5>技能概览</h5>
        <div class="skills-list">
          <div
            v-for="skill in hero.skills"
            :key="skill.id"
            class="skill-item"
          >
            <div class="skill-icon">{{ skill.icon }}</div>
            <div class="skill-info">
              <div class="skill-name">{{ skill.name }}</div>
              <div class="skill-desc">{{ skill.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="sidebar-actions">
        <button
          class="action-btn primary-btn"
          @click="$emit('add-to-team', hero)"
        >
          加入队伍
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Hero } from './HeroCard.vue';

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface HeroWithSkills extends Hero {
  skills: Skill[];
}

defineProps<{
  hero: HeroWithSkills;
}>();

const emit = defineEmits<{
  close: [];
  'add-to-team': [hero: HeroWithSkills];
}>();
</script>

<style lang="scss" scoped>
.hero-detail-sidebar {
  width: 400px;
  background: tokens.$bg-light;
  border-left: 2px solid tokens.$border-medium;
  padding: tokens.$spacing-lg;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: tokens.$spacing-lg;
  padding-bottom: tokens.$spacing-md;
  border-bottom: 1px solid tokens.$border-medium;

  h4 {
    margin: 0;
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }

  .close-detail-btn {
    width: 32px;
    height: 32px;
    background: tokens.$bg-secondary;
    border: none;
    border-radius: 50%;
    font-size: tokens.$font-size-lg;
    color: tokens.$text-primary;
    cursor: pointer;
    transition: all tokens.$transition-fast;

    &:hover {
      background: tokens.$error;
      color: #fff;
    }
  }
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-lg;
}

.hero-basic-info {
  text-align: center;

  .hero-detail-avatar {
    width: 80px;
    height: 80px;
    background: tokens.$bg-secondary;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto tokens.$spacing-md;

    .hero-detail-icon {
      font-size: 40px;
    }
  }

  .hero-detail-header {
    h3 {
      margin: 0 0 tokens.$spacing-sm 0;
      font-size: tokens.$font-size-xl;
      font-weight: tokens.$font-weight-bold;
      color: tokens.$text-primary;
    }

    .hero-detail-categories {
      display: flex;
      justify-content: center;
      gap: tokens.$spacing-sm;

      .detail-category-badge,
      .detail-strength-badge {
        padding: tokens.$spacing-xs tokens.$spacing-sm;
        border-radius: tokens.$radius-sm;
        font-size: tokens.$font-size-xs;
        font-weight: tokens.$font-weight-bold;
      }

      .detail-category-badge {
        background: tokens.$bg-secondary;

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

      .detail-strength-badge {
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
  }
}

.hero-detail-stats {
  h5 {
    margin: 0 0 tokens.$spacing-md 0;
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }

  .stats-grid {
    display: flex;
    flex-direction: column;
    gap: tokens.$spacing-md;
  }

  .stat-detail-item {
    .stat-detail-label {
      display: block;
      font-size: tokens.$font-size-sm;
      font-weight: tokens.$font-weight-medium;
      color: tokens.$text-primary;
      margin-bottom: tokens.$spacing-xs;
    }

    .stat-bar-container {
      position: relative;
      height: 20px;
      background: tokens.$bg-secondary;
      border-radius: tokens.$radius-sm;
      overflow: hidden;

      .stat-bar {
        height: 100%;
        background: linear-gradient(90deg, tokens.$primary-gold 0%, color.adjust(tokens.$primary-gold, $lightness: -20%) 100%);
        transition: width tokens.$transition-fast;

        &.pick-rate-bar {
          background: linear-gradient(90deg, tokens.$primary-blue 0%, color.adjust(tokens.$primary-blue, $lightness: -20%) 100%);
        }

        &.ban-rate-bar {
          background: linear-gradient(90deg, tokens.$error 0%, color.adjust(tokens.$error, $lightness: -20%) 100%);
        }
      }

      .stat-detail-value {
        position: absolute;
        top: 50%;
        right: tokens.$spacing-xs;
        transform: translateY(-50%);
        font-size: tokens.$font-size-xs;
        font-weight: tokens.$font-weight-bold;
        color: tokens.$text-primary;
      }
    }
  }
}

.hero-skills-overview {
  h5 {
    margin: 0 0 tokens.$spacing-md 0;
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
  }

  .skills-list {
    display: flex;
    flex-direction: column;
    gap: tokens.$spacing-md;

    .skill-item {
      display: flex;
      gap: tokens.$spacing-md;
      padding: tokens.$spacing-md;
      background: tokens.$bg-secondary;
      border-radius: tokens.$radius-md;

      .skill-icon {
        width: 40px;
        height: 40px;
        background: tokens.$bg-light;
        border-radius: tokens.$radius-sm;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        flex-shrink: 0;
      }

      .skill-info {
        flex: 1;

        .skill-name {
          font-size: tokens.$font-size-sm;
          font-weight: tokens.$font-weight-bold;
          color: tokens.$text-primary;
          margin-bottom: tokens.$spacing-xs;
        }

        .skill-desc {
          font-size: tokens.$font-size-xs;
          color: tokens.$text-secondary;
          line-height: 1.4;
        }
      }
    }
  }
}

.sidebar-actions {
  .action-btn {
    width: 100%;
    padding: tokens.$spacing-md;
    background: linear-gradient(135deg, tokens.$primary-gold 0%, color.adjust(tokens.$primary-gold, $lightness: -10%) 100%);
    border: none;
    border-radius: tokens.$radius-md;
    color: #fff;
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-bold;
    cursor: pointer;
    transition: all tokens.$transition-fast;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgb(255 193 7 / 40%);
    }

    &:active {
      transform: translateY(0);
    }
  }
}
</style>
