<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="not-found-number">404</div>
      <h1 class="not-found-title">页面未找到</h1>
      <p class="not-found-description">您访问的页面不存在或已被移除</p>
      <div class="not-found-actions">
        <button
          class="action-button"
          @click="goHome"
        >
          返回首页
        </button>
        <button
          class="action-button secondary"
          @click="goBack"
        >
          返回上一页
        </button>
      </div>
      <div class="not-found-image">
        <!-- 这里可以添加404相关的图片或动画 -->
        <div class="floating-elements">
          <div class="element element-1"></div>
          <div class="element element-2"></div>
          <div class="element element-3"></div>
          <div class="element element-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

// 返回首页
const goHome = () => {
  router.push('/');
};

// 返回上一页
const goBack = () => {
  router.back();
};
</script>

<style lang="scss" scoped>

.not-found-page {
  width: 100vw;
  height: 100vh;
  @include utils.flex-center;
  background: linear-gradient(135deg, tokens.$bg-dark 0%, tokens.$bg-secondary 50%, tokens.$bg-tertiary 100%);
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(circle at 20% 50%, rgb(74 158 255 / 10%) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgb(255 215 0 / 10%) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgb(255 107 107 / 10%) 0%, transparent 50%);
    animation: backgroundPulse 4s ease-in-out infinite alternate;
  }
}

@keyframes backgroundPulse {
  from {
    opacity: 0.8;
  }
  to {
    opacity: 1;
  }
}

.not-found-container {
  @include utils.flex-col(tokens.$spacing-md, center, center);
  text-align: center;
  z-index: 1;
  max-width: 600px;
  padding: tokens.$spacing-xl;
  background-color: rgb(26 26 46 / 90%);
  border-radius: tokens.$radius-xl;
  box-shadow: tokens.$shadow-xl;
  border: 1px solid rgb(74 158 255 / 30%);
}

.not-found-number {
  font-size: 12rem;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$primary;
  text-shadow: 0 0 30px rgb(74 158 255 / 50%);
  margin: 0;
  line-height: 1;
  animation: numberFloat 3s ease-in-out infinite;
}

@keyframes numberFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.not-found-title {
  font-size: tokens.$font-size-4xl;
  font-weight: tokens.$font-weight-semibold;
  color: tokens.$text-primary;
  margin: tokens.$spacing-md 0 tokens.$spacing-sm;
}

.not-found-description {
  font-size: tokens.$font-size-lg;
  color: tokens.$text-secondary;
  margin: 0 0 tokens.$spacing-xl;
  line-height: tokens.$line-height-normal;
}

.not-found-actions {
  display: flex;
  gap: tokens.$spacing-md;
  margin-bottom: tokens.$spacing-xl;
}

.action-button {
  padding: tokens.$spacing-sm tokens.$spacing-xl;
  font-size: tokens.$font-size-lg;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
  background: linear-gradient(135deg, tokens.$primary 0%, tokens.$primary-dark 100%);
  border: none;
  border-radius: tokens.$radius-full;
  cursor: pointer;
  transition: all tokens.$transition-normal;
  box-shadow: 0 4px 15px rgb(74 158 255 / 40%);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgb(74 158 255 / 60%);
    background: linear-gradient(135deg, tokens.$primary-dark 0%, tokens.$primary 100%);
  }

  &.secondary {
    background: tokens.$bg-lighter;
    border: 2px solid rgb(255 255 255 / 30%);
    box-shadow: none;

    &:hover {
      background: tokens.$bg-light;
      border-color: rgb(255 255 255 / 50%);
    }
  }
}

.not-found-image {
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
  border-radius: tokens.$radius-md;
}

.floating-elements {
  position: relative;
  width: 100%;
  height: 100%;
}

.element {
  position: absolute;
  border-radius: 50%;
  background: rgb(74 158 255 / 30%);
  animation: float 6s ease-in-out infinite;
}

.element-1 {
  width: 60px;
  height: 60px;
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.element-2 {
  width: 40px;
  height: 40px;
  top: 60%;
  left: 30%;
  animation-delay: 1s;
}

.element-3 {
  width: 80px;
  height: 80px;
  top: 30%;
  right: 25%;
  animation-delay: 2s;
}

.element-4 {
  width: 30px;
  height: 30px;
  bottom: 20%;
  right: 35%;
  animation-delay: 3s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translate(20px, -20px) scale(1.1);
    opacity: 0.8;
  }
  50% {
    transform: translate(0, -40px) scale(0.9);
    opacity: 1;
  }
  75% {
    transform: translate(-20px, -20px) scale(1.1);
    opacity: 0.8;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .not-found-container {
    padding: tokens.$spacing-lg tokens.$spacing-md;
    margin: tokens.$spacing-md;
  }

  .not-found-number {
    font-size: 8rem;
  }

  .not-found-title {
    font-size: tokens.$font-size-3xl;
  }

  .not-found-description {
    font-size: tokens.$font-size-base;
  }

  .not-found-actions {
    flex-direction: column;
    width: 100%;
  }

  .action-button {
    width: 100%;
  }
}
</style>
