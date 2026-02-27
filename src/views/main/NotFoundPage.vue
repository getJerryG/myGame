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
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
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
      radial-gradient(circle at 20% 50%, rgba(74, 158, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%);
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 1;
  max-width: 600px;
  padding: 40px;
  background-color: rgba(26, 26, 46, 0.9);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(74, 158, 255, 0.3);
}

.not-found-number {
  font-size: 12rem;
  font-weight: bold;
  color: #4a9eff;
  text-shadow: 0 0 30px rgba(74, 158, 255, 0.5);
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
  font-size: 2.5rem;
  font-weight: 600;
  color: white;
  margin: 20px 0 10px;
}

.not-found-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 30px;
  line-height: 1.6;
}

.not-found-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
}

.action-button {
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 500;
  color: white;
  background: linear-gradient(135deg, #4a9eff 0%, #357abd 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(74, 158, 255, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(74, 158, 255, 0.6);
    background: linear-gradient(135deg, #357abd 0%, #4a9eff 100%);
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: none;

    &:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
    }
  }
}

.not-found-image {
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
}

.floating-elements {
  position: relative;
  width: 100%;
  height: 100%;
}

.element {
  position: absolute;
  border-radius: 50%;
  background: rgba(74, 158, 255, 0.3);
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
    padding: 30px 20px;
    margin: 20px;
  }

  .not-found-number {
    font-size: 8rem;
  }

  .not-found-title {
    font-size: 2rem;
  }

  .not-found-description {
    font-size: 1rem;
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
