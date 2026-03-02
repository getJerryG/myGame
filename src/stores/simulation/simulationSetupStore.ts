import { defineStore } from "pinia";

// 定义游戏设置类型
interface GameSetup {
  id: string;
  name: string;
  type: "casual" | "core" | "hardcore" | "simulation" | "rpg" | "strategy";
  platform: "pc" | "mobile" | "console" | "cross_platform";
  targetAudience: "children" | "teen" | "adult" | "all_ages";
  developmentTime: number; // 预估开发时间（天）
  estimatedCost: number; // 预估开发成本
  requiredTeamSize: {
    designers: number;
    programmers: number;
    artists: number;
    producers: number;
    marketing: number;
  };
  features: Array<{
    id: string;
    name: string;
    description: string;
    cost: number;
    developmentTime: number;
    isSelected: boolean;
  }>;
  status: "planning" | "in_development" | "testing" | "completed" | "cancelled";
  createdAt: number;
  updatedAt: number;
}

// 定义游戏设置状态类型
interface SimulationSetupState {
  // 游戏设置列表
  gameSetups: GameSetup[];
  // 当前活动设置
  currentSetup?: GameSetup;
  // 设置配置
  setupConfig: {
    maxSimultaneousSetups: number;
    defaultFeatures: string[];
    costCalculationBase: number;
    timeCalculationBase: number;
  };
  // 平台配置
  platformConfig: Array<{
    id: string;
    name: string;
    costMultiplier: number;
    timeMultiplier: number;
    audienceSize: number;
  }>;
}

// 创建并导出游戏设置store
export const useSimulationSetupStore = defineStore("simulationSetup", {
  state: (): SimulationSetupState => ({
    // 初始游戏设置列表
    gameSetups: [],
    // 初始当前活动设置为undefined
    currentSetup: undefined,
    // 初始设置配置
    setupConfig: {
      maxSimultaneousSetups: 3,
      defaultFeatures: [],
      costCalculationBase: 10000,
      timeCalculationBase: 30,
    },
    // 初始平台配置
    platformConfig: [
      {
        id: "platform_pc",
        name: "PC",
        costMultiplier: 1.0,
        timeMultiplier: 1.0,
        audienceSize: 1000000,
      },
      {
        id: "platform_mobile",
        name: "移动设备",
        costMultiplier: 0.8,
        timeMultiplier: 0.7,
        audienceSize: 5000000,
      },
      {
        id: "platform_console",
        name: "主机",
        costMultiplier: 1.5,
        timeMultiplier: 1.3,
        audienceSize: 2000000,
      },
      {
        id: "platform_cross",
        name: "跨平台",
        costMultiplier: 2.0,
        timeMultiplier: 1.8,
        audienceSize: 8000000,
      },
    ],
  }),

  getters: {
    // 获取活跃的游戏设置
    activeSetups: (state) => {
      return state.gameSetups.filter(
        (setup) => setup.status === "planning" || setup.status === "in_development" || setup.status === "testing"
      );
    },

    // 获取已完成的游戏设置
    completedSetups: (state) => {
      return state.gameSetups.filter((setup) => setup.status === "completed");
    },

    // 根据平台获取配置
    getPlatformConfig: (state) => (platformId: string) => {
      return state.platformConfig.find((platform) => platform.id === platformId);
    },

    // 根据ID获取游戏设置
    getSetupById: (state) => (setupId: string) => {
      return state.gameSetups.find((setup) => setup.id === setupId);
    },
  },

  actions: {
    // 创建新游戏设置
    createGameSetup(setupData: Omit<GameSetup, "id" | "createdAt" | "updatedAt" | "features">) {
      if (this.activeSetups.length >= this.setupConfig.maxSimultaneousSetups) {
        throw new Error("已达到最大同时设置数量限制");
      }

      // 初始化特性列表
      const initialFeatures = [
        {
          id: "feature_multiplayer",
          name: "多人游戏",
          description: "支持玩家之间的在线交互",
          cost: 5000,
          developmentTime: 15,
          isSelected: false,
        },
        {
          id: "feature_graphics",
          name: "高级图形",
          description: "高质量的视觉效果和图形",
          cost: 8000,
          developmentTime: 20,
          isSelected: false,
        },
        {
          id: "feature_story",
          name: "丰富剧情",
          description: "深入的游戏剧情和角色发展",
          cost: 6000,
          developmentTime: 25,
          isSelected: false,
        },
        {
          id: "feature_customization",
          name: "角色定制",
          description: "允许玩家自定义角色外观和能力",
          cost: 4000,
          developmentTime: 10,
          isSelected: false,
        },
      ];

      const newSetup: GameSetup = {
        ...setupData,
        id: `setup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        features: initialFeatures,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      this.gameSetups.push(newSetup);
      return newSetup;
    },

    // 更新游戏设置
    updateGameSetup(setupId: string, updates: Partial<GameSetup>) {
      const setup = this.getSetupById(setupId);
      if (setup) {
        Object.assign(setup, updates);
        setup.updatedAt = Date.now();
      }
    },

    // 设置当前活动设置
    setCurrentSetup(setupId: string) {
      this.currentSetup = this.getSetupById(setupId);
    },

    // 选择特性
    toggleFeatureSelection(setupId: string, featureId: string) {
      const setup = this.getSetupById(setupId);
      if (setup) {
        const feature = setup.features.find((f) => f.id === featureId);
        if (feature) {
          feature.isSelected = !feature.isSelected;
          setup.updatedAt = Date.now();
        }
      }
    },

    // 计算开发成本
    calculateDevelopmentCost(setup: GameSetup) {
      // 基础成本
      let totalCost = this.setupConfig.costCalculationBase;

      // 平台成本乘数
      const platform = this.getPlatformConfig(`platform_${setup.platform}`);
      if (platform) {
        totalCost *= platform.costMultiplier;
      }

      // 团队规模成本
      const teamSize = Object.values(setup.requiredTeamSize).reduce((sum, count) => sum + count, 0);
      totalCost *= 1 + teamSize * 0.1;

      // 特性成本
      const selectedFeatures = setup.features.filter((f) => f.isSelected);
      const featuresCost = selectedFeatures.reduce((sum, feature) => sum + feature.cost, 0);
      totalCost += featuresCost;

      return Math.round(totalCost);
    },

    // 计算开发时间
    calculateDevelopmentTime(setup: GameSetup) {
      // 基础时间
      let totalTime = this.setupConfig.timeCalculationBase;

      // 平台时间乘数
      const platform = this.getPlatformConfig(`platform_${setup.platform}`);
      if (platform) {
        totalTime *= platform.timeMultiplier;
      }

      // 特性开发时间
      const selectedFeatures = setup.features.filter((f) => f.isSelected);
      const featuresTime = selectedFeatures.reduce((sum, feature) => sum + feature.developmentTime, 0);
      totalTime += featuresTime;

      return Math.round(totalTime);
    },
  },

  // 持久化存储
  persist: {
    key: "simulation-setup",
    storage: localStorage,
  },
});
