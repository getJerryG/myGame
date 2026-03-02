import { defineStore } from "pinia";

// 定义抽奖记录类型
interface DrawRecord {
  drawId: string;
  drawType: string;
  timestamp: number;
  rewards: Array<{
    type: string;
    amount: number;
  }>;
}

// 定义抽奖状态类型
interface LotteryDrawState {
  // 抽奖次数统计
  drawCount: {
    single: number;
    ten: number;
  };
  // 抽奖消耗记录
  drawCost: {
    gold: number;
    coupons: number;
  };
  // 抽奖历史记录
  drawHistory: DrawRecord[];
  // 上次抽奖时间
  lastDrawTime: number;
}

// 创建并导出抽奖store
export const useLotteryDrawStore = defineStore("lotteryDraw", {
  state: (): LotteryDrawState => ({
    // 初始抽奖次数为0
    drawCount: {
      single: 0,
      ten: 0,
    },
    // 初始消耗记录为0
    drawCost: {
      gold: 0,
      coupons: 0,
    },
    // 初始历史记录为空数组
    drawHistory: [],
    // 初始上次抽奖时间为0
    lastDrawTime: 0,
  }),

  getters: {
    // 获取总抽奖次数
    totalDrawCount: (state) => {
      return state.drawCount.single + state.drawCount.ten * 10;
    },
    // 获取最近的抽奖记录
    recentDraws: (state) => {
      return [...state.drawHistory].reverse().slice(0, 10);
    },
  },

  actions: {
    // 单次抽奖
    singleDraw(drawType = "normal") {
      // 实现单次抽奖逻辑
      this.drawCount.single++;
      this.lastDrawTime = Date.now();

      // 创建抽奖记录
      const drawRecord: DrawRecord = {
        drawId: `draw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        drawType,
        timestamp: Date.now(),
        rewards: [
          {
            type: "gold",
            amount: 100,
          },
        ],
      };

      // 添加到历史记录
      this.drawHistory.push(drawRecord);

      return drawRecord;
    },

    // 十连抽
    tenDraw(drawType = "normal") {
      // 实现十连抽逻辑
      this.drawCount.ten++;
      this.lastDrawTime = Date.now();

      // 创建抽奖记录
      const drawRecord: DrawRecord = {
        drawId: `draw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        drawType,
        timestamp: Date.now(),
        rewards: Array.from({ length: 10 }, () => ({
          type: Math.random() > 0.3 ? "gold" : "coupon",
          amount: Math.random() > 0.5 ? 100 : 10,
        })),
      };

      // 添加到历史记录
      this.drawHistory.push(drawRecord);

      return drawRecord;
    },

    // 记录抽奖消耗
    recordDrawCost(gold: number, coupons: number) {
      this.drawCost.gold += gold;
      this.drawCost.coupons += coupons;
    },

    // 清除抽奖历史
    clearDrawHistory() {
      this.drawHistory = [];
    },

    // 获取抽奖历史
    getDrawHistory(limit?: number) {
      if (limit) {
        return [...this.drawHistory].reverse().slice(0, limit);
      }
      return [...this.drawHistory].reverse();
    },
  },

  // 持久化存储
  persist: {
    key: "lottery-draw",
    storage: localStorage,
  },
});
