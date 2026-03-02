<template>
  <div v-if="playerStore.player" class="character-core-info">
    <!-- 角色名称和等级 -->
    <div class="core-info-header">
      <h2 class="character-name">{{ playerStore.player.name }}</h2>
      <div class="level-badge">
        <span class="level-icon">🏆</span>
        <span class="level-text">{{ playerStore.player.level }}</span>
      </div>
      <div class="gold-display">
        <span class="resource-icon gold-icon">💰</span>
        <span class="gold-text">{{ playerStore.player.gold }}</span>
      </div>
    </div>

    <!-- 生命值 -->
    <div class="stat-container health-container">
      <div class="stat-header">
        <span class="stat-icon health-icon">❤️</span>
        <span class="stat-label">生命值</span>
      </div>
      <div class="stat-bar-wrapper">
        <div class="stat-bar health-bar">
          <div
            class="stat-fill health-fill"
            :style="{ width: playerStore.currentHpPercent + '%' }"
          ></div>
          <div class="stat-glow health-glow"></div>
        </div>
        <div class="stat-text health-text">
          {{ playerStore.player.stats.hp }} /
          {{ playerStore.player.stats.maxHp }}
        </div>
      </div>
    </div>

    <!-- 经验值 -->
    <div class="stat-container exp-container">
      <div class="stat-header">
        <span class="stat-icon exp-icon">⭐</span>
        <span class="stat-label">经验值</span>
      </div>
      <div class="stat-bar-wrapper">
        <div class="stat-bar exp-bar">
          <div
            class="stat-fill exp-fill"
            :style="{ width: playerStore.expProgress + '%' }"
          ></div>
          <div class="stat-glow exp-glow"></div>
        </div>
        <div class="stat-text exp-text">
          {{ playerStore.player.exp }} /
          {{ playerStore.player.expToNextLevel }}
        </div>
      </div>
    </div>

    <!-- 属性值 -->
    <div class="attributes-section">
      <h3 class="section-title">能力属性</h3>
      <div class="attributes-grid">
        <div
          class="attribute-card"
          @mouseenter="showTooltip('物理攻击力：影响普通攻击和物理技能伤害')"
          @mouseleave="hideTooltip"
        >
          <div class="attribute-icon">⚔️</div>
          <div class="attribute-value">
            {{ playerStore.player.stats.attack }}
          </div>
          <div class="attribute-label">攻击</div>
        </div>
        <div
          class="attribute-card"
          @mouseenter="showTooltip('防御力：减少受到的物理伤害')"
          @mouseleave="hideTooltip"
        >
          <div class="attribute-icon">🛡️</div>
          <div class="attribute-value">
            {{ playerStore.player.stats.defense }}
          </div>
          <div class="attribute-label">防御</div>
        </div>
        <div
          class="attribute-card"
          @mouseenter="showTooltip('魔法攻击力：影响魔法技能伤害')"
          @mouseleave="hideTooltip"
        >
          <div class="attribute-icon">🔮</div>
          <div class="attribute-value">
            {{ playerStore.player.stats.magicAttack }}
          </div>
          <div class="attribute-label">魔法</div>
        </div>
        <div
          class="attribute-card"
          @mouseenter="showTooltip('魔法防御力：减少受到的魔法伤害')"
          @mouseleave="hideTooltip"
        >
          <div class="attribute-icon">🔮</div>
          <div class="attribute-value">
            {{ playerStore.player.stats.magicDefense }}
          </div>
          <div class="attribute-label">魔防</div>
        </div>
      </div>
    </div>

    <!-- 悬浮提示框 -->
    <div v-if="tooltipVisible" class="tooltip" :style="tooltipStyle">
      {{ tooltipText }}
      <div class="tooltip-arrow"></div>
    </div>
  </div>

  <div v-else class="no-player">
    <div class="no-player-icon">👤</div>
    <p>角色未初始化</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { usePlayerStore } from "../stores/playerStore";

const playerStore = usePlayerStore();

// 悬浮提示
const tooltipVisible = ref(false);
const tooltipText = ref("");
const tooltipStyle = ref({});

// 显示悬浮提示
function showTooltip(text: string): void {
  tooltipText.value = text;
  tooltipVisible.value = true;
}

// 隐藏悬浮提示
function hideTooltip(): void {
  tooltipVisible.value = false;
}
</script>

<style lang="scss" scoped>
/* 核心信息区域 */
.character-core-info {
  @include utils.flex-col(tokens.$spacing-lg);
}

/* 核心信息头部 */
.core-info-header {
  @include utils.flex-between;

  gap: tokens.$spacing-md;
  padding: tokens.$spacing-md;
  background: linear-gradient(
    135deg,
    tokens.$skill-magic-border 0%,
    tokens.$skill-magic-dark 100%
  );
  border-radius: tokens.$radius-xl;
  box-shadow: 0 10px 30px rgb(102 126 234 / 40%);
  animation: headerGlow 3s ease-in-out infinite alternate;
}

@keyframes headerGlow {
  from {
    box-shadow: 0 10px 30px rgb(102 126 234 / 40%);
  }

  to {
    box-shadow: 0 10px 40px rgb(102 126 234 / 60%);
  }
}

/* 角色名称 */
.character-name {
  margin: 0;
  font-size: tokens.$font-size-2xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  text-shadow: 2px 2px 4px rgb(0 0 0 / 30%);
  flex: 1;
  text-align: center;
}

/* 等级徽章 */
.level-badge {
  @include utils.flex-row(tokens.$spacing-xs, center, center);

  background: tokens.$bg-lighter;
  backdrop-filter: blur(10px);
  padding: tokens.$spacing-sm tokens.$spacing-md;
  border-radius: tokens.$radius-full;
  border: 2px solid rgb(255 255 255 / 30%);
  box-shadow: inset 0 0 20px rgb(255 255 255 / 20%);
}

.level-icon {
  font-size: tokens.$font-size-lg;
  animation: pulse 2s ease-in-out infinite;
}

.level-text {
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  text-shadow: 0 0 10px rgb(255 255 255 / 80%);
}

/* 金币显示 */
.gold-display {
  @include utils.flex-row(tokens.$spacing-xs, center, center);

  background: linear-gradient(135deg, #f6e05e 0%, #d69e2e 100%);
  padding: tokens.$spacing-sm tokens.$spacing-md;
  border-radius: tokens.$radius-full;
  box-shadow: 0 5px 15px rgb(246 224 94 / 40%);
  animation: goldGlow 2s ease-in-out infinite alternate;
}

@keyframes goldGlow {
  from {
    box-shadow: 0 5px 15px rgb(246 224 94 / 40%);
  }

  to {
    box-shadow: 0 5px 25px rgb(246 224 94 / 60%);
  }
}

.gold-icon {
  font-size: tokens.$font-size-lg;
  transform: rotate(0deg);
  transition: transform tokens.$transition-normal;
}

.gold-display {
  &:hover {
    .gold-icon {
      transform: rotate(360deg);
    }
  }
}

.gold-text {
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$gray-800;
  text-shadow: 1px 1px 2px rgb(255 255 255 / 80%);
}

/* 状态容器 */
.stat-container {
  background: tokens.$text-primary;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-md;
  box-shadow: tokens.$shadow-md;
  border: 2px solid tokens.$gray-200;
  transition: all tokens.$transition-normal;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgb(0 0 0 / 15%);
    border-color: tokens.$skill-magic-border;
  }
}

/* 状态头部 */
.stat-header {
  @include utils.flex-row(tokens.$spacing-sm, center, flex-start);

  margin-bottom: tokens.$spacing-sm;
}

.stat-icon {
  font-size: tokens.$font-size-xl;
}

.health-icon {
  color: tokens.$health-red;
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }
}

.exp-icon {
  color: tokens.$warning;
  animation: starSpin 3s linear infinite;
}

@keyframes starSpin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.stat-label {
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$gray-600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 状态条包装 */
.stat-bar-wrapper {
  @include utils.flex-col(tokens.$spacing-sm);
}

/* 状态条 */
.stat-bar {
  height: 25px;
  background: tokens.$gray-100;
  border-radius: tokens.$radius-md;
  overflow: hidden;
  position: relative;
  border: 2px solid tokens.$gray-200;
  box-shadow: inset 0 2px 5px rgb(0 0 0 / 10%);
}

/* 状态填充 */
.stat-fill {
  height: 100%;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: tokens.$radius-sm;
  position: relative;
  z-index: 1;
}

.health-fill {
  background: linear-gradient(90deg, tokens.$health-red 0%, #f87171 100%);
}

.exp-fill {
  background: linear-gradient(90deg, tokens.$warning 0%, #fbbf24 100%);
}

/* 状态发光效果 */
.stat-glow {
  position: absolute;
  inset: 0;
  opacity: 0.6;
  filter: blur(8px);
  z-index: 0;
}

.health-glow {
  background: linear-gradient(90deg, tokens.$health-red 0%, #f87171 100%);
}

.exp-glow {
  background: linear-gradient(90deg, tokens.$warning 0%, #fbbf24 100%);
}

/* 状态文本 */
.stat-text {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-bold;
  text-align: center;
  color: tokens.$gray-600;
  text-shadow: 0 1px 2px rgb(255 255 255 / 80%);
}

/* 属性区域 */
.attributes-section {
  background: tokens.$text-primary;
  border-radius: tokens.$radius-lg;
  padding: tokens.$spacing-lg;
  box-shadow: tokens.$shadow-md;
  border: 2px solid tokens.$gray-200;
}

.section-title {
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$gray-600;
  margin-bottom: tokens.$spacing-md;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: linear-gradient(
    135deg,
    tokens.$skill-magic-border 0%,
    tokens.$skill-magic-dark 100%
  );
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 属性网格 */
.attributes-grid {
  @include utils.grid-layout(2, tokens.$spacing-md);
}

/* 属性卡片 */
.attribute-card {
  @include utils.flex-col(tokens.$spacing-sm, center, center);

  padding: tokens.$spacing-md;
  background: linear-gradient(
    135deg,
    tokens.$gray-50 0%,
    tokens.$gray-200 100%
  );
  border-radius: tokens.$radius-lg;
  border: 2px solid tokens.$gray-300;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: help;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgb(255 255 255 / 40%),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 15px 35px rgb(0 0 0 / 15%);
    border-color: tokens.$skill-magic-border;
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);

    &::before {
      left: 100%;
    }
  }
}

.attribute-card {
  &:hover {
    .attribute-icon {
      transform: scale(1.2) rotate(5deg);
    }
  }
}

.attribute-icon {
  font-size: tokens.$font-size-4xl;
  transition: transform tokens.$transition-normal;
}

.attribute-value {
  font-size: tokens.$font-size-2xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$gray-600;
  text-shadow: 1px 1px 2px rgb(255 255 255 / 80%);
}

.attribute-label {
  font-size: tokens.$font-size-sm;
  color: tokens.$gray-500;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: tokens.$font-weight-bold;
}

/* 悬浮提示 */
.tooltip {
  position: absolute;
  background: rgb(0 0 0 / 90%);
  color: tokens.$text-primary;
  padding: tokens.$spacing-sm tokens.$spacing-md;
  border-radius: tokens.$radius-lg;
  font-size: tokens.$font-size-sm;
  z-index: tokens.$z-tooltip;
  pointer-events: none;
  max-width: 250px;
  box-shadow: tokens.$shadow-lg;
  animation: tooltipFadeIn 0.3s ease-out;
  border: 2px solid tokens.$skill-magic-border;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip-arrow {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid rgb(0 0 0 / 90%);
}

/* 无玩家状态 */
.no-player {
  @include utils.flex-col(tokens.$spacing-md, center, center);

  padding: tokens.$spacing-2xl;
  text-align: center;
  color: tokens.$gray-400;
}

.no-player-icon {
  font-size: 60px;
  opacity: 0.5;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}
</style>
