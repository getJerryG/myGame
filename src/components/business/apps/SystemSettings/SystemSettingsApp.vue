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
        <div
          v-if="activeTab === 'save'"
          class="settings-section"
        >
          <h3 class="text-gold">存档管理</h3>
          <div class="save-list">
            <div
              v-for="save in saveFiles"
              :key="save.id"
              class="save-item"
              :class="{ active: save.isCurrent }"
            >
              <div class="save-info">
                <div class="save-name">{{ save.name }}</div>
                <div class="save-date">{{ save.date }}</div>
                <div class="save-progress">{{ save.progress }}</div>
              </div>
              <div class="save-actions">
                <button
                  class="action-btn load"
                  @click="loadSave(save.id)"
                  :disabled="save.isCurrent"
                >
                  {{ save.isCurrent ? '当前存档' : '加载' }}
                </button>
                <button
                  class="action-btn delete"
                  @click="deleteSave(save.id)"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
          <button
            class="save-btn"
            @click="createSave"
          >
            新建存档
          </button>
        </div>

        <!-- 画面设置 -->
        <div
          v-if="activeTab === 'graphics'"
          class="settings-section"
        >
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
                    :class="{ active: graphicsSettings.quality === quality.id }"
                    @click="graphicsSettings.quality = quality.id"
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
                    :class="{ active: graphicsSettings.fullscreen }"
                    @click="graphicsSettings.fullscreen = !graphicsSettings.fullscreen"
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
                    :class="{ active: graphicsSettings.fpsLimit === fps.id }"
                    @click="graphicsSettings.fpsLimit = fps.id"
                  >
                    {{ fps.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 音效设置 -->
        <div
          v-if="activeTab === 'audio'"
          class="settings-section"
        >
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
                    :class="{ active: audioSettings.bgMusic === level.value }"
                    @click="audioSettings.bgMusic = level.value"
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
                    :class="{ active: audioSettings.soundEffects === level.value }"
                    @click="audioSettings.soundEffects = level.value"
                  >
                    {{ level.name }}
                  </button>
                </div>
              </div>
            </div>
            <div class="setting-item">
              <div class="setting-label">静音</div>
              <div class="setting-control">
                <div class="toggle-switch">
                  <button
                    class="toggle-btn"
                    :class="{ active: audioSettings.mute }"
                    @click="audioSettings.mute = !audioSettings.mute"
                  >
                    <span class="toggle-slider"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 新手引导 -->
        <div
          v-if="activeTab === 'tutorial'"
          class="settings-section"
        >
          <h3 class="text-gold">新手引导</h3>
          <div class="tutorial-content">
            <p>重新开启新手引导将重置所有引导进度，下次游戏时会重新显示所有引导提示</p>
            <button
              class="tutorial-btn"
              @click="resetTutorial"
            >
              重置新手引导
            </button>
          </div>
        </div>

        <!-- 主题设置 -->
        <div
          v-if="activeTab === 'theme'"
          class="settings-section"
        >
          <h3 class="text-gold">主题设置</h3>
          <div class="settings-group">
            <div class="setting-item">
              <div class="setting-label">主题模式</div>
              <div class="setting-control">
                <div class="option-buttons">
                  <button
                    v-for="theme in themeOptions"
                    :key="theme.id"
                    class="option-btn theme-btn"
                    :class="{ active: activeTheme === theme.id }"
                    @click="changeTheme(theme.id)"
                  >
                    <span class="theme-icon">{{ theme.icon }}</span>
                    <span class="theme-name">{{ theme.name }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 保存按钮 -->
        <div class="save-settings-section">
          <button
            class="save-settings-btn"
            @click="saveSettings"
          >
            保存设置
          </button>
        </div>
      </div>
    </template>
  </ApplicationWindow>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ApplicationWindow from '@/components/common/window/ApplicationWindow.vue';

// 标签页数�?const activeTab = ref('save');
const tabs = [
  { id: 'save', name: '存档管理', icon: '💾' },
  { id: 'graphics', name: '画面设置', icon: '🎨' },
  { id: 'audio', name: '音效设置', icon: '🔊' },
  { id: 'theme', name: '主题设置', icon: '🌓' },
  { id: 'tutorial', name: '新手引导', icon: '📚' },
];

// 主题设置
const themeOptions = [
  { id: 'auto', name: '跟随系统', icon: '🔄' },
  { id: 'dark', name: '深色模式', icon: '🌙' },
  { id: 'light', name: '浅色模式', icon: '☀️' },
];

const activeTheme = ref(localStorage.getItem('app-theme') || 'auto');

// 应用主题
const applyTheme = (theme: string) => {
  const html = document.documentElement;
  html.classList.remove('theme-dark', 'theme-light');

  if (theme === 'dark' || theme === 'light') {
    html.classList.add(`theme-${theme}`);
    localStorage.setItem('app-theme', theme);
  } else {
    // 跟随系统
    localStorage.removeItem('app-theme');
  }
};

// 初始化主�?applyTheme(activeTheme.value);

// 切换主题
const changeTheme = (theme: string) => {
  activeTheme.value = theme;
  applyTheme(theme);
};

// 存档数据
const saveFiles = ref([
  {
    id: '1',
    name: '存档1',
    date: '2026-02-14 14:30:22',
    progress: '�?�?�?�?| 见习策划III',
    isCurrent: true,
  },
  {
    id: '2',
    name: '存档2',
    date: '2026-02-14 10:15:45',
    progress: '�?�?�?�?| 见习策划III',
    isCurrent: false,
  },
]);

// 画面设置
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
  { id: 'unlimited', name: '无限' },
];

const graphicsSettings = ref({
  quality: 'medium',
  fullscreen: false,
  fpsLimit: '60',
});

// 音量等级选项
const volumeLevels = ref([
  { id: 'mute', name: '静音', value: 0 },
  { id: 'low', name: '低', value: 25 },
  { id: 'medium', name: '中', value: 50 },
  { id: 'high', name: '高', value: 75 },
  { id: 'max', name: '最高', value: 100 },
]);

// 音效设置
const audioSettings = ref({
  bgMusic: 75, // 对应"�?等级
  soundEffects: 100, // 对应"最�?等级
  mute: false,
});

// 存档管理方法
const loadSave = (saveId: string) => {
  console.log('加载存档:', saveId);
  // 这里实现加载存档的逻辑
};

const deleteSave = (saveId: string) => {
  console.log('删除存档:', saveId);
  // 这里实现删除存档的逻辑
};

const createSave = () => {
  console.log('新建存档');
  // 这里实现新建存档的逻辑
};

// 重置新手引导
const resetTutorial = () => {
  console.log('重置新手引导');
  // 这里实现重置新手引导的逻辑
};

// 保存设置
const saveSettings = () => {
  console.log('保存设置');
  // 这里实现保存设置的逻辑
};
</script>

<style lang="scss" scoped>
/* 侧边栏菜�? */
.sidebar-menu {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--sidebar-bg, #2a2a3a);
  padding: 16px 0;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: none;
  border: none;
  color: var(--sidebar-text, #aaa);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 16px;
  font-weight: var(--font-semibold, 600);
}

.menu-item:hover {
  background-color: var(--sidebar-hover, rgb(74 158 255 / 10%));
  color: var(--sidebar-hover-text, #4a9eff);
}

.menu-item.active {
  background-color: var(--sidebar-active, rgb(74 158 255 / 20%));
  color: var(--sidebar-active-text, #4a9eff);
  border-right: 3px solid var(--sidebar-active-border, #4a9eff);
}

.menu-icon {
  font-size: 20px;
}

/* 设置内容 */
.system-settings-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: var(--content-bg, #1e1e2e);
  color: var(--text-primary, #fff);
  overflow: hidden;
}

.settings-section {
  margin-bottom: 32px;
}

.settings-section h3 {
  margin: 0 0 20px;
  font-size: 22px;
  color: var(--primary-gold, #ffd700);
  font-weight: var(--font-bold, 700);
}

/* 存档管理 */
.save-list {
  margin-bottom: 24px;
}

.save-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--card-bg, #2a2a3a);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 30%);
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

.save-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgb(0 0 0 / 40%);
}

.save-item.active {
  border-left-color: var(--primary-color, #4a9eff);
  background-color: var(--card-hover, rgb(74 158 255 / 10%));
}

.save-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.save-name {
  font-size: 18px;
  font-weight: var(--font-bold, 700);
  color: var(--text-primary, #fff);
}

.save-date {
  font-size: 14px;
  color: var(--text-secondary, #aaa);
}

.save-progress {
  font-size: 14px;
  color: var(--primary-color, #4a9eff);
}

.save-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: var(--font-bold, 700);
  transition: all 0.2s ease;
}

.action-btn.load {
  background-color: var(--primary-color, #4a9eff);
  color: white;
}

.action-btn.load:hover:not(:disabled) {
  background-color: var(--primary-hover, #357abd);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgb(74 158 255 / 30%);
}

.action-btn.load:disabled {
  background-color: var(--disabled-bg, #555);
  color: var(--disabled-text, #aaa);
  cursor: not-allowed;
}

.action-btn.delete {
  background-color: var(--danger-color, #ff4757);
  color: white;
}

.action-btn.delete:hover {
  background-color: var(--danger-hover, #e84118);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgb(255 71 87 / 30%);
}

.save-btn {
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color, #4a9eff);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: var(--font-bold, 700);
  transition: all 0.2s ease;
}

.save-btn:hover {
  background-color: var(--primary-hover, #357abd);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgb(74 158 255 / 30%);
}

/* 设置�? */
.settings-group {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: var(--card-bg, #2a2a3a);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 30%);
}

.setting-label {
  font-size: 16px;
  font-weight: var(--font-bold, 700);
  color: var(--text-primary, #fff);
}

/* 选项按钮 */
.option-buttons {
  display: flex;
  gap: 12px;
}

.option-btn {
  padding: 10px 20px;
  border: 2px solid var(--border-color, rgb(74 158 255 / 20%));
  background-color: var(--button-bg, rgb(74 158 255 / 10%));
  color: var(--text-primary, #fff);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: var(--font-semibold, 600);
}

.option-btn:hover {
  background-color: var(--button-hover, rgb(74 158 255 / 20%));
  border-color: var(--primary-color, #4a9eff);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgb(74 158 255 / 20%);
}

.option-btn.active {
  background-color: var(--button-active, rgb(74 158 255 / 30%));
  border-color: var(--primary-color, #4a9eff);
}

/* 主题按钮 */
.theme-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  text-align: center;
}

.theme-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.theme-name {
  font-size: 14px;
  font-weight: var(--font-semibold, 600);
}

/* 切换开�? */
.toggle-switch {
  display: inline-block;
}

.toggle-btn {
  position: relative;
  width: 60px;
  height: 30px;
  background-color: var(--toggle-bg, rgb(74 158 255 / 20%));
  border: 2px solid var(--toggle-border, rgb(74 158 255 / 30%));
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn.active {
  background-color: var(--toggle-active-bg, #4a9eff);
  border-color: var(--toggle-active-border, #4a9eff);
}

.toggle-slider {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background-color: var(--toggle-slider, white);
  border-radius: 50%;
  transition: all 0.2s ease;
  display: block;
}

.toggle-btn.active .toggle-slider {
  left: 33px;
}

/* 新手引导 */
.tutorial-content {
  background-color: var(--card-bg, #2a2a3a);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 30%);
  text-align: center;
}

.tutorial-content p {
  margin: 0 0 24px;
  color: var(--text-secondary, #aaa);
  line-height: 1.6;
  font-size: 16px;
}

.tutorial-btn {
  padding: 12px 28px;
  background-color: var(--warning-color, #ff9800);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: var(--font-bold, 700);
  transition: all 0.2s ease;
}

.tutorial-btn:hover {
  background-color: var(--warning-hover, #f57c00);
  transform: translateY(-1px);
  box-shadow: 0 2px 12px rgb(255 152 0 / 30%);
}

/* 保存设置按钮 */
.save-settings-section {
  padding: 24px;
  background-color: var(--card-bg, #2a2a3a);
  border-top: 1px solid var(--border-color, #333);
  display: flex;
  justify-content: center;
  margin: 0 -24px -24px;
}

.save-settings-btn {
  padding: 14px 40px;
  background-color: var(--primary-color, #4a9eff);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: var(--font-bold, 700);
  transition: all 0.2s ease;
}

.save-settings-btn:hover {
  background-color: var(--primary-hover, #357abd);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgb(74 158 255 / 40%);
}

/* 滚动条样�? */
.system-settings-content::-webkit-scrollbar {
  width: 8px;
}

.system-settings-content::-webkit-scrollbar-track {
  background: var(--scrollbar-track, rgb(0 0 0 / 10%));
  border-radius: 4px;
}

.system-settings-content::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb, rgb(74 158 255 / 50%));
  border-radius: 4px;
}

.system-settings-content::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover, rgb(74 158 255 / 70%));
}

/* 响应式设�? */
@media (width <= 768px) {
  .save-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .save-actions {
    align-self: flex-end;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .setting-control {
    width: 100%;
  }

  .option-buttons {
    flex-wrap: wrap;
  }
}
</style>
