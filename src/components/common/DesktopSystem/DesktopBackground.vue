<template>
  <div class="desktop-background">
    <!-- 桌面应用图标区域 -->
    <div class="desktop-icons">
      <DesktopAppIcon 
        v-for="app in apps" 
        :key="app.id" 
        :app="app" 
        :position="app.position"
        @click="$emit('click', app)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DesktopAppIcon from '../DesktopAppIcon/index.vue';
import type { DesktopApp } from './types';

// Props
defineProps<{
  apps: DesktopApp[];
}>();

// Emits
defineEmits<{
  click: [app: DesktopApp];
}>();
</script>

<style lang="scss" scoped>
.desktop-background {
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, tokens.$bg-dark 0%, color.adjust(tokens.$bg-dark, $lightness: -5%) 100%);
  overflow: hidden;
  margin-top: 0;
  padding-top: tokens.$spacing-lg;

  .desktop-icons {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;

    > * {
      pointer-events: auto;
    }
  }
}
</style>
