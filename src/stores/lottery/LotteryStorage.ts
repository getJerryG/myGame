import { defineStore } from "pinia";

// 定义抽奖配置类型
export type LotteryConfig = Record<string, unknown>;

// 定义抽奖结果类型
export interface LotteryResult {
  type: string;
  amount: number;
}

// 定义抽奖存储状态类型
interface LotteryStorageState {
  // 抽奖配置存储
  configStorage: {
    // 上次更新时间
    lastUpdated: number;
    // 配置版本
    version: string;
    // 配置数据
    data: LotteryConfig;
  };
  // 抽奖结果缓存
  resultCache: {
    // 缓存的抽奖结果
    cachedResults: Array<{
      cacheKey: string;
      results: LotteryResult[];
      timestamp: number;
      expiration: number;
    }>;
    // 最大缓存数量
    maxCacheSize: number;
  };
  // 抽奖统计数据
  statistics: {
    // 每日抽奖数据
    daily: Record<
      string,
      {
        date: string;
        drawCount: number;
        totalCost: number;
        totalRewards: number;
      }
    >;
    // 总计数据
    total: {
      drawCount: number;
      totalCost: number;
      totalRewards: number;
    };
  };
}

// 创建并导出存储store
export const useLotteryStorageStore = defineStore("lotteryStorage", {
  state: (): LotteryStorageState => ({
    // 初始配置存储
    configStorage: {
      lastUpdated: Date.now(),
      version: "1.0.0",
      data: {},
    },
    // 初始结果缓存
    resultCache: {
      cachedResults: [],
      maxCacheSize: 100,
    },
    // 初始统计数据
    statistics: {
      daily: {},
      total: {
        drawCount: 0,
        totalCost: 0,
        totalRewards: 0,
      },
    },
  }),

  getters: {
    // 获取今日抽奖数据
    todayStatistics: (state) => {
      const today = new Date().toISOString().split("T")[0];
      return (
        state.statistics.daily[today] || {
          date: today,
          drawCount: 0,
          totalCost: 0,
          totalRewards: 0,
        }
      );
    },

    // 获取缓存的抽奖结果
    getCachedResults: (state) => (cacheKey: string) => {
      const cachedItem = state.resultCache.cachedResults.find(
        (item) => item.cacheKey === cacheKey,
      );
      if (cachedItem && cachedItem.expiration > Date.now()) {
        return cachedItem.results;
      }
      return null;
    },
  },

  actions: {
    // 保存抽奖配置
    saveConfig(configData: LotteryConfig) {
      this.configStorage.data = { ...this.configStorage.data, ...configData };
      this.configStorage.lastUpdated = Date.now();
    },

    // 加载抽奖配置
    loadConfig(): LotteryConfig {
      return { ...this.configStorage.data };
    },

    // 缓存抽奖结果
    cacheResults(
      cacheKey: string,
      results: LotteryResult[],
      expirationMinutes = 60,
    ) {
      // 移除旧的相同key的缓存
      this.resultCache.cachedResults = this.resultCache.cachedResults.filter(
        (item) => item.cacheKey !== cacheKey,
      );

      // 添加新缓存
      this.resultCache.cachedResults.push({
        cacheKey,
        results,
        timestamp: Date.now(),
        expiration: Date.now() + expirationMinutes * 60 * 1000,
      });

      // 清理超出最大数量的缓存
      if (
        this.resultCache.cachedResults.length > this.resultCache.maxCacheSize
      ) {
        this.resultCache.cachedResults.sort(
          (a, b) => a.timestamp - b.timestamp,
        );
        this.resultCache.cachedResults = this.resultCache.cachedResults.slice(
          -this.resultCache.maxCacheSize,
        );
      }
    },

    // 更新抽奖统计
    updateStatistics(
      date: string,
      drawCount: number,
      cost: number,
      rewardValue: number,
    ) {
      // 更新每日统计
      if (!this.statistics.daily[date]) {
        this.statistics.daily[date] = {
          date,
          drawCount: 0,
          totalCost: 0,
          totalRewards: 0,
        };
      }

      this.statistics.daily[date].drawCount += drawCount;
      this.statistics.daily[date].totalCost += cost;
      this.statistics.daily[date].totalRewards += rewardValue;

      // 更新总计数据
      this.statistics.total.drawCount += drawCount;
      this.statistics.total.totalCost += cost;
      this.statistics.total.totalRewards += rewardValue;
    },

    // 清理过期缓存
    cleanExpiredCache() {
      const now = Date.now();
      this.resultCache.cachedResults = this.resultCache.cachedResults.filter(
        (item) => item.expiration > now,
      );
    },

    // 重置统计数据
    resetStatistics() {
      this.statistics = {
        daily: {},
        total: {
          drawCount: 0,
          totalCost: 0,
          totalRewards: 0,
        },
      };
    },
  },

  // 持久化存储
  persist: {
    key: "lottery-storage",
    storage: localStorage,
  },
});
