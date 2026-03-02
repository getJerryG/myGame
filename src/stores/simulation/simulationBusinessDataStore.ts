import { defineStore } from 'pinia';

// 定义业务数据类型
interface BusinessData {
  // 时间戳
  timestamp: number;
  // 下载量
  downloads: number;
  // 活跃用户数
  activeUsers: number;
  // 收入
  revenue: {
    // 广告收入
    ad: number;
    // 内购收入
    inApp: number;
    // 订阅收入
    subscription: number;
    // 总收入
    total: number;
  };
  // 用户留存率
  retentionRate: {
    // 次日留存
    day1: number;
    // 7日留存
    day7: number;
    // 30日留存
    day30: number;
  };
  // 评分
  ratings: {
    // 总评分
    total: number;
    // 评分人数
    count: number;
    // 5星评分占比
    fiveStar: number;
  };
  // 市场份额
  marketShare: number;
}

// 定义业务数据状态类型
interface SimulationBusinessDataState {
  // 当前业务数据
  currentData: BusinessData;
  // 历史业务数据
  historicalData: BusinessData[];
  // 业务数据配置
  dataConfig: {
    // 数据更新频率（分钟）
    updateFrequency: number;
    // 历史数据保留天数
    historyRetentionDays: number;
    // 数据目标
    targets: {
      dailyDownloads: number;
      monthlyRevenue: number;
      targetRetention: {
        day1: number;
        day7: number;
        day30: number;
      };
    };
  };
}

// 创建并导出业务数据store
export const useSimulationBusinessDataStore = defineStore(
  'simulationBusinessData',
  {
    state: (): SimulationBusinessDataState => ({
      // 初始当前业务数据
      currentData: {
        timestamp: Date.now(),
        downloads: 0,
        activeUsers: 0,
        revenue: {
          ad: 0,
          inApp: 0,
          subscription: 0,
          total: 0,
        },
        retentionRate: {
          day1: 0,
          day7: 0,
          day30: 0,
        },
        ratings: {
          total: 0,
          count: 0,
          fiveStar: 0,
        },
        marketShare: 0,
      },
      // 初始历史业务数据为空数组
      historicalData: [],
      // 初始业务数据配置
      dataConfig: {
        updateFrequency: 60,
        historyRetentionDays: 30,
        targets: {
          dailyDownloads: 10000,
          monthlyRevenue: 500000,
          targetRetention: {
            day1: 0.4,
            day7: 0.2,
            day30: 0.1,
          },
        },
      },
    }),

    getters: {
      // 获取今日业务数据
      todayData: (state) => {
        const today = new Date().toISOString().split('T')[0];
        return (
          state.historicalData.find(
            (data) =>
              new Date(data.timestamp).toISOString().split('T')[0] === today,
          ) || state.currentData
        );
      },

      // 获取昨日业务数据
      yesterdayData: (state) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        return state.historicalData.find(
          (data) =>
            new Date(data.timestamp).toISOString().split('T')[0] ===
            yesterdayStr,
        );
      },

      // 获取本周业务数据
      weeklyData: (state) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        return state.historicalData
          .filter((data) => data.timestamp >= oneWeekAgo.getTime())
          .sort((a, b) => a.timestamp - b.timestamp);
      },

      // 获取业务数据增长趋势
      growthTrend: (state) => {
        if (state.historicalData.length < 2) {
          return { downloads: 0, revenue: 0, activeUsers: 0 };
        }

        const latest = state.currentData;
        const previous = state.historicalData[state.historicalData.length - 1];

        return {
          downloads:
            ((latest.downloads - previous.downloads) / previous.downloads) *
              100 || 0,
          revenue:
            ((latest.revenue.total - previous.revenue.total) /
              previous.revenue.total) *
              100 || 0,
          activeUsers:
            ((latest.activeUsers - previous.activeUsers) /
              previous.activeUsers) *
              100 || 0,
        };
      },
    },

    actions: {
      // 更新业务数据
      updateBusinessData(newData: Partial<BusinessData>) {
        // 创建新的业务数据记录
        const updatedData: BusinessData = {
          ...this.currentData,
          ...newData,
          timestamp: Date.now(),
        };

        // 计算总收入
        updatedData.revenue.total =
          updatedData.revenue.ad +
          updatedData.revenue.inApp +
          updatedData.revenue.subscription;

        // 将当前数据移至历史数据
        this.historicalData.push(this.currentData);

        // 更新当前数据
        this.currentData = updatedData;

        // 清理超出保留天数的历史数据
        this.cleanHistoricalData();
      },

      // 清理历史数据
      cleanHistoricalData() {
        const retentionTime =
          this.dataConfig.historyRetentionDays * 24 * 60 * 60 * 1000;
        const cutoffTime = Date.now() - retentionTime;

        this.historicalData = this.historicalData.filter(
          (data) => data.timestamp >= cutoffTime,
        );
      },

      // 重置业务数据
      resetBusinessData() {
        this.currentData = {
          timestamp: Date.now(),
          downloads: 0,
          activeUsers: 0,
          revenue: {
            ad: 0,
            inApp: 0,
            subscription: 0,
            total: 0,
          },
          retentionRate: {
            day1: 0,
            day7: 0,
            day30: 0,
          },
          ratings: {
            total: 0,
            count: 0,
            fiveStar: 0,
          },
          marketShare: 0,
        };

        this.historicalData = [];
      },
    },

    // 持久化存储
    persist: {
      key: 'simulation-business-data',
      storage: localStorage,
    },
  },
);
