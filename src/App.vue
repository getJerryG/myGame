<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 应用根组件
</script>

<style lang="scss" scoped>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, tokens.$bg-dark 0%, tokens.$bg-secondary 50%, tokens.$bg-tertiary 100%);
  font-family: tokens.$font-family-base;
  color: tokens.$text-primary;
}
</style>
