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
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: modalFadeIn 0.4s ease;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 20px;
  box-shadow:
    0 10px 40px rgb(0 0 0 / 30%),
    0 0 0 4px rgb(102 126 234 / 30%),
    inset 0 1px 0 rgb(255 255 255 / 80%);
  width: 90%;
  max-width: 550px;
  animation: modalSlideUp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  border: 3px solid #667eea;
  position: relative;
  overflow: hidden;
}

.modal-content::before {
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

.modal-content:hover::before {
  left: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 3px solid #cbd5e1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px 15px 0 0;
  position: relative;
  z-index: 1;
}

.modal-title {
  font-size: 24px;
  font-weight: 900;
  color: white;
  margin: 0;
  text-shadow:
    0 0 10px rgb(255 255 255 / 80%),
    2px 2px 4px rgb(0 0 0 / 50%);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  letter-spacing: 1px;
}

.close-btn {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  border: 2px solid white;
  font-size: 20px;
  color: white;
  cursor: pointer;
  padding: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgb(245 101 101 / 40%);
  position: relative;
  z-index: 1;
}

.close-btn:hover {
  transform: rotate(90deg) scale(1.1);
  box-shadow: 0 6px 20px rgb(245 101 101 / 60%);
  background: linear-gradient(135deg, #e53e3e 0%, #f56565 100%);
}

.close-btn:active {
  transform: rotate(90deg) scale(0.95);
}

.close-icon {
  font-size: 22px;
  line-height: 1;
}

.modal-body {
  padding: 25px;
  color: #4a5568;
  line-height: 1.6;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  position: relative;
  z-index: 1;
  background: rgb(255 255 255 / 80%);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 25px;
  border-top: 3px solid #cbd5e1;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 0 0 15px 15px;
  position: relative;
  z-index: 1;
}

.modal-btn {
  padding: 12px 24px;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgb(0 0 0 / 15%);
  z-index: 1;
}

.modal-btn::before {
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

.modal-btn:hover::before {
  left: 100%;
}

.modal-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgb(0 0 0 / 25%);
}

.modal-btn:active {
  transform: translateY(-1px);
}

.modal-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 15px rgb(102 126 234 / 40%);
}

.modal-btn.primary:hover {
  box-shadow: 0 8px 25px rgb(102 126 234 / 60%);
}

.modal-btn.secondary {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border-color: #f59e0b;
  box-shadow: 0 4px 15px rgb(245 158 11 / 40%);
}

.modal-btn.secondary:hover {
  box-shadow: 0 8px 25px rgb(245 158 11 / 60%);
}

.modal-btn.danger {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  color: white;
  border-color: #f56565;
  box-shadow: 0 4px 15px rgb(245 101 101 / 40%);
}

.modal-btn.danger:hover {
  box-shadow: 0 8px 25px rgb(245 101 101 / 60%);
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
