<template>
  <div class="graphics-settings-tab">
    <h3 class="text-gold">画面设置</h3>
    <div class="settings-group">
      <div class="setting-item">
        <div class="setting-label">画面质量</div>
        <div class="setting-control">
          <div class="option-buttons">
            <button
              v-for="quality in graphicsQualities"
              :key="quality.id"
              class="option-btn"
              :class="{ active: modelValue.quality === quality.id }"
              @click="$emit('update:quality', quality.id)"
            >
              {{ quality.name }}
            </button>
          </div>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-label">全屏模式</div>
        <div class="setting-control">
          <div class="toggle-switch">
            <button
              class="toggle-btn"
              :class="{ active: modelValue.fullscreen }"
              @click="$emit('update:fullscreen', !modelValue.fullscreen)"
            >
              <span class="toggle-slider"></span>
            </button>
          </div>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-label">帧率限制</div>
        <div class="setting-control">
          <div class="option-buttons">
            <button
              v-for="fps in fpsLimits"
              :key="fps.id"
              class="option-btn"
              :class="{ active: modelValue.fpsLimit === fps.id }"
              @click="$emit('update:fpsLimit', fps.id)"
            >
              {{ fps.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface GraphicsSettings {
  quality: string;
  fullscreen: boolean;
  fpsLimit: string;
}

const graphicsQualities = [
  { id: 'low', name: '低' },
  { id: 'medium', name: '中' },
  { id: 'high', name: '高' },
  { id: 'ultra', name: '极致' },
];

const fpsLimits = [
  { id: '30', name: '30 FPS' },
  { id: '60', name: '60 FPS' },
  { id: '120', name: '120 FPS' },
  { id: 'unlimited', name: '不限制' },
];

const props = defineProps<{
  modelValue: GraphicsSettings;
}>();

const emit = defineEmits<{
  'update:quality': [id: string];
  'update:fullscreen': [value: boolean];
  'update:fpsLimit': [id: string];
}>();
</script>

<style lang="scss" scoped>
.graphics-settings-tab {
  padding: tokens.$spacing-lg;
}

.text-gold {
  color: tokens.$primary-gold;
  margin: 0 0 tokens.$spacing-xl 0;
  font-size: tokens.$font-size-xl;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: tokens.$spacing-lg;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: tokens.$spacing-md;
  background: tokens.$bg-light;
  border: 1px solid tokens.$border-medium;
  border-radius: tokens.$radius-md;
}

.setting-label {
  font-size: tokens.$font-size-base;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
}

.setting-control {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.option-buttons {
  display: flex;
  gap: tokens.$spacing-xs;
}

.option-btn {
  padding: tokens.$spacing-xs tokens.$spacing-md;
  background: tokens.$bg-secondary;
  border: 2px solid tokens.$border-medium;
  border-radius: tokens.$radius-sm;
  font-size: tokens.$font-size-sm;
  font-weight: tokens.$font-weight-medium;
  color: tokens.$text-primary;
  cursor: pointer;
  transition: all tokens.$transition-fast;

  &:hover {
    border-color: tokens.$primary-blue;
    background: rgb(74 158 255 / 10%);
  }

  &.active {
    border-color: tokens.$primary-blue;
    background: rgb(74 158 255 / 20%);
    color: tokens.$primary-blue;
  }
}

.toggle-switch {
  width: 60px;
  height: 30px;
}

.toggle-btn {
  width: 100%;
  height: 100%;
  background: tokens.$bg-secondary;
  border: 2px solid tokens.$border-medium;
  border-radius: 15px;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  position: relative;

  &.active {
    background: tokens.$primary-blue;
    border-color: tokens.$primary-blue;
  }

  .toggle-slider {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 22px;
    height: 22px;
    background: #fff;
    border-radius: 50%;
    transition: all tokens.$transition-fast;
  }

  &.active .toggle-slider {
    left: calc(100% - 24px);
  }
}
</style>
