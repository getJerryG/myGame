import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useGameStore } from '@/stores/gameStore';
import { getMaxExp, checkPromotionRequirements, getNextLevelInfo, getSubLevelIndex } from '@/utils/levelUtils';
import { getInDevelopmentProjects, advanceDevelopment } from '@/utils/HeroSkinManager';

// Mock dependencies
vi.mock('@/utils/levelUtils', () => ({
  getMaxExp: vi.fn().mockReturnValue(100),
  checkPromotionRequirements: vi.fn().mockReturnValue(false),
  getNextLevelInfo: vi.fn().mockReturnValue({
    nextLevel: '见习',
    nextSubLevel: 'III',
    nextLevelInRank: 1
  }),
  getSubLevelIndex: vi.fn().mockReturnValue(0)
}));

vi.mock('@/utils/HeroSkinManager', () => ({
  getInDevelopmentProjects: vi.fn().mockReturnValue([]),
  advanceDevelopment: vi.fn()
}));

describe('gameStore', () => {
  let gameStore: ReturnType<typeof useGameStore>;
  
  beforeEach(() => {
    // Create a new pinia instance for each test
    const pinia = createPinia();
    setActivePinia(pinia);
    
    // Create a new store instance
    gameStore = useGameStore();
  });
  
  describe('state initialization', () => {
    it('should initialize with correct default values', () => {
      expect(gameStore.currentDate).toEqual({ year: 1, month: 1, day: 1 });
      expect(gameStore.isPlayerTurn).toBe(true);
      expect(gameStore.money).toBe(10000);
      expect(gameStore.reputation).toBe(0);
      expect(gameStore.popularity).toBe(50);
      expect(gameStore.wordOfMouth).toBe(100);
      expect(gameStore.heroCount).toBe(0);
      expect(gameStore.skinCount).toBe(0);
      expect(gameStore.plannerLevel).toBe('见习');
      expect(gameStore.plannerSubLevel).toBe('III');
      expect(gameStore.levelInRank).toBe(1);
      expect(gameStore.plannerExp).toBe(0);
      expect(gameStore.ongoingProjects).toEqual([]);
      expect(gameStore.onlineHeroes).toEqual([]);
      expect(gameStore.onlineSkins).toEqual([]);
      expect(gameStore.activeEvents).toEqual([]);
    });
  });
  
  describe('getters', () => {
    it('should calculate expProgressPercent correctly', () => {
      // Set up mock return value for getMaxExp
      (getMaxExp as vi.Mock).mockReturnValue(200);
      
      // Set up store with some exp
      gameStore.plannerExp = 50;
      
      expect(gameStore.expProgressPercent).toBe(25); // 50 / 200 * 100 = 25
      
      // Test with different exp values
      gameStore.plannerExp = 100;
      expect(gameStore.expProgressPercent).toBe(50);
      
      gameStore.plannerExp = 200;
      expect(gameStore.expProgressPercent).toBe(100);
    });
    
    it('should return canPromote correctly', () => {
      // Test when cannot promote
      (checkPromotionRequirements as vi.Mock).mockReturnValue(false);
      expect(gameStore.canPromote).toBe(false);
      
      // Test when can promote
      (checkPromotionRequirements as vi.Mock).mockReturnValue(true);
      expect(gameStore.canPromote).toBe(true);
    });
  });
  
  describe('actions', () => {
    describe('nextDay', () => {
      it('should advance the game date', () => {
        // Test advancing from day 1 to day 2
        expect(gameStore.currentDate).toEqual({ year: 1, month: 1, day: 1 });
        gameStore.nextDay();
        expect(gameStore.currentDate).toEqual({ year: 1, month: 1, day: 2 });
        
        // Test advancing from day 30 to day 1 of next month
        gameStore.currentDate = { year: 1, month: 1, day: 30 };
        gameStore.nextDay();
        expect(gameStore.currentDate).toEqual({ year: 1, month: 2, day: 1 });
        
        // Test advancing from day 30, month 12 to day 1 of next year
        gameStore.currentDate = { year: 1, month: 12, day: 30 };
        gameStore.nextDay();
        expect(gameStore.currentDate).toEqual({ year: 2, month: 1, day: 1 });
      });
      
      it('should call dailySettlement when advancing to next day', () => {
        // Mock dailySettlement to track calls
        const dailySettlementSpy = vi.spyOn(gameStore, 'dailySettlement');
        
        gameStore.nextDay();
        
        expect(dailySettlementSpy).toHaveBeenCalledTimes(1);
      });
    });
    
    describe('calculateIncome', () => {
      it('should calculate income correctly based on game state', () => {
        // Set up test data
        gameStore.popularity = 100;
        gameStore.wordOfMouth = 100;
        gameStore.heroCount = 5;
        gameStore.skinCount = 3;
        const initialMoney = gameStore.money;
        
        // Calculate expected income
        const expectedIncome = Math.floor((100 * 100) / 100 + 5 * 100 + 3 * 50);
        
        // Call the method
        gameStore.calculateIncome();
        
        // Check results
        expect(gameStore.money).toBe(initialMoney + expectedIncome);
        expect(gameStore.totalMoney).toBe(expectedIncome);
      });
    });
    
    describe('addProject', () => {
      it('should add a new project to ongoingProjects', () => {
        const newProject = {
          id: 'proj-1',
          name: 'Test Hero',
          type: 'hero' as const,
          dailyProgress: 10,
          details: { name: 'Test Hero' },
          heroName: 'Test Hero'
        };
        
        gameStore.addProject(newProject);
        
        expect(gameStore.ongoingProjects).toHaveLength(1);
        expect(gameStore.ongoingProjects[0].id).toBe('proj-1');
        expect(gameStore.ongoingProjects[0].name).toBe('Test Hero');
        expect(gameStore.ongoingProjects[0].type).toBe('hero');
        expect(gameStore.ongoingProjects[0].progress).toBe(0);
        expect(gameStore.ongoingProjects[0].status).toBe('in_progress');
        expect(gameStore.ongoingProjects[0].startDate).toEqual(gameStore.currentDate);
      });
    });
    
    describe('updateProjects', () => {
      it('should update project progress and handle completed projects', () => {
        // Add a project that will complete in one update
        gameStore.addProject({
          id: 'proj-1',
          name: 'Test Hero',
          type: 'hero' as const,
          dailyProgress: 100,
          details: { id: 'hero-1', name: 'Test Hero', usageRate: 0, winRate: 50, banRate: 0 },
          heroName: 'Test Hero'
        });
        
        // Add a project that won't complete in one update
        gameStore.addProject({
          id: 'proj-2',
          name: 'Test Skin',
          type: 'skin' as const,
          dailyProgress: 50,
          details: { id: 'skin-1', name: 'Test Skin', rarity: '普通', sales: { daily: 0, total: 0 } }
        });
        
        const initialHeroCount = gameStore.heroCount;
        
        gameStore.updateProjects();
        
        // Check results
        expect(gameStore.ongoingProjects).toHaveLength(1); // One project should be completed and removed
        expect(gameStore.ongoingProjects[0].id).toBe('proj-2');
        expect(gameStore.ongoingProjects[0].progress).toBe(50);
        expect(gameStore.heroCount).toBe(initialHeroCount + 1); // Hero count should increase by 1
      });
    });
    
    describe('addExp', () => {
      it('should add experience and check for promotion', () => {
        // Mock canPromote getter
        (checkPromotionRequirements as vi.Mock).mockReturnValue(false);
        
        const initialExp = gameStore.plannerExp;
        const expToAdd = 50;
        
        gameStore.addExp(expToAdd);
        
        expect(gameStore.plannerExp).toBe(initialExp + expToAdd);
      });
      
      it('should check promotion when exp is added', () => {
        // Mock canPromote to return true
        (checkPromotionRequirements as vi.Mock).mockReturnValue(true);
        
        // Mock checkPromotion method
        const checkPromotionSpy = vi.spyOn(gameStore, 'checkPromotion');
        
        gameStore.addExp(100);
        
        expect(checkPromotionSpy).toHaveBeenCalled();
      });
    });
    
    describe('handleEvent', () => {
      it('should handle event and apply effects', () => {
        // Add an event
        const eventId = 'event-1';
        gameStore.activeEvents.push({
          id: eventId,
          name: 'Test Event',
          type: 'test',
          description: 'A test event',
          options: [
            { id: 'option-1', text: 'Option 1', effects: { money: 100, popularity: 10 } },
            { id: 'option-2', text: 'Option 2', effects: { reputation: 20, exp: 50 } }
          ]
        });
        
        const initialMoney = gameStore.money;
        const initialPopularity = gameStore.popularity;
        
        // Handle the event with option 1
        gameStore.handleEvent(eventId, 'option-1');
        
        // Check results
        expect(gameStore.activeEvents).toHaveLength(0); // Event should be removed
        expect(gameStore.money).toBe(initialMoney + 100);
        expect(gameStore.popularity).toBe(initialPopularity + 10);
      });
      
      it('should do nothing for non-existent event', () => {
        // Attempt to handle a non-existent event
        gameStore.handleEvent('non-existent-event', 'option-1');
        
        // No changes should occur
        expect(gameStore.activeEvents).toHaveLength(0);
      });
    });
    
    describe('checkRandomEvents', () => {
      it('should have a chance to add random events', () => {
        // Mock Math.random to always return 0 (100% chance)
        vi.spyOn(Math, 'random').mockReturnValue(0);
        
        const initialEventCount = gameStore.activeEvents.length;
        
        gameStore.checkRandomEvents();
        
        expect(gameStore.activeEvents.length).toBe(initialEventCount + 1);
        expect(gameStore.activeEvents[0].type).toBe('random');
      });
      
      it('should not add event when chance is too low', () => {
        // Mock Math.random to always return 1 (0% chance)
        vi.spyOn(Math, 'random').mockReturnValue(1);
        
        const initialEventCount = gameStore.activeEvents.length;
        
        gameStore.checkRandomEvents();
        
        expect(gameStore.activeEvents.length).toBe(initialEventCount);
      });
    });
    
    describe('checkPromotion', () => {
      it('should not promote when requirements are not met', () => {
        // Mock canPromote to return false
        (checkPromotionRequirements as vi.Mock).mockReturnValue(false);
        
        const initialLevel = gameStore.plannerLevel;
        const initialSubLevel = gameStore.plannerSubLevel;
        
        gameStore.checkPromotion();
        
        // No changes should occur
        expect(gameStore.plannerLevel).toBe(initialLevel);
        expect(gameStore.plannerSubLevel).toBe(initialSubLevel);
      });
      
      it('should promote when requirements are met', () => {
        // Mock canPromote to return true
        (checkPromotionRequirements as vi.Mock).mockReturnValue(true);
        
        // Mock getMaxExp to return a value
        (getMaxExp as vi.Mock).mockReturnValue(100);
        
        // Mock getNextLevelInfo to return new level info
        (getNextLevelInfo as vi.Mock).mockReturnValue({
          nextLevel: '初级',
          nextSubLevel: 'III',
          nextLevelInRank: 1
        });
        
        // Set up exp to meet promotion requirements
        gameStore.plannerExp = 150;
        
        // Mock giveLevelUpReward to avoid side effects
        const giveLevelUpRewardSpy = vi.spyOn(gameStore, 'giveLevelUpReward');
        
        gameStore.checkPromotion();
        
        expect(gameStore.plannerLevel).toBe('初级');
        expect(gameStore.plannerSubLevel).toBe('III');
        expect(gameStore.plannerExp).toBe(50); // 150 - 100 = 50
        expect(giveLevelUpRewardSpy).toHaveBeenCalled();
      });
    });
    
    describe('giveLevelUpReward', () => {
      it('should give appropriate rewards based on level', () => {
        // Set up a specific level
        gameStore.plannerLevel = '初级';
        gameStore.plannerSubLevel = 'III';
        gameStore.levelInRank = 1;
        
        // Mock getSubLevelIndex to return 0
        (getSubLevelIndex as vi.Mock).mockReturnValue(0);
        
        const initialMoney = gameStore.money;
        const initialReputation = gameStore.reputation;
        
        gameStore.giveLevelUpReward();
        
        // Check that rewards were given
        expect(gameStore.money).toBeGreaterThan(initialMoney);
        expect(gameStore.reputation).toBeGreaterThan(initialReputation);
      });
    });
    
    describe('updatePopularityAndWordOfMouth', () => {
      it('should update popularity and word of mouth based on game state', () => {
        // Mock Math.random to return consistent values
        vi.spyOn(Math, 'random').mockReturnValue(0.5);
        
        const initialPopularity = gameStore.popularity;
        const initialWordOfMouth = gameStore.wordOfMouth;
        
        gameStore.updatePopularityAndWordOfMouth();
        
        // Values should have changed
        expect(gameStore.popularity).not.toBe(initialPopularity);
        expect(gameStore.wordOfMouth).not.toBe(initialWordOfMouth);
        
        // Values should be within expected ranges
        expect(gameStore.popularity).toBeGreaterThanOrEqual(0);
        expect(gameStore.popularity).toBeLessThanOrEqual(200);
        expect(gameStore.wordOfMouth).toBeGreaterThanOrEqual(-100);
        expect(gameStore.wordOfMouth).toBeLessThanOrEqual(100);
      });
    });
    
    describe('calculateSkinSales', () => {
      it('should calculate skin sales and update revenue', () => {
        // Add a skin to onlineSkins
        gameStore.onlineSkins.push({
          id: 'skin-1',
          name: 'Test Skin',
          rarity: '普通',
          sales: { daily: 0, total: 0 }
        });
        
        const initialMoney = gameStore.money;
        const initialTotalMoney = gameStore.totalMoney;
        
        gameStore.calculateSkinSales();
        
        // Check that sales were calculated and revenue updated
        expect(gameStore.onlineSkins[0].sales.daily).toBeGreaterThan(0);
        expect(gameStore.onlineSkins[0].sales.total).toBeGreaterThan(0);
        expect(gameStore.money).toBeGreaterThan(initialMoney);
        expect(gameStore.totalMoney).toBeGreaterThan(initialTotalMoney);
      });
      
      it('should handle skins with different rarities', () => {
        // Add skins of different rarities
        gameStore.onlineSkins.push(
          {
            id: 'skin-1',
            name: 'Common Skin',
            rarity: '普通',
            sales: { daily: 0, total: 0 }
          },
          {
            id: 'skin-2',
            name: 'Epic Skin',
            rarity: '史诗',
            sales: { daily: 0, total: 0 }
          }
        );
        
        gameStore.calculateSkinSales();
        
        // Both skins should have sales calculated
        expect(gameStore.onlineSkins[0].sales.daily).toBeGreaterThan(0);
        expect(gameStore.onlineSkins[1].sales.daily).toBeGreaterThan(0);
        
        // Epic skin should have higher sales than common skin
        expect(gameStore.onlineSkins[1].sales.daily).toBeGreaterThan(gameStore.onlineSkins[0].sales.daily);
      });
    });
  });
});
