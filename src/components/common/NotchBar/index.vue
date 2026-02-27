<template>
  <div class="notch-bar">
    <div class="notch-info-left">
      <!-- 用户头像和名称 -->
      <div class="user-info">
        <div class="user-avatar">
          <div class="avatar-placeholder">CP</div>
        </div>
        <div class="user-name">策划大师</div>
      </div>

      <!-- 用户等级和经验值 -->
      <div class="notch-item">
        <span class="notch-value">{{ levelName }} {{ levelRank }}</span>
      </div>
      <div class="notch-item">
        <div class="exp-container">
          <span class="notch-value">{{ currentExp }}/{{ maxExp }}</span>
          <div class="exp-progress-bar">
            <div
              class="exp-progress"
              :style="{ width: `${expProgressPercent}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="notch-info-right">
      <!-- 资金信息 -->
      <div class="notch-item">
        <span class="notch-value">{{ funds }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 定义组件props
const props = defineProps<{
  levelName: string;
  levelRank: string;
  currentExp: number;
  maxExp: number;
  funds: number;
}>();

// 计算经验条百分比
const expProgressPercent = computed(() => {
  if (props.maxExp <= 0) return 0;
  return Math.min(100, Math.floor((props.currentExp / props.maxExp) * 100));
});
</script>

<style scoped lang="scss">
/* 刘海栏样式 */
.notch-bar {
  height: 60px;
  background: linear-gradient(135deg, #0a1027 0%, #1a2332 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
}

.notch-info-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notch-info-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.avatar-placeholder {
  font-size: 18px;
  font-weight: bold;
  color: #0a1027;
}

.user-name {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 调整后的notch-item样式 - 上下布局 */
.notch-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  min-width: 100px;
}

/* 移除notch-label，只显示数值 */
.notch-label {
  display: none;
}

.notch-value {
  color: #ffd700;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 经验条样式 - 王者荣耀风格，字体大小12px */
.exp-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  align-items: center;
}

.exp-container .notch-value {
  font-size: 12px;
}

.exp-progress-bar {
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.exp-progress {
  height: 100%;
  background: linear-gradient(90deg, #ffd700 0%, #ffa500 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notch-bar {
    padding: 0 10px;
    height: 50px;
  }

  .notch-info-left {
    gap: 10px;
  }

  .notch-info-right {
    gap: 10px;
  }

  .user-info {
    gap: 10px;
  }

  .user-avatar {
    width: 35px;
    height: 35px;
  }

  .avatar-placeholder {
    font-size: 16px;
  }

  .user-name {
    font-size: 14px;
  }

  .notch-item {
    padding: 6px 12px;
    font-size: 12px;
    gap: 8px;
  }

  .exp-container {
    min-width: 100px;
  }
}
</style>
