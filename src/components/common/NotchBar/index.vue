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
      <div class="notch-item funds-item">
        <span class="notch-value funds-value">{{ animatedFunds }}</span>
        <!-- 资金变化提示 -->
        <transition
          name="fade"
          @before-enter="handleBeforeEnter"
          @enter="handleEnter"
          @after-enter="handleAfterEnter"
        >
          <span
            v-if="showFundChange"
            class="funds-change-indicator"
            :class="{ positive: fundChange > 0, negative: fundChange < 0 }"
          >
            {{ fundChange > 0 ? "+" : "" }}{{ fundChange }}
          </span>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";

// 定义组件 props
const props = defineProps<{
  levelName: string;
  levelRank: string;
  currentExp: number;
  maxExp: number;
  funds: number;
}>();

// 动画资金值
const animatedFunds = ref(props.funds);

// 资金变化提示相关
const showFundChange = ref(false);
const fundChange = ref(0);

// 经验条百分比
const expProgressPercent = computed(() => {
  if (props.maxExp <= 0) return 0;
  return Math.min(100, Math.floor((props.currentExp / props.maxExp) * 100));
});

// 监听资金变化
watch(
  () => props.funds,
  async (newFunds, oldFunds) => {
    if (newFunds === oldFunds) return;

    const change = newFunds - oldFunds;

    // 1. 先设置变化值和显示状态（显示提示）
    fundChange.value = change;
    showFundChange.value = true;

    // 2. 等待提示元素显示出来
    await nextTick();

    // 3. 提示显示后，延迟一小段时间再执行数字滚动
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 4. 执行数字滚动动画
    await animateValue(oldFunds, newFunds, 500);

    // 5. 数字滚动完成后，再延迟隐藏提示
    setTimeout(() => {
      showFundChange.value = false;
    }, 1000);
  },
  { immediate: false },
);

// 数字滚动动画函数
const animateValue = (
  start: number,
  end: number,
  duration: number,
): Promise<void> => {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const startValue = Math.floor(start);
    const endValue = Math.floor(end);
    const diff = endValue - startValue;

    // 如果差值很小，直接设置
    if (Math.abs(diff) < 1) {
      animatedFunds.value = endValue;
      resolve();
      return;
    }

    const animate = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用缓动函数（easeOutQuart）
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + diff * easeProgress);

      animatedFunds.value = currentValue;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        animatedFunds.value = endValue;
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
};

// Transition 钩子函数
const handleBeforeEnter = (el: Element): void => {
  // 初始状态：完全可见，在数字上方
  (el as HTMLElement).style.opacity = "1";
  (el as HTMLElement).style.transform = "translateY(0) scale(1)";
};

const handleEnter = (el: Element, done: () => void): void => {
  // 提示元素保持可见一段时间
  setTimeout(() => {
    // 数字滚动完成后，开始淡出并向上移动
    (el as HTMLElement).style.opacity = "0";
    (el as HTMLElement).style.transform = "translateY(-20px) scale(0.8)";
  }, 1200); // 等待数字滚动（500ms）+ 显示一段时间（700ms）后淡出

  setTimeout(done, 2000); // 总时长：淡出动画 800ms
};

const handleAfterEnter = (_el: Element): void => {
  // 动画完成后清理
};
</script>

<style scoped lang="scss">
// 刘海栏容器
.notch-bar {
  height: tokens.$notch-bar-height;
  background: linear-gradient(
    135deg,
    tokens.$bg-dark 0%,
    tokens.$bg-medium 100%
  );
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
  background: linear-gradient(
    135deg,
    tokens.$primary-gold 0%,
    tokens.$warning 100%
  );

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
  background: linear-gradient(
    135deg,
    rgb(255 255 255 / 10%) 0%,
    rgb(255 255 255 / 5%) 100%
  );
  border-radius: tokens.$radius-full;
  font-size: tokens.$font-size-sm;
  border: 1px solid rgb(255 215 0 / 20%);
  box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
  min-width: 100px;
  position: relative;
}

// 资金项特殊样式
.funds-item {
  position: relative;
  overflow: visible;
}

.funds-value {
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

// 资金变化提示
.funds-change-indicator {
  position: absolute;
  top: -20px;
  right: 50%;
  transform: translateX(50%);
  font-size: tokens.$font-size-xs;
  font-weight: tokens.$font-weight-bold;
  padding: tokens.$spacing-xs tokens.$spacing-sm;
  border-radius: tokens.$radius-sm;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgb(0 0 0 / 30%);

  &.positive {
    color: #fff;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }

  &.negative {
    color: #fff;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  }
}

// Fade transition
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.8);
}

.fade-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.fade-leave-active {
  opacity: 0;
  transform: translateY(-20px) scale(0.8);
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
  background: linear-gradient(
    90deg,
    tokens.$primary-gold 0%,
    tokens.$warning 100%
  );
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
