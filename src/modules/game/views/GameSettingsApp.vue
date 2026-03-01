<template>
  <div class="game-settings-app">
    <!-- 应用头部 -->
    <div class="app-header">
      <h2 class="app-title">游戏设置</h2>
      <button
        class="close-btn"
        @click="closeApp"
      >
        ×
      </button>
    </div>

    <!-- 设置内容 -->
    <div class="settings-content">
      <!-- 音频设置 -->
      <div class="settings-section">
        <h3 class="section-title">音频设置</h3>
        <div class="setting-item">
          <span class="setting-label">主音量</span>
          <input
            v-model="settings.masterVolume"
            type="range"
            min="0"
            max="100"
            class="setting-slider"
          />
          <span class="setting-value">{{ settings.masterVolume }}%</span>
        </div>
        <div class="setting-item">
          <span class="setting-label">背景音乐</span>
          <input
            v-model="settings.bgmVolume"
            type="range"
            min="0"
            max="100"
            class="setting-slider"
          />
          <span class="setting-value">{{ settings.bgmVolume }}%</span>
        </div>
        <div class="setting-item">
          <span class="setting-label">音效</span>
          <input
            v-model="settings.sfxVolume"
            type="range"
            min="0"
            max="100"
            class="setting-slider"
          />
          <span class="setting-value">{{ settings.sfxVolume }}%</span>
        </div>
      </div>

      <!-- 画面设置 -->
      <div class="settings-section">
        <h3 class="section-title">画面设置</h3>
        <div class="setting-item">
          <span class="setting-label">分辨率</span>
          <select
            v-model="settings.resolution"
            class="setting-select"
          >
            <option value="1920x1080">1920x1080</option>
            <option value="1600x900">1600x900</option>
            <option value="1366x768">1366x768</option>
            <option value="1280x720">1280x720</option>
          </select>
        </div>
        <div class="setting-item">
          <span class="setting-label">全屏模式</span>
          <label class="toggle-switch">
            <input
              v-model="settings.fullscreen"
              type="checkbox"
            />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <span class="setting-label">垂直同步</span>
          <label class="toggle-switch">
            <input
              v-model="settings.vsync"
              type="checkbox"
            />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <!-- 游戏设置 -->
      <div class="settings-section">
        <h3 class="section-title">游戏设置</h3>
        <div class="setting-item">
          <span class="setting-label">自动保存</span>
          <label class="toggle-switch">
            <input
              v-model="settings.autoSave"
              type="checkbox"
            />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <span class="setting-label">显示FPS</span>
          <label class="toggle-switch">
            <input
              v-model="settings.showFps"
              type="checkbox"
            />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <span class="setting-label">语言</span>
          <select
            v-model="settings.language"
            class="setting-select"
          >
            <option value="zh-CN">简体中文</option>
            <option value="zh-TW">繁体中文</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="settings-footer">
      <button
        class="footer-btn secondary"
        @click="resetSettings"
      >
        恢复默认
      </button>
      <button
        class="footer-btn primary"
        @click="saveSettings"
      >
        保存设置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

// 设置数据
const settings = reactive({
  masterVolume: 80,
  bgmVolume: 60,
  sfxVolume: 70,
  resolution: '1920x1080',
  fullscreen: false,
  vsync: true,
  autoSave: true,
  showFps: false,
  language: 'zh-CN',
});

// 恢复默认设置
const resetSettings = () => {
  settings.masterVolume = 80;
  settings.bgmVolume = 60;
  settings.sfxVolume = 70;
  settings.resolution = '1920x1080';
  settings.fullscreen = false;
  settings.vsync = true;
  settings.autoSave = true;
  settings.showFps = false;
  settings.language = 'zh-CN';
};

// 保存设置
const saveSettings = () => {
  // TODO: 实现保存设置逻辑
  alert('设置已保存！');
};

// 关闭应用
const closeApp = () => {
  window.history.back();
};
</script>

<style lang="scss" scoped>

.game-settings-app {
  @include utils.flex-col(tokens.$spacing-0, stretch, flex-start);

  height: 100%;
  background-color: tokens.$bg-lighter;
  border-radius: tokens.$radius-lg;
  overflow: hidden;
}

.app-header {
  @include utils.flex-between;

  padding: tokens.$spacing-md tokens.$spacing-lg;
  background: linear-gradient(135deg, tokens.$gray-600 0%, tokens.$gray-700 100%);
  color: tokens.$text-primary;

  .app-title {
    margin: 0;
    font-size: tokens.$font-size-xl;
    font-weight: tokens.$font-weight-bold;
  }

  .close-btn {
    background: none;
    border: none;
    color: tokens.$text-primary;
    font-size: tokens.$font-size-2xl;
    cursor: pointer;
    width: 32px;
    height: 32px;

    @include utils.flex-center;

    border-radius: 50%;
    transition: all tokens.$transition-normal;

    &:hover {
      background-color: rgb(255 255 255 / 20%);
    }
  }
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: tokens.$spacing-xl;
}

.settings-section {
  margin-bottom: tokens.$spacing-xl;

  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    margin: 0 0 tokens.$spacing-md;
    font-size: tokens.$font-size-lg;
    font-weight: tokens.$font-weight-bold;
    color: tokens.$text-primary;
    padding-bottom: tokens.$spacing-sm;
    border-bottom: 2px solid tokens.$border-light;
  }
}

.setting-item {
  @include utils.flex-row(tokens.$spacing-md, center, flex-start);

  padding: tokens.$spacing-md 0;
  border-bottom: 1px solid tokens.$border-light;

  &:last-child {
    border-bottom: none;
  }
}

.setting-label {
  flex: 1;
  font-size: tokens.$font-size-base;
  color: tokens.$text-primary;
}

.setting-slider {
  width: 150px;
  height: 6px;
  border-radius: 3px;
  background: tokens.$bg-light;
  outline: none;
  appearance: none;

  &::-webkit-slider-thumb {
    appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: tokens.$primary;
    cursor: pointer;
    box-shadow: 0 2px 6px rgb(74 158 255 / 40%);
    transition: all tokens.$transition-normal;

    &:hover {
      transform: scale(1.2);
    }
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: tokens.$primary;
    cursor: pointer;
    border: none;
  }
}

.setting-value {
  min-width: 50px;
  text-align: right;
  font-size: tokens.$font-size-sm;
  color: tokens.$text-muted;
}

.setting-select {
  padding: tokens.$spacing-sm tokens.$spacing-md;
  font-size: tokens.$font-size-base;
  border: 2px solid tokens.$border-light;
  border-radius: tokens.$radius-md;
  background-color: tokens.$bg-light;
  color: tokens.$text-primary;
  outline: none;
  cursor: pointer;
  min-width: 150px;

  &:focus {
    border-color: tokens.$primary;
    box-shadow: 0 0 0 3px rgb(74 158 255 / 20%);
  }
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .toggle-slider {
      background-color: tokens.$primary;

      &::before {
        transform: translateX(24px);
      }
    }
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: tokens.$bg-light;
    transition: tokens.$transition-normal;
    border-radius: 26px;
    border: 2px solid tokens.$border-light;

    &::before {
      position: absolute;
      content: '';
      height: 18px;
      width: 18px;
      left: 2px;
      bottom: 2px;
      background-color: tokens.$text-primary;
      transition: tokens.$transition-normal;
      border-radius: 50%;
    }
  }
}

.settings-footer {
  @include utils.flex-row(tokens.$spacing-md, center, center);

  padding: tokens.$spacing-md tokens.$spacing-xl;
  background-color: tokens.$bg-light;
  border-top: 1px solid tokens.$border-light;

  .footer-btn {
    padding: tokens.$spacing-sm tokens.$spacing-xl;
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-semibold;
    border: none;
    border-radius: tokens.$radius-md;
    cursor: pointer;
    transition: all tokens.$transition-normal;
    min-width: 120px;

    &.primary {
      background: linear-gradient(135deg, tokens.$primary 0%, tokens.$primary-dark 100%);
      color: tokens.$text-primary;
      box-shadow: 0 4px 15px rgb(74 158 255 / 40%);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgb(74 158 255 / 60%);
      }
    }

    &.secondary {
      background-color: tokens.$bg-lighter;
      color: tokens.$text-primary;
      border: 2px solid tokens.$border-light;

      &:hover {
        background-color: tokens.$bg-light;
        border-color: tokens.$primary;
      }
    }
  }
}

/* 响应式设计 */
@media (width <= 768px) {
  .settings-content {
    padding: tokens.$spacing-lg tokens.$spacing-md;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: tokens.$spacing-sm;
  }

  .setting-slider,
  .setting-select {
    width: 100%;
  }

  .settings-footer {
    flex-direction: column;

    .footer-btn {
      width: 100%;
    }
  }
}
</style>
