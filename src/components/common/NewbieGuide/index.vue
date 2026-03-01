<template>
  <div
    v-if="isVisible"
    class="guide-overlay"
  >
    <div class="guide-content">
      <div class="guide-header">
        <h3 class="guide-title">游戏指南</h3>
        <div class="guide-step">
          <span class="step-number">{{ currentStep + 1 }}</span>
          <span class="step-total">/{{ guideSteps.length }}</span>
        </div>
      </div>
      <div class="guide-body">
        <div class="guide-text">{{ guideSteps[currentStep].text }}</div>
        <div
          v-if="guideSteps[currentStep].image"
          class="guide-image"
        >
          <!-- 这里可以添加引导图片 -->
        </div>
      </div>
      <div class="guide-footer">
        <button
          class="guide-btn back"
          :disabled="currentStep === 0"
          @click="prevStep"
        >
          上一步
        </button>
        <button
          class="guide-btn next"
          @click="nextStep"
        >
          {{ currentStep === guideSteps.length - 1 ? '完成' : '下一步' }}
        </button>
        <button
          class="guide-btn skip"
          @click="skipGuide"
        >
          跳过
        </button>
      </div>
    </div>

    <!-- 引导箭头 -->
    <div
      v-if="guideSteps[currentStep].position"
      class="guide-arrow"
      :style="{
        left: `${guideSteps[currentStep].position.x}%`,
        top: `${guideSteps[currentStep].position.y}%`,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'stepChange']);

const currentStep = ref(0);

// 引导步骤
const guideSteps = [
  {
    text: '欢迎来到《策划大师：王者经营》！在这里你可以模拟游戏开发，创建属于你的游戏王国',
    position: { x: 75, y: 20 },
  },
  {
    text: '移动到怪物所在的格子，触发战斗！击败怪物可以获得经验和金币',
    position: { x: 50, y: 50 },
  },
  {
    text: '战斗时，点击右侧技能面板中的技能或按对应数字键释放技能',
    position: { x: 90, y: 50 },
  },
  {
    text: '打开宝箱可以获得珍贵道具和装备，提升角色实力',
    position: { x: 50, y: 50 },
  },
  {
    text: '点击左上角的小地图可以快速切换场景，探索不同区域',
    position: { x: 10, y: 20 },
  },
  {
    text: '完成战斗后，可以在角色信息面板中使用道具或进入抽奖界面',
    position: { x: 15, y: 50 },
  },
];

function nextStep(): void {
  if (currentStep.value < guideSteps.length - 1) {
    currentStep.value++;
    emit('stepChange', currentStep.value);
  } else {
    finishGuide();
  }
}

function prevStep(): void {
  if (currentStep.value > 0) {
    currentStep.value--;
    emit('stepChange', currentStep.value);
  }
}

function skipGuide(): void {
  finishGuide();
}

function finishGuide(): void {
  emit('close');
}

onMounted(() => {
  // 初始化引导
  if (props.isVisible) {
    emit('stepChange', currentStep.value);
  }
});
</script>

<style lang="scss" scoped>
.guide-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 90%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: guideFadeIn 0.4s ease;
  backdrop-filter: blur(5px);
}

.guide-content {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 20px;
  box-shadow:
    0 15px 50px rgb(0 0 0 / 40%),
    0 0 0 4px rgb(102 126 234 / 40%),
    inset 0 1px 0 rgb(255 255 255 / 80%);
  width: 90%;
  max-width: 550px;
  animation: guideSlideUp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  border: 3px solid #667eea;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgb(255 255 255 / 30%), transparent);
    transition: left 0.6s ease;
    z-index: 0;
  }

  &:hover {
    &::before {
      left: 100%;
    }
  }
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 3px solid #cbd5e1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px 15px 0 0;
  position: relative;
  z-index: 1;
}

.guide-title {
  font-size: 24px;
  font-weight: 900;
  color: white;
  margin: 0;
  text-shadow:
    0 0 10px rgb(255 255 255 / 80%),
    2px 2px 4px rgb(0 0 0 / 50%);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  letter-spacing: 1px;
}

.guide-step {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgb(255 255 255 / 20%);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid rgb(255 255 255 / 30%);
  box-shadow: inset 0 0 20px rgb(255 255 255 / 20%);
}

.step-number {
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 10px rgb(255 255 255 / 80%);
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}

.step-total {
  font-size: 16px;
  color: white;
  font-weight: bold;
  text-shadow: 0 0 10px rgb(255 255 255 / 50%);
}

.guide-body {
  padding: 25px;
  position: relative;
  z-index: 1;
  background: rgb(255 255 255 / 80%);
}

.guide-text {
  font-size: 16px;
  line-height: 1.8;
  color: #4a5568;
  margin-bottom: 20px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  background: linear-gradient(135deg, #fff 0%, #f1f5f9 100%);
  padding: 15px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
}

.guide-image {
  width: 100%;
  height: 200px;
  background-color: #f0fdf4;
  border-radius: 12px;
  margin: 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  font-style: italic;
  font-size: 18px;
  font-weight: bold;
  border: 2px dashed #10b981;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
    box-shadow: 0 4px 15px rgb(16 185 129 / 30%);
  }
}

.guide-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 25px;
  border-top: 3px solid #cbd5e1;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 0 0 15px 15px;
  position: relative;
  z-index: 1;
}

.guide-btn {
  padding: 12px 24px;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgb(0 0 0 / 15%);
  z-index: 1;
  min-width: 100px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgb(255 255 255 / 40%), transparent);
    transition: left 0.5s ease;
    z-index: -1;
  }

  &:hover {
    &::before {
      left: 100%;
    }

    &:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgb(0 0 0 / 25%);
    }
  }

  &:active {
    &:not(:disabled) {
      transform: translateY(-1px);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &.back {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    border-color: #f59e0b;
    box-shadow: 0 4px 15px rgb(245 158 11 / 40%);

    &:hover {
      &:not(:disabled) {
        box-shadow: 0 8px 25px rgb(245 158 11 / 60%);
      }
    }
  }

  &.next {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border-color: #10b981;
    box-shadow: 0 4px 15px rgb(16 185 129 / 40%);

    &:hover {
      &:not(:disabled) {
        box-shadow: 0 8px 25px rgb(16 185 129 / 60%);
      }
    }
  }

  &.skip {
    background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
    color: white;
    border-color: #f56565;
    box-shadow: 0 4px 15px rgb(245 101 101 / 40%);
    margin-left: auto;

    &:hover {
      &:not(:disabled) {
        box-shadow: 0 8px 25px rgb(245 101 101 / 60%);
      }
    }
  }
}

.guide-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 30px solid #667eea;
  transform: translate(-50%, -100%);
  z-index: 2001;
  filter: drop-shadow(0 5px 10px rgb(0 0 0 / 30%));

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: -12px;
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 24px solid white;
  }
}

/* 动画 */
@keyframes guideFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes guideSlideUp {
  from {
    transform: translateY(100px) scale(0.8);
    opacity: 0;
  }

  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}
</style>
