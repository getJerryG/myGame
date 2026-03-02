import { defineStore } from "pinia";

// 定义游戏状态类型
interface GameState {
  id: string;
  name: string;
  version: string;
  status: "development" | "beta" | "released" | "maintenance" | "sunset";
  releaseDate?: number;
  lastUpdate: number;
  playerCount: {
    dailyActive: number;
    monthlyActive: number;
    peakConcurrent: number;
    total: number;
  };
  performanceMetrics: {
    averageFPS: number;
    loadTime: number;
    crashRate: number;
    serverResponseTime: number;
  };
  technicalStats: {
    codebaseSize: number;
    activeBugs: number;
    resolvedBugs: number;
    featureRequests: number;
    technicalDebt: number;
  };
  currentPhase: string;
  nextMilestone: string;
  milestoneDate?: number;
}

// 定义游戏状态状态类型
interface SimulationGameStateState {
  // 当前游戏状态
  currentState: GameState;
  // 游戏状态历史
  stateHistory: Array<{
    timestamp: number;
    state: Partial<GameState>;
  }>;
  // 游戏配置
  gameConfig: {
    updateFrequency: number;
    stateHistoryRetentionDays: number;
    performanceThresholds: {
      minFPS: number;
      maxLoadTime: number;
      maxCrashRate: number;
    };
  };
}

// 创建并导出游戏状态store
export const useSimulationGameStateStore = defineStore("simulationGameState", {
  state: (): SimulationGameStateState => ({
    // 初始当前游戏状态
    currentState: {
      id: "game_main",
      name: "模拟游戏",
      version: "1.0.0",
      status: "development",
      lastUpdate: Date.now(),
      playerCount: {
        dailyActive: 0,
        monthlyActive: 0,
        peakConcurrent: 0,
        total: 0,
      },
      performanceMetrics: {
        averageFPS: 60,
        loadTime: 2.5,
        crashRate: 0.1,
        serverResponseTime: 100,
      },
      technicalStats: {
        codebaseSize: 100000,
        activeBugs: 50,
        resolvedBugs: 0,
        featureRequests: 20,
        technicalDebt: 1000,
      },
      currentPhase: "前期开发",
      nextMilestone: "Alpha测试",
    },
    // 初始游戏状态历史为空数组
    stateHistory: [],
    // 初始游戏配置
    gameConfig: {
      updateFrequency: 60,
      stateHistoryRetentionDays: 90,
      performanceThresholds: {
        minFPS: 30,
        maxLoadTime: 5,
        maxCrashRate: 1.0,
      },
    },
  }),

  getters: {
    // 获取游戏性能状态
    performanceStatus: (state) => {
      const thresholds = state.gameConfig.performanceThresholds;
      const metrics = state.currentState.performanceMetrics;

      return {
        fps: metrics.averageFPS >= thresholds.minFPS ? "good" : "poor",
        loadTime: metrics.loadTime <= thresholds.maxLoadTime ? "good" : "poor",
        crashRate:
          metrics.crashRate <= thresholds.maxCrashRate ? "good" : "poor",
      };
    },

    // 获取游戏状态变化趋势
    stateTrend: (state) => {
      return state.stateHistory
        .slice(-30)
        .sort((a, b) => a.timestamp - b.timestamp);
    },

    // 获取当前版本生命周期
    versionLifecycle: (state) => {
      if (!state.currentState.releaseDate) return 0;
      return Math.floor(
        (Date.now() - state.currentState.releaseDate) / (24 * 60 * 60 * 1000),
      );
    },
  },

  actions: {
    // 更新游戏状态
    updateGameState(updates: Partial<GameState>) {
      // 记录当前状态到历史
      this.stateHistory.push({
        timestamp: Date.now(),
        state: { ...this.currentState },
      });

      // 更新当前状态
      this.currentState = {
        ...this.currentState,
        ...updates,
        lastUpdate: Date.now(),
      };

      // 清理旧的历史记录
      this.cleanStateHistory();
    },

    // 更新玩家数量
    updatePlayerCount(updates: Partial<GameState["playerCount"]>) {
      this.updateGameState({
        playerCount: { ...this.currentState.playerCount, ...updates },
      });
    },

    // 更新性能指标
    updatePerformanceMetrics(
      updates: Partial<GameState["performanceMetrics"]>,
    ) {
      this.updateGameState({
        performanceMetrics: {
          ...this.currentState.performanceMetrics,
          ...updates,
        },
      });
    },

    // 更新技术统计
    updateTechnicalStats(updates: Partial<GameState["technicalStats"]>) {
      this.updateGameState({
        technicalStats: { ...this.currentState.technicalStats, ...updates },
      });
    },

    // 清理旧的状态历史
    cleanStateHistory() {
      const retentionTime =
        this.gameConfig.stateHistoryRetentionDays * 24 * 60 * 60 * 1000;
      const cutoffTime = Date.now() - retentionTime;

      this.stateHistory = this.stateHistory.filter(
        (entry) => entry.timestamp >= cutoffTime,
      );
    },

    // 发布游戏
    releaseGame() {
      this.updateGameState({
        status: "released",
        releaseDate: Date.now(),
        currentPhase: "正式运营",
        nextMilestone: "第一个内容更新",
      });
    },

    // 更新游戏版本
    updateGameVersion(newVersion: string) {
      this.updateGameState({
        version: newVersion,
      });
    },
  },

  // 持久化存储
  persist: {
    key: "simulation-game-state",
    storage: localStorage,
  },
});
