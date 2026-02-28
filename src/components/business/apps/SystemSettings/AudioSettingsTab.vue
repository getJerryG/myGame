<template>
  <div class="audio-settings-tab">
    <h3 class="text-gold">音效设置</h3>
    <div class="settings-group">
      <div class="setting-item">
        <div class="setting-label">背景音乐</div>
        <div class="setting-control">
          <div class="option-buttons">
            <button
              v-for="level in volumeLevels"
              :key="level.id"
              class="option-btn"
              :class="{ active: modelValue.bgMusic === level.value }"
              @click="$emit('update:bgMusic', level.value)"
            >
              {{ level.name }}
            </button>
          </div>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-label">音效</div>
        <div class="setting-control">
          <div class="option-buttons">
            <button
              v-for="level in volumeLevels"
              :key="level.id"
              class="option-btn"
              :class="{ active: modelValue.soundEffects === level.value }"
              @click="$emit('update:soundEffects', level.value)"
            >
              {{ level.name }}
            </button>
          </div>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-label">语音</div>
        <div class="setting-control">
          <div class="option-buttons">
            <button
              v-for="level in volumeLevels"
              :key="level.id"
              class="option-btn"
              :class="{ active: modelValue.voice === level.value }"
              @click="$emit('update:voice', level.value)"
            >
              {{ level.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface AudioSettings {
  bgMusic: number;
  soundEffects: number;
  voice: number;
}

const volumeLevels = [
  { id: '0', name: '静音', value: 0 },
  { id: '25', name: '25%', value: 25 },
  { id: '50', name: '50%', value: 50 },
  { id: '75', name: '75%', value: 75 },
  { id: '100', name: '100%', value: 100 },
];

const props = defineProps<{
  modelValue: AudioSettings;
}>();

const emit = defineEmits<{
  'update:bgMusic': [value: number];
  'update:soundEffects': [value: number];
  'update:voice': [value: number];
}>();
</script>

<style lang="scss" scoped>
.audio-settings-tab {
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
</style>
