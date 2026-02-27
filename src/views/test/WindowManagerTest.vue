<template>
  <div class="window-manager-test">
    <h1 class="page-title">窗口管理器测�?/h1>
    <p class="page-description">这是一个模拟Windows系统窗口层级管理的测试页面。您可以�?/p>
    <ul class="feature-list">
      <li>拖拽窗口标题栏来移动窗口</li>
      <li>点击窗口激活并提升层级</li>
      <li>拖拽窗口标题栏到另一个窗口标题栏上进行合�?/li>
      <li>拖拽选项卡离开标题栏来分离窗口</li>
      <li>点击选项卡切换窗口内�?/li>
      <li>使用Ctrl+Tab切换窗口</li>
      <li>使用Ctrl+Shift+Tab反向切换窗口</li>
      <li>使用Ctrl+N创建新窗�?/li>
    </ul>

    <!-- 窗口管理器组�?-->
    <WindowManager class="window-manager-container" />
  </div>
</template>

<script setup lang="ts">
import WindowManager from '../components/common/window/WindowManager.vue';
</script>

<style lang="scss" scoped>
.window-manager-test {
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

.feature-list {
  position: fixed;
  top: 100px;
  left: 20px;
  font-size: 14px;
  color: #555;
  margin: 0;
  padding-left: 20px;
  z-index: 1000;
  max-width: 300px;

  li {
    margin-bottom: 8px;
    line-height: 1.4;
  }
}

.window-manager-container {
  width: 100%;
  height: 100%;
}
</style>
