<template>
  <div class="skill-panel-container">
    <h2 class="text-xl font-bold mb-4">技能面�?/h2>

    <div
      v-if="playerStore.player"
      class="skills-list"
    >
      <div
        v-for="(skill, index) in playerStore.player.skills"
        :key="skill.id"
        class="skill-item"
        :class="`skill-${skill.type}`"
      >
        <div class="skill-header">
          <span class="skill-name">{{ skill.name }}</span>
          <span class="skill-type">{{ skill.type === 'physical' ? '物理' : '魔法' }}</span>
          <span class="skill-key">
            {{ getSkillKey(index + 1) }}
          </span>
        </div>
        <div class="skill-details">
          <div class="skill-stat">
            <span class="stat-label">伤害:</span>
            <span class="stat-value">{{ skill.damage }}</span>
          </div>
          <div class="skill-stat">
            <span class="stat-label">消�?</span>
            <span class="stat-value">{{ skill.cost }}</span>
          </div>
        </div>
        <div class="skill-description">{{ skill.description }}</div>
      </div>
    </div>

    <div
      v-else
      class="no-skills"
    >
      <p>没有可用技�?/p></p>
    </div>

    <div class="skill-tips mt-6">
      <h3 class="text-lg font-semibold mb-2">技能说�?/h3>
      <ul class="tips-list">
        <li class="tip-item">�?物理技能造成物理伤害，受攻击力和防御力影�?/li></li>
        <li class="tip-item">�?魔法技能造成魔法伤害，受魔法攻击力和魔法防御力影�?</li>
        <li class="tip-item">�?战斗中按数字键或点击技能释�?/li></li>
        <li class="tip-item">�?击败怪物可以获得经验值，提升等级</li>
        <li class="tip-item">�?升级后属性会得到提升</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '../stores/playerStore';

const playerStore = usePlayerStore();

// 获取技能快捷键
function getSkillKey(index: number): string {
  const keys = ['1', '2', '3', '4', '5', '6'];
  return keys[index - 1] || '';
}
</script>

<style lang="scss" scoped>
/* 核心容器样式 */
.skill-panel-container {
  padding: 20px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 20px;
  border: 3px solid #667eea;
  box-shadow:
    0 8px 32px rgb(102 126 234 / 30%),
    inset 0 1px 0 rgb(255 255 255 / 80%);
  position: relative;
}

.skill-panel-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgb(255 255 255 / 10%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 10%) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: 0;
  pointer-events: none;
}

/* 标题样式 */
.skill-panel-container h2 {
  font-size: 24px;
  font-weight: bold;
  color: #475569;
  margin-bottom: 20px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;
}

/* 技能列表样�? */
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
  z-index: 1;
}

/* 技能项样式 */
.skill-item {
  padding: 20px;
  border-radius: 15px;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgb(0 0 0 / 10%);
}

.skill-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 40%), transparent);
  transition: left 0.5s ease;
  z-index: 0;
}

.skill-item:hover::before {
  left: 100%;
}

.skill-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgb(0 0 0 / 18%);
}

/* 物理技能卡片样�? */
.skill-item.skill-physical {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
  box-shadow:
    0 4px 15px rgb(245 158 11 / 20%),
    inset 0 1px 0 rgb(255 255 255 / 80%);
}

.skill-item.skill-physical::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f59e0b, #d97706, #f59e0b);
  animation: skillPulsePhysical 2s ease-in-out infinite;
}

/* 魔法技能卡片样�? */
.skill-item.skill-magic {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  border-color: #667eea;
  box-shadow:
    0 4px 15px rgb(102 126 234 / 20%),
    inset 0 1px 0 rgb(255 255 255 / 80%);
}

.skill-item.skill-magic::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
  animation: skillPulseMagic 2s ease-in-out infinite;
}

/* 技能头部样�? */
.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 15px;
  position: relative;
  z-index: 1;
}

/* 技能名称样�? */
.skill-name {
  font-weight: bold;
  font-size: 18px;
  color: #2d3748;
  flex: 1;
  text-shadow: 0 1px 2px rgb(255 255 255 / 80%);
  letter-spacing: 0.5px;
}

/* 技能类型标签样�? */
.skill-type {
  font-size: 12px;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 3px 10px rgb(0 0 0 / 20%);
  animation: pulse 2s ease-in-out infinite;
}

/* 物理技能标�? */
.skill-item.skill-physical .skill-type {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: 2px solid rgb(255 255 255 / 30%);
}

/* 魔法技能标�? */
.skill-item.skill-magic .skill-type {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid rgb(255 255 255 / 30%);
}

/* 技能快捷键样式 */
.skill-key {
  background: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%);
  color: #4a5568;
  font-weight: bold;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  box-shadow:
    0 4px 12px rgb(0 0 0 / 15%),
    inset 0 1px 0 rgb(255 255 255 / 80%);
  border: 2px solid rgb(255 255 255 / 50%);
  transition: all 0.3s ease;
}

.skill-item:hover .skill-key {
  transform: scale(1.1);
  box-shadow:
    0 6px 15px rgb(0 0 0 / 20%),
    inset 0 1px 0 rgb(255 255 255 / 80%);
}

/* 技能详情样�? */
.skill-details {
  display: flex;
  gap: 25px;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

/* 技能属性样�? */
.skill-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgb(255 255 255 / 70%);
  padding: 6px 12px;
  border-radius: 15px;
  border: 2px solid rgb(255 255 255 / 50%);
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #2d3748;
  text-shadow: 0 1px 2px rgb(255 255 255 / 80%);
}

/* 技能描述样�? */
.skill-description {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
  background: rgb(255 255 255 / 80%);
  padding: 12px;
  border-radius: 10px;
  border-left: 4px solid #667eea;
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
  position: relative;
  z-index: 1;
}

/* 无技能状态样�? */
.no-skills {
  text-align: center;
  color: #718096;
  padding: 40px 20px;
  font-style: italic;
  background: rgb(255 255 255 / 80%);
  border-radius: 15px;
  border: 2px dashed #cbd5e1;
  position: relative;
  z-index: 1;
  font-size: 16px;
}

/* 技能提示样�? */
.skill-tips {
  background: linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%);
  padding: 20px;
  border-radius: 15px;
  margin-top: 25px;
  border: 2px solid #10b981;
  box-shadow:
    0 4px 15px rgb(16 185 129 / 20%),
    inset 0 1px 0 rgb(255 255 255 / 80%);
  position: relative;
  z-index: 1;
}

.skill-tips h3 {
  font-size: 18px;
  font-weight: bold;
  color: #10b981;
  margin-bottom: 15px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgb(255 255 255 / 80%);
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tip-item {
  margin-bottom: 10px;
  font-size: 14px;
  color: #2d3748;
  line-height: 1.5;
  background: rgb(255 255 255 / 70%);
  padding: 10px 15px;
  border-radius: 10px;
  border-left: 3px solid #10b981;
  transition: all 0.3s ease;
}

.tip-item:last-child {
  margin-bottom: 0;
}

.tip-item:hover {
  transform: translateX(5px);
  box-shadow: 0 3px 10px rgb(0 0 0 / 10%);
}

/* 滚动条样�? */
.skill-panel-container::-webkit-scrollbar {
  width: 8px;
}

.skill-panel-container::-webkit-scrollbar-track {
  background: rgb(255 255 255 / 50%);
  border-radius: 4px;
}

.skill-panel-container::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  border: 2px solid rgb(255 255 255 / 50%);
}

.skill-panel-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #764ba2 0%, #667eea 100%);
}

/* 动画效果 */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

@keyframes skillPulsePhysical {
  0%,
  100% {
    opacity: 0.6;
    transform: scaleX(1);
  }

  50% {
    opacity: 1;
    transform: scaleX(1.05);
  }
}

@keyframes skillPulseMagic {
  0%,
  100% {
    opacity: 0.6;
    transform: scaleX(1);
  }

  50% {
    opacity: 1;
    transform: scaleX(1.05);
  }
}
</style>
