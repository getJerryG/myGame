<template>
  <div class="desktop-system">
    <!-- 引入独立的刘海栏组件 -->
    <NotchBar :levelName="策划职级名称" :levelRank="策划段位" :currentExp="策划经验" :maxExp="策划升级经验" :funds="策划资金" />

    <!-- 任务系统面板 -->
    <TaskSystemPanel />

    <!-- 退出确认对话框 -->
    <ExitConfirmDialog :isVisible="showExitDialog" title="退出游戏确认" message="您正在退出游戏，如未保存将造成数据丢失！"
      @close="showExitDialog = false" @exit="handleExit" @save="handleSaveAndExit" />

    <!-- 升级特效 -->
    <div v-if="showLevelUpEffect" class="level-up-effect">
      <div class="level-up-message">{{ levelUpMessage }}</div>
    </div>

    <!-- 桌面背景 -->
    <div class="desktop-background">
      <!-- 桌面应用图标区域 -->
      <div class="desktop-icons">
        <DesktopAppIcon v-for="app in allDesktopApps" :key="app.id" :app="app" :position="app.position"
          @click="openApp(app)" />
      </div>
    </div>

    <!-- 任务栏 -->
    <div class="taskbar">
      <div class="taskbar-left">
        <div class="start-button" @click="toggleStartMenu">
          <span>开始</span>
        </div>
      </div>
      <div class="taskbar-right">
        <div class="game-date">{{ gameDateDisplay }}</div>
      </div>
    </div>

    <!-- 开始菜单 -->
    <div v-if="isStartMenuOpen" class="start-menu" @click.stop>
      <div class="start-menu-header">
        <h2>开始</h2>
      </div>
      <div class="start-menu-content">
        <div class="start-menu-buttons">
          <button class="start-menu-button" @click="saveGame">
            <span class="button-icon">💾</span>
            <span class="button-text">保存副本</span>
          </button>
          <button class="start-menu-button" @click="restartGame">
            <span class="button-icon">🔄</span>
            <span class="button-text">重新开始</span>
          </button>
          <button class="start-menu-button" @click="openGameSettings">
            <span class="button-icon">⚙️</span>
            <span class="button-text">游戏设置</span>
          </button>
        </div>
      </div>
    </div>
    <!-- 点击外部关闭开始菜单 -->
    <div v-if="isStartMenuOpen" class="start-menu-backdrop" @click="closeStartMenu"></div>

    <!-- 弹出层 -->
    <div class="desktop-modals">
      <DesktopAppContainer v-for="modal in sortedModals" :key="modal.id" :window-id="modal.id" :window-state="{
        position: modal.position,
        size: modal.size,
        isMaximized: modal.isMaximized,
        isMinimized: minimizedApps.includes(modal.appId),
        activeModule: modal.activeModule,
      }" :app="allDesktopApps.find((a) => a.id === modal.appId)" :gameData="gameData" @close="closeApp(modal.appId)"
        @update:windowState="
          (updatedState) => {
            const updatedModal = {
              ...modal,
              position: updatedState.position,
              size: updatedState.size,
              isMaximized: updatedState.isMaximized,
              activeModule: updatedState.activeModule,
            };
            updateModal(updatedModal);
          }
        " @app-installed="handleAppInstalled">
        <!-- 这里可以添加应用内容的插槽 -->
      </DesktopAppContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, provide } from 'vue';
import { useRouter } from 'vue-router';
import DesktopAppIcon from '../DesktopAppIcon/index.vue';
import DesktopAppContainer from '../DesktopAppContainer/index.vue';
import TaskSystemPanel from '../TaskSystemPanel/index.vue';
import ExitConfirmDialog from '../dialogs/ExitConfirmDialog.vue';
import NotchBar from '../NotchBar/index.vue';
import { useGameStore } from '@/stores/gameStore';
import { useSimulationGameStateStore } from '@/stores/simulation/simulationGameStateStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useSimulationStore } from '@/stores/simulationStore';
import { useSimulationCareerSystemStore } from '@/stores/simulation/simulationCareerSystemStore';
import { useWindowManagerStore } from '@/stores/windowManagerStore';
import { useSimulationTaskSystemStore } from '@/stores/simulation/simulationTaskSystemStore';
import { useSimulationNewbieGoalsStore } from '@/stores/simulation/simulationNewbieGoalsStore';
import { useSimulationSkinDevelopmentStore } from '@/stores/simulation/simulationSkinDevelopmentStore';
import { useSimulationHeroDevelopmentStore } from '@/stores/simulation/simulationHeroDevelopmentStore';
import { useSimulationBusinessDataStore } from '@/stores/simulation/simulationBusinessDataStore';
import { useSimulationCoreGoalsStore } from '@/stores/simulation/simulationCoreGoalsStore';
import { useLotteryStorageStore } from '@/stores/lottery/LotteryStorage';
import { useHeroSkinStore } from '@/stores/heroSkinStore';
import { useModalStore } from '@/stores/modalStore';

// 导入类型
import type { GameData } from '@/types/game';
import type { Modal } from '@/types/modal';
import type { AvailableApp } from '@/components/business/apps/AppStore/AppStore.vue';

// 定义应用类型
interface DesktopApp {
  id: string;
  name: string;
  icon: string;
  position: { x: number; y: number };
  coreData: Record<string, any>;
  modules: Array<{ id: string; name: string }>;
}

// Props定义
const props = defineProps<{
  gameData: GameData;
}>();

// 获取路由实例
const router = useRouter();

// 获取策划职业系统 store
const careerSystemStore = useSimulationCareerSystemStore();
// 获取模拟系统 store
const simulationStore = useSimulationStore();
// 获取窗口管理器 store
const windowManagerStore = useWindowManagerStore();

// 策划相关数据
const 策划等级 = ref(1);
const 策划经验 = ref(0);
const 策划升级经验 = ref(100);
const 策划资金 = ref(10000);
const 策划职级名称 = ref('初级策划');
const 策划段位 = ref('I');
const expProgress = ref(0);
const 策划名称 = ref('我是策划');
// 退出确认对话框状态
const showExitDialog = ref(false);

// 监听simulation实例变化，设置资金变化回调
watch(
  () => simulationStore.simulation,
  (newSimulation) => {
    if (newSimulation) {
      // 立即获取最新资金
      const results = newSimulation.getResults();
      策划资金.value = results.gameState.plannerFunds;
      updateAppData();

      // 设置资金变化回调函数，实现真正的响应式更新
      newSimulation.setFundsUpdateCallback((newFunds) => {
        策划资金.value = newFunds;
        updateAppData();
      });
    }
  },
  { immediate: true }
);

// 记录上一次的等级，用于判断是否需要显示升级特效
const previousLevel = ref(1);

// 升级特效状态
const showLevelUpEffect = ref(false);
const levelUpMessage = ref('');

// 计算属性：经验进度百分比
const expProgressPercent = computed(() => {
  if (策划升级经验.value === 0) return 100;
  return Math.min(100, Math.floor((策划经验.value / 策划升级经验.value) * 100));
});

// 更新策划数据
const updateCareerData = (): void => {
  const currentLevel = careerSystemStore.getCurrentCareerLevel;
  const currentSubLevel = careerSystemStore.getCurrentSubLevel;
  const newLevel = careerSystemStore.levelIndex + 1;

  // 只有当等级真正变化时，才显示升级特效
  if (newLevel !== previousLevel.value) {
    showLevelUpEffect.value = true;
    levelUpMessage.value = `恭喜晋升为${currentLevel.name} ${currentSubLevel.name}`;
    // 3秒后关闭特效
    setTimeout(() => {
      showLevelUpEffect.value = false;
    }, 3000);

    // 更新上一次的等级
    previousLevel.value = newLevel;
  }

  // 更新所有策划数据
  策划等级.value = newLevel;
  策划职级名称.value = currentLevel.name;
  策划段位.value = currentSubLevel.name; // 设置段位（如 I, II, III）
  策划经验.value = careerSystemStore.exp;
  // 当前级别的最大经验值是当前小等级所需的升级经验
  策划升级经验.value = currentSubLevel.expRequired;
};

// 提供策划数据给子组件
provide('策划等级', 策划等级);
provide('策划职级名称', 策划职级名称);
provide('策划经验', 策划经验);
provide('策划升级经验', 策划升级经验);
provide('策划资金', 策划资金);
provide('expProgress', expProgress);

// 提供更新策划经验的方法
const addExp = (amount: number): void => {
  // 获取经验增加结果，包括可能的奖励资金
  const expResult = careerSystemStore.addExp(amount);

  // 如果获得了奖励资金
  if (expResult.fundsEarned > 0) {
    if (simulationStore.simulation) {
      // 如果Simulation实例存在，调用updatePlannerFunds方法
      simulationStore.simulation.updatePlannerFunds(expResult.fundsEarned);
    } else {
      // 如果Simulation实例不存在，直接更新策划资金
      策划资金.value += expResult.fundsEarned;
      updateAppData();
    }
  }

  // 更新所有策划数据
  updateCareerData();
};
provide('addExp', addExp);

// 监听职业系统状态变化，更新UI
watch(
  () => careerSystemStore.currentLevelIndex,
  () => {
    updateCareerData();
  }
);

watch(
  () => careerSystemStore.currentSubLevelIndex,
  () => {
    updateCareerData();
  }
);

watch(
  () => careerSystemStore.exp,
  () => {
    updateCareerData();
  }
);

// 初始化数据
updateCareerData();

// 本地存储键
const DESKTOP_APPS_KEY = 'desktop-apps';

// 初始桌面应用列表
const initialDesktopApps: DesktopApp[] = [
  {
    id: 'wallet',
    name: '钱包',
    icon: '💰',
    position: { x: 50, y: 50 },
    coreData: {
      balance: 0,
    },
    modules: [
      { id: 'balance-info', name: '余额信息' },
      { id: 'transaction-history', name: '交易记录' },
    ],
  },
  {
    id: 'app-store',
    name: '应用中心',
    icon: '📱',
    position: { x: 250, y: 50 },
    coreData: {},
    modules: [{ id: 'app-store', name: '应用中心' }],
  },
  {
    id: 'game-release',
    name: '游戏发布',
    icon: '📦',
    position: { x: 450, y: 50 },
    coreData: {},
    modules: [{ id: 'game-release', name: '游戏发布' }],
  },
];

// 可下载的应用列表 - 用于下载时创建临时应用图标
const availableAppsForDownload: AvailableApp[] = [
  {
    id: 'data-center',
    name: '数据中心',
    icon: '📊',
    description: '',
    memory: '',
    category: 'system',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'career-growth',
    name: '策划成长',
    icon: '📈',
    description: '',
    memory: '',
    category: 'system',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'system-settings',
    name: '系统设置',
    icon: '⚙️',
    description: '',
    memory: '',
    category: 'system',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'chat',
    name: '聊天',
    icon: '💬',
    description: '',
    memory: '',
    category: 'core',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'hero-development',
    name: '英雄',
    icon: '🦸',
    description: '',
    memory: '',
    category: 'core',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'skin-development',
    name: '皮肤',
    icon: '🧵',
    description: '',
    memory: '',
    category: 'core',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'event-development',
    name: '活动',
    icon: '🎪',
    description: '',
    memory: '',
    category: 'core',
    requiredLevelId: 'trainee-planner',
  },
  {
    id: 'task-center',
    name: '任务中心',
    icon: '📋',
    description: '',
    memory: '',
    category: 'advanced',
    requiredLevelId: 'junior-planner',
  },
  {
    id: 'collaboration-center',
    name: '联动中心',
    icon: '🤝',
    description: '',
    memory: '',
    category: 'advanced',
    requiredLevelId: 'intermediate-planner',
  },
  {
    id: 'public-opinion-center',
    name: '舆情中心',
    icon: '📢',
    description: '',
    memory: '',
    category: 'advanced',
    requiredLevelId: 'senior-planner',
  },
  {
    id: 'event-log',
    name: '事件日志',
    icon: '📝',
    description: '',
    memory: '',
    category: 'advanced',
    requiredLevelId: 'intermediate-planner',
  },
  {
    id: 'channel-delivery',
    name: '渠道投放',
    icon: '📣',
    description: '',
    memory: '',
    category: 'advanced',
    requiredLevelId: 'expert-planner',
  },
];

// 从本地存储加载桌面应用，或使用初始列表
const loadDesktopApps = (): DesktopApp[] => {
  const saved = localStorage.getItem(DESKTOP_APPS_KEY);
  let apps: DesktopApp[];

  if (saved) {
    apps = JSON.parse(saved);
  } else {
    apps = initialDesktopApps;
  }

  // 重置所有应用位置，确保整齐排列
  resetAppPositions(apps);

  // 立即保存重置后的位置到本地存储
  localStorage.setItem(DESKTOP_APPS_KEY, JSON.stringify(apps));

  return apps;
};

// 合并桌面应用和下载中的应用
const allDesktopApps = computed(() => {
  const apps = [...desktopApps.value];

  // 添加下载中的应用（如果还不在桌面应用列表中）
  if (windowManagerStore.downloadProgress && Array.isArray(windowManagerStore.downloadProgress)) {
    windowManagerStore.downloadProgress.forEach((download) => {
      const exists = apps.some((app) => app.id === download.appId);
      if (!exists) {
        const appInfo = availableAppsForDownload.find((a) => a.id === download.appId);
        if (appInfo) {
          apps.push({
            id: appInfo.id,
            name: appInfo.name,
            icon: appInfo.icon,
            position: { x: 0, y: 0 },
            coreData: {},
            modules: [{ id: appInfo.id, name: appInfo.name }],
          });
        }
      }
    });
  }

  // 重新排列位置
  resetAppPositions(apps);

  return apps;
});

// 重置应用位置的通用函数
const resetAppPositions = (apps: DesktopApp[]): void => {
  const appsPerRow = 4;
  const appSpacing = 200; // 应用之间的水平间距
  const verticalSpacing = 150; // 应用之间的垂直间距
  apps.forEach((app, index) => {
    const row = Math.floor(index / appsPerRow);
    const col = index % appsPerRow;

    app.position = {
      x: 50 + col * appSpacing, // 50是左边距
      y: 50 + row * verticalSpacing, // 50是上边距
    };
  });
};

// 保存桌面应用到本地存储
const saveDesktopApps = (): void => {
  localStorage.setItem(DESKTOP_APPS_KEY, JSON.stringify(desktopApps.value));
};

// 桌面应用列表
const desktopApps = ref<DesktopApp[]>(loadDesktopApps());

// 计算游戏日期对应的星期几
const getDayOfWeek = (year: number, month: number, day: number): string => {
  // 使用固定算法计算星期几，基于1年1月1日是星期一
  const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  // 简单的日期计算，实际项目中可以使用更精确的算法
  const totalDays = (year - 1) * 365 + (month - 1) * 30 + day;
  return daysOfWeek[totalDays % 7];
};

// 游戏日期显示，包含星期几
const gameDateDisplay = computed(() => {
  // 添加空值检查
  if (!props.gameData?.gameState?.currentDate) {
    return '加载中...';
  }

  const date = props.gameData.gameState.currentDate;
  const dayOfWeek = getDayOfWeek(date.year, date.month, date.day);
  return `${date.year}年${date.month}月${date.day}日 ${dayOfWeek} ${date.hour}:${String(date.minute).padStart(2, '0')}`;
});

// 处理应用安装事件
const handleAppInstalled = (app: App): void => {
  // 检查应用是否已存在
  const exists = desktopApps.value.some((existingApp) => existingApp.id === app.id);
  if (exists) return;

  // 根据应用类型配置不同的modules
  let modules;
  switch (app.id) {
    case 'lottery':
      modules = [
        { id: 'lottery-main', name: '抽奖主界面' },
        { id: 'lottery-history', name: '抽奖历史' },
        { id: 'lottery-rewards', name: '累抽奖励' },
      ];
      break;
    case 'hero-development':
      modules = [
        { id: 'hero-new', name: '新建英雄' },
        { id: 'hero-manage', name: '英雄管理' },
      ];
      break;
    default:
      modules = [{ id: app.id, name: app.name }];
  }

  // 添加新应用到桌面
  desktopApps.value.push({
    id: app.id,
    name: app.name,
    icon: app.icon,
    position: { x: 0, y: 0 }, // 初始位置，后续会重置
    coreData: {},
    modules: modules,
  });

  // 重置所有应用位置，确保整齐排列
  resetAppPositions(desktopApps.value);

  // 保存桌面应用到本地存储
  saveDesktopApps();
};

// 活跃的应用列表
const activeApps = ref<string[]>([]);

// 最小化的应用列表
const minimizedApps = ref<string[]>([]);

// 打开的弹出框列表
const openModals = ref<Modal[]>([]);

// 排序后的弹出框列表（根据 zIndex）
const sortedModals = computed(() => {
  return [...openModals.value].sort((a, b) => {
    const windowA = windowManagerStore.windows.find((w) => w.id === a.id);
    const windowB = windowManagerStore.windows.find((w) => w.id === b.id);
    return (windowA?.zIndex || 0) - (windowB?.zIndex || 0);
  });
});

// 更新桌面应用数据
const updateAppData = (): void => {
  // 更新钱包应用，将余额与策划资金挂钩
  const walletApp = desktopApps.value.find((app) => app.id === 'wallet');
  if (walletApp) {
    walletApp.coreData = {
      balance: 策划资金.value, // 余额与策划资金保持一致
    };
    // 保存桌面应用到本地存储
    saveDesktopApps();
  }
};

// 监听游戏数据变化，更新应用数据
watch(
  () => props.gameData,
  () => {
    updateAppData();
  },
  { deep: true }
);

// 打开应用
const openApp = (app: DesktopApp): void => {
  // 检查是否正在下载
  if (windowManagerStore.isDownloading(app.id)) {
    return;
  }

  if (!activeApps.value.includes(app.id)) {
    activeApps.value.push(app.id);
  }

  // 移除最小化状态
  if (minimizedApps.value.includes(app.id)) {
    minimizedApps.value = minimizedApps.value.filter((id) => id !== app.id);
  }

  // 检查是否已打开
  const existingModal = openModals.value.find((modal) => modal.appId === app.id);
  if (!existingModal) {
    const windowId = `window-${app.id}-${Date.now()}`;
    openModals.value.push({
      id: windowId,
      appId: app.id,
      position: { x: 0, y: 0 },
      size: { width: window.innerWidth, height: window.innerHeight },
      activeModule: app.modules[0].id,
      isMaximized: true,
    });

    // 在windowManagerStore 中创建窗口
    windowManagerStore.createWindow(app.name, { type: 'app', props: { app } });
  }
};

// 关闭应用
const closeApp = (appId: string): void => {
  activeApps.value = activeApps.value.filter((id) => id !== appId);
  minimizedApps.value = minimizedApps.value.filter((id) => id !== appId);
  openModals.value = openModals.value.filter((modal) => modal.appId !== appId);
};

// 更新模态框
const updateModal = (updatedModal: Modal): void => {
  const index = openModals.value.findIndex((modal) => modal.id === updatedModal.id);
  if (index !== -1) {
    openModals.value[index] = updatedModal;
  }
};

// 开始菜单状态
const isStartMenuOpen = ref(false);

// 切换开始菜单显示/隐藏
const toggleStartMenu = (): void => {
  isStartMenuOpen.value = !isStartMenuOpen.value;
};

// 关闭开始菜单
const closeStartMenu = (): void => {
  isStartMenuOpen.value = false;
};

// 保存游戏
const saveGame = (): void => {
  // 获取所有相关store的实例
  const gameStore = useGameStore();
  const simulationGameStateStore = useSimulationGameStateStore();
  const playerStore = usePlayerStore();
  const simulationStore = useSimulationStore();

  // 创建游戏状态快照
  const gameSnapshot = {
    timestamp: Date.now(),
    gameStore: gameStore.$state,
    simulationGameStateStore: simulationGameStateStore.$state,
    playerStore: playerStore.$state,
    simulationStore: simulationStore.$state,
    desktopApps: desktopApps.value,
  };

  // 保存到localStorage
  const savedGames = JSON.parse(localStorage.getItem('game-snapshots') || '[]');
  savedGames.push(gameSnapshot);
  localStorage.setItem('game-snapshots', JSON.stringify(savedGames));

  closeStartMenu();
};

// 重新开始游戏
const restartGame = (): void => {
  // 确认重新开始
  if (confirm('确定要重新开始游戏吗？所有进度将丢失！')) {
    // 获取所有相关store的实例
    const gameStore = useGameStore();
    const simulationGameStateStore = useSimulationGameStateStore();
    const playerStore = usePlayerStore();
    const simulationStore = useSimulationStore();
    const taskSystemStore = useSimulationTaskSystemStore();
    const careerSystemStore = useSimulationCareerSystemStore();
    const newbieGoalsStore = useSimulationNewbieGoalsStore();
    const skinDevelopmentStore = useSimulationSkinDevelopmentStore();
    const heroDevelopmentStore = useSimulationHeroDevelopmentStore();
    const businessDataStore = useSimulationBusinessDataStore();
    const coreGoalsStore = useSimulationCoreGoalsStore();
    const lotteryStorageStore = useLotteryStorageStore();
    const heroSkinStore = useHeroSkinStore();
    const modalStore = useModalStore();

    // 重置各个store的状态
    gameStore.resetResources();
    gameStore.resetStatistics();
    simulationGameStateStore.resetGameState();
    playerStore.resetPlayer();
    simulationStore.resetSimulation();
    taskSystemStore.resetTaskSystem();
    careerSystemStore.resetCareerSystem();
    newbieGoalsStore.resetNewbieGoals();
    skinDevelopmentStore.resetSkinDevelopmentSystem();
    heroDevelopmentStore.resetHeroDevelopmentSystem();
    businessDataStore.resetBusinessData();
    coreGoalsStore.$reset();
    lotteryStorageStore.$reset();
    heroSkinStore.clearAllData();
    modalStore.$reset();

    // 清除所有相关的localStorage数据
    const localStorageKeys = [
      'game-snapshots',
      'pinia-game',
      'pinia-simulationGameState',
      'pinia-player',
      'pinia-simulation',
      'simulation-task-system',
      'simulation-career-system',
      'simulation-newbie-goals',
      'simulation-skin-development',
      'simulation-hero-development',
      'simulation-business-data',
      'simulation-core-goals',
      'lottery-storage',
      'hero-skin-data',
      'desktop-apps',
      'app-store-installed-apps',
      'heroes-storage',
      'skins-storage',
    ];

    localStorageKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    // 重置桌面应用为初始状态
    desktopApps.value = initialDesktopApps;
    resetAppPositions(desktopApps.value);
    saveDesktopApps();

    // 重置活跃应用和模态框
    activeApps.value = [];
    minimizedApps.value = [];
    openModals.value = [];

    closeStartMenu();

    // 刷新页面以确保所有状态都被重置
    window.location.reload();
  }
};

// 打开游戏设置
const openGameSettings = (): void => {
  // 检查游戏设置应用是否已存在
  let settingsApp = desktopApps.value.find((app) => app.id === 'game-settings');

  // 如果不存在，添加到桌面应用列表
  if (!settingsApp) {
    settingsApp = {
      id: 'game-settings',
      name: '游戏设置',
      icon: '⚙️',
      position: { x: 0, y: 0 }, // 初始位置，后续会重置
      coreData: {},
      modules: [
        { id: 'basic-settings', name: '基本设置' },
        { id: 'advanced-settings', name: '高级设置' },
        { id: 'about', name: '关于' },
      ],
    };

    // 添加新应用到桌面
    desktopApps.value.push(settingsApp);

    // 重置所有应用位置，确保整齐排列
    resetAppPositions(desktopApps.value);

    // 保存桌面应用到本地存储
    saveDesktopApps();
  }

  // 打开游戏设置应用
  openApp(settingsApp);

  closeStartMenu();
};

// 初始化
onMounted(() => {
  // 初始更新应用数据
  updateAppData();

  // 确保游戏发布应用已正确配置
  const gameReleaseApp = desktopApps.value.find((app) => app.id === 'game-release');
  if (!gameReleaseApp) {
    // 如果游戏发布应用不存在，添加到桌面
    desktopApps.value.push({
      id: 'game-release',
      name: '游戏发布',
      icon: '📦',
      position: { x: 450, y: 50 },
      coreData: {},
      modules: [{ id: 'game-release', name: '游戏发布' }],
    });
    resetAppPositions(desktopApps.value);
    saveDesktopApps();
  }
});

// 处理直接退出
const handleExit = () => {
  showExitDialog.value = false;
  // 直接返回主页，不执行保存
  router.push('/');
};

// 处理保存后退出
const handleSaveAndExit = () => {
  showExitDialog.value = false;
  // 调用保存游戏方法
  saveGame();
  // 保存完成后返回主页
  router.push('/');
};
</script>

<style lang="scss" scoped>
.desktop-system {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1a2e;
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}

/* 刘海栏样式 */
.notch-bar {
  height: 60px;
  background: linear-gradient(135deg, #0a1027 0%, #1a2332 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);

  .notch-info-left {
    display: flex;
    align-items: center;
    margin-left: 20px;

    /* 用户信息样式 */
    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;

      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.3);
      }

      .avatar-placeholder {
        font-size: 18px;
        font-weight: bold;
        color: #0a1027;
      }

      .user-name {
        font-size: 16px;
        font-weight: bold;
        color: #fff;

        .name {
          width: 150px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .notch-value {
            // tag
            padding: 2px 5px;
            border-radius: 4px;
            background-color: #f40;
            color: #fff;
          }
        }
      }
    }
  }
}

/* 升级特效样式 */
.level-up-effect {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  animation: levelUpEffect 3s ease-out forwards;
}

.level-up-message {
  background-color: rgb(0 0 0 / 80%);
  color: #4a9eff;
  font-size: 32px;
  font-weight: bold;
  padding: 20px 40px;
  border-radius: 10px;
  text-shadow: 0 0 10px rgb(74 158 255 / 80%);
  box-shadow: 0 0 30px rgb(74 158 255 / 50%);
  animation: levelUpPulse 1.5s ease-in-out infinite;
}

@keyframes levelUpEffect {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }

  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }

  80% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes levelUpPulse {

  0%,
  100% {
    text-shadow: 0 0 10px rgb(74 158 255 / 80%);
    box-shadow: 0 0 30px rgb(74 158 255 / 50%);
  }

  50% {
    text-shadow: 0 0 20px rgb(74 158 255 / 100%);
    box-shadow: 0 0 50px rgb(74 158 255 / 80%);
  }
}

.desktop-background {
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  overflow: hidden;
  margin-top: 0;
  padding-top: 25px;

  /* 添加顶部内边距，确保内容不被刘海栏遮挡 */
}

.desktop-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
}

.desktop-icons > * {
  pointer-events: auto;
}

/* 任务栏样式 */
.taskbar {
  height: 48px;
  background-color: rgb(26 26 46 / 95%);
  border-top: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  z-index: 100;
  box-shadow: 0 -2px 10px rgb(0 0 0 / 30%);
}

.taskbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.start-button {
  padding: 8px 16px;
  background-color: #4a9eff;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}

.start-button:hover {
  background-color: #357abd;
  transform: translateY(-1px);
}

.taskbar-apps {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  max-width: calc(100% - 200px);
}

.taskbar-app {
  padding: 8px 16px;
  background-color: rgb(74 158 255 / 20%);
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.taskbar-app:hover {
  background-color: rgb(74 158 255 / 40%);
}

.taskbar-app.active {
  background-color: rgb(74 158 255 / 60%);
  border-color: #4a9eff;
}

.taskbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.game-date {
  padding: 8px 16px;
  background-color: rgb(0 0 0 / 20%);
  border-radius: 4px;
  font-size: 14px;
  color: #4a9eff;
  font-weight: bold;
}

.system-time {
  padding: 8px 16px;
  background-color: rgb(0 0 0 / 20%);
  border-radius: 4px;
  font-size: 14px;
}

/* 弹出框内容 */
.desktop-modals {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 150;
  pointer-events: none;
}

.desktop-modals > * {
  pointer-events: auto;
}

/* 开始菜单样式 */
.start-menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 98;
  background-color: rgb(0 0 0 / 0%);
}

.start-menu {
  position: absolute;
  bottom: 48px;
  left: 0;
  width: 280px;
  background-color: rgb(26 26 46 / 95%);
  border: 1px solid #333;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -2px 15px rgb(0 0 0 / 50%);
  z-index: 99;
  display: flex;
  flex-direction: column;
  animation: startMenuSlideUp 0.2s ease-out forwards;
  transform-origin: bottom left;
}

@keyframes startMenuSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.start-menu-header {
  padding: 12px 16px;
  border-bottom: 1px solid #333;
  background-color: rgb(74 158 255 / 10%);
  border-radius: 8px 8px 0 0;
}

.start-menu-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #4a9eff;
}

.start-menu-content {
  padding: 8px 0;
  flex: 1;
  overflow-y: auto;
}

.start-menu-buttons {
  display: flex;
  flex-direction: column;
}

.start-menu-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.start-menu-button:hover {
  background-color: rgb(74 158 255 / 30%);
}

.start-menu-button:active {
  background-color: rgb(74 158 255 / 50%);
}

.button-icon {
  font-size: 20px;
}

.button-text {
  flex: 1;
}
</style>
