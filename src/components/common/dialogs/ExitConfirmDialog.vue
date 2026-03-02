<template>
  <div v-if="isVisible" class="exit-dialog-overlay" @click="handleOverlayClick">
    <div class="exit-dialog" @click.stop>
      <div class="exit-dialog-header">
        <h3 class="exit-dialog-title">{{ title }}</h3>
      </div>
      <div class="exit-dialog-body">
        <p class="exit-dialog-message">{{ message }}</p>
      </div>
      <div class="exit-dialog-footer">
        <button class="exit-dialog-button exit-button" @click="handleExit">
          直接退出
        </button>
        <button class="exit-dialog-button save-button" @click="handleSave">
          立即保存
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Props定义
const props = defineProps<{
  isVisible: boolean;
  title?: string;
  message?: string;
}>();

// Emits定义
const emit = defineEmits<{
  close: [];
  exit: [];
  save: [];
}>();

// 默认属性
const title = props.title || '退出游戏确认';
const message = props.message || '您正在退出游戏，如未保存将造成数据丢失！';

// 处理遮罩点击
const handleOverlayClick = () => {
  emit('close');
};

// 处理直接退出
const handleExit = () => {
  emit('exit');
};

// 处理保存
const handleSave = () => {
  emit('save');
};
</script>

<style lang="scss" scoped>
.exit-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 80%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.exit-dialog {
  background: #1a1a2e;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 0 20px rgb(0 0 0 / 50%);
}

.exit-dialog-header {
  margin-bottom: 15px;
}

.exit-dialog-title {
  margin: 0;
  color: #4a9eff;
  font-size: 18px;
  font-weight: bold;
}

.exit-dialog-body {
  margin-bottom: 20px;
}

.exit-dialog-message {
  margin: 0;
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
}

.exit-dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.exit-dialog-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.exit-button {
  background-color: #ff6b6b;
  color: white;

  &:hover {
    background-color: #ff5252;
  }
}

.save-button {
  background-color: #4a9eff;
  color: white;

  &:hover {
    background-color: #357abd;
  }
}
</style>
