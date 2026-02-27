<template>
  <div v-if="playerStore.player" class="character-core-info">
    <!-- 角色名称和等�?-->
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

    <!-- 属性�?-->
    <div class="attributes-section">
      <h3 class="section-title">能力属�?/h3>
      <div class="attributes-grid">
        <div
          class="attribute-card"
          @mouseenter="showTooltip('物理攻击力：影响普通攻击和物理技能伤�?)"
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
          @mouseenter="showTooltip('防御力：减少受到的物理伤�?)""
          @mouseleave="hideTooltip"
        >
          <div class="attribute-icon">🛡�?/div>
          <div class="attribute-value">
            {{ playerStore.player.stats.defense }}
          </div>
          <div class="attribute-label">防御</div>
        </div>
        <div
          class="attribute-card"
          @mouseenter="showTooltip('魔法攻击力：影响魔法技能伤�?)""
          @mouseleave="hideTooltip"
        >
          <div class="attribute-icon">�?/div>
          <div class="attribute-value">
            {{ playerStore.player.stats.magicAttack }}
          </div>
          <div class="attribute-label">魔法</div>
        </div>
        <div
          class="attribute-card"
          @mouseenter="showTooltip('魔法防御力：减少受到的魔法伤�?)""
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

    <!-- 悬浮提示�?-->
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
import { ref } from 'vue';
import { usePlayerStore } from '../stores/playerStore';

const playerStore = usePlayerStore();

// 悬浮提示
const tooltipVisible = ref(false);
const tooltipText = ref('');
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

<style lang=scss scoped>
/* 核心信息区域 */
.character-core-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 核心信息头部 */
.core-info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
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
  font-size: 28px;
  font-weight: 900;
  color: white;
  text-shadow: 2px 2px 4px rgb(0 0 0 / 30%);
  flex: 1;
  text-align: center;
}

/* 等级徽章 */
.level-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgb(255 255 255 / 20%);
  backdrop-filter: blur(10px);
  padding: 10px 15px;
  border-radius: 25px;
  border: 2px solid rgb(255 255 255 / 30%);
  box-shadow: inset 0 0 20px rgb(255 255 255 / 20%);
}

.level-icon {
  font-size: 20px;
  animation: pulse 2s ease-in-out infinite;
}

.level-text {
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 10px rgb(255 255 255 / 80%);
}

/* 金币显示 */
.gold-display {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #f6e05e 0%, #d69e2e 100%);
  padding: 12px 18px;
  border-radius: 25px;
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
  font-size: 20px;
  transform: rotate(0deg);
  transition: transform 0.3s ease;
}

.gold-display:hover .gold-icon {
  transform: rotate(360deg);
}

.gold-text {
  font-size: 18px;
  font-weight: bold;
  color: #2d3748;
  text-shadow: 1px 1px 2px rgb(255 255 255 / 80%);
}

/* 状态容�? */
.stat-container {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 20px rgb(0 0 0 / 10%);
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.stat-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgb(0 0 0 / 15%);
  border-color: #667eea;
}

/* 状态头�? */
.stat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.stat-icon {
  font-size: 24px;
}

.health-icon {
  color: #ef4444;
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
  color: #f59e0b;
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
  font-size: 18px;
  font-weight: bold;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 状态条包装 */
.stat-bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 状态条 */
.stat-bar {
  height: 25px;
  background: #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  border: 2px solid #e2e8f0;
  box-shadow: inset 0 2px 5px rgb(0 0 0 / 10%);
}

/* 状态填�? */
.stat-fill {
  height: 100%;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 10px;
  position: relative;
  z-index: 1;
}

.health-fill {
  background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
}

.exp-fill {
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
}

/* 状态发光效�? */
.stat-glow {
  position: absolute;
  inset: 0;
  opacity: 0.6;
  filter: blur(8px);
  z-index: 0;
}

.health-glow {
  background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
}

.exp-glow {
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
}

/* 状态文�? */
.stat-text {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: #475569;
  text-shadow: 0 1px 2px rgb(255 255 255 / 80%);
}

/* 属性区�? */
.attributes-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgb(0 0 0 / 10%);
  border: 2px solid #e2e8f0;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #475569;
  margin-bottom: 20px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 属性网�? */
.attributes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

/* 属性卡�? */
.attribute-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 15px;
  border: 2px solid #cbd5e1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: help;
  position: relative;
  overflow: hidden;
}

.attribute-card::before {
  content: '';
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

.attribute-card:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 15px 35px rgb(0 0 0 / 15%);
  border-color: #667eea;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
}

.attribute-card:hover::before {
  left: 100%;
}

.attribute-icon {
  font-size: 40px;
  transition: transform 0.3s ease;
}

.attribute-card:hover .attribute-icon {
  transform: scale(1.2) rotate(5deg);
}

.attribute-value {
  font-size: 24px;
  font-weight: bold;
  color: #475569;
  text-shadow: 1px 1px 2px rgb(255 255 255 / 80%);
}

.attribute-label {
  font-size: 14px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

/* 悬浮提示 */
.tooltip {
  position: absolute;
  background: rgb(0 0 0 / 90%);
  color: white;
  padding: 15px 20px;
  border-radius: 12px;
  font-size: 14px;
  z-index: 1000;
  pointer-events: none;
  max-width: 250px;
  box-shadow: 0 5px 20px rgb(0 0 0 / 30%);
  animation: tooltipFadeIn 0.3s ease-out;
  border: 2px solid #667eea;
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

/* 无玩家状�? */
.no-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 50px;
  text-align: center;
  color: #94a3b8;
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
