<template>
  <div class="skill-panel-container">
    <h2 class="text-xl font-bold mb-4">技能面板</h2>

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
            <span class="stat-label">消耗:</span>
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
      <p>没有可用技能</p>
    </div>

    <div class="skill-tips mt-6">
      <h3 class="text-lg font-semibold mb-2">技能说明</h3>
      <ul class="tips-list">
        <li class="tip-item">• 物理技能造成物理伤害，受攻击力和防御力影响</li>
        <li class="tip-item">• 魔法技能造成魔法伤害，受魔法攻击力和魔法防御力影响</li>
        <li class="tip-item">• 战斗中按数字键或点击技能释放</li>
        <li class="tip-item">• 击败怪物可以获得经验值，提升等级</li>
        <li class="tip-item">• 升级后属性会得到提升</li>
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
  @include utils.flex-col(tokens.$spacing-lg, stretch, flex-start);

  padding: tokens.$spacing-lg;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  max-height: 100%;
  overflow: hidden auto;
  background: linear-gradient(135deg, tokens.$panel-bg-start 0%, tokens.$panel-bg-end 100%);
  border-radius: tokens.$radius-xl;
  border: 3px solid tokens.$skill-magic-border;
  box-shadow:
    0 8px 32px rgb(102 126 234 / 30%),
    inset 0 1px 0 rgb(255 255 255 / 80%);
  position: relative;

  &::before {
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
  h2 {
    font-size: tokens.$font-size-2xl;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$gray-600;
    margin-bottom: tokens.$spacing-lg;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    background: linear-gradient(135deg, tokens.$skill-magic-border 0%, tokens.$skill-magic-dark 100%);
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    z-index: 1;
  }

  /* 滚动条样式 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgb(255 255 255 / 50%);
    border-radius: tokens.$radius-sm;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, tokens.$skill-magic-border 0%, tokens.$skill-magic-dark 100%);
    border-radius: tokens.$radius-sm;
    border: 2px solid rgb(255 255 255 / 50%);

    &:hover {
      background: linear-gradient(180deg, tokens.$skill-magic-dark 0%, tokens.$skill-magic-border 100%);
    }
  }
}

/* 技能列表样式 */
.skills-list {
  @include utils.flex-col(tokens.$spacing-md);

  position: relative;
  z-index: 1;
}

/* 技能项样式 */
.skill-item {
  padding: tokens.$spacing-lg;
  border-radius: tokens.$radius-lg;
  border: 2px solid transparent;
  transition: all tokens.$transition-normal;
  position: relative;
  overflow: hidden;
  box-shadow: tokens.$shadow-md;

  &::before {
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

  &:hover {
    transform: translateY(-5px);
    box-shadow: tokens.$shadow-lg;

    &::before {
      left: 100%;
    }

    .skill-key {
      transform: scale(1.1);
      box-shadow:
        0 6px 15px rgb(0 0 0 / 20%),
        inset 0 1px 0 rgb(255 255 255 / 80%);
    }
  }

  /* 物理技能卡片样式 */
  &.skill-physical {
    background: linear-gradient(135deg, tokens.$skill-physical-bg-start 0%, tokens.$skill-physical-bg-end 100%);
    border-color: tokens.$skill-physical-border;
    box-shadow:
      0 4px 15px rgb(245 158 11 / 20%),
      inset 0 1px 0 rgb(255 255 255 / 80%);

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, tokens.$skill-physical-border, tokens.$skill-physical-dark, tokens.$skill-physical-border);
      animation: skillPulsePhysical 2s ease-in-out infinite;
    }

    .skill-type {
      background: linear-gradient(135deg, tokens.$skill-physical-border 0%, tokens.$skill-physical-dark 100%);
      border: 2px solid rgb(255 255 255 / 30%);
    }
  }

  /* 魔法技能卡片样式 */
  &.skill-magic {
    background: linear-gradient(135deg, tokens.$skill-magic-bg-start 0%, tokens.$skill-magic-bg-end 100%);
    border-color: tokens.$skill-magic-border;
    box-shadow:
      0 4px 15px rgb(102 126 234 / 20%),
      inset 0 1px 0 rgb(255 255 255 / 80%);

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, tokens.$skill-magic-border, tokens.$skill-magic-dark, tokens.$skill-magic-border);
      animation: skillPulseMagic 2s ease-in-out infinite;
    }

    .skill-type {
      background: linear-gradient(135deg, tokens.$skill-magic-border 0%, tokens.$skill-magic-dark 100%);
      border: 2px solid rgb(255 255 255 / 30%);
    }
  }
}

/* 技能头部样式 */
.skill-header {
  @include utils.flex-between;

  margin-bottom: tokens.$spacing-md;
  gap: tokens.$spacing-md;
  position: relative;
  z-index: 1;
}

/* 技能名称样式 */
.skill-name {
  font-weight: tokens.$font-weight-bold;
  font-size: tokens.$font-size-lg;
  color: tokens.$gray-800;
  flex: 1;
  text-shadow: 0 1px 2px rgb(255 255 255 / 80%);
  letter-spacing: 0.5px;
}

/* 技能类型标签样式 */
.skill-type {
  font-size: tokens.$font-size-xs;
  color: tokens.$text-primary;
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  border-radius: tokens.$radius-full;
  font-weight: tokens.$font-weight-bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: tokens.$shadow-md;
  animation: pulse 2s ease-in-out infinite;
}

/* 技能快捷键样式 */
.skill-key {
  background: linear-gradient(135deg, tokens.$gray-100 0%, tokens.$gray-300 100%);
  color: tokens.$gray-600;
  font-weight: tokens.$font-weight-bold;
  width: 32px;
  height: 32px;

  @include utils.flex-center;

  border-radius: 50%;
  font-size: tokens.$font-size-sm;
  box-shadow:
    0 4px 12px rgb(0 0 0 / 15%),
    inset 0 1px 0 rgb(255 255 255 / 80%);
  border: 2px solid rgb(255 255 255 / 50%);
  transition: all tokens.$transition-normal;
}

/* 技能详情样式 */
.skill-details {
  @include utils.flex-row(tokens.$spacing-xl, center, flex-start);

  margin-bottom: tokens.$spacing-md;
  position: relative;
  z-index: 1;
}

/* 技能属性样式 */
.skill-stat {
  @include utils.flex-row(tokens.$spacing-sm, center, flex-start);

  background: rgb(255 255 255 / 70%);
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  border-radius: tokens.$radius-lg;
  border: 2px solid rgb(255 255 255 / 50%);
  box-shadow: tokens.$shadow-sm;

  .stat-label {
    font-size: tokens.$font-size-sm;
    color: tokens.$gray-500;
    font-weight: tokens.$font-weight-bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-value {
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$gray-800;
    text-shadow: 0 1px 2px rgb(255 255 255 / 80%);
  }
}

/* 技能描述样式 */
.skill-description {
  font-size: tokens.$font-size-base;
  color: tokens.$gray-500;
  line-height: tokens.$line-height-normal;
  background: rgb(255 255 255 / 80%);
  padding: tokens.$spacing-sm;
  border-radius: tokens.$radius-md;
  border-left: 4px solid tokens.$skill-magic-border;
  box-shadow: tokens.$shadow-sm;
  position: relative;
  z-index: 1;
}

/* 无技能状态样式 */
.no-skills {
  text-align: center;
  color: tokens.$gray-500;
  padding: tokens.$spacing-2xl tokens.$spacing-lg;
  font-style: italic;
  background: rgb(255 255 255 / 80%);
  border-radius: tokens.$radius-lg;
  border: 2px dashed tokens.$gray-300;
  position: relative;
  z-index: 1;
  font-size: tokens.$font-size-base;
}

/* 技能提示样式 */
.skill-tips {
  background: linear-gradient(135deg, tokens.$tips-bg-start 0%, tokens.$tips-bg-end 100%);
  padding: tokens.$spacing-lg;
  border-radius: tokens.$radius-lg;
  margin-top: tokens.$spacing-xl;
  border: 2px solid tokens.$tips-border;
  box-shadow:
    0 4px 15px rgb(16 185 129 / 20%),
    inset 0 1px 0 rgb(255 255 255 / 80%);
  position: relative;
  z-index: 1;

  h3 {
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$tips-border;
    margin-bottom: tokens.$spacing-md;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 0 1px 2px rgb(255 255 255 / 80%);
  }
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tip-item {
  margin-bottom: tokens.$spacing-sm;
  font-size: tokens.$font-size-sm;
  color: tokens.$gray-800;
  line-height: tokens.$line-height-normal;
  background: rgb(255 255 255 / 70%);
  padding: tokens.$spacing-sm tokens.$spacing-md;
  border-radius: tokens.$radius-md;
  border-left: 3px solid tokens.$tips-border;
  transition: all tokens.$transition-normal;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    transform: translateX(5px);
    box-shadow: tokens.$shadow-sm;
  }
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
