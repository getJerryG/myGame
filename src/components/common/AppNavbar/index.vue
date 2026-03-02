<template>
  <nav
    class="navbar"
    aria-label="主导航"
    :class="{ 'navbar-hidden': isHidden && !isMobile }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="navbar-brand">
      <h1 aria-level="1">游戏工具箱</h1>
    </div>
    <button
      class="menu-toggle"
      aria-expanded="isMenuOpen"
      aria-label="切换菜单"
      @click="toggleMenu"
    >
      <span class="menu-icon" aria-hidden="true">{{
        isMenuOpen ? "×" : "☰"
      }}</span>
    </button>
    <div class="navbar-menu" :class="{ 'menu-open': isMenuOpen }">
      <router-link to="/" class="nav-link" aria-current="page" exact>
        <span class="link-text">首页</span>
        <span class="link-glow"></span>
      </router-link>
      <router-link to="/lottery" class="nav-link" aria-current="page">
        <span class="link-text">无相抽奖</span>
        <span class="link-glow"></span>
      </router-link>
      <router-link to="/simulation" class="nav-link" aria-current="page">
        <span class="link-text">策划模拟经营</span>
        <span class="link-glow"></span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

// 公共导航栏组件
const isMenuOpen = ref(false);
const isHidden = ref(true); // 默认隐藏
const isMobile = ref(false);
const hideTimer = ref<ReturnType<typeof setTimeout> | null>(null);

const toggleMenu = (): void => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleMouseEnter = (): void => {
  // 清除隐藏定时器
  if (hideTimer.value) {
    clearTimeout(hideTimer.value);
    hideTimer.value = null;
  }
  // 显示导航栏
  isHidden.value = false;
};

const handleMouseLeave = (): void => {
  // 只有在非移动设备上才自动隐藏
  if (!isMobile.value) {
    // 立即隐藏导航栏
    isHidden.value = true;
  }
};

const checkMobile = (): void => {
  isMobile.value = window.innerWidth <= 768;
  // 移动设备上始终显示导航栏
  if (isMobile.value) {
    isHidden.value = false;
    if (hideTimer.value) {
      clearTimeout(hideTimer.value);
      hideTimer.value = null;
    }
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  // 初始状态隐藏
  isHidden.value = true;
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  if (hideTimer.value) {
    clearTimeout(hideTimer.value);
  }
});
</script>

<style lang="scss" scoped>
/* 导航栏样式 */
.navbar {
  background: linear-gradient(
    135deg,
    tokens.$gray-800 0%,
    tokens.$gray-700 100%
  );
  color: tokens.$text-primary;
  padding: tokens.$spacing-sm tokens.$spacing-lg;

  @include utils.flex-between;

  box-shadow: 0 2px 10px rgb(0 0 0 / 20%);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: tokens.$z-fixed;

  /* 导航栏隐藏状态 */
  &.navbar-hidden {
    transform: translateY(-80%);
    box-shadow: 0 0 0 rgb(0 0 0 / 0%);
  }

  /* 鼠标接近时的显示效果 */
  &:hover {
    transform: translateY(0);
    box-shadow: 0 4px 20px rgb(0 0 0 / 30%);

    .navbar-brand {
      h1 {
        transform: scale(1.05);
      }
    }
  }
}

.navbar-brand {
  h1 {
    margin: 0;
    font-size: tokens.$font-size-2xl;
    font-weight: tokens.$font-weight-bold;
    text-shadow: 0 2px 4px rgb(0 0 0 / 30%);
    transition: all tokens.$transition-normal;
  }
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: tokens.$text-primary;
  font-size: tokens.$font-size-2xl;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  transition: all tokens.$transition-normal;

  &:hover {
    transform: scale(1.1);
    text-shadow: 0 0 10px rgb(255 255 255 / 50%);
  }

  @include utils.mobile {
    display: flex;
  }
}

.navbar-menu {
  @include utils.flex-row(tokens.$spacing-lg, center);

  transition: all tokens.$transition-normal;
}

.nav-link {
  color: tokens.$text-primary;
  text-decoration: none;
  padding: tokens.$spacing-2 tokens.$spacing-4;
  border-radius: tokens.$radius-full;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
  position: relative;
  overflow: hidden;
  font-weight: tokens.$font-weight-medium;
  animation: fadeInUp 0.3s ease forwards;

  /* 导航链接悬停效果 */
  &:hover {
    background: rgb(255 255 255 / 15%);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 5px 15px rgb(0 0 0 / 30%);
  }

  /* 导航链接激活状态 */
  &.router-link-active {
    background: linear-gradient(
      135deg,
      tokens.$success 0%,
      tokens.$success-green 100%
    );
    box-shadow: 0 4px 12px rgb(16 185 129 / 40%);

    &:hover {
      background: linear-gradient(
        135deg,
        tokens.$success-green 0%,
        #3d8b40 100%
      );
      transform: translateY(-3px) scale(1.05);
    }
  }

  &:nth-child(1) {
    animation-delay: 0.1s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }
}

/* 链接文本 */
.link-text {
  position: relative;
  z-index: 2;
  transition: all tokens.$transition-normal;
}

/* 链接发光效果 */
.nav-link {
  &:hover {
    .link-glow {
      transform: scale(1);
      opacity: 1;
    }
  }
}

.link-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgb(255 255 255 / 20%) 0%,
    rgb(255 255 255 / 0%) 70%
  );
  transform: scale(0);
  opacity: 0;
  transition: all 0.6s ease;
  z-index: 1;
}

/* 响应式设计 */
@include utils.mobile {
  .menu-toggle {
    display: flex;

    &:focus {
      outline: 2px solid tokens.$text-primary;
      outline-offset: 2px;
      border-radius: tokens.$radius-sm;
    }
  }

  .navbar-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(
      135deg,
      tokens.$gray-800 0%,
      tokens.$gray-700 100%
    );
    flex-direction: column;
    gap: 0;
    padding: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    box-shadow: 0 4px 6px rgb(0 0 0 / 10%);

    &.menu-open {
      max-height: 300px;
    }
  }

  .nav-link {
    padding: tokens.$spacing-3 tokens.$spacing-5;
    border-bottom: 1px solid rgb(255 255 255 / 10%);
    width: 100%;
    box-sizing: border-box;
    border-radius: 0;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      transform: none;
      background: rgb(255 255 255 / 10%);
    }

    &:focus {
      outline: 2px solid tokens.$success;
      outline-offset: 2px;
    }
  }

  .navbar-brand {
    h1 {
      font-size: tokens.$font-size-lg;
    }
  }

  .navbar {
    transform: translateY(0) !important;
  }
}

/* 可访问性增强 */
.nav-link {
  &:focus {
    outline: 2px solid tokens.$success;
    outline-offset: 2px;
  }
}

.menu-toggle {
  &:focus {
    outline: 2px solid tokens.$text-primary;
    outline-offset: 2px;
    border-radius: tokens.$radius-sm;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
