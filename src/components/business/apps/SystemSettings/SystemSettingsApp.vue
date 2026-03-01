<template>
  <ApplicationWindow windowTitle="系统设置">
    <template #sidebar>
      <div class="sidebar-menu">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="menu-item"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="menu-icon">{{ tab.icon }}</span>
          <span class="menu-name">{{ tab.name }}</span>
        </button>
      </div>
    </template>

    <template #content>
      <div class="system-settings-content">
        <!-- 存档管理 -->
        <SaveManagementTab
          v-if="activeTab === 'save'"
          :save-files="saveFiles"
          @load="handleLoadSave"
          @delete="handleDeleteSave"
          @create="handleCreateSave"
        />

        <!-- 画面设置 -->
        <GraphicsSettingsTab
          v-else-if="activeTab === 'graphics'"
          v-model:quality="graphicsSettings.quality"
          v-model:fullscreen="graphicsSettings.fullscreen"
          v-model:fps-limit="graphicsSettings.fpsLimit"
        />

        <!-- 音效设置 -->
        <AudioSettingsTab
          v-else-if="activeTab === 'audio'"
          v-model:bg-music="audioSettings.bgMusic"
          v-model:sound-effects="audioSettings.soundEffects"
          v-model:voice="audioSettings.voice"
        />

        <!-- 系统信息 -->
        <div
          v-else-if="activeTab === 'info'"
          class="system-info-tab"
        >
          <h3 class="text-gold">系统信息</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">游戏版本</span>
              <span class="info-value">1.0.0</span>
            </div>
            <div class="info-item">
              <span class="info-label">游戏时间</span>
              <span class="info-value">{{
                gameData?.gameState?.currentDate
                  ? `${gameData.gameState.currentDate.year}年${gameData.gameState.currentDate.month}月${gameData.gameState.currentDate.day}日`
                  : '加载中...'
              }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">策划等级</span>
              <span class="info-value">{{ gameData?.careerData?.currentLevel?.name || 'N/A' }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ApplicationWindow>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ApplicationWindow from '@/components/common/window/ApplicationWindow.vue';
import SaveManagementTab from './SaveManagementTab.vue';
import GraphicsSettingsTab from './GraphicsSettingsTab.vue';
import AudioSettingsTab from './AudioSettingsTab.vue';

import type { GameData } from '@/types/game';

const props = defineProps<{
  gameData?: GameData;
}>();

const tabs = [
  { id: 'save', name: '存档管理', icon: '💾' },
  { id: 'graphics', name: '画面设置', icon: '🖥️' },
  { id: 'audio', name: '音效设置', icon: '🔊' },
  { id: 'info', name: '系统信息', icon: 'ℹ️' },
];

const activeTab = ref<string>('save');

const saveFiles = ref([
  {
    id: '1',
    name: '存档 1',
    date: '2026-02-28 10:30',
    progress: '策划等级：Lv.10',
    isCurrent: true,
  },
  {
    id: '2',
    name: '存档 2',
    date: '2026-02-27 15:20',
    progress: '策划等级：Lv.8',
    isCurrent: false,
  },
]);

const graphicsSettings = ref({
  quality: 'high',
  fullscreen: false,
  fpsLimit: '60',
});

const audioSettings = ref({
  bgMusic: 75,
  soundEffects: 100,
  voice: 100,
});

const handleLoadSave = (id: string) => {
  const save = saveFiles.value.find((s) => s.id === id);
  if (save) {
    alert(`已加载存档：${save.name}`);
    saveFiles.value.forEach((s) => {
      s.isCurrent = s.id === id;
    });
  }
};

const handleDeleteSave = (id: string) => {
  if (confirm('确定要删除此存档吗？')) {
    saveFiles.value = saveFiles.value.filter((s) => s.id !== id);
    alert('存档已删除');
  }
};

const handleCreateSave = () => {
  const newSave = {
    id: Date.now().toString(),
    name: `存档${saveFiles.value.length + 1}`,
    date: new Date().toLocaleString('zh-CN'),
    progress: '策划等级：Lv.10',
    isCurrent: false,
  };
  saveFiles.value.push(newSave);
  alert('存档已创建');
};
</script>

<style lang="scss" scoped>
.sidebar-menu {
  display: flex;
  flex-direction: column;
  padding: tokens.$spacing-md 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: tokens.$spacing-md;
  padding: tokens.$spacing-md tokens.$spacing-lg;
  background: transparent;
  border: none;
  border-radius: tokens.$radius-md;
  cursor: pointer;
  transition: all tokens.$transition-fast;
  text-align: left;
  margin: 0 tokens.$spacing-sm;

  &:hover {
    background: rgb(74 158 255 / 10%);
  }

  &.active {
    background: rgb(74 158 255 / 20%);
    color: tokens.$primary-blue;
  }

  .menu-icon {
    font-size: tokens.$font-size-lg;
  }

  .menu-name {
    font-size: tokens.$font-size-base;
    font-weight: tokens.$font-weight-medium;
  }
}

.system-settings-content {
  padding: tokens.$spacing-lg;
  height: 100%;
  overflow: auto;
}

.text-gold {
  color: tokens.$primary-gold;
}

.system-info-tab {
  .info-list {
    display: flex;
    flex-direction: column;
    gap: tokens.$spacing-md;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    padding: tokens.$spacing-md;
    background: tokens.$bg-light;
    border: 1px solid tokens.$border-medium;
    border-radius: tokens.$radius-md;

    .info-label {
      font-weight: tokens.$font-weight-medium;
      color: tokens.$text-primary;
    }

    .info-value {
      color: tokens.$text-secondary;
    }
  }
}
</style>
