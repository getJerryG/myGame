<template>
  <div
    v-if="isVisible"
    class="modal-overlay"
    @click="closeModal"
  >
    <div
      class="modal-content"
      @click.stop
    >
      <div class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button
          class="close-btn"
          @click="closeModal"
        >
          <span class="close-icon">✖️</span>
        </button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div
        v-if="showFooter"
        class="modal-footer"
      >
        <button
          v-for="button in buttons"
          :key="button.text"
          :class="['modal-btn', button.type || 'primary']"
          @click="button.action && button.action()"
        >
          {{ button.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '提示',
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  buttons: {
    type: Array,
    default: () => [{ text: '确定', type: 'primary' }],
  },
});

const emit = defineEmits(['close']);

const closeModal = (): void => {
  emit('close');
};
</script>

<style lang="scss" scoped>

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 85%);

  @include utils.flex-center;

  z-index: tokens.$z-modal;
  animation: modalFadeIn 0.4s ease;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: linear-gradient(135deg, tokens.$gray-50 0%, tokens.$gray-200 100%);
  border-radius: tokens.$radius-xl;
  box-shadow:
    0 10px 40px rgb(0 0 0 / 30%),
    0 0 0 4px rgb(102 126 234 / 30%),
    inset 0 1px 0 rgb(255 255 255 / 80%);
  width: 90%;
  max-width: 550px;
  animation: modalSlideUp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  border: 3px solid tokens.$primary;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgb(255 255 255 / 20%), transparent);
    transition: left 0.5s ease;
    z-index: 0;
  }

  &:hover::before {
    left: 100%;
  }
}

.modal-header {
  @include utils.flex-between;

  padding: tokens.$spacing-5 tokens.$spacing-6;
  border-bottom: 3px solid tokens.$gray-300;
  background: linear-gradient(135deg, tokens.$primary 0%, #764ba2 100%);
  border-radius: tokens.$radius-lg tokens.$radius-lg 0 0;
  position: relative;
  z-index: 1;
}

.modal-title {
  font-size: tokens.$font-size-2xl;
  font-weight: tokens.$font-weight-bold;
  color: tokens.$text-primary;
  margin: 0;
  text-shadow:
    0 0 10px rgb(255 255 255 / 80%),
    2px 2px 4px rgb(0 0 0 / 50%);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  letter-spacing: 1px;
}

.close-btn {
  background: linear-gradient(135deg, tokens.$error 0%, #e53e3e 100%);
  border: 2px solid tokens.$text-primary;
  font-size: tokens.$font-size-lg;
  color: tokens.$text-primary;
  cursor: pointer;
  padding: tokens.$spacing-2;
  width: 40px;
  height: 40px;

  @include utils.flex-center;

  border-radius: tokens.$radius-full;
  transition: all tokens.$transition-normal;
  box-shadow: 0 4px 15px rgb(239 68 68 / 40%);
  position: relative;
  z-index: 1;

  &:hover {
    transform: rotate(90deg) scale(1.1);
    box-shadow: 0 6px 20px rgb(239 68 68 / 60%);
    background: linear-gradient(135deg, #e53e3e 0%, tokens.$error 100%);
  }

  &:active {
    transform: rotate(90deg) scale(0.95);
  }
}

.close-icon {
  font-size: tokens.$font-size-xl;
  line-height: 1;
}

.modal-body {
  padding: tokens.$spacing-6;
  color: tokens.$gray-700;
  line-height: tokens.$line-height-relaxed;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  position: relative;
  z-index: 1;
  background: rgb(255 255 255 / 80%);
}

.modal-footer {
  @include utils.flex-row(tokens.$spacing-3, center, flex-end);

  padding: tokens.$spacing-5 tokens.$spacing-6;
  border-top: 3px solid tokens.$gray-300;
  background: linear-gradient(135deg, tokens.$gray-100 0%, tokens.$gray-200 100%);
  border-radius: 0 0 tokens.$radius-lg tokens.$radius-lg;
  position: relative;
  z-index: 1;
}

.modal-btn {
  padding: tokens.$spacing-3 tokens.$spacing-6;
  border: 2px solid transparent;
  border-radius: tokens.$radius-lg;
  cursor: pointer;
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-bold;
  transition: all tokens.$transition-normal;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgb(0 0 0 / 15%);
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgb(255 255 255 / 40%), transparent);
    transition: left 0.5s ease;
    z-index: -1;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgb(0 0 0 / 25%);
  }

  &:active {
    transform: translateY(-1px);
  }

  &.primary {
    background: linear-gradient(135deg, tokens.$primary 0%, #764ba2 100%);
    color: tokens.$text-primary;
    border-color: tokens.$primary;
    box-shadow: 0 4px 15px rgb(102 126 234 / 40%);

    &:hover {
      box-shadow: 0 8px 25px rgb(102 126 234 / 60%);
    }
  }

  &.secondary {
    background: linear-gradient(135deg, tokens.$warning 0%, #d97706 100%);
    color: tokens.$text-primary;
    border-color: tokens.$warning;
    box-shadow: 0 4px 15px rgb(245 158 11 / 40%);

    &:hover {
      box-shadow: 0 8px 25px rgb(245 158 11 / 60%);
    }
  }

  &.danger {
    background: linear-gradient(135deg, tokens.$error 0%, #e53e3e 100%);
    color: tokens.$text-primary;
    border-color: tokens.$error;
    box-shadow: 0 4px 15px rgb(239 68 68 / 40%);

    &:hover {
      box-shadow: 0 8px 25px rgb(239 68 68 / 60%);
    }
  }
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes modalSlideUp {
  from {
    transform: translateY(100px) scale(0.8);
    opacity: 0;
  }

  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>
