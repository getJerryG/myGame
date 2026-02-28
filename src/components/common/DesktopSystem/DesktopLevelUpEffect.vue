<template>
  <div v-if="visible" class="level-up-effect">
    <div class="level-up-message">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps<{
  visible: boolean;
  message: string;
}>();
</script>

<style lang="scss" scoped>
.level-up-effect {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: tokens.$z-max;
  animation: levelUpEffect 3s ease-out forwards;

  .level-up-message {
    background-color: rgb(0 0 0 / 80%);
    color: tokens.$primary-blue;
    font-size: tokens.$font-size-3xl;
    font-weight: tokens.$font-weight-bold;
    padding: tokens.$spacing-lg tokens.$spacing-xl;
    border-radius: tokens.$radius-lg;
    text-shadow: 0 0 10px rgb(74 158 255 / 80%);
    box-shadow: 0 0 30px rgb(74 158 255 / 50%);
    animation: levelUpPulse 1.5s ease-in-out infinite;
  }
}

@keyframes levelUpEffect {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }

  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }

  80% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes levelUpPulse {
  0%,
  100% {
    text-shadow: 0 0 10px rgb(74 158 255 / 80%);
    box-shadow: 0 0 30px rgb(74 158 255 / 50%);
  }

  50% {
    text-shadow: 0 0 20px rgb(74 158 255 / 100%);
    box-shadow: 0 0 50px rgb(74 158 255 / 80%);
  }
}
</style>
