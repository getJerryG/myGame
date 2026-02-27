<template>
  <div class="action-section">
    <h3 class="section-title">游戏功能</h3>
    <div class="action-buttons">
      <button
        class="action-btn inventory-btn"
        title="打开背包"
        @click="toggleFullInventory"
      >
        <div class="btn-icon">🎒</div>
        <div class="btn-text">背包</div>
      </button>
      <button
        class="action-btn achievement-btn"
        title="查看成就"
        @click="showAchievements"
      >
        <div class="btn-icon">🏆</div>
        <div class="btn-text">成就</div>
      </button>
      <button
        class="action-btn lottery-btn"
        title="进入抽奖界面"
        @click="$router.push('/lottery')"
      >
        <div class="btn-icon">🎲</div>
        <div class="btn-text">抽奖</div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['toggle-inventory', 'show-achievements']);

// 切换背包弹窗
const toggleFullInventory = (): void => {
  emit('toggle-inventory');
};

// 显示成就
const showAchievements = (): void => {
  emit('show-achievements');
};
</script>

<style lang="scss" scoped>
/* 动作区域 */
.action-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 20px rgb(0 0 0 / 10%);
  border: 2px solid #e2e8f0;
}

/* 动作按钮容器 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 动作按钮 */
.action-btn {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px 25px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 40%), transparent);
  transition: left 0.5s ease;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgb(0 0 0 / 20%);
}

.action-btn:active {
  transform: translateY(0);
}

/* 按钮图标 */
.btn-icon {
  font-size: 24px;
  transition: transform 0.3s ease;
}

.action-btn:hover .btn-icon {
  transform: scale(1.2) rotate(10deg);
}

/* 按钮样式变体 */
.inventory-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 5px 15px rgb(16 185 129 / 40%);
}

.achievement-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 5px 15px rgb(245 158 11 / 40%);
}

.lottery-btn {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 5px 15px rgb(139 92 246 / 40%);
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
</style>
