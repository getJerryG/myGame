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
        <div
          v-for="app in filteredApps"
          :key="app.id"
          class="app-item"
        >
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
                    'status-available': canUnlockApp(app) && !isInstalled(app.id),
                    'status-installed': isInstalled(app.id),
                  }"
                >
                  <span class="text-gold">{{ getAppStatusText(app) }}</span>
                </span>
                <span
                  v-if="!canUnlockApp(app)"
                  class="lock-reason"
                >
                  (需达到{{ getUnlockConditionText(app) }})
                </span>
              </div>
            </div>
          </div>
          <div class="app-actions">
            <button
              v-if="!isDownloading(app.id) && !isInstalled(app.id) && canUnlockApp(app)"
              class="download-btn"
              @click="startDownload(app)"
            >
              下载
            </button>
            <button
              v-else-if="!canUnlockApp(app)"
              class="locked-btn"
              disabled
            >
              未解�?
            </button>
            <div
              v-else-if="isDownloading(app.id)"
              class="download-progress"
            >
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: `${getDownloadProgress(app.id)}%` }"
                ></div>
              </div>
              <div class="progress-text">{{ getDownloadProgress(app.id) }}%</div>
            </div>
            <button
              v-else
              class="installed-btn"
              disabled
            >
              已安�?
            </button>
          </div>
        </div>
      </div>
    </div>
  </ApplicationWindow>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useWindowManagerStore } from '@/stores/windowManagerStore';
import ApplicationWindow from '@/components/common/window/ApplicationWindow.vue';
import type { SidebarItem } from '@/components/common/window/ApplicationWindow.vue';

import { useSimulationCareerSystemStore } from '@/stores/simulation/simulationCareerSystemStore';
import { careerLevelsConfig } from '@/config/careerLevelsConfig';

interface AvailableApp {
  id: string;
  name: string;
  icon: string;
  description: string;
  memory: string;
  category: 'system' | 'core' | 'advanced';
  requiredLevelId: string;
  requiredSubLevel?: number;
}

const careerSystemStore = useSimulationCareerSystemStore();

const sidebarItems: SidebarItem[] = [
  { id: 'all', name: '全部应用', icon: '📱' },
  { id: 'system', name: '系统必备', icon: '⚙️' },
  { id: 'unlocked', name: '已解锁', icon: '🔓' },
  { id: 'locked', name: '未解锁', icon: '🔒' },
  { id: 'mini', name: '小游戏', icon: '🎮' },
];

const activeCategory = ref('all');

const availableApps: AvailableApp[] = [
  {
    id: 'app-store',
    name: '应用商店',
    icon: '🏪',
    description: '所有高级应用的唯一获取入口',
    memory: '128MB',
    category: 'system',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'data-center',
    name: '数据中心',
    icon: '📊',
    description: '每日结算报表、游戏数据可视化',
    memory: '256MB',
    category: 'system',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'career-growth',
    name: '策划成长',
    icon: '📈',
    description: '职级体系、升级规则、权限管理',
    memory: '128MB',
    category: 'system',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'system-settings',
    name: '系统设置',
    icon: '⚙️',
    description: '游戏存档、音量、画面设置',
    memory: '128MB',
    category: 'system',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'wallet',
    name: '钱包',
    icon: '💰',
    description: '唯一财务入口：资金余额、收支流水',
    memory: '128MB',
    category: 'core',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'chat',
    name: '聊天',
    icon: '💬',
    description: '与团队沟通、玩家舆情反馈',
    memory: '128MB',
    category: 'core',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'hero-development',
    name: '英雄',
    icon: '🦸',
    description: '唯一英雄全生命周期管理',
    memory: '256MB',
    category: 'core',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'skin-development',
    name: '皮肤',
    icon: '🧵',
    description: '唯一皮肤全生命周期管理',
    memory: '128MB',
    category: 'core',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'event-development',
    name: '活动',
    icon: '🎪',
    description: '唯一运营活动管理',
    memory: '192MB',
    category: 'core',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'game-release',
    name: '游戏发布',
    icon: '📦',
    description: '唯一版本上线入口',
    memory: '320MB',
    category: 'core',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'task-center',
    name: '任务中心',
    icon: '📋',
    description: '日常任务、主线任务、成就任务',
    memory: '128MB',
    category: 'advanced',
    requiredLevelId: 'junior-planner',
    requiredSubLevel: 3,
  },
  {
    id: 'collaboration-center',
    name: '联动中心',
    icon: '🤝',
    description: '全量可联动IP/工作室展示、联动项目管理',
    memory: '192MB',
    category: 'advanced',
    requiredLevelId: 'intermediate-planner',
    requiredSubLevel: 5,
  },
  {
    id: 'public-opinion-center',
    name: '舆情中心',
    icon: '📢',
    description: '玩家社区评论、口碑变化明细',
    memory: '192MB',
    category: 'advanced',
    requiredLevelId: 'senior-planner',
    requiredSubLevel: 5,
  },
  {
    id: 'event-log',
    name: '事件日志',
    icon: '📝',
    description: '历史随机事件全记录',
    memory: '128MB',
    category: 'advanced',
    requiredLevelId: 'intermediate-planner',
    requiredSubLevel: 3,
  },
  {
    id: 'channel-delivery',
    name: '渠道投放',
    icon: '📣',
    description: '市场推广渠道选择、投放力度设置',
    memory: '192MB',
    category: 'advanced',
    requiredLevelId: 'expert-planner',
    requiredSubLevel: 5,
  },
];

const INSTALLED_APPS_KEY = 'app-store-installed-apps';

const windowManagerStore = useWindowManagerStore();

const installedApps = ref<string[]>([]);

const _emit = defineEmits<{
  'app-installed': [app: AvailableApp];
}>();

const loadInstalledApps = (): void => {
  const saved = localStorage.getItem(INSTALLED_APPS_KEY);
  if (saved) {
    installedApps.value = JSON.parse(saved);
  }
};

const _saveInstalledApps = (): void => {
  localStorage.setItem(INSTALLED_APPS_KEY, JSON.stringify(installedApps.value));
};

const isDownloading = (appId: string): boolean => {
  return windowManagerStore.isDownloading(appId);
};

const isInstalled = (appId: string): boolean => {
  return installedApps.value.includes(appId);
};

const canUnlockApp = (app: AvailableApp): boolean => {
  // 由于careerLevelsConfig没有id属性，我们简化逻辑，只检查subLevel
  const currentSubLevel = careerSystemStore.getCurrentSubLevel;

  // 假设所有应用都可以解锁，除了需要特定subLevel的
  if (app.requiredSubLevel) {
    // 使用当前小等级的索引作为order值
    return careerSystemStore.subLevelIndex + 1 >= app.requiredSubLevel;
  }

  return true;
};

const getLevelNameById = (levelId: string): string => {
  const levelMap: Record<string, string> = {
    'trainee-planner': '见习策划',
    'junior-planner': '初级策划',
    'intermediate-planner': '中级策划',
    'senior-planner': '高级策划',
    'expert-planner': '资深策划',
    'master-planner': '专家策划',
    'manager-planner': '策划经理',
    'director-planner': '策划总监',
  };
  return levelMap[levelId] || levelId;
};

const getSubLevelName = (levelId: string, subLevelOrder: number): string => {
  // 由于careerLevelsConfig结构不匹配，我们简化实现
  return `${subLevelOrder}`;
};

const getUnlockConditionText = (app: AvailableApp): string => {
  const levelName = getLevelNameById(app.requiredLevelId);
  const subLevelName = app.requiredSubLevel ? getSubLevelName(app.requiredLevelId, app.requiredSubLevel) : '';
  return `${levelName}${subLevelName}`;
};

const getAppStatusText = (app: AvailableApp): string => {
  if (isInstalled(app.id)) {
    return '已安装';
  }

  if (isDownloading(app.id)) {
    return '下载中';
  }

  if (!canUnlockApp(app)) {
    return '未解锁';
  }

  return '可下载';
};

const getDownloadProgress = (appId: string): number => {
  return windowManagerStore.getDownloadProgress(appId);
};

const startDownload = (app: AvailableApp): void => {
  windowManagerStore.startDownload(app.id);
  simulateDownload(app);
};

const simulateDownload = (app: AvailableApp): void => {
  const interval = setInterval(() => {
    const currentProgress = windowManagerStore.getDownloadProgress(app.id);

    if (windowManagerStore.isDownloading(app.id)) {
      const newProgress = Math.min(currentProgress + Math.floor(Math.random() * 10) + 5, 100);
      windowManagerStore.updateDownloadProgress(app.id, newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          installedApps.value.push(app.id);
          _saveInstalledApps();
          _emit('app-installed', app);
          windowManagerStore.removeCompletedDownload(app.id);
        }, 500);
      }
    } else {
      clearInterval(interval);
    }
  }, 300);
};

const filteredApps = computed(() => {
  switch (activeCategory.value) {
    case 'system':
      return availableApps.filter((app) => app.category === 'system');
    case 'unlocked':
      return availableApps.filter((app) => canUnlockApp(app));
    case 'locked':
      return availableApps.filter((app) => !canUnlockApp(app));
    case 'mini':
      return [];
    default:
      return availableApps;
  }
});

const handleCategoryClick = (item: SidebarItem): void => {
  activeCategory.value = item.id;
};

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
  gap: 20px;
  padding: 20px;
}

.app-item {
  display: flex;
  flex-direction: column;
  background-color: rgb(26 26 46 / 95%);
  border: 1px solid rgb(74 158 255 / 20%);
  border-radius: 8px;
  padding: var(--space-3);
  gap: var(--space-3);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.app-item:hover {
  box-shadow: 0 4px 12px rgb(74 158 255 / 30%);
  transform: translateY(-2px);
  border-color: var(--color-border-primary);
}

.app-info {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
}

.app-icon {
  font-size: 48px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-hover);
  border-radius: var(--radius-md);
}

.app-details {
  flex: 1;
}

.app-details h3 {
  margin: 0 0 var(--space-2) 0;
  font-size: var(--text-lg);
  color: var(--app-text-primary);
}

.app-description {
  margin: 0 0 var(--space-3) 0;
  font-size: var(--text-sm);
  color: var(--app-text-secondary);
  line-height: var(--line-height-sm);
}

.app-memory {
  font-size: var(--text-xs);
  color: var(--color-border-primary);
}

.app-status {
  margin-top: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
}

.status-locked {
  color: var(--danger-red);
  font-weight: var(--font-bold);
}

.status-available {
  color: var(--success-green);
  font-weight: var(--font-bold);
}

.status-installed {
  color: var(--color-border-primary);
  font-weight: var(--font-bold);
}

.lock-reason {
  color: var(--app-text-tertiary);
  font-size: var(--text-xs);
}

.app-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--space-2);
}

.download-btn {
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-border-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
}

.download-btn:hover {
  background-color: var(--color-primary-light-blue);
  transform: translateY(-1px);
}

.locked-btn,
.installed-btn {
  padding: var(--space-2) var(--space-4);
  background-color: var(--app-bg-tertiary);
  color: var(--app-text-tertiary);
  border: var(--border-width-1) solid var(--app-border-secondary);
  border-radius: var(--radius-sm);
  cursor: not-allowed;
  font-size: var(--text-sm);
}

.download-progress {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  max-width: 150px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: var(--app-bg-tertiary);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-border-primary);
  border-radius: var(--radius-sm);
  transition: width var(--transition-normal);
}

.progress-text {
  font-size: var(--text-xs);
  color: var(--color-border-primary);
  min-width: 40px;
}
</style>
