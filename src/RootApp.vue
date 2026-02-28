<template>
  <div class="root-app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 根应用组件
</script>

<style lang="scss" scoped>

.root-app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, tokens.$bg-dark 0%, tokens.$bg-secondary 50%, tokens.$bg-tertiary 100%);
  font-family: tokens.$font-family-base;
  color: tokens.$text-primary;
}
</style>
