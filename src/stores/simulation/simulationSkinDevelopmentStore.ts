import { defineStore } from "pinia";

// 定义皮肤类型
export interface Skin {
  id: string;
  name: string;
  quality: "common" | "rare" | "epic" | "legendary";
  theme: string;
  isLimited: boolean;
  isDual: boolean;
  developmentCost: number;
  developmentTime: number;
  releaseTime?: number;
  sales: number;
  revenue: number;
  popularity: number;
  qualityScore: number;
  developmentStatus: "planning" | "development" | "testing" | "released";
  description?: string;
  tags?: string[];
}

// 定义皮肤开发任务类型
interface SkinDevelopmentTask {
  id: string;
  skinId: string;
  name: string;
  type: "art" | "programming" | "testing" | "design";
  progress: number;
  requiredTime: number;
  completed: boolean;
}

// 定义皮肤开发系统状态类型
interface SkinDevelopmentState {
  // 所有皮肤数据
  skins: Skin[];
  // 当前开发的皮肤ID
  currentDevelopingSkinId: string | null;
  // 开发任务列表
  developmentTasks: SkinDevelopmentTask[];
  // 开发进度
  totalDevelopmentProgress: number;
  // 可用于开发的资源
  availableResources: {
    funds: number;
    teamSize: number;
    dailyProductivity: number;
  };
  // 统计数据
  statistics: {
    totalSkinsDeveloped: number;
    totalRevenue: number;
    averageSales: number;
    successfulSkins: number;
  };
}

// 创建并导出皮肤开发系统store
export const useSimulationSkinDevelopmentStore = defineStore(
  "simulationSkinDevelopment",
  {
    state: (): SkinDevelopmentState => ({
      // 所有皮肤数据
      skins: [],
      // 当前开发的皮肤ID
      currentDevelopingSkinId: null,
      // 开发任务列表
      developmentTasks: [],
      // 开发进度
      totalDevelopmentProgress: 0,
      // 可用于开发的资源
      availableResources: {
        funds: 0,
        teamSize: 1,
        dailyProductivity: 100,
      },
      // 统计数据
      statistics: {
        totalSkinsDeveloped: 0,
        totalRevenue: 0,
        averageSales: 0,
        successfulSkins: 0,
      },
    }),

    getters: {
      // 获取所有正在开发的皮肤
      getDevelopingSkins: (state) => {
        return state.skins.filter(
          (skin) => skin.developmentStatus === "development",
        );
      },

      // 获取所有已发布的皮肤
      getReleasedSkins: (state) => {
        return state.skins.filter(
          (skin) => skin.developmentStatus === "released",
        );
      },

      // 根据ID获取皮肤
      getSkinById: (state) => (skinId: string) => {
        return state.skins.find((skin) => skin.id === skinId);
      },

      // 获取当前正在开发的皮肤
      getCurrentDevelopingSkin: (state) => {
        if (!state.currentDevelopingSkinId) return null;
        return state.skins.find(
          (skin) => skin.id === state.currentDevelopingSkinId,
        );
      },

      // 获取已发布皮肤的数量
      getReleasedSkinsCount: (state) => {
        return state.skins.filter(
          (skin) => skin.developmentStatus === "released",
        ).length;
      },

      // 检查皮肤项目是否存在
      isSkinProjectExists: (state) => (skinId: string) => {
        return state.skins.some((skin) => skin.id === skinId);
      },
    },

    actions: {
      // 计算皮肤开发成本
      calculateDevelopmentCost(
        quality: Skin["quality"],
        isDual: boolean,
        isLimited: boolean,
      ): number {
        let baseCost = 0;

        // 根据品质计算基础成本
        switch (quality) {
          case "common":
            baseCost = 500;
            break;
          case "rare":
            baseCost = 1000;
            break;
          case "epic":
            baseCost = 2000;
            break;
          case "legendary":
            baseCost = 5000;
            break;
        }

        // 双版本额外成本
        if (isDual) {
          baseCost *= 1.5;
        }

        // 限定版额外成本
        if (isLimited) {
          baseCost *= 2;
        }

        return Math.floor(baseCost);
      },

      // 计算皮肤开发时间
      calculateDevelopmentTime(
        quality: Skin["quality"],
        isDual: boolean,
      ): number {
        let baseTime = 0;

        // 根据品质计算基础时间
        switch (quality) {
          case "common":
            baseTime = 123;
            break;
          case "rare":
            baseTime = 235;
            break;
          case "epic":
            baseTime = 355;
            break;
          case "legendary":
            baseTime = 577;
            break;
        }

        // 双版本额外时间
        if (isDual) {
          baseTime *= 1.5;
        }

        return Math.floor(baseTime);
      },

      // 创建皮肤项目
      createSkinProject(
        name: string,
        quality: Skin["quality"],
        theme: string,
        isLimited: boolean,
        isDual: boolean,
      ): boolean {
        // 检查资金是否足够
        const developmentCost = this.calculateDevelopmentCost(
          quality,
          isDual,
          isLimited,
        );
        if (this.availableResources.funds < developmentCost) {
          // console.error("资金不足，无法创建皮肤项目");
          return false;
        }

        // 消耗资金
        this.availableResources.funds -= developmentCost;

        // 创建新皮肤
        const newSkin: Skin = {
          id: `skin-${Date.now()}`,
          name,
          quality,
          theme,
          isLimited,
          isDual,
          developmentCost,
          developmentTime: this.calculateDevelopmentTime(quality, isDual),
          sales: 0,
          revenue: 0,
          popularity: 0,
          qualityScore: 0,
          developmentStatus: "planning",
        };

        // 添加到皮肤列表
        this.skins.push(newSkin);

        return true;
      },

      // 开始开发皮肤
      startSkinDevelopment(skinId: string): boolean {
        const skin = this.skins.find((s) => s.id === skinId);
        if (!skin) {
          // console.error("皮肤不存在，无法开始开发");
          return false;
        }

        // 设置皮肤状态为开发中
        skin.developmentStatus = "development";

        // 设置当前开发的皮肤ID
        this.currentDevelopingSkinId = skinId;

        // 创建开发任务
        this.createDevelopmentTasks(skinId);

        return true;
      },

      // 创建开发任务
      createDevelopmentTasks(skinId: string): void {
        // 清除旧任务
        this.developmentTasks = this.developmentTasks.filter(
          (task) => task.skinId !== skinId,
        );

        // 创建新任务
        const tasks: SkinDevelopmentTask[] = [
          {
            id: `task-${Date.now()}-1`,
            skinId,
            name: "角色艺术设计",
            type: "art",
            progress: 0,
            requiredTime: 25,
            completed: false,
          },
          {
            id: `task-${Date.now()}-2`,
            skinId,
            name: "技能特效设计",
            type: "design",
            progress: 0,
            requiredTime: 20,
            completed: false,
          },
          {
            id: `task-${Date.now()}-3`,
            skinId,
            name: "3D模型制作",
            type: "art",
            progress: 0,
            requiredTime: 30,
            completed: false,
          },
          {
            id: `task-${Date.now()}-4`,
            skinId,
            name: "动画制作",
            type: "programming",
            progress: 0,
            requiredTime: 25,
            completed: false,
          },
          {
            id: `task-${Date.now()}-5`,
            skinId,
            name: "代码实现",
            type: "programming",
            progress: 0,
            requiredTime: 35,
            completed: false,
          },
          {
            id: `task-${Date.now()}-6`,
            skinId,
            name: "测试与调试",
            type: "testing",
            progress: 0,
            requiredTime: 15,
            completed: false,
          },
        ];

        // 添加到任务列表
        this.developmentTasks.push(...tasks);
      },

      // 推进开发进度
      updateDevelopmentProgress() {
        if (!this.currentDevelopingSkinId) return;

        // 计算每日进度
        const dailyProgress =
          this.availableResources.dailyProductivity *
          this.availableResources.teamSize;

        // 更新未完成任务的进度
        const ongoingTasks = this.developmentTasks.filter(
          (task) =>
            task.skinId === this.currentDevelopingSkinId && !task.completed,
        );

        if (ongoingTasks.length === 0) {
          // 所有任务已完成，标记皮肤开发完成
          const skin = this.skins.find(
            (s) => s.id === this.currentDevelopingSkinId,
          );
          if (skin) {
            skin.developmentStatus = "testing";
          }
          return;
        }

        // 平均分配进度到所有未完成任务
        const progressPerTask = dailyProgress / ongoingTasks.length;

        ongoingTasks.forEach((task) => {
          task.progress += progressPerTask;

          // 检查任务是否完成
          if (task.progress >= 100) {
            task.progress = 100;
            task.completed = true;
          }
        });

        // 更新总进度
        const totalRequiredProgress = this.developmentTasks
          .filter((task) => task.skinId === this.currentDevelopingSkinId)
          .reduce((total, task) => total + task.requiredTime, 0);

        const currentTotalProgress = this.developmentTasks
          .filter((task) => task.skinId === this.currentDevelopingSkinId)
          .reduce(
            (total, task) => total + (task.progress / 100) * task.requiredTime,
            0,
          );

        this.totalDevelopmentProgress = Math.floor(
          (currentTotalProgress / totalRequiredProgress) * 100,
        );
      },

      // 开始测试皮肤
      startSkinTesting(skinId: string): boolean {
        const skin = this.skins.find((s) => s.id === skinId);
        if (skin?.developmentStatus !== "development") {
          // console.error("皮肤不存在或未完成开发，无法开始测试");
          return false;
        }

        // 设置皮肤状态为测试中
        skin.developmentStatus = "testing";

        return true;
      },

      // 发布皮肤
      releaseSkin(skinId: string): boolean {
        const skin = this.skins.find((s) => s.id === skinId);
        if (skin?.developmentStatus !== "testing") {
          // console.error("皮肤不存在或未完成测试，无法发布");
          return false;
        }

        // 设置皮肤状态为已发布
        skin.developmentStatus = "released";
        skin.releaseTime = Date.now();

        // 更新统计数据
        this.statistics.totalSkinsDeveloped++;

        return true;
      },

      // 更新已发布皮肤的销售数据
      updateReleasedSkinStats() {
        this.skins
          .filter((skin) => skin.developmentStatus === "released")
          .forEach((skin) => {
            // 模拟每日销售数据更新
            const dailySales = Math.floor(
              (Math.random() * 100 * skin.popularity) / 100,
            );
            const price = this.calculateSkinPrice(skin);

            skin.sales += dailySales;
            skin.revenue += dailySales * price;

            // 更新流行度（基于销售和评价）
            skin.popularity = Math.min(
              100,
              skin.popularity + (dailySales > 50 ? 1 : 0),
            );
          });

        // 更新总收入和平均销售额
        this.statistics.totalRevenue = this.skins
          .filter((skin) => skin.developmentStatus === "released")
          .reduce((total, skin) => total + skin.revenue, 0);

        this.statistics.averageSales =
          this.skins.filter((skin) => skin.developmentStatus === "released")
            .length > 0
            ? Math.floor(
                this.statistics.totalRevenue /
                  this.skins.filter(
                    (skin) => skin.developmentStatus === "released",
                  ).length,
              )
            : 0;
      },

      // 计算皮肤价格
      calculateSkinPrice(skin: Skin): number {
        let basePrice = 0;

        // 根据品质计算基础价格
        switch (skin.quality) {
          case "common":
            basePrice = 200;
            break;
          case "rare":
            basePrice = 500;
            break;
          case "epic":
            basePrice = 1200;
            break;
          case "legendary":
            basePrice = 2500;
            break;
        }

        // 限定版额外加价
        if (skin.isLimited) {
          basePrice *= 1.5;
        }

        // 双版本额外加价
        if (skin.isDual) {
          basePrice *= 1.8;
        }

        return Math.floor(basePrice);
      },

      // 重置皮肤开发系统
      resetSkinDevelopmentSystem() {
        this.skins = [];
        this.currentDevelopingSkinId = null;
        this.developmentTasks = [];
        this.totalDevelopmentProgress = 0;
        this.availableResources = {
          funds: 0,
          teamSize: 1,
          dailyProductivity: 100,
        };
        this.statistics = {
          totalSkinsDeveloped: 0,
          totalRevenue: 0,
          averageSales: 0,
          successfulSkins: 0,
        };
      },
    },

    // 持久化存储
    persist: {
      key: "simulation-skin-development",
      storage: localStorage,
    },
  },
);
