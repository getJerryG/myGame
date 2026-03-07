import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LotteryService, lotteryService, type LotteryConfig, type Prize } from '@/services/LotteryService';

describe('LotteryService', () => {
  let service: LotteryService;
  
  // 默认奖品配置
  const defaultConfig: LotteryConfig = {
    prizes: [
      { icon: '💎', name: '钻石x1000', rarity: 'legendary', probability: 1 },
      { icon: '👑', name: '皇冠', rarity: 'epic', probability: 5 },
      { icon: '💰', name: '金币x500', rarity: 'rare', probability: 15 },
      { icon: '🎁', name: '神秘礼包', rarity: 'rare', probability: 20 },
      { icon: '⭐', name: '星星x50', rarity: 'common', probability: 25 },
      { icon: '💎', name: '钻石x100', rarity: 'common', probability: 34 },
    ],
    initialTickets: 10
  };
  
  beforeEach(() => {
    // 创建新的服务实例，确保测试之间的隔离
    service = new LotteryService(defaultConfig);
    
    // 使用假计时器，用于模拟异步操作
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    // 恢复真实计时器
    vi.useRealTimers();
  });
  
  describe('constructor', () => {
    it('should initialize with correct config', () => {
      const service = new LotteryService(defaultConfig);
      expect(service.getTickets()).toBe(defaultConfig.initialTickets);
      expect(service.getPrizes()).toEqual(defaultConfig.prizes);
      expect(service.getDrawHistory().length).toBe(0);
    });
    
    it('should initialize with empty prizes when not provided', () => {
      const config: LotteryConfig = {
        prizes: [],
        initialTickets: 5
      };
      const service = new LotteryService(config);
      expect(service.getPrizes().length).toBe(0);
      expect(service.getTickets()).toBe(5);
    });
  });
  
  describe('getPrizes', () => {
    it('should return all prizes', () => {
      const prizes = service.getPrizes();
      expect(prizes).toBeDefined();
      expect(prizes.length).toBe(defaultConfig.prizes.length);
      expect(prizes).toEqual(defaultConfig.prizes);
    });
    
    it('should return a copy of the prizes array', () => {
      const prizes1 = service.getPrizes();
      const prizes2 = service.getPrizes();
      expect(prizes1).not.toBe(prizes2); // 应该是不同的引用
      expect(prizes1).toEqual(prizes2); // 但内容应该相同
    });
  });
  
  describe('getDrawHistory', () => {
    it('should return empty array initially', () => {
      const history = service.getDrawHistory();
      expect(history).toEqual([]);
    });
    
    it('should return a copy of the draw history array', async () => {
      // 先进行一次抽奖
      const drawPromise = service.startDraw();
      vi.advanceTimersByTime(3000);
      await drawPromise;
      
      const history1 = service.getDrawHistory();
      const history2 = service.getDrawHistory();
      expect(history1).not.toBe(history2); // 应该是不同的引用
      expect(history1).toEqual(history2); // 但内容应该相同
    });
  });
  
  describe('getTickets', () => {
    it('should return initial ticket count', () => {
      expect(service.getTickets()).toBe(defaultConfig.initialTickets);
    });
    
    it('should return updated ticket count after buying tickets', () => {
      service.buyTickets(5);
      expect(service.getTickets()).toBe(defaultConfig.initialTickets + 5);
    });
    
    it('should return updated ticket count after drawing', async () => {
      const initialTickets = service.getTickets();
      const drawPromise = service.startDraw();
      vi.advanceTimersByTime(3000);
      await drawPromise;
      expect(service.getTickets()).toBe(initialTickets - 1);
    });
  });
  
  describe('startDraw', () => {
    it('should throw error when no tickets left', async () => {
      // 创建一个抽奖券为0的服务实例
      const config: LotteryConfig = {
        prizes: defaultConfig.prizes,
        initialTickets: 0
      };
      const service = new LotteryService(config);
      
      await expect(service.startDraw()).rejects.toThrow('抽奖券不足');
    });
    
    it('should successfully draw a prize with valid tickets', async () => {
      // 保存原始Date对象
      const originalDate = global.Date;
      const mockDate = new Date('2023-06-15T10:30:00');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      
      // 调用startDraw方法
      const drawPromise = service.startDraw();
      
      // 快进时间，模拟异步操作完成
      vi.advanceTimersByTime(3000);
      
      // 等待promise完成
      const result = await drawPromise;
      
      // 验证结果
      expect(result).toBeDefined();
      expect(result.selectedPrize).toBeDefined();
      expect(result.spinCount).toBeGreaterThanOrEqual(20);
      expect(result.spinCount).toBeLessThanOrEqual(30);
      
      // 验证抽奖券已消耗
      expect(service.getTickets()).toBe(defaultConfig.initialTickets - 1);
      
      // 验证抽奖记录已添加
      expect(service.getDrawHistory().length).toBe(1);
      
      // 恢复原始Date对象
      global.Date = originalDate;
    });
    
    it('should return a valid prize from prizes list', async () => {
      const drawPromise = service.startDraw();
      vi.advanceTimersByTime(3000);
      const result = await drawPromise;
      
      const prizes = service.getPrizes();
      expect(prizes).toContain(result.selectedPrize);
    });
    
    it('should return different spin counts on multiple draws', async () => {
      const drawPromise1 = service.startDraw();
      vi.advanceTimersByTime(3000);
      const result1 = await drawPromise1;
      
      const drawPromise2 = service.startDraw();
      vi.advanceTimersByTime(3000);
      const result2 = await drawPromise2;
      
      // 虽然有可能相同，但概率极低
      expect(result1.spinCount).not.toBe(result2.spinCount);
    });
  });
  
  describe('buyTickets', () => {
    it('should throw error when amount is zero', () => {
      expect(() => service.buyTickets(0)).toThrow('购买数量必须大于0');
    });
    
    it('should throw error when amount is negative', () => {
      expect(() => service.buyTickets(-5)).toThrow('购买数量必须大于0');
    });
    
    it('should increase tickets when buying positive amount', () => {
      const initialTickets = service.getTickets();
      service.buyTickets(5);
      expect(service.getTickets()).toBe(initialTickets + 5);
    });
    
    it('should handle large ticket purchases', () => {
      const initialTickets = service.getTickets();
      service.buyTickets(1000);
      expect(service.getTickets()).toBe(initialTickets + 1000);
    });
  });
  
  describe('getRarityLabel', () => {
    it('should return correct label for legendary rarity', () => {
      expect(service.getRarityLabel('legendary')).toBe('传说');
    });
    
    it('should return correct label for epic rarity', () => {
      expect(service.getRarityLabel('epic')).toBe('史诗');
    });
    
    it('should return correct label for rare rarity', () => {
      expect(service.getRarityLabel('rare')).toBe('稀有');
    });
    
    it('should return correct label for common rarity', () => {
      expect(service.getRarityLabel('common')).toBe('普通');
    });
    
    it('should return unknown for invalid rarity', () => {
      expect(service.getRarityLabel('invalid')).toBe('未知');
    });
    
    it('should return unknown for empty string', () => {
      expect(service.getRarityLabel('')).toBe('未知');
    });
  });
  
  describe('getWheelItemStyle', () => {
    it('should return correct style for first item', () => {
      const style = service.getWheelItemStyle(0, 6);
      expect(style).toEqual({
        transform: 'rotate(0deg) translateY(-120px)',
      });
    });
    
    it('should return correct style for second item', () => {
      const style = service.getWheelItemStyle(1, 6);
      expect(style).toEqual({
        transform: 'rotate(60deg) translateY(-120px)',
      });
    });
    
    it('should return correct style for last item', () => {
      const style = service.getWheelItemStyle(5, 6);
      expect(style).toEqual({
        transform: 'rotate(300deg) translateY(-120px)',
      });
    });
    
    it('should handle different total items', () => {
      const style = service.getWheelItemStyle(2, 8);
      expect(style).toEqual({
        transform: 'rotate(90deg) translateY(-120px)',
      });
    });
  });
  
  describe('lotteryService Instance', () => {
    it('should be a single instance', () => {
      // 验证导出的实例是LotteryService类型
      expect(lotteryService).toBeInstanceOf(LotteryService);
      
      // 验证多次访问导出的实例是同一个对象
      const instance1 = lotteryService;
      const instance2 = lotteryService;
      expect(instance1).toBe(instance2);
    });
    
    it('should have correct default configuration', () => {
      // 验证默认实例的奖品配置
      const prizes = lotteryService.getPrizes();
      expect(prizes.length).toBeGreaterThan(0);
      expect(prizes.some((prize: Prize) => prize.rarity === 'legendary')).toBe(true);
      
      // 验证默认实例的初始抽奖券数量
      expect(lotteryService.getTickets()).toBe(10);
    });
  });
});
