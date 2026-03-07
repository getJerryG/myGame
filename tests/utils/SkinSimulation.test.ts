import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  processIndicators,
  calculateDynamicWeights,
  calculateSkinMarketData,
  batchCalculateSkinMarketData,
  validateIndicatorValue,
  generateRandomIndicatorConfig,
  generateRandomWeightConfig,
  simulateDifferentWeightConfigs,
  SkinIndicatorConfig,
  WeightConfig,
  SimulateResult
} from '@/utils/SkinSimulation';

// Mock Math.random to get consistent results
vi.spyOn(Math, 'random').mockReturnValue(0.5);

describe('SkinSimulation', () => {
  // 测试数据
  const mockIndicators: SkinIndicatorConfig = {
    skinId: 'skin-1',
    heroId: 'hero-1',
    pickRate: 0.8,
    userBase: 0.7,
    designFit: 0.9,
    scarcity: 0.6,
    costEffectiveness: 0.8,
    obtainDifficulty: 0.3,
    communityHeat: 0.9,
    negativePublicOpinion: 0.1
  };
  
  beforeEach(() => {
    // Reset Math.random mock
    (Math.random as any).mockReturnValue(0.5);
  });
  
  describe('processIndicators', () => {
    describe('scarcity', () => {
      it('should return squared value for scarcity', () => {
        expect(processIndicators.scarcity(0.5)).toBe(0.25);
        expect(processIndicators.scarcity(1)).toBe(1);
        expect(processIndicators.scarcity(0)).toBe(0);
      });
      
      it('should handle boundary values correctly', () => {
        expect(processIndicators.scarcity(0)).toBe(0);
        expect(processIndicators.scarcity(1)).toBe(1);
      });
    });
    
    describe('obtainDifficulty', () => {
      it('should return 1 - squared value for obtainDifficulty', () => {
        expect(processIndicators.obtainDifficulty(0.5)).toBe(0.75);
        expect(processIndicators.obtainDifficulty(1)).toBe(0);
        expect(processIndicators.obtainDifficulty(0)).toBe(1);
      });
      
      it('should handle boundary values correctly', () => {
        expect(processIndicators.obtainDifficulty(0)).toBe(1);
        expect(processIndicators.obtainDifficulty(1)).toBe(0);
      });
    });
    
    describe('negativePublicOpinion', () => {
      it('should return cubed value for negativePublicOpinion', () => {
        expect(processIndicators.negativePublicOpinion(0.5)).toBe(0.125);
        expect(processIndicators.negativePublicOpinion(1)).toBe(1);
        expect(processIndicators.negativePublicOpinion(0)).toBe(0);
      });
      
      it('should handle boundary values correctly', () => {
        expect(processIndicators.negativePublicOpinion(0)).toBe(0);
        expect(processIndicators.negativePublicOpinion(1)).toBe(1);
      });
    });
  });
  
  describe('calculateDynamicWeights', () => {
    it('should return default weights when no config is provided', () => {
      const result = calculateDynamicWeights();
      
      expect(result.heroBase).toBeGreaterThan(0);
      expect(result.skinAttract).toBeGreaterThan(0);
      expect(result.decisionThreshold).toBeGreaterThan(0);
      expect(result.publicOpinion).toBeGreaterThan(0);
      
      // Weights should sum to approximately 1
      const totalWeight = result.heroBase + result.skinAttract + result.decisionThreshold + result.publicOpinion;
      expect(totalWeight).toBeCloseTo(1, 5);
    });
    
    it('should calculate dynamic weights with custom config', () => {
      const customConfig: Partial<WeightConfig> = {
        baseWeights: {
          heroBase: 0.4,
          skinAttract: 0.3,
          decisionThreshold: 0.2,
          publicOpinion: 0.1
        },
        adjustCoeffs: {
          heroBase: 1.5,
          skinAttract: 1.2,
          decisionThreshold: 1.0,
          publicOpinion: 0.8
        }
      };
      
      const result = calculateDynamicWeights(customConfig);
      
      expect(result.heroBase).toBeGreaterThan(result.skinAttract);
      expect(result.skinAttract).toBeGreaterThan(result.decisionThreshold);
      expect(result.decisionThreshold).toBeGreaterThan(result.publicOpinion);
      
      // Weights should sum to approximately 1
      const totalWeight = result.heroBase + result.skinAttract + result.decisionThreshold + result.publicOpinion;
      expect(totalWeight).toBeCloseTo(1, 5);
    });
    
    it('should handle zero total weight gracefully', () => {
      const zeroConfig: Partial<WeightConfig> = {
        baseWeights: {
          heroBase: 0,
          skinAttract: 0,
          decisionThreshold: 0,
          publicOpinion: 0
        }
      };
      
      const result = calculateDynamicWeights(zeroConfig);
      
      // Should return default weights
      const totalWeight = result.heroBase + result.skinAttract + result.decisionThreshold + result.publicOpinion;
      expect(totalWeight).toBeCloseTo(1, 5);
    });
    
    it('should handle partial config correctly', () => {
      const partialConfig: Partial<WeightConfig> = {
        baseWeights: {
          heroBase: 0.5
        }
      };
      
      const result = calculateDynamicWeights(partialConfig);
      
      // Weights should sum to approximately 1
      const totalWeight = result.heroBase + result.skinAttract + result.decisionThreshold + result.publicOpinion;
      expect(totalWeight).toBeCloseTo(1, 5);
    });
  });
  
  describe('calculateSkinMarketData', () => {
    it('should return valid simulation result with default weights', () => {
      const result = calculateSkinMarketData(mockIndicators);
      
      expect(result.likeScore).toBeGreaterThanOrEqual(0);
      expect(result.likeScore).toBeLessThanOrEqual(100);
      expect(result.marketScore).toBeGreaterThanOrEqual(0);
      expect(result.marketScore).toBeLessThanOrEqual(100);
      expect(result.sales).toBeGreaterThanOrEqual(0);
      expect(result.discussionCount).toBeGreaterThanOrEqual(0);
      expect(result.payRate).toBeGreaterThanOrEqual(0);
      expect(result.payRate).toBeLessThanOrEqual(1);
    });
    
    it('should return valid result with custom weights', () => {
      const customConfig: Partial<WeightConfig> = {
        baseWeights: {
          heroBase: 0.5,
          skinAttract: 0.3,
          decisionThreshold: 0.1,
          publicOpinion: 0.1
        }
      };
      
      const result = calculateSkinMarketData(mockIndicators, customConfig);
      
      expect(result.likeScore).toBeGreaterThanOrEqual(0);
      expect(result.likeScore).toBeLessThanOrEqual(100);
      expect(result.marketScore).toBeGreaterThanOrEqual(0);
      expect(result.marketScore).toBeLessThanOrEqual(100);
    });
    
    it('should handle high negative public opinion correctly', () => {
      const highNegativeIndicators = {
        ...mockIndicators,
        negativePublicOpinion: 0.9
      };
      
      const result = calculateSkinMarketData(highNegativeIndicators);
      
      // High negative opinion should lower scores
      expect(result.likeScore).toBeLessThan(50);
      expect(result.marketScore).toBeLessThan(50);
    });
    
    it('should handle high scarcity correctly', () => {
      const highScarcityIndicators = {
        ...mockIndicators,
        scarcity: 0.9
      };
      
      const result = calculateSkinMarketData(highScarcityIndicators);
      
      // High scarcity should increase scores
      expect(result.marketScore).toBeGreaterThan(50);
    });
  });
  
  describe('batchCalculateSkinMarketData', () => {
    it('should return array of results for multiple indicators', () => {
      const indicatorsList: SkinIndicatorConfig[] = [
        mockIndicators,
        {
          ...mockIndicators,
          skinId: 'skin-2',
          heroId: 'hero-2',
          pickRate: 0.5,
          userBase: 0.4
        }
      ];
      
      const results = batchCalculateSkinMarketData(indicatorsList);
      
      expect(results).toHaveLength(2);
      results.forEach((result: SimulateResult) => {
        expect(result.likeScore).toBeGreaterThanOrEqual(0);
        expect(result.likeScore).toBeLessThanOrEqual(100);
        expect(result.marketScore).toBeGreaterThanOrEqual(0);
        expect(result.marketScore).toBeLessThanOrEqual(100);
      });
    });
    
    it('should return empty array for empty input', () => {
      const results = batchCalculateSkinMarketData([]);
      expect(results).toEqual([]);
    });
    
    it('should apply custom weights to all calculations', () => {
      const indicatorsList: SkinIndicatorConfig[] = [
        mockIndicators,
        {
          ...mockIndicators,
          skinId: 'skin-2',
          heroId: 'hero-2'
        }
      ];
      
      const customConfig: Partial<WeightConfig> = {
        baseWeights: {
          heroBase: 0.2,
          skinAttract: 0.5,
          decisionThreshold: 0.2,
          publicOpinion: 0.1
        }
      };
      
      const results = batchCalculateSkinMarketData(indicatorsList, customConfig);
      
      expect(results).toHaveLength(2);
      results.forEach((result: SimulateResult) => {
        expect(result.likeScore).toBeGreaterThanOrEqual(0);
        expect(result.likeScore).toBeLessThanOrEqual(100);
      });
    });
  });
  
  describe('validateIndicatorValue', () => {
    it('should return true for valid values (0-1)', () => {
      expect(validateIndicatorValue(0)).toBe(true);
      expect(validateIndicatorValue(0.5)).toBe(true);
      expect(validateIndicatorValue(1)).toBe(true);
    });
    
    it('should return false for invalid values', () => {
      expect(validateIndicatorValue(-0.1)).toBe(false);
      expect(validateIndicatorValue(1.1)).toBe(false);
      expect(validateIndicatorValue(10)).toBe(false);
      expect(validateIndicatorValue(-10)).toBe(false);
    });
  });
  
  describe('generateRandomIndicatorConfig', () => {
    it('should generate valid indicator config with given skinId and heroId', () => {
      const result = generateRandomIndicatorConfig('test-skin', 'test-hero');
      
      expect(result.skinId).toBe('test-skin');
      expect(result.heroId).toBe('test-hero');
      expect(result.pickRate).toBeGreaterThanOrEqual(0);
      expect(result.pickRate).toBeLessThanOrEqual(1);
      expect(result.userBase).toBeGreaterThanOrEqual(0);
      expect(result.userBase).toBeLessThanOrEqual(1);
      expect(result.designFit).toBeGreaterThanOrEqual(0);
      expect(result.designFit).toBeLessThanOrEqual(1);
      expect(result.scarcity).toBeGreaterThanOrEqual(0);
      expect(result.scarcity).toBeLessThanOrEqual(1);
      expect(result.costEffectiveness).toBeGreaterThanOrEqual(0);
      expect(result.costEffectiveness).toBeLessThanOrEqual(1);
      expect(result.obtainDifficulty).toBeGreaterThanOrEqual(0);
      expect(result.obtainDifficulty).toBeLessThanOrEqual(1);
      expect(result.communityHeat).toBeGreaterThanOrEqual(0);
      expect(result.communityHeat).toBeLessThanOrEqual(1);
      expect(result.negativePublicOpinion).toBeGreaterThanOrEqual(0);
      expect(result.negativePublicOpinion).toBeLessThanOrEqual(1);
    });
  });
  
  describe('generateRandomWeightConfig', () => {
    it('should generate valid weight config', () => {
      const result = generateRandomWeightConfig();
      
      expect(result.baseWeights).toBeDefined();
      expect(result.adjustCoeffs).toBeDefined();
      
      // Base weights should sum to approximately 1
      const baseWeightsSum = Object.values(result.baseWeights).reduce((sum, w) => sum + w, 0);
      expect(baseWeightsSum).toBeCloseTo(1, 5);
      
      // Adjust coefficients should be between 0.8 and 1.5
      Object.values(result.adjustCoeffs).forEach(coeff => {
        expect(coeff).toBeGreaterThanOrEqual(0.8);
        expect(coeff).toBeLessThanOrEqual(1.5);
      });
    });
  });
  
  describe('simulateDifferentWeightConfigs', () => {
    it('should simulate results for multiple weight configs', () => {
      const weightConfigs: WeightConfig[] = [
        generateRandomWeightConfig(),
        generateRandomWeightConfig(),
        generateRandomWeightConfig()
      ];
      
      const results = simulateDifferentWeightConfigs(mockIndicators, weightConfigs);
      
      expect(results).toHaveLength(3);
      results.forEach((item, index) => {
        expect(item.weightConfig).toBe(weightConfigs[index]);
        expect(item.result.likeScore).toBeGreaterThanOrEqual(0);
        expect(item.result.likeScore).toBeLessThanOrEqual(100);
        expect(item.result.marketScore).toBeGreaterThanOrEqual(0);
        expect(item.result.marketScore).toBeLessThanOrEqual(100);
      });
    });
    
    it('should return empty array for empty weight configs', () => {
      const results = simulateDifferentWeightConfigs(mockIndicators, []);
      expect(results).toEqual([]);
    });
  });
});
