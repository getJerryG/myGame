<template>
  <div class="window-manager-test-standalone">
    <h1 class="page-title">窗口管理器测试（独立版）</h1>
    <p class="page-description">
      这是一个独立的窗口管理器测试页面，不依赖于其他可能导致错误的组件�?/p>

      <!-- 窗口管理器组�?-->
      <WindowManager class="window-manager-container" />
    </p>
  </div>
</template>

<script setup lang="ts">
import WindowManager from '../components/common/window/WindowManager.vue';
</script>

<style lang="scss" scoped>
.window-manager-test-standalone {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f0f0;
  overflow: hidden;
}

.page-title {
  position: fixed;
  top: 20px;
  left: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
  z-index: 1000;
}

.page-description {
  position: fixed;
  top: 60px;
  left: 20px;
  font-size: 14px;
  color: #666;
  margin: 0;
  z-index: 1000;
}

.window-manager-container {
  width: 100%;
  height: 100%;
}
</style>
