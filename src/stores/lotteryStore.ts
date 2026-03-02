import { defineStore } from "pinia";

export interface LotteryItem {
  id: string;
  name: string;
  type: "hero" | "skin" | "item" | "gold" | "diamond";
  rarity: "common" | "rare" | "epic" | "legendary";
  probability: number;
  quantity?: number;
  image: string;
}

export interface LotteryState {
  lotteryItems: LotteryItem[];
  drawCount: number;
  cumulativeDraws: number;
  lastDrawTime: number;
  freeDrawAvailable: boolean;
  freeDrawCooldown: number;
}

export const useLotteryStore = defineStore("lottery", {
  state: (): LotteryState => ({
    lotteryItems: [
      {
        id: "gold_100",
        name: "金币",
        type: "gold",
        rarity: "common",
        probability: 0.4,
        quantity: 100,
        image: "/assets/icons/gold.png",
      },
      {
        id: "diamond_10",
        name: "钻石",
        type: "diamond",
        rarity: "common",
        probability: 0.3,
        quantity: 10,
        image: "/assets/icons/diamond.png",
      },
      {
        id: "hero_common_1",
        name: "普通英雄",
        type: "hero",
        rarity: "common",
        probability: 0.2,
        image: "/assets/heroes/common_1.png",
      },
      {
        id: "skin_rare_1",
        name: "稀有皮肤",
        type: "skin",
        rarity: "rare",
        probability: 0.08,
        image: "/assets/skins/rare_1.png",
      },
      {
        id: "hero_epic_1",
        name: "史诗英雄",
        type: "hero",
        rarity: "epic",
        probability: 0.015,
        image: "/assets/heroes/epic_1.png",
      },
      {
        id: "skin_legendary_1",
        name: "传说皮肤",
        type: "skin",
        rarity: "legendary",
        probability: 0.005,
        image: "/assets/skins/legendary_1.png",
      },
    ],
    drawCount: 0,
    cumulativeDraws: 0,
    lastDrawTime: 0,
    freeDrawAvailable: true,
    freeDrawCooldown: 86400000, // 24小时
  }),

  getters: {
    /**
     * 获取当前免费抽奖是否可用
     */
    isFreeDrawAvailable(): boolean {
      if (this.freeDrawAvailable) {
        return true;
      }
      const now = Date.now();
      const timeSinceLastFreeDraw = now - this.lastDrawTime;
      return timeSinceLastFreeDraw >= this.freeDrawCooldown;
    },

    /**
     * 获取免费抽奖冷却剩余时间（毫秒）
     */
    freeDrawRemainingCooldown(): number {
      if (this.freeDrawAvailable) {
        return 0;
      }
      const now = Date.now();
      const timeSinceLastFreeDraw = now - this.lastDrawTime;
      const remaining = this.freeDrawCooldown - timeSinceLastFreeDraw;
      return Math.max(0, remaining);
    },

    /**
     * 获取各稀有度物品的概率分布
     */
    rarityDistribution(): Record<string, number> {
      const distribution: Record<string, number> = {
        common: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
      };
      this.lotteryItems.forEach((item) => {
        distribution[item.rarity] += item.probability;
      });
      return distribution;
    },
  },

  actions: {
    /**
     * 执行单抽
     */
    drawSingle(isFreeDraw = false): LotteryItem {
      if (isFreeDraw) {
        if (!this.isFreeDrawAvailable) {
          throw new Error("免费抽奖不可用");
        }
        this.freeDrawAvailable = false;
        this.lastDrawTime = Date.now();
      }

      this.drawCount++;
      this.cumulativeDraws++;

      return this.performDraw();
    },

    /**
     * 执行十连抽
     */
    drawTen(): LotteryItem[] {
      const results: LotteryItem[] = [];
      for (let i = 0; i < 10; i++) {
        results.push(this.performDraw());
      }
      this.drawCount += 10;
      this.cumulativeDraws += 10;

      return results;
    },

    /**
     * 执行实际的抽奖逻辑
     */
    performDraw(): LotteryItem {
      const random = Math.random();
      let cumulativeProbability = 0;

      for (const item of this.lotteryItems) {
        cumulativeProbability += item.probability;
        if (random <= cumulativeProbability) {
          return { ...item };
        }
      }

      // 兜底返回普通物品
      return { ...this.lotteryItems[0] };
    },

    /**
     * 重置免费抽奖
     */
    resetFreeDraw() {
      this.freeDrawAvailable = true;
    },

    /**
     * 更新抽奖物品列表
     */
    updateLotteryItems(items: LotteryItem[]) {
      this.lotteryItems = items;
    },

    /**
     * 增加指定稀有度物品的概率
     */
    increaseRarityProbability(rarity: string, amount: number) {
      const items = this.lotteryItems.filter((item) => item.rarity === rarity);
      if (items.length > 0) {
        const increasePerItem = amount / items.length;
        items.forEach((item) => {
          const index = this.lotteryItems.findIndex((i) => i.id === item.id);
          if (index !== -1) {
            this.lotteryItems[index].probability += increasePerItem;
          }
        });
        // 确保概率总和为1
        this.normalizeProbabilities();
      }
    },

    /**
     * 归一化概率，确保总和为1
     */
    normalizeProbabilities() {
      const totalProbability = this.lotteryItems.reduce(
        (sum, item) => sum + item.probability,
        0,
      );
      if (totalProbability > 0) {
        this.lotteryItems.forEach((item) => {
          item.probability /= totalProbability;
        });
      }
    },

    /**
     * 获取累计抽奖奖励
     */
    getCumulativeReward(): LotteryItem | null {
      // 每100抽获得一个传说奖励
      if (this.cumulativeDraws % 100 === 0 && this.cumulativeDraws > 0) {
        const legendaryItems = this.lotteryItems.filter(
          (item) => item.rarity === "legendary",
        );
        if (legendaryItems.length > 0) {
          return {
            ...legendaryItems[
              Math.floor(Math.random() * legendaryItems.length)
            ],
          };
        }
      }
      return null;
    },

    /**
     * 重置抽奖数据
     */
    resetLotteryData() {
      this.drawCount = 0;
      this.cumulativeDraws = 0;
      this.freeDrawAvailable = true;
      this.lastDrawTime = 0;
    },
  },
});
