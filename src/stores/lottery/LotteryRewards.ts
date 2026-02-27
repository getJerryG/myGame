import { defineStore } from 'pinia';

// 定义奖励配置类型
interface RewardConfig {
  id: string;
  type: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  probability: number;
  amount: number;
  description: string;
}

// 定义奖励池配置类型
interface RewardPoolConfig {
  poolId: string;
  rewards: RewardConfig[];
}

// 定义奖励状态类型
interface LotteryRewardsState {
  // 奖励池配置
  rewardPools: RewardPoolConfig[];
  // 已获得的奖励
  obtainedRewards: Array<{
    rewardId: string;
    timestamp: number;
    count: number;
  }>;
  // 奖励概率配置
  probabilityConfig: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
}

// 创建并导出奖励store
export const useLotteryRewardsStore = defineStore('lotteryRewards', {
  state: (): LotteryRewardsState => ({
    // 初始奖励池配置
    rewardPools: [
      {
        poolId: 'normal',
        rewards: [
          {
            id: 'gold-100',
            type: 'gold',
            name: '金币',
            rarity: 'common',
            probability: 0.5,
            amount: 100,
            description: '获得100金币',
          },
          {
            id: 'coupon-10',
            type: 'coupon',
            name: '抽奖券',
            rarity: 'common',
            probability: 0.3,
            amount: 10,
            description: '获得10张抽奖券',
          },
          {
            id: 'skin-fragment-5',
            type: 'skinFragment',
            name: '皮肤碎片',
            rarity: 'rare',
            probability: 0.15,
            amount: 5,
            description: '获得5个皮肤碎片',
          },
          {
            id: 'epic-skin-1',
            type: 'skin',
            name: '史诗皮肤',
            rarity: 'epic',
            probability: 0.04,
            amount: 1,
            description: '获得1个史诗皮肤',
          },
          {
            id: 'legendary-skin-1',
            type: 'skin',
            name: '传奇皮肤',
            rarity: 'legendary',
            probability: 0.01,
            amount: 1,
            description: '获得1个传奇皮肤',
          },
        ],
      },
    ],
    // 初始已获得奖励为空数组
    obtainedRewards: [],
    // 初始概率配置
    probabilityConfig: {
      common: 0.8,
      rare: 0.15,
      epic: 0.04,
      legendary: 0.01,
    },
  }),

  getters: {
    // 根据奖励池ID获取奖励池
    getRewardPool: (state) => (poolId: string) => {
      return state.rewardPools.find((pool) => pool.poolId === poolId) || state.rewardPools[0];
    },

    // 获取特定稀有度的奖励
    getRewardsByRarity: (state) => (rarity: string) => {
      const allRewards = state.rewardPools.flatMap((pool) => pool.rewards);
      return allRewards.filter((reward) => reward.rarity === rarity);
    },

    // 获取已获得奖励的统计
    obtainedRewardsStats: (state) => {
      const stats: Record<string, number> = {};
      state.obtainedRewards.forEach((reward) => {
        if (stats[reward.rewardId]) {
          stats[reward.rewardId] += reward.count;
        } else {
          stats[reward.rewardId] = reward.count;
        }
      });
      return stats;
    },
  },

  actions: {
    // 根据概率抽取奖励
    drawReward(poolId = 'normal') {
      const pool = this.getRewardPool(poolId);
      const random = Math.random();
      let cumulativeProbability = 0;

      for (const reward of pool.rewards) {
        cumulativeProbability += reward.probability;
        if (random <= cumulativeProbability) {
          // 记录获得的奖励
          this.recordObtainedReward(reward.id, reward.amount);
          return reward;
        }
      }

      // 默认返回第一个奖励
      const defaultReward = pool.rewards[0];
      this.recordObtainedReward(defaultReward.id, defaultReward.amount);
      return defaultReward;
    },

    // 记录获得的奖励
    recordObtainedReward(rewardId: string, count = 1) {
      const existingReward = this.obtainedRewards.find((r) => r.rewardId === rewardId);

      if (existingReward) {
        existingReward.count += count;
        existingReward.timestamp = Date.now();
      } else {
        this.obtainedRewards.push({
          rewardId,
          timestamp: Date.now(),
          count,
        });
      }
    },

    // 添加奖励到奖励池
    addRewardToPool(poolId: string, reward: RewardConfig) {
      const pool = this.getRewardPool(poolId);
      pool.rewards.push(reward);
    },

    // 更新奖励概率
    updateRewardProbability(rewardId: string, newProbability: number) {
      this.rewardPools.forEach((pool) => {
        const reward = pool.rewards.find((r) => r.id === rewardId);
        if (reward) {
          reward.probability = newProbability;
        }
      });
    },
  },

  // 持久化存储
  persist: {
    key: 'lottery-rewards',
    storage: localStorage,
  },
});
