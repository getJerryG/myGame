<template>
  <div class="character-core-info">
    <!-- 角色名称和等�?-->
    <div class="core-info-header">
      <h2 class="character-name">{{ player.name }}</h2>
      <div class="level-badge">
        <span class="level-icon">🏆</span>
        <span class="level-text">{{ player.level }}</span>
      </div>
      <div class="gold-display">
        <span class="resource-icon gold-icon">�?/span>
        <span class="gold-text">{{ player.gold }}</span>
      </div>
    </div>

    <!-- 生命�?-->
    <div class="stat-container health-container">
      <div class="stat-header">
        <span class="stat-icon health-icon">❤️</span>
        <span class="stat-label">生命�?/span>
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

    <!-- 经验�?-->
    <div class="stat-container exp-container">
      <div class="stat-header">
        <span class="stat-icon exp-icon">�?/span>
        <span class="stat-label">经验�?/span>
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

<script setup lang=ts>
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

<style lang=scss scoped>
.character-core-info {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
}

.core-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.character-name {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.level-badge {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background-color: rgb(251 191 36 / 20%);
  color: var(--primary-gold);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
}

.gold-display {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: var(--font-semibold);
  color: var(--primary-gold);
}

.stat-container {
  margin-bottom: var(--space-3);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.stat-icon {
  font-size: var(--text-lg);
}

.stat-label {
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.stat-bar-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.stat-bar {
  flex: 1;
  height: 12px;
  background-color: rgb(255 255 255 / 10%);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.stat-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: var(--radius-full);
}

.stat-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(255 255 255 / 30%),
    transparent
  );
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
  background-color: #ef4444;
  background-image: linear-gradient(90deg, #dc2626, #ef4444);
}

.exp-fill {
  background-color: #3b82f6;
  background-image: linear-gradient(90deg, #2563eb, #3b82f6);
}

.stat-text {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  min-width: 80px;
  text-align: right;
}
</style>
