/**
 * 皮肤市场表现加权模拟工具
 * 基于分层维度+动态权重+非线性映射的模型
 */

import skinSimulationConfig from "../config/SkinSimulateConfig";

// 指标配置接口
export interface SkinIndicatorConfig {
  skinId: string;
  heroId: string;
  // 基础指标（0-1）
  pickRate: number; // 英雄出场率
  userBase: number; // 英雄熟练度分布
  designFit: number; // 设计契合度
  scarcity: number; // 视觉稀缺感（原始值）
  costEffectiveness: number; // 性价比
  obtainDifficulty: number; // 获取难度（原始值）
  communityHeat: number; // 社群讨论度
  negativePublicOpinion: number; // 负面舆情
}

// 权重配置接口
export interface WeightConfig {
  baseWeights: {
    heroBase: number; // 英雄基础盘权重
    skinAttract: number; // 皮肤核心吸引力权重
    decisionThreshold: number; // 获取决策门槛权重
    publicOpinion: number; // 外部舆情热度权重
  };
  adjustCoeffs: {
    heroBase: number; // 英雄基础盘调节系数
    skinAttract: number; // 皮肤核心吸引力调节系数
    decisionThreshold: number; // 获取决策门槛调节系数
    publicOpinion: number; // 外部舆情热度调节系数
  };
}

// 输出结果接口
export interface SimulateResult {
  likeScore: number; // 喜爱度（0-100）
  marketScore: number; // 市场表现分（0-100）
  sales: number; // 模拟销量
  discussionCount: number; // 模拟讨论量
  payRate: number; // 模拟付费率
}

/**
 * 非线性指标处理函数
 */
export const processIndicators = {
  // 视觉稀缺感：稀缺感的边际效应递增
  scarcity: (value: number): number => Math.pow(value, 2),

  // 获取难度：难度过高会导致购买率骤降
  obtainDifficulty: (value: number): number => 1 - Math.pow(value, 2),

  // 负面舆情：负面舆情对喜爱度的打击是“断崖式”的
  negativePublicOpinion: (value: number): number => Math.pow(value, 3),
};

/**
 * 计算动态权重（重新归一化）
 */
export function calculateDynamicWeights(weightConfig: Partial<WeightConfig> = {}): {
  heroBase: number;
  skinAttract: number;
  decisionThreshold: number;
  publicOpinion: number;
} {
  // 默认基础权重配置
  const defaultBaseWeights = {
    heroBase: 0.3,
    skinAttract: 0.3,
    decisionThreshold: 0.2,
    publicOpinion: 0.2,
  };

  // 默认调节系数配置
  const defaultAdjustCoeffs = {
    heroBase: 1,
    skinAttract: 1,
    decisionThreshold: 1,
    publicOpinion: 1,
  };

  // 合并用户配置和默认配置
  const baseWeights = {
    heroBase: weightConfig.baseWeights?.heroBase || defaultBaseWeights.heroBase,
    skinAttract: weightConfig.baseWeights?.skinAttract || defaultBaseWeights.skinAttract,
    decisionThreshold: weightConfig.baseWeights?.decisionThreshold || defaultBaseWeights.decisionThreshold,
    publicOpinion: weightConfig.baseWeights?.publicOpinion || defaultBaseWeights.publicOpinion,
  };

  const adjustCoeffs = {
    heroBase: weightConfig.adjustCoeffs?.heroBase || defaultAdjustCoeffs.heroBase,
    skinAttract: weightConfig.adjustCoeffs?.skinAttract || defaultAdjustCoeffs.skinAttract,
    decisionThreshold: weightConfig.adjustCoeffs?.decisionThreshold || defaultAdjustCoeffs.decisionThreshold,
    publicOpinion: weightConfig.adjustCoeffs?.publicOpinion || defaultAdjustCoeffs.publicOpinion,
  };

  // 计算总权重和归一化后的动态权重
  const totalWeight =
    baseWeights.heroBase * adjustCoeffs.heroBase +
    baseWeights.skinAttract * adjustCoeffs.skinAttract +
    baseWeights.decisionThreshold * adjustCoeffs.decisionThreshold +
    baseWeights.publicOpinion * adjustCoeffs.publicOpinion;

  // 避免除以零
  if (totalWeight <= 0) {
    return defaultBaseWeights;
  }

  return {
    heroBase: (baseWeights.heroBase * adjustCoeffs.heroBase) / totalWeight,
    skinAttract: (baseWeights.skinAttract * adjustCoeffs.skinAttract) / totalWeight,
    decisionThreshold: (baseWeights.decisionThreshold * adjustCoeffs.decisionThreshold) / totalWeight,
    publicOpinion: (baseWeights.publicOpinion * adjustCoeffs.publicOpinion) / totalWeight,
  };
}

/**
 * 计算单个皮肤的市场表现数据
 * @param indicators 皮肤指标配置
 * @param weightConfig 权重配置（可选）
 * @returns 模拟结果
 */
export function calculateSkinMarketData(
  indicators: SkinIndicatorConfig,
  weightConfig?: Partial<WeightConfig>
): SimulateResult {
  // 1. 计算动态权重
  const dynamicWeights = calculateDynamicWeights(weightConfig);

  // 2. 非线性处理指标
  const scarcityPrime = processIndicators.scarcity(indicators.scarcity);
  const obtainDiffPrime = processIndicators.obtainDifficulty(indicators.obtainDifficulty);
  const negativeOpPrime = processIndicators.negativePublicOpinion(indicators.negativePublicOpinion);

  // 3. 计算各维度得分
  const heroScore = (indicators.pickRate + indicators.userBase) / 2;
  const skinAttractScore = (indicators.designFit + scarcityPrime) / 2;
  const decisionThresholdScore = (indicators.costEffectiveness + obtainDiffPrime) / 2;
  const publicOpinionScore = (indicators.communityHeat + negativeOpPrime) / 2;

  // 4. 计算喜爱度和市场表现分
  const likeScore = Number(
    (
      (heroScore * dynamicWeights.heroBase +
        skinAttractScore * dynamicWeights.skinAttract +
        publicOpinionScore * dynamicWeights.publicOpinion) *
      100
    ).toFixed(2)
  );

  const marketScore = Number(
    (
      (heroScore * dynamicWeights.heroBase +
        skinAttractScore * dynamicWeights.skinAttract +
        decisionThresholdScore * dynamicWeights.decisionThreshold +
        publicOpinionScore * dynamicWeights.publicOpinion) *
      100
    ).toFixed(2)
  );

  // 5. 获取基础模拟参数
  const { sales: baseSales, discussion: baseDiscussion, payRate: basePayRate } = skinSimulationConfig.baseValues;

  // 6. 生成随机扰动因子
  const marketRandomFactor =
    skinSimulationConfig.randomFactors.market.min +
    Math.random() * (skinSimulationConfig.randomFactors.market.max - skinSimulationConfig.randomFactors.market.min);

  const opinionRandomFactor =
    skinSimulationConfig.randomFactors.publicOpinion.min +
    Math.random() *
      (skinSimulationConfig.randomFactors.publicOpinion.max - skinSimulationConfig.randomFactors.publicOpinion.min);

  // 7. 映射到具体数值
  const sales = Math.round(baseSales * (marketScore / 100) * marketRandomFactor);
  const discussionCount = Math.round(baseDiscussion * (publicOpinionScore * 100) * opinionRandomFactor);
  const payRate = Number((basePayRate * ((decisionThresholdScore * marketScore) / 100)).toFixed(4));

  return {
    likeScore,
    marketScore,
    sales,
    discussionCount,
    payRate,
  };
}

/**
 * 批量计算多个皮肤的市场表现数据
 * @param indicatorsList 皮肤指标配置列表
 * @param weightConfig 权重配置（可选）
 * @returns 模拟结果列表
 */
export function batchCalculateSkinMarketData(
  indicatorsList: SkinIndicatorConfig[],
  weightConfig?: Partial<WeightConfig>
): SimulateResult[] {
  return indicatorsList.map((indicators) => calculateSkinMarketData(indicators, weightConfig));
}

/**
 * 验证指标值是否在有效范围内（0-1）
 * @param value 指标值
 * @returns 是否在有效范围内
 */
export function validateIndicatorValue(value: number): boolean {
  return value >= 0 && value <= 1;
}

/**
 * 生成随机指标配置（用于测试）
 * @returns 随机生成的指标配置
 */
export function generateRandomIndicatorConfig(skinId: string, heroId: string): SkinIndicatorConfig {
  return {
    skinId,
    heroId,
    pickRate: Math.random(),
    userBase: Math.random(),
    designFit: Math.random(),
    scarcity: Math.random(),
    costEffectiveness: Math.random(),
    obtainDifficulty: Math.random(),
    communityHeat: Math.random(),
    negativePublicOpinion: Math.random(),
  };
}

/**
 * 生成随机权重配置（用于测试）
 * @returns 随机生成的权重配置
 */
export function generateRandomWeightConfig(): WeightConfig {
  const baseWeights = {
    heroBase: Math.random(),
    skinAttract: Math.random(),
    decisionThreshold: Math.random(),
    publicOpinion: Math.random(),
  };

  // 归一化基础权重
  const totalBaseWeight = Object.values(baseWeights).reduce((sum, weight) => sum + weight, 0);
  for (const key in baseWeights) {
    baseWeights[key as keyof typeof baseWeights] /= totalBaseWeight;
  }

  return {
    baseWeights,
    adjustCoeffs: {
      heroBase: 0.8 + Math.random() * 0.7, // 0.8-1.5
      skinAttract: 0.8 + Math.random() * 0.7,
      decisionThreshold: 0.8 + Math.random() * 0.7,
      publicOpinion: 0.8 + Math.random() * 0.7,
    },
  };
}

/**
 * 模拟不同权重配置下的市场表现
 * @param indicators 皮肤指标配置
 * @param weightConfigs 多个权重配置
 * @returns 不同权重配置下的模拟结果
 */
export function simulateDifferentWeightConfigs(
  indicators: SkinIndicatorConfig,
  weightConfigs: WeightConfig[]
): Array<{
  weightConfig: WeightConfig;
  result: SimulateResult;
}> {
  return weightConfigs.map((config) => ({
    weightConfig: config,
    result: calculateSkinMarketData(indicators, config),
  }));
}
