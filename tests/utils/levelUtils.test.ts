import { describe, it, expect } from 'vitest';
import { 
  plannerLevels, 
  subLevels, 
  getLevelIndex, 
  getSubLevelIndex, 
  getTotalLevelIndex, 
  getMaxExp, 
  checkPromotionRequirements, 
  getNextLevelInfo
} from '@/utils/levelUtils';

describe('levelUtils', () => {
  describe('plannerLevels and subLevels constants', () => {
    it('should contain correct planner levels', () => {
      expect(plannerLevels).toEqual([
        "见习",
        "初级",
        "中级",
        "高级",
        "资深",
        "专家",
        "经理",
        "总监"
      ]);
      expect(plannerLevels.length).toBe(8);
    });
    
    it('should contain correct sub levels', () => {
      expect(subLevels).toEqual(["III", "II", "I"]);
      expect(subLevels.length).toBe(3);
    });
  });
  
  describe('getLevelIndex', () => {
    it('should return correct index for existing level', () => {
      expect(getLevelIndex("见习")).toBe(0);
      expect(getLevelIndex("初级")).toBe(1);
      expect(getLevelIndex("总监")).toBe(7);
    });
    
    it('should return -1 for non-existing level', () => {
      expect(getLevelIndex("不存在的等级")).toBe(-1);
      expect(getLevelIndex("")).toBe(-1);
    });
  });
  
  describe('getSubLevelIndex', () => {
    it('should return correct index for existing sub level', () => {
      expect(getSubLevelIndex("III")).toBe(0);
      expect(getSubLevelIndex("II")).toBe(1);
      expect(getSubLevelIndex("I")).toBe(2);
    });
    
    it('should return -1 for non-existing sub level', () => {
      expect(getSubLevelIndex("IV")).toBe(-1);
      expect(getSubLevelIndex("")).toBe(-1);
    });
  });
  
  describe('getTotalLevelIndex', () => {
    it('should calculate correct total level index for various levels', () => {
      // 见习III-1级
      expect(getTotalLevelIndex("见习", "III", 1)).toBe(0);
      
      // 见习III-2级
      expect(getTotalLevelIndex("见习", "III", 2)).toBe(1);
      
      // 见习II-1级
      expect(getTotalLevelIndex("见习", "II", 1)).toBe(2);
      
      // 见习II-2级
      expect(getTotalLevelIndex("见习", "II", 2)).toBe(3);
      
      // 见习I-1级
      expect(getTotalLevelIndex("见习", "I", 1)).toBe(4);
      
      // 见习I-2级
      expect(getTotalLevelIndex("见习", "I", 2)).toBe(5);
      
      // 初级III-1级
      expect(getTotalLevelIndex("初级", "III", 1)).toBe(6);
      
      // 总监I-2级（最高级）
      expect(getTotalLevelIndex("总监", "I", 2)).toBe(47);
    });
    
    it('should handle invalid level gracefully', () => {
      // 无效的level会返回-1，导致计算结果为负数
      expect(getTotalLevelIndex("无效等级", "III", 1)).toBe(-6);
    });
    
    it('should handle invalid sub level gracefully', () => {
      // 无效的subLevel会返回-1，导致计算结果为负数
      expect(getTotalLevelIndex("见习", "无效子等级", 1)).toBe(-2);
    });
  });
  
  describe('getMaxExp', () => {
    it('should calculate correct max exp for various levels', () => {
      // 见习III-1级
      expect(getMaxExp("见习", "III", 1)).toBe(100);
      
      // 见习III-2级
      expect(getMaxExp("见习", "III", 2)).toBe(120);
      
      // 见习II-1级
      expect(getMaxExp("见习", "II", 1)).toBe(144);
      
      // 初级III-1级
      expect(getMaxExp("初级", "III", 1)).toBe(298);
      
      // 总监I-2级（最高级）
      // 经验值公式：100 * 1.2^47
      expect(getMaxExp("总监", "I", 2)).toBe(526645);
    });
    
    it('should return 0 for invalid level', () => {
      // 无效的level会导致totalLevelIndex为-6，结果接近0
      expect(getMaxExp("无效等级", "III", 1)).toBe(0);
    });
  });
  
  describe('checkPromotionRequirements', () => {
    it('should return true when exp meets or exceeds max exp', () => {
      // 见习III-1级，经验值刚好达到
      expect(checkPromotionRequirements("见习", "III", 1, 100)).toBe(true);
      
      // 见习III-1级，经验值超过
      expect(checkPromotionRequirements("见习", "III", 1, 200)).toBe(true);
      
      // 见习III-2级，经验值刚好达到
      expect(checkPromotionRequirements("见习", "III", 2, 120)).toBe(true);
    });
    
    it('should return false when exp is less than max exp', () => {
      // 见习III-1级，经验值不足
      expect(checkPromotionRequirements("见习", "III", 1, 99)).toBe(false);
      
      // 见习III-2级，经验值不足
      expect(checkPromotionRequirements("见习", "III", 2, 119)).toBe(false);
      
      // 初级III-1级，经验值不足
      expect(checkPromotionRequirements("初级", "III", 1, 297)).toBe(false);
    });
    
    it('should handle zero exp', () => {
      expect(checkPromotionRequirements("见习", "III", 1, 0)).toBe(false);
    });
  });
  
  describe('getNextLevelInfo', () => {
    it('should return correct next level info when upgrading within rank', () => {
      // 见习III-1级 -> 见习III-2级
      expect(getNextLevelInfo("见习", "III", 1)).toEqual({
        nextLevel: "见习",
        nextSubLevel: "III",
        nextLevelInRank: 2
      });
      
      // 初级II-1级 -> 初级II-2级
      expect(getNextLevelInfo("初级", "II", 1)).toEqual({
        nextLevel: "初级",
        nextSubLevel: "II",
        nextLevelInRank: 2
      });
    });
    
    it('should return correct next level info when upgrading sub level', () => {
      // 见习III-2级 -> 见习II-1级
      expect(getNextLevelInfo("见习", "III", 2)).toEqual({
        nextLevel: "见习",
        nextSubLevel: "II",
        nextLevelInRank: 1
      });
      
      // 见习II-2级 -> 见习I-1级
      expect(getNextLevelInfo("见习", "II", 2)).toEqual({
        nextLevel: "见习",
        nextSubLevel: "I",
        nextLevelInRank: 1
      });
    });
    
    it('should return correct next level info when upgrading main level', () => {
      // 见习I-2级 -> 初级III-1级
      expect(getNextLevelInfo("见习", "I", 2)).toEqual({
        nextLevel: "初级",
        nextSubLevel: "III",
        nextLevelInRank: 1
      });
      
      // 初级I-2级 -> 中级III-1级
      expect(getNextLevelInfo("初级", "I", 2)).toEqual({
        nextLevel: "中级",
        nextSubLevel: "III",
        nextLevelInRank: 1
      });
    });
    
    it('should return correct next level info for highest level', () => {
      // 总监I-2级（最高级）-> 总监I-3级（理论上不存在的等级）
      expect(getNextLevelInfo("总监", "I", 2)).toEqual({
        nextLevel: "总监",
        nextSubLevel: "I",
        nextLevelInRank: 3
      });
    });
    
    it('should handle invalid level gracefully', () => {
      // 无效的level不会影响返回结果的结构
      expect(getNextLevelInfo("无效等级", "III", 1)).toEqual({
        nextLevel: "无效等级",
        nextSubLevel: "III",
        nextLevelInRank: 2
      });
    });
  });
});
