<template>
  <div class="character-core-info">
    <!-- 角色名称和等级 -->
    <div class="core-info-header">
      <h2 class="character-name">{{ player.name }}</h2>
      <div class="level-badge">
        <span class="level-icon">🏆</span>
        <span class="level-text">{{ player.level }}</span>
      </div>
      <div class="gold-display">
        <span class="resource-icon gold-icon">💰</span>
        <span class="gold-text">{{ player.gold }}</span>
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
            :style="{ width: healthPercent + '%' }"
          ></div>
          <div class="stat-glow health-glow"></div>
        </div>
        <div class="stat-text health-text">
          {{ player.stats.hp }} /
          {{ player.stats.maxHp }}
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
            :style="{ width: expProgress + '%' }"
          ></div>
          <div class="stat-glow exp-glow"></div>
        </div>
        <div class="stat-text exp-text">
          {{ player.exp }} /
          {{ player.expToNextLevel }}
        </div>
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
  healthPercent: {
    type: Number,
    required: true,
  },
  expProgress: {
    type: Number,
    required: true,
  },
});
</script>

<style lang="scss" scoped>

.character-core-info {
  @include utils.panel-base;

  padding: tokens.$space-4;
}

.core-info-header {
  @include utils.flex-between;

  margin-bottom: tokens.$space-4;
}

.character-name {
  font-size: tokens.$font-size-2xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  margin: 0;
}

.level-badge {
  @include utils.flex-row(tokens.$space-2, center, flex-start);

  background-color: rgb(251 191 36 / 20%);
  color: tokens.$primary-gold;
  padding: tokens.$space-1 tokens.$space-3;
  border-radius: tokens.$radius-full;
  font-weight: tokens.$font-weight-bold;
}

.gold-display {
  @include utils.flex-row(tokens.$space-2, center, flex-start);

  font-weight: tokens.$font-weight-semibold;
  color: tokens.$primary-gold;
}

.stat-container {
  margin-bottom: tokens.$space-3;
}

.stat-header {
  @include utils.flex-row(tokens.$space-2, center, flex-start);

  margin-bottom: tokens.$space-2;
}

.stat-icon {
  font-size: tokens.$font-size-lg;
}

.stat-label {
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-secondary;
}

.stat-bar-wrapper {
  @include utils.flex-row(tokens.$space-3, center, flex-start);
}

.stat-bar {
  flex: 1;
  height: 12px;
  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-full;
  overflow: hidden;
  position: relative;
}

.stat-fill {
  height: 100%;
  transition: width tokens.$transition-normal;
  border-radius: tokens.$radius-full;
}

.stat-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 30%), transparent);
  animation: glow 2s infinite;
}

@keyframes glow {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.health-fill {
  background-color: tokens.$health-red;
  background-image: linear-gradient(90deg, tokens.$health-red-dark, tokens.$health-red);
}

.exp-fill {
  background-color: tokens.$exp-blue;
  background-image: linear-gradient(90deg, tokens.$exp-blue-dark, tokens.$exp-blue);
}

.stat-text {
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
  min-width: 80px;
  text-align: right;
}
</style>
