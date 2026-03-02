import { defineStore } from "pinia";

// 定义累计奖励类型
export type CumulativeRewardType = "currency" | "item" | "special";

// 定义累计奖励配置类型
export interface CumulativeRewardConfig {
  type: CumulativeRewardType;
  minAmount: number;
  maxAmount: number;
  probability: number;
  itemId?: string;
  itemCount?: number;
  specialEffect?: string;
}

// 定义累计奖励类型
export interface CumulativeReward {
  id: string;
  type: CumulativeRewardType;
  amount: number;
  itemId?: string;
  itemCount?: number;
  specialEffect?: string;
  claimed: boolean;
  claimCount: number;
  createdAt: number;
}

// 定义累计奖励系统状态类型
interface CumulativeRewardsState {
  // 累计抽奖次数
  cumulativeDraws: number;
  // 累计奖励配置
  rewardConfigs: {
    currency: CumulativeRewardConfig[];
    item: CumulativeRewardConfig[];
    special: CumulativeRewardConfig[];
  };
  // 当前可领取的累计奖励
  availableRewards: CumulativeReward[];
  // 已领取的累计奖励
  claimedRewards: CumulativeReward[];
  // 奖励领取限制
  claimLimit: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  // 奖励领取统计
  claimStats: {
    total: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  // 上次重置时间
  lastReset: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

// 创建并导出累计奖励store
export const useLotteryCumulativeRewardsStore = defineStore(
  "lotteryCumulativeRewards",
  {
    state: (): CumulativeRewardsState => ({
      // 累计抽奖次数
      cumulativeDraws: 0,
      // 累计奖励配置
      rewardConfigs: {
        currency: [
          {
            type: "currency",
            minAmount: 100,
            maxAmount: 500,
            probability: 0.5,
          },
          {
            type: "currency",
            minAmount: 500,
            maxAmount: 1000,
            probability: 0.3,
          },
          {
            type: "currency",
            minAmount: 1000,
            maxAmount: 2000,
            probability: 0.15,
          },
          {
            type: "currency",
            minAmount: 2000,
            maxAmount: 5000,
            probability: 0.05,
          },
        ],
        item: [
          {
            type: "item",
            minAmount: 1,
            maxAmount: 3,
            probability: 0.4,
            itemId: "common-item",
            itemCount: 1,
          },
          {
            type: "item",
            minAmount: 1,
            maxAmount: 2,
            probability: 0.25,
            itemId: "rare-item",
            itemCount: 1,
          },
          {
            type: "item",
            minAmount: 1,
            maxAmount: 1,
            probability: 0.15,
            itemId: "epic-item",
            itemCount: 1,
          },
          {
            type: "item",
            minAmount: 1,
            maxAmount: 1,
            probability: 0.05,
            itemId: "legendary-item",
            itemCount: 1,
          },
        ],
        special: [
          {
            type: "special",
            minAmount: 1,
            maxAmount: 1,
            probability: 0.04,
            specialEffect: "double-currency",
          },
          {
            type: "special",
            minAmount: 1,
            maxAmount: 1,
            probability: 0.03,
            specialEffect: "free-draw",
          },
          {
            type: "special",
            minAmount: 1,
            maxAmount: 1,
            probability: 0.02,
            specialEffect: "guaranteed-epic",
          },
          {
            type: "special",
            minAmount: 1,
            maxAmount: 1,
            probability: 0.01,
            specialEffect: "legendary-chance",
          },
        ],
      },
      // 当前可领取的累计奖励
      availableRewards: [],
      // 已领取的累计奖励
      claimedRewards: [],
      // 奖励领取限制
      claimLimit: {
        daily: 10,
        weekly: 50,
        monthly: 200,
      },
      // 奖励领取统计
      claimStats: {
        total: 0,
        daily: 0,
        weekly: 0,
        monthly: 0,
      },
      // 上次重置时间
      lastReset: {
        daily: Date.now(),
        weekly: Date.now(),
        monthly: Date.now(),
      },
    }),

    getters: {
      // 获取累计抽奖次数
      getCumulativeDraws: (state) => state.cumulativeDraws,

      // 获取当前可领取的累计奖励
      getAvailableRewards: (state) =>
        state.availableRewards.filter((reward) => !reward.claimed),

      // 获取已领取的累计奖励
      getClaimedRewards: (state) => state.claimedRewards,

      // 获取奖励领取统计
      getClaimStats: (state) => state.claimStats,

      // 获取是否可以领取奖励
      canClaimReward: (state) => {
        return (
          state.claimStats.daily < state.claimLimit.daily &&
          state.claimStats.weekly < state.claimLimit.weekly &&
          state.claimStats.monthly < state.claimLimit.monthly
        );
      },
    },

    actions: {
      // 增加累计抽奖次数
      increaseCumulativeDraws(count = 1) {
        this.cumulativeDraws += count;

        // 检查是否达到累计奖励条件
        this.checkCumulativeReward();
      },

      // 检查是否达到累计奖励条件
      checkCumulativeReward() {
        // 这里可以添加累计奖励的触发条件
        // 例如，每10次抽奖获得一次累计奖励
        if (this.cumulativeDraws % 10 === 0 && this.cumulativeDraws > 0) {
          this.generateCumulativeReward();
        }
      },

      // 生成累计奖励
      generateCumulativeReward() {
        // 根据配置随机选择奖励类型
        const rewardType = this.selectRewardType();
        if (!rewardType) return;

        // 根据奖励类型生成奖励
        const reward = this.generateRewardByType(rewardType);
        if (!reward) return;

        // 添加到可用奖励列表
        this.availableRewards.push(reward);
      },

      // 选择奖励类型
      selectRewardType(): CumulativeRewardType | null {
        // 计算总概率
        const totalProbability = {
          currency: this.rewardConfigs.currency.reduce(
            (sum, config) => sum + config.probability,
            0,
          ),
          item: this.rewardConfigs.item.reduce(
            (sum, config) => sum + config.probability,
            0,
          ),
          special: this.rewardConfigs.special.reduce(
            (sum, config) => sum + config.probability,
            0,
          ),
        };

        const total =
          totalProbability.currency +
          totalProbability.item +
          totalProbability.special;
        const random = Math.random() * total;

        let cumulative = 0;
        if (random < cumulative + totalProbability.currency) {
          return "currency";
        } else if (
          random <
          (cumulative += totalProbability.currency) + totalProbability.item
        ) {
          return "item";
        } else if (
          random <
          (cumulative += totalProbability.item) + totalProbability.special
        ) {
          return "special";
        }

        return null;
      },

      // 根据奖励类型生成奖励
      generateRewardByType(
        type: CumulativeRewardType,
      ): CumulativeReward | null {
        const configs = this.rewardConfigs[type];
        if (!configs || configs.length === 0) return null;

        // 计算总概率
        const totalProbability = configs.reduce(
          (sum, config) => sum + config.probability,
          0,
        );
        const random = Math.random() * totalProbability;

        // 选择配置
        let cumulative = 0;
        let selectedConfig: CumulativeRewardConfig | null = null;

        for (const config of configs) {
          if (random < cumulative + config.probability) {
            selectedConfig = config;
            break;
          }
          cumulative += config.probability;
        }

        if (!selectedConfig) return null;

        // 生成随机数量
        const amount = Math.floor(
          Math.random() *
            (selectedConfig.maxAmount - selectedConfig.minAmount + 1) +
            selectedConfig.minAmount,
        );

        // 创建奖励
        const reward: CumulativeReward = {
          id: `cumulative-reward-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type,
          amount,
          itemId: selectedConfig.itemId,
          itemCount: selectedConfig.itemCount,
          specialEffect: selectedConfig.specialEffect,
          claimed: false,
          claimCount: 0,
          createdAt: Date.now(),
        };

        return reward;
      },

      // 领取累计奖励
      claimCumulativeReward(rewardId: string): boolean {
        // 检查是否可以领取奖励
        if (!this.canClaimReward) {
          return false;
        }

        // 查找奖励
        const rewardIndex = this.availableRewards.findIndex(
          (reward) => reward.id === rewardId && !reward.claimed,
        );
        if (rewardIndex === -1) {
          return false;
        }

        // 领取奖励
        const reward = this.availableRewards[rewardIndex];
        reward.claimed = true;
        reward.claimCount++;

        // 更新领取统计
        this.claimStats.total++;
        this.claimStats.daily++;
        this.claimStats.weekly++;
        this.claimStats.monthly++;

        // 将奖励移到已领取列表
        this.claimedRewards.push(reward);
        this.availableRewards.splice(rewardIndex, 1);

        // 重置累计抽奖次数
        this.cumulativeDraws = 0;

        return true;
      },

      // 处理其他累计奖励逻辑
      handleOtherCumulativeRewardLogic() {
        // 这里可以添加其他累计奖励逻辑
        // 例如，特殊奖励的特殊处理
      },

      // 重置领取统计
      resetClaimStats() {
        const now = Date.now();

        // 重置每日统计
        if (now - this.lastReset.daily >= 24 * 60 * 60 * 1000) {
          this.claimStats.daily = 0;
          this.lastReset.daily = now;
        }

        // 重置每周统计
        if (now - this.lastReset.weekly >= 7 * 24 * 60 * 60 * 1000) {
          this.claimStats.weekly = 0;
          this.lastReset.weekly = now;
        }

        // 重置每月统计
        if (now - this.lastReset.monthly >= 30 * 24 * 60 * 60 * 1000) {
          this.claimStats.monthly = 0;
          this.lastReset.monthly = now;
        }
      },

      // 重置累计奖励系统
      reset() {
        this.cumulativeDraws = 0;
        this.availableRewards = [];
        this.claimedRewards = [];
        this.claimStats = {
          total: 0,
          daily: 0,
          weekly: 0,
          monthly: 0,
        };
        this.lastReset = {
          daily: Date.now(),
          weekly: Date.now(),
          monthly: Date.now(),
        };
      },
    },

    // 持久化存储
    persist: {
      key: "lottery-cumulative-rewards",
      storage: localStorage,
    },
  },
);
