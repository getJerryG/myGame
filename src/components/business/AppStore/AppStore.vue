<template>
  <ApplicationWindow
    title="应用商店"
    title-icon="🏪"
    :sidebar-items="sidebarItems"
    :active-item-id="activeCategory"
    @update:active-item-id="activeCategory = $event"
    @item-click="handleCategoryClick"
  >
    <template #header-actions> </template>

    <div class="app-store-content">
      <div class="app-list">
        <div v-for="app in filteredApps" :key="app.id" class="app-item">
          <div class="app-info">
            <div class="app-icon">{{ app.icon }}</div>
            <div class="app-details">
              <h3>{{ app.name }}</h3>
              <p class="app-description">{{ app.description }}</p>
              <div class="app-memory text-gold">虚拟内存: {{ app.memory }}</div>
              <div class="app-status">
                <span
                  :class="{
                    'status-locked': !canUnlockApp(app),
                    'status-available':
                      canUnlockApp(app) && !isInstalled(app.id),
                    'status-installed': isInstalled(app.id),
                  }"
                >
                  <span class="text-gold">{{ getAppStatusText(app) }}</span>
                </span>
                <span v-if="!canUnlockApp(app)" class="lock-reason">
                  (需达到{{ getUnlockConditionText(app) }})
                </span>
              </div>
            </div>
          </div>
          <div class="app-actions">
            <button
              v-if="
                !isDownloading(app.id) &&
                !isInstalled(app.id) &&
                canUnlockApp(app)
              "
              class="download-btn"
              @click="startDownload(app)"
            >
              下载
            </button>
            <button v-else-if="!canUnlockApp(app)" class="locked-btn" disabled>
              未解锁
            </button>
            <div v-else-if="isDownloading(app.id)" class="download-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: `${getDownloadProgress(app.id)}%` }"
                ></div>
              </div>
              <div class="progress-text">
                {{ getDownloadProgress(app.id) }}%
              </div>
            </div>
            <button v-else class="installed-btn" disabled>已安装</button>
          </div>
        </div>
      </div>
    </div>
  </ApplicationWindow>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useWindowManagerStore } from "@/stores/windowManagerStore";
import ApplicationWindow from "@/components/common/window/ApplicationWindow.vue";
import type { SidebarItem } from "@/components/common/window/ApplicationWindow.vue";
import { useSimulationCareerSystemStore } from "@/stores/simulation/simulationCareerSystemStore";
import { AppStoreService, type AvailableApp, type AppStatus } from "@/services/app/AppStoreService";

const careerSystemStore = useSimulationCareerSystemStore();
const windowManagerStore = useWindowManagerStore();

const sidebarItems: SidebarItem[] = [
  { id: "all", name: "全部应用", icon: "📱" },
  { id: "system", name: "系统必备", icon: "⚙️" },
  { id: "unlocked", name: "已解锁", icon: "🔓" },
  { id: "locked", name: "未解锁", icon: "🔒" },
  { id: "mini", name: "小游戏", icon: "🎮" },
];

const activeCategory = ref("all");
const installedApps = ref<string[]>([]);

const emit = defineEmits<{
  "app-installed": [app: AvailableApp];
}>();

// 加载已安装应用
const loadInstalledApps = (): void => {
  installedApps.value = AppStoreService.loadInstalledApps();
};

// 保存已安装应用
const saveInstalledApps = (): void => {
  AppStoreService.saveInstalledApps(installedApps.value);
};

// 检查应用是否正在下载
const isDownloading = (appId: string): boolean => {
  return windowManagerStore.isDownloading(appId);
};

// 检查应用是否已安装
const isInstalled = (appId: string): boolean => {
  return AppStoreService.isInstalled(appId, installedApps.value);
};

// 检查应用是否可解锁
const canUnlockApp = (app: AvailableApp): boolean => {
  return AppStoreService.canUnlockApp(app, careerSystemStore.subLevelIndex);
};

// 获取应用状态文本
const getAppStatusText = (app: AvailableApp): string => {
  const status = AppStoreService.getAppStatus(
    app,
    installedApps.value,
    isDownloading,
    careerSystemStore.subLevelIndex
  );
  return AppStoreService.getAppStatusText(status);
};

// 获取解锁条件文本
const getUnlockConditionText = (app: AvailableApp): string => {
  return AppStoreService.getUnlockConditionText(app);
};

// 获取下载进度
const getDownloadProgress = (appId: string): number => {
  return windowManagerStore.getDownloadProgress(appId);
};

// 开始下载应用
const startDownload = (app: AvailableApp): void => {
  windowManagerStore.startDownload(app.id);
  simulateDownload(app);
};

// 模拟下载过程
const simulateDownload = (app: AvailableApp): void => {
  const interval = setInterval(() => {
    const currentProgress = windowManagerStore.getDownloadProgress(app.id);

    if (windowManagerStore.isDownloading(app.id)) {
      const newProgress = Math.min(
        currentProgress + Math.floor(Math.random() * 10) + 5,
        100,
      );
      windowManagerStore.updateDownloadProgress(app.id, newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          installedApps.value.push(app.id);
          saveInstalledApps();
          emit("app-installed", app);
          windowManagerStore.removeCompletedDownload(app.id);
        }, 500);
      }
    } else {
      clearInterval(interval);
    }
  }, 300);
};

// 过滤应用
const filteredApps = computed(() => {
  return AppStoreService.filterApps(activeCategory.value, careerSystemStore.subLevelIndex);
});

// 处理分类点击
const handleCategoryClick = (item: SidebarItem): void => {
  activeCategory.value = item.id;
};

// 组件挂载时加载已安装应用
onMounted(() => {
  loadInstalledApps();
});
</script>

<style lang="scss" scoped>
.app-store-content {
  flex: 1;
  height: 100%;
  overflow-y: auto;
}

.app-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: tokens.$spacing-lg;
  padding: tokens.$spacing-lg;
}

.app-item {
  @include utils.flex-col(tokens.$space-3, flex-start);

  background-color: tokens.$bg-secondary;
  border: 1px solid tokens.$border-light;
  border-radius: tokens.$radius-md;
  padding: tokens.$space-3;
  box-shadow: tokens.$shadow-sm;
  transition: all tokens.$transition-normal;

  &:hover {
    box-shadow: tokens.$shadow-blue;
    transform: translateY(-2px);
    border-color: tokens.$primary-blue;
  }
}

.app-info {
  @include utils.flex-row(tokens.$space-3, flex-start);
}

.app-icon {
  font-size: 48px;
  width: 60px;
  height: 60px;

  @include utils.flex-center;

  background-color: tokens.$bg-light;
  border-radius: tokens.$radius-md;
}

.app-details {
  flex: 1;

  h3 {
    margin: 0 0 tokens.$space-2 0;
    font-size: tokens.$font-size-lg;
    color: tokens.$text-primary;
  }
}

.app-description {
  margin: 0 0 tokens.$space-3 0;
  font-size: tokens.$font-size-sm;
  color: tokens.$text-secondary;
  line-height: tokens.$line-height-normal;
}

.app-memory {
  font-size: tokens.$font-size-xs;
  color: tokens.$primary-gold;
}

.app-status {
  margin-top: tokens.$space-1;

  @include utils.flex-row(tokens.$space-2, center);

  font-size: tokens.$font-size-xs;
}

.status-locked {
  color: tokens.$error;
  font-weight: tokens.$font-weight-bold;
}

.status-available {
  color: tokens.$success;
  font-weight: tokens.$font-weight-bold;
}

.status-installed {
  color: tokens.$primary-blue;
  font-weight: tokens.$font-weight-bold;
}

.lock-reason {
  color: tokens.$text-muted;
  font-size: tokens.$font-size-xs;
}

.app-actions {
  @include utils.flex-row(tokens.$space-2, center, flex-end);
}

.download-btn {
  padding: tokens.$space-2 tokens.$space-4;
  background-color: tokens.$primary-blue;
  color: tokens.$text-primary;
  border: none;
  border-radius: tokens.$radius-sm;
  cursor: pointer;
  font-size: tokens.$font-size-sm;
  transition: all tokens.$transition-fast;

  &:hover {
    background-color: tokens.$primary-light;
    transform: translateY(-1px);
  }
}

.locked-btn,
.installed-btn {
  padding: tokens.$space-2 tokens.$space-4;
  background-color: tokens.$bg-tertiary;
  color: tokens.$text-muted;
  border: 1px solid tokens.$border-medium;
  border-radius: tokens.$radius-sm;
  cursor: not-allowed;
  font-size: tokens.$font-size-sm;
}

.download-progress {
  @include utils.flex-row(tokens.$space-2, center);

  width: 100%;
  max-width: 150px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: tokens.$bg-tertiary;
  border-radius: tokens.$radius-sm;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: tokens.$primary-blue;
  border-radius: tokens.$radius-sm;
  transition: width tokens.$transition-normal;
}

.progress-text {
  font-size: tokens.$font-size-xs;
  color: tokens.$primary-blue;
  min-width: 40px;
}
</style>
