<template>
  <div class="desktop-system">
    <!-- 刘海栏 -->
    <NotchBar
      :levelName="plannerRankName"
      :levelRank="plannerTier"
      :currentExp="plannerExp"
      :maxExp="plannerLevelUpExp"
      :funds="plannerFunds"
    />

    <!-- 任务系统面板 -->
    <TaskSystemPanel />

    <!-- 退出确认对话框 -->
    <ExitConfirmDialog
      :isVisible="showExitDialog"
      title="退出游戏确认"
      message="您正在退出游戏，如未保存将造成数据丢失！"
      @close="showExitDialog = false"
      @exit="handleExit"
      @save="handleSaveAndExit"
    />

    <!-- 升级特效 -->
    <DesktopLevelUpEffect
      :visible="showLevelUpEffect"
      :message="levelUpMessage"
    />

    <!-- 桌面背景和图标 -->
    <DesktopBackground :apps="allDesktopApps" @click="openApp" />

    <!-- 任务栏（包含开始菜单） -->
    <DesktopTaskbar
      :game-data="gameData"
      @save-game="saveGame"
      @restart-game="restartGame"
      @open-settings="openGameSettings"
    />

    <!-- 应用窗口层 -->
    <div class="desktop-modals">
      <DesktopAppContainer
        v-for="modal in sortedModals"
        :key="modal.id"
        :window-id="modal.id"
        :window-state="{
          position: modal.position,
          size: modal.size,
          isMaximized: modal.isMaximized,
          isMinimized: minimizedApps.includes(modal.appId),
          activeModule: modal.activeModule,
        }"
        :app="allDesktopApps.find((a) => a.id === modal.appId)"
        :gameData="gameData"
        @close="closeApp(modal.appId)"
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
        "
        @app-installed="handleAppInstalled"
      >
      </DesktopAppContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, provide } from "vue";
import { useRouter } from "vue-router";
import DesktopAppContainer from "../DesktopAppContainer/index.vue";
import TaskSystemPanel from "../TaskSystemPanel/index.vue";
import ExitConfirmDialog from "../dialogs/ExitConfirmDialog.vue";
import NotchBar from "../NotchBar/index.vue";
import DesktopLevelUpEffect from "./DesktopLevelUpEffect.vue";
import DesktopBackground from "./DesktopBackground.vue";
import DesktopTaskbar from "./DesktopTaskbar.vue";
import { useGameStore } from "@/stores/gameStore";
import { useSimulationGameStateStore } from "@/stores/simulation/simulationGameStateStore";
import { usePlayerStore } from "@/stores/playerStore";
import { useSimulationStore } from "@/stores/simulationStore";
import { useSimulationCareerSystemStore } from "@/stores/simulation/simulationCareerSystemStore";
import { useWindowManagerStore } from "@/stores/windowManagerStore";
import { useSimulationTaskSystemStore } from "@/stores/simulation/simulationTaskSystemStore";
import { useSimulationNewbieGoalsStore } from "@/stores/simulation/simulationNewbieGoalsStore";
import { useSimulationSkinDevelopmentStore } from "@/stores/simulation/simulationSkinDevelopmentStore";
import { useSimulationHeroDevelopmentStore } from "@/stores/simulation/simulationHeroDevelopmentStore";
import { useSimulationBusinessDataStore } from "@/stores/simulation/simulationBusinessDataStore";
import { useSimulationCoreGoalsStore } from "@/stores/simulation/simulationCoreGoalsStore";
import { useLotteryStorageStore } from "@/stores/lottery/LotteryStorage";
import { useHeroSkinStore } from "@/stores/heroSkinStore";
import { useModalStore } from "@/stores/modalStore";

// 导入类型
import type { GameData } from "@/types/game";
import type { Modal } from "@/types/modal";
import type { DesktopApp, AvailableApp } from "./types";

// Props 定义
const props = defineProps<{
  gameData: GameData;
}>();

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

// 获取路由实例
const router = useRouter();

// 获取策划职业系统 store
const careerSystemStore = useSimulationCareerSystemStore();
// 获取模拟系统 store
const simulationStore = useSimulationStore();
// 获取窗口管理器 store
const windowManagerStore = useWindowManagerStore();

// 策划相关数据
const plannerLevel = ref(1);
const plannerExp = ref(0);
const plannerLevelUpExp = ref(100);
const plannerFunds = ref(10000);
const plannerRankName = ref("初级策划");
const plannerTier = ref("I");
const expProgress = ref(0);
const _plannerName = ref("我是策划");
// 退出确认对话框状态
const showExitDialog = ref(false);

// 监听simulation实例变化，设置资金变化回调
watch(
  () => simulationStore.simulation,
  (newSimulation) => {
    if (newSimulation) {
      // 立即获取最新资金
      const results = newSimulation.getResults();
      plannerFunds.value = results.gameState.plannerFunds;
      updateAppData();

      // 设置资金变化回调函数，实现真正的响应式更新
      newSimulation.setFundsUpdateCallback((newFunds) => {
        plannerFunds.value = newFunds;
        updateAppData();
      });
    }
  },
  { immediate: true },
);

// 记录上一次的等级，用于判断是否需要显示升级特效
const previousLevel = ref(1);

// 升级特效状态
const showLevelUpEffect = ref(false);
const levelUpMessage = ref("");

// 计算属性：经验进度百分比
const _expProgressPercent = computed(() => {
  if (plannerLevelUpExp.value === 0) return 100;
  return Math.min(
    100,
    Math.floor((plannerExp.value / plannerLevelUpExp.value) * 100),
  );
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
  plannerLevel.value = newLevel;
  plannerRankName.value = currentLevel.name;
  plannerTier.value = currentSubLevel.name; // 设置段位（如 I, II, III）
  plannerExp.value = careerSystemStore.exp;
  // 当前级别的最大经验值是当前小等级所需的升级经验
  plannerLevelUpExp.value = currentSubLevel.expRequired;
};

// 提供策划数据给子组件
provide("plannerLevel", plannerLevel);
provide("plannerRankName", plannerRankName);
provide("plannerExp", plannerExp);
provide("plannerLevelUpExp", plannerLevelUpExp);
provide("plannerFunds", plannerFunds);
provide("expProgress", expProgress);

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
      plannerFunds.value += expResult.fundsEarned;
      updateAppData();
    }
  }

  // 更新所有策划数据
  updateCareerData();
};
provide("addExp", addExp);

// 监听职业系统状态变化，更新UI
watch(
  () => careerSystemStore.currentLevelIndex,
  () => {
    updateCareerData();
  },
);

watch(
  () => careerSystemStore.currentSubLevelIndex,
  () => {
    updateCareerData();
  },
);

watch(
  () => careerSystemStore.exp,
  () => {
    updateCareerData();
  },
);

// 初始化数据
updateCareerData();

// 本地存储键
const DESKTOP_APPS_KEY = "desktop-apps";

// 初始桌面应用列表
const initialDesktopApps: DesktopApp[] = [
  {
    id: "wallet",
    name: "钱包",
    icon: "💰",
    position: { x: 50, y: 50 },
    coreData: {
      balance: 0,
    },
    modules: [
      { id: "balance-info", name: "余额信息" },
      { id: "transaction-history", name: "交易记录" },
    ],
  },
  {
    id: "app-store",
    name: "应用中心",
    icon: "📱",
    position: { x: 250, y: 50 },
    coreData: {},
    modules: [{ id: "app-store", name: "应用中心" }],
  },
  {
    id: "game-release",
    name: "游戏发布",
    icon: "📦",
    position: { x: 450, y: 50 },
    coreData: {},
    modules: [{ id: "game-release", name: "游戏发布" }],
  },
];

// 可下载的应用列表 - 用于下载时创建临时应用图标
const availableAppsForDownload: AvailableApp[] = [
  {
    id: "data-center",
    name: "数据中心",
    icon: "📊",
    description: "",
    memory: "",
    category: "system",
    requiredLevelId: "trainee-planner",
  },
  {
    id: "career-growth",
    name: "策划成长",
    icon: "📈",
    description: "",
    memory: "",
    category: "system",
    requiredLevelId: "trainee-planner",
  },
  {
    id: "system-settings",
    name: "系统设置",
    icon: "⚙️",
    description: "",
    memory: "",
    category: "system",
    requiredLevelId: "trainee-planner",
  },
  {
    id: "chat",
    name: "聊天",
    icon: "💬",
    description: "",
    memory: "",
    category: "core",
    requiredLevelId: "trainee-planner",
  },
  {
    id: "hero-development",
    name: "英雄",
    icon: "🦸",
    description: "",
    memory: "",
    category: "core",
    requiredLevelId: "trainee-planner",
  },
  {
    id: "skin-development",
    name: "皮肤",
    icon: "🧵",
    description: "",
    memory: "",
    category: "core",
    requiredLevelId: "trainee-planner",
  },
  {
    id: "event-development",
    name: "活动",
    icon: "🎪",
    description: "",
    memory: "",
    category: "core",
    requiredLevelId: "trainee-planner",
  },
  {
    id: "task-center",
    name: "任务中心",
    icon: "📋",
    description: "",
    memory: "",
    category: "advanced",
    requiredLevelId: "junior-planner",
  },
  {
    id: "collaboration-center",
    name: "联动中心",
    icon: "🤝",
    description: "",
    memory: "",
    category: "advanced",
    requiredLevelId: "intermediate-planner",
  },
  {
    id: "public-opinion-center",
    name: "舆情中心",
    icon: "📢",
    description: "",
    memory: "",
    category: "advanced",
    requiredLevelId: "senior-planner",
  },
  {
    id: "event-log",
    name: "事件日志",
    icon: "📝",
    description: "",
    memory: "",
    category: "advanced",
    requiredLevelId: "intermediate-planner",
  },
  {
    id: "channel-delivery",
    name: "渠道投放",
    icon: "📣",
    description: "",
    memory: "",
    category: "advanced",
    requiredLevelId: "expert-planner",
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
  if (
    windowManagerStore.downloadProgress &&
    Array.isArray(windowManagerStore.downloadProgress)
  ) {
    windowManagerStore.downloadProgress.forEach((download) => {
      const exists = apps.some((app) => app.id === download.appId);
      if (!exists) {
        const appInfo = availableAppsForDownload.find(
          (a) => a.id === download.appId,
        );
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

// 处理应用安装事件
const handleAppInstalled = (app: App): void => {
  // 检查应用是否已存在
  const exists = desktopApps.value.some(
    (existingApp) => existingApp.id === app.id,
  );
  if (exists) return;

  // 根据应用类型配置不同的modules
  let modules;
  switch (app.id) {
    case "lottery":
      modules = [
        { id: "lottery-main", name: "抽奖主界面" },
        { id: "lottery-history", name: "抽奖历史" },
        { id: "lottery-rewards", name: "累抽奖励" },
      ];
      break;
    case "hero-development":
      modules = [
        { id: "hero-new", name: "新建英雄" },
        { id: "hero-manage", name: "英雄管理" },
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

// 保存游戏（由 DesktopTaskbar 调用）
const saveGame = (): void => {
  const gameStore = useGameStore();
  const simulationGameStateStore = useSimulationGameStateStore();
  const playerStore = usePlayerStore();
  const simulationStore = useSimulationStore();

  const gameSnapshot = {
    timestamp: Date.now(),
    gameStore: gameStore.$state,
    simulationGameStateStore: simulationGameStateStore.$state,
    playerStore: playerStore.$state,
    simulationStore: simulationStore.$state,
    desktopApps: desktopApps.value,
  };

  const savedGames = JSON.parse(localStorage.getItem("game-snapshots") || "[]");
  savedGames.push(gameSnapshot);
  localStorage.setItem("game-snapshots", JSON.stringify(savedGames));
};

// 重新开始游戏（由 DesktopTaskbar 调用）
const restartGame = (): void => {
  if (confirm("确定要重新开始游戏吗？所有进度将丢失！")) {
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

    const localStorageKeys = [
      "game-snapshots",
      "pinia-game",
      "pinia-simulationGameState",
      "pinia-player",
      "pinia-simulation",
      "simulation-task-system",
      "simulation-career-system",
      "simulation-newbie-goals",
      "simulation-skin-development",
      "simulation-hero-development",
      "simulation-business-data",
      "simulation-core-goals",
      "lottery-storage",
      "hero-skin-data",
      "desktop-apps",
      "app-store-installed-apps",
      "heroes-storage",
      "skins-storage",
    ];

    localStorageKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    desktopApps.value = initialDesktopApps;
    resetAppPositions(desktopApps.value);
    saveDesktopApps();

    activeApps.value = [];
    minimizedApps.value = [];
    openModals.value = [];

    window.location.reload();
  }
};

// 打开游戏设置（由 DesktopTaskbar 调用）
const openGameSettings = (): void => {
  let settingsApp = desktopApps.value.find((app) => app.id === "game-settings");

  if (!settingsApp) {
    settingsApp = {
      id: "game-settings",
      name: "游戏设置",
      icon: "⚙️",
      position: { x: 0, y: 0 },
      coreData: {},
      modules: [
        { id: "basic-settings", name: "基本设置" },
        { id: "advanced-settings", name: "高级设置" },
        { id: "about", name: "关于" },
      ],
    };

    desktopApps.value.push(settingsApp);
    resetAppPositions(desktopApps.value);
    saveDesktopApps();
  }

  openApp(settingsApp);
};

// 处理直接退出
const handleExit = (): void => {
  showExitDialog.value = false;
  router.push("/");
};

// 处理保存后退出
const handleSaveAndExit = (): void => {
  showExitDialog.value = false;
  saveGame();
  router.push("/");
};

// 初始化
onMounted(() => {
  updateAppData();

  const gameReleaseApp = desktopApps.value.find(
    (app) => app.id === "game-release",
  );
  if (!gameReleaseApp) {
    desktopApps.value.push({
      id: "game-release",
      name: "游戏发布",
      icon: "📦",
      position: { x: 450, y: 50 },
      coreData: {},
      modules: [{ id: "game-release", name: "游戏发布" }],
    });
    resetAppPositions(desktopApps.value);
    saveDesktopApps();
  }
});

// 更新桌面应用数据
const updateAppData = (): void => {
  // 更新钱包应用，将余额与策划资金挂钩
  const walletApp = desktopApps.value.find((app) => app.id === "wallet");
  if (walletApp) {
    walletApp.coreData = {
      balance: plannerFunds.value, // 余额与策划资金保持一致
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
  { deep: true },
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
  const existingModal = openModals.value.find(
    (modal) => modal.appId === app.id,
  );
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
    windowManagerStore.createWindow(app.name, { type: "app", props: { app } });
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
  const index = openModals.value.findIndex(
    (modal) => modal.id === updatedModal.id,
  );
  if (index !== -1) {
    openModals.value[index] = updatedModal;
  }
};
</script>

<style lang="scss" scoped>
// ============================================
// DesktopSystem 组件样式
// ============================================

.desktop-system {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: tokens.$bg-dark;
  color: tokens.$text-primary;
  font-family: tokens.$font-family-base;
  overflow: hidden;

  /* 弹出层 */
  .desktop-modals {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 150;
    pointer-events: none;

    > * {
      pointer-events: auto;
    }
  }
}
</style>
