// 等级系统工具函数

// 职级列表（共8个职级）
export const plannerLevels = [
  "见习",
  "初级",
  "中级",
  "高级",
  "资深",
  "专家",
  "经理",
  "总监",
];

// 子等级列表
export const subLevels = ["III", "II", "I"];

// 辅助函数：获取职级索引
export function getLevelIndex(level: string): number {
  return plannerLevels.indexOf(level);
}

// 辅助函数：获取子等级索引
export function getSubLevelIndex(subLevel: string): number {
  return subLevels.indexOf(subLevel);
}

// 辅助函数：获取总等级数（0-47）
export function getTotalLevelIndex(
  level: string,
  subLevel: string,
  levelInRank: number,
): number {
  const levelIndex = getLevelIndex(level);
  const subLevelIndex = getSubLevelIndex(subLevel);
  return levelIndex * 6 + subLevelIndex * 2 + (levelInRank - 1);
}

// 辅助函数：获取最大经验值（实现48级的经验值系统）
export function getMaxExp(
  level: string,
  subLevel: string,
  levelInRank: number,
): number {
  // 总等级索引（0-47）
  const totalLevelIndex = getTotalLevelIndex(level, subLevel, levelInRank);

  // 经验值公式：基础经验值 × 1.2^等级索引
  // 基础经验值：见习III-1级为100
  const baseExp = 100;
  
  // 如果总等级索引小于0，返回0
  if (totalLevelIndex < 0) {
    return 0;
  }
  
  return Math.floor(baseExp * Math.pow(1.2, totalLevelIndex));
}

// 辅助函数：检查升级条件
export function checkPromotionRequirements(
  plannerLevel: string,
  plannerSubLevel: string,
  levelInRank: number,
  plannerExp: number,
): boolean {
  const maxExp = getMaxExp(plannerLevel, plannerSubLevel, levelInRank);
  return plannerExp >= maxExp;
}

// 辅助函数：获取下一个等级信息
export function getNextLevelInfo(
  level: string,
  subLevel: string,
  levelInRank: number,
): { nextLevel: string; nextSubLevel: string; nextLevelInRank: number } {
  let nextLevel = level;
  let nextSubLevel = subLevel;
  let nextLevelInRank = levelInRank;

  // 1. 先提升等级内等级（1-2）
  nextLevelInRank++;

  // 2. 如果等级内等级达到3，重置为1并提升子等级
  if (nextLevelInRank > 2) {
    const levelIndex = getLevelIndex(level);
    const subLevelIndex = getSubLevelIndex(subLevel);
    
    // 检查是否是最高等级
    if (levelIndex === plannerLevels.length - 1 && subLevelIndex === subLevels.length - 1) {
      // 最高等级，只增加等级内等级，不提升子等级或职级
      return { nextLevel, nextSubLevel, nextLevelInRank };
    }
    
    nextLevelInRank = 1;
    
    // 提升子等级（III -> II -> I）
    if (subLevelIndex < subLevels.length - 1) {
      nextSubLevel = subLevels[subLevelIndex + 1];
    } else {
      // 3. 如果子等级达到I且等级内等级达到3，重置为III并提升职级
      nextSubLevel = "III";
      if (levelIndex < plannerLevels.length - 1) {
        nextLevel = plannerLevels[levelIndex + 1];
      }
    }
  }

  return { nextLevel, nextSubLevel, nextLevelInRank };
}
