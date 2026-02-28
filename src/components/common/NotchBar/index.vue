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
            <div class="exp-progress" :style="{ width: `${expProgressPercent}%` }"></div>
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
// 刘海栏容器
.notch-bar {
  height: tokens.$notch-bar-height;
  background: linear-gradient(135deg, tokens.$bg-dark 0%, tokens.$bg-medium 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 tokens.$spacing-lg;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: tokens.$z-max;
  box-shadow: 0 2px 10px rgb(0 0 0 / 50%);
  border-bottom: 2px solid rgb(255 215 0 / 30%);

  // 左侧信息区
  .notch-info-left {
    @include utils.flex-row(tokens.$spacing-lg);
  }

  // 右侧信息区
  .notch-info-right {
    @include utils.flex-row(tokens.$spacing-lg);
    margin-right: tokens.$spacing-lg;
  }
}

// 用户信息
.user-info {
  @include utils.flex-row(tokens.$spacing-md);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: tokens.$radius-md;
  background: linear-gradient(135deg, tokens.$primary-gold 0%, tokens.$warning 100%);
  @include utils.flex-center;
  box-shadow: 0 2px 8px rgb(255 215 0 / 50%);
  border: 2px solid rgb(255 255 255 / 30%);
}

.avatar-placeholder {
  font-size: 18px;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$bg-dark;
}

.user-name {
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  text-shadow: 0 1px 2px rgb(0 0 0 / 50%);
}

// 信息项
.notch-item {
  @include utils.flex-col(tokens.$spacing-xs, center);
  padding: tokens.$spacing-sm tokens.$spacing-md;
  background: linear-gradient(135deg, rgb(255 255 255 / 10%) 0%, rgb(255 255 255 / 5%) 100%);
  border-radius: tokens.$radius-full;
  font-size: tokens.$font-size-sm;
  border: 1px solid rgb(255 215 0 / 20%);
  box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
  min-width: 100px;
}

.notch-label {
  display: none;
}

.notch-value {
  color: tokens.$primary-gold;
  font-weight: tokens.$font-weight-bold;
  text-shadow: 0 1px 2px rgb(0 0 0 / 50%);
}

// 经验条容器
.exp-container {
  @include utils.flex-col(tokens.$spacing-xs, center);
  width: 100%;

  .notch-value {
    font-size: tokens.$font-size-xs;
  }
}

.exp-progress-bar {
  width: 100%;
  height: 8px;
  background-color: rgb(255 255 255 / 10%);
  border-radius: tokens.$radius-sm;
  overflow: hidden;
  border: 1px solid rgb(255 215 0 / 30%);
}

.exp-progress {
  height: 100%;
  background: linear-gradient(90deg, tokens.$primary-gold 0%, tokens.$warning 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
  box-shadow: 0 0 8px rgb(255 215 0 / 50%);
}

@include utils.mobile {
  .notch-bar {
    padding: 0 tokens.$spacing-sm;
    height: 50px;
  }

  .notch-info-left,
  .notch-info-right {
    gap: tokens.$spacing-sm;
  }

  .user-info {
    gap: tokens.$spacing-sm;
  }

  .user-avatar {
    width: 35px;
    height: 35px;
  }

  .avatar-placeholder {
    font-size: 16px;
  }

  .user-name {
    font-size: tokens.$font-size-sm;
  }

  .notch-item {
    padding: tokens.$spacing-xs tokens.$spacing-sm;
    font-size: tokens.$font-size-xs;
    gap: tokens.$spacing-xs;
  }

  .exp-container {
    min-width: 100px;
  }
}
</style>
