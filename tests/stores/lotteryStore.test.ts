import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useLotteryStore } from '@/stores/lotteryStore';

describe('LotteryStore', () => {
  beforeEach(() => {
    // 创建一个新的 Pinia 实例用于测试
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  describe('状态初始化', () => {
    it('应该使用正确的默认值初始化', () => {
      const lotteryStore = useLotteryStore();
      
      expect(lotteryStore.lotteryItems).toHaveLength(6);
      expect(lotteryStore.drawCount).toBe(0);
      expect(lotteryStore.cumulativeDraws).toBe(0);
      expect(lotteryStore.lastDrawTime).toBe(0);
      expect(lotteryStore.freeDrawAvailable).toBe(true);
      expect(lotteryStore.freeDrawCooldown).toBe(86400000); // 24小时
    });

    it('应该有正确的抽奖物品配置', () => {
      const lotteryStore = useLotteryStore();
      
      // 检查是否包含所有类型的物品
      const itemTypes = lotteryStore.lotteryItems.map(item => item.type);
      expect(itemTypes).toContain('gold');
      expect(itemTypes).toContain('diamond');
      expect(itemTypes).toContain('hero');
      expect(itemTypes).toContain('skin');
      
      // 检查是否包含所有稀有度
      const rarities = lotteryStore.lotteryItems.map(item => item.rarity);
      expect(rarities).toContain('common');
      expect(rarities).toContain('rare');
      expect(rarities).toContain('epic');
      expect(rarities).toContain('legendary');
    });
  });

  describe('计算属性', () => {
    it('isFreeDrawAvailable 应该正确判断免费抽奖是否可用', () => {
      const lotteryStore = useLotteryStore();
      
      // 初始状态下免费抽奖可用
      expect(lotteryStore.isFreeDrawAvailable).toBe(true);
      
      // 使用免费抽奖后，应该不可用
      lotteryStore.drawSingle(true);
      expect(lotteryStore.isFreeDrawAvailable).toBe(false);
      
      // 模拟24小时后，应该可用
      lotteryStore.lastDrawTime = Date.now() - 86400000 - 1000;
      expect(lotteryStore.isFreeDrawAvailable).toBe(true);
    });

    it('freeDrawRemainingCooldown 应该返回正确的剩余冷却时间', () => {
      const lotteryStore = useLotteryStore();
      
      // 初始状态下冷却时间为0
      expect(lotteryStore.freeDrawRemainingCooldown).toBe(0);
      
      // 使用免费抽奖后，计算剩余冷却时间
      lotteryStore.drawSingle(true);
      const initialCooldown = lotteryStore.freeDrawRemainingCooldown;
      
      // 应该大于0且小于等于24小时
      expect(initialCooldown).toBeGreaterThan(0);
      expect(initialCooldown).toBeLessThanOrEqual(86400000);
      
      // 模拟1小时后，冷却时间应该减少约1小时
      // 直接修改lastDrawTime来模拟时间流逝，避免异步问题
      lotteryStore.lastDrawTime = Date.now() - 3600000;
      const laterCooldown = lotteryStore.freeDrawRemainingCooldown;
      expect(laterCooldown).toBeLessThan(initialCooldown);
      expect(laterCooldown).toBeGreaterThan(initialCooldown - 3600000 - 1000);
    });

    it('rarityDistribution 应该返回正确的稀有度概率分布', () => {
      const lotteryStore = useLotteryStore();
      const distribution = lotteryStore.rarityDistribution;
      
      // 检查是否包含所有稀有度
      expect(distribution).toHaveProperty('common');
      expect(distribution).toHaveProperty('rare');
      expect(distribution).toHaveProperty('epic');
      expect(distribution).toHaveProperty('legendary');
      
      // 概率总和应该接近1（考虑浮点精度）
      const totalProbability = Object.values(distribution).reduce((sum, prob) => sum + prob, 0);
      expect(totalProbability).toBeCloseTo(1, 5);
      
      // 普通物品概率应该最高
      expect(distribution.common).toBeGreaterThan(distribution.rare);
      expect(distribution.rare).toBeGreaterThan(distribution.epic);
      expect(distribution.epic).toBeGreaterThan(distribution.legendary);
    });
  });

  describe('抽奖功能', () => {
    it('drawSingle 应该正确执行单抽', () => {
      const lotteryStore = useLotteryStore();
      const initialDrawCount = lotteryStore.drawCount;
      const initialCumulativeDraws = lotteryStore.cumulativeDraws;
      
      // 执行单抽
      const result = lotteryStore.drawSingle();
      
      // 检查结果
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('rarity');
      expect(result).toHaveProperty('probability');
      expect(result).toHaveProperty('image');
      
      // 检查抽奖计数
      expect(lotteryStore.drawCount).toBe(initialDrawCount + 1);
      expect(lotteryStore.cumulativeDraws).toBe(initialCumulativeDraws + 1);
    });

    it('drawSingle 应该正确处理免费抽奖', () => {
      const lotteryStore = useLotteryStore();
      
      // 初始状态下可以免费抽奖
      expect(lotteryStore.isFreeDrawAvailable).toBe(true);
      
      // 执行免费单抽
      const result = lotteryStore.drawSingle(true);
      
      // 检查结果
      expect(result).toBeDefined();
      
      // 免费抽奖后，应该不可用
      expect(lotteryStore.isFreeDrawAvailable).toBe(false);
      expect(lotteryStore.lastDrawTime).toBeGreaterThan(0);
    });

    it('drawTen 应该正确执行十连抽', () => {
      const lotteryStore = useLotteryStore();
      const initialDrawCount = lotteryStore.drawCount;
      const initialCumulativeDraws = lotteryStore.cumulativeDraws;
      
      // 执行十连抽
      const results = lotteryStore.drawTen();
      
      // 检查结果
      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('type');
      });
      
      // 检查抽奖计数
      expect(lotteryStore.drawCount).toBe(initialDrawCount + 10);
      expect(lotteryStore.cumulativeDraws).toBe(initialCumulativeDraws + 10);
    });

    it('performDraw 应该根据概率返回抽奖结果', () => {
      const lotteryStore = useLotteryStore();
      
      // 执行多次抽奖，检查结果分布
      const results: string[] = [];
      const drawCount = 1000;
      
      for (let i = 0; i < drawCount; i++) {
        const result = lotteryStore.performDraw();
        results.push(result.rarity);
      }
      
      // 计算各稀有度出现次数
      const counts = results.reduce((acc, rarity) => {
        acc[rarity] = (acc[rarity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // 检查分布是否符合预期（普通物品应该最多，传说物品最少）
      expect(counts.common).toBeGreaterThan(counts.rare);
      expect(counts.rare).toBeGreaterThan(counts.epic);
      expect(counts.epic).toBeGreaterThanOrEqual(counts.legendary);
    });
  });

  describe('抽奖管理', () => {
    it('resetFreeDraw 应该重置免费抽奖', () => {
      const lotteryStore = useLotteryStore();
      
      // 使用免费抽奖
      lotteryStore.drawSingle(true);
      expect(lotteryStore.isFreeDrawAvailable).toBe(false);
      
      // 重置免费抽奖
      lotteryStore.resetFreeDraw();
      expect(lotteryStore.isFreeDrawAvailable).toBe(true);
    });

    it('updateLotteryItems 应该更新抽奖物品列表', () => {
      const lotteryStore = useLotteryStore();
      const initialCount = lotteryStore.lotteryItems.length;
      
      // 创建新的抽奖物品列表
      const newItems = [
        {
          id: 'test_item_1',
          name: '测试物品1',
          type: 'item',
          rarity: 'common',
          probability: 1,
          image: '/assets/test/item1.png'
        }
      ];
      
      // 更新抽奖物品
      lotteryStore.updateLotteryItems(newItems);
      
      expect(lotteryStore.lotteryItems).toHaveLength(1);
      expect(lotteryStore.lotteryItems[0].id).toBe(newItems[0].id);
      expect(lotteryStore.lotteryItems[0].name).toBe(newItems[0].name);
    });

    it('increaseRarityProbability 应该增加指定稀有度的概率', () => {
      const lotteryStore = useLotteryStore();
      const initialDistribution = lotteryStore.rarityDistribution;
      const initialEpicProbability = initialDistribution.epic;
      
      // 增加史诗物品的概率
      lotteryStore.increaseRarityProbability('epic', 0.1);
      
      const newDistribution = lotteryStore.rarityDistribution;
      // 史诗物品概率应该增加
      expect(newDistribution.epic).toBeGreaterThan(initialEpicProbability);
      // 概率总和应该接近1
      const totalProbability = Object.values(newDistribution).reduce((sum, prob) => sum + prob, 0);
      expect(totalProbability).toBeCloseTo(1, 5);
    });

    it('normalizeProbabilities 应该确保概率总和为1', () => {
      const lotteryStore = useLotteryStore();
      
      // 修改物品概率，使总和不为1
      lotteryStore.lotteryItems[0].probability = 2;
      lotteryStore.lotteryItems[1].probability = 2;
      
      // 归一化概率
      lotteryStore.normalizeProbabilities();
      
      // 检查概率总和是否为1
      const totalProbability = lotteryStore.lotteryItems.reduce((sum, item) => sum + item.probability, 0);
      expect(totalProbability).toBeCloseTo(1, 5);
    });

    it('getCumulativeReward 应该在累计抽奖达到100时返回奖励', () => {
      const lotteryStore = useLotteryStore();
      
      // 累计抽奖99次，应该没有奖励
      lotteryStore.cumulativeDraws = 99;
      const reward1 = lotteryStore.getCumulativeReward();
      expect(reward1).toBeNull();
      
      // 累计抽奖100次，应该返回奖励
      lotteryStore.cumulativeDraws = 100;
      const reward2 = lotteryStore.getCumulativeReward();
      expect(reward2).not.toBeNull();
      expect(reward2?.rarity).toBe('legendary');
      
      // 累计抽奖200次，应该返回奖励
      lotteryStore.cumulativeDraws = 200;
      const reward3 = lotteryStore.getCumulativeReward();
      expect(reward3).not.toBeNull();
      expect(reward3?.rarity).toBe('legendary');
    });

    it('resetLotteryData 应该重置抽奖数据', () => {
      const lotteryStore = useLotteryStore();
      
      // 修改一些数据
      lotteryStore.drawCount = 50;
      lotteryStore.cumulativeDraws = 150;
      lotteryStore.lastDrawTime = Date.now();
      lotteryStore.freeDrawAvailable = false;
      
      // 重置抽奖数据
      lotteryStore.resetLotteryData();
      
      // 检查是否重置
      expect(lotteryStore.drawCount).toBe(0);
      expect(lotteryStore.cumulativeDraws).toBe(0);
      expect(lotteryStore.lastDrawTime).toBe(0);
      expect(lotteryStore.freeDrawAvailable).toBe(true);
    });
  });
});