// 市场表现模拟配置文件
// 所有参数均可在外部修改，无需重新编译代码

// 权重配置
const WEIGHTS = {
  // 核心引导力权重
  coreGuidance: 0.3,
  // 市场影响权重
  marketInfluence: 0.2,
  // 外部因素权重
  externalFactors: 0.15,
  // 品质影响权重
  qualityImpact: 0.15,
  // 活动调整权重
  activityAdjustment: 0.1,
  // 随机波动权重
  randomFluctuation: 0.1,
  // 基础权重
  base: 1.0,
};

// 皮肤品质权限配置
const RARITY_PERMISSIONS = {
  companion: {
    requiredHeroCount: 0,
  },
  courage: {
    requiredHeroCount: 1,
  },
  epic: {
    requiredHeroCount: 3,
  },
  legendary: {
    requiredHeroCount: 5,
  },
  rareLimited: {
    requiredHeroCount: 8,
  },
  peerlessLimited: {
    requiredHeroCount: 12,
  },
  rarePeerlessLimited: {
    requiredHeroCount: 15,
  },
};

// 随机事件配置
const RANDOM_EVENTS = {
  // 触发间隔（天）
  triggerInterval: 2,
  // 每次触发的随机事件数量
  eventCountPerTrigger: 1,
  // 事件间隔天数
  intervalDays: 2,
  // 推荐职业数量
  recommendProfessionCount: 3,
  // 强度范围
  strengthRange: {
    min: 0.7,
    max: 1.3,
  },
};

// 基础值配置
const BASE_VALUES = {
  // 基础销售额
  sales: 10000,
  // 基础讨论度
  discussion: 500,
  // 基础付费率
  payRate: 0.1,
};

// 随机因素配置
const RANDOM_FACTORS = {
  // 市场随机因素范围
  market: {
    min: 0.8,
    max: 1.2,
  },
  // 舆情随机因素范围
  publicOpinion: {
    min: 0.9,
    max: 1.1,
  },
};

// 职业列表
const PROFESSIONS = ["战士", "法师", "刺客", "射手", "辅助", "坦克"];

// 市场表现模拟配置
const skinSimulationConfig = {
  // 1. 权重配置
  weights: WEIGHTS,

  // 2. 核心品质引导力配置
  coreQualityGuidance: {
    // 品质影响系数
    qualityImpactFactor: 0.6,
    // 创作成本影响系数
    creationCostFactor: 0.4,
  },

  // 3. 皮肤品质权限配置
  rarityPermissions: RARITY_PERMISSIONS,

  // 4. 品质与创作权限解锁条件
  qualityCreationUnlock: {
    // 创建普通皮肤所需的条件
    basic: {
      requiredHeroCount: 0,
    },
    // 创建高级皮肤所需的条件
    advanced: {
      requiredHeroCount: 5,
    },
  },

  // 5. 商业系数（用于随机事件）
  businessCoefficients: {
    // 市场饱和度
    marketSaturation: 0.7,
    // 用户需求变化
    userDemandChange: 0.5,
    // 竞争压力
    competitivePressure: 0.6,
  },

  // 6. 随机事件配置
  randomEvents: RANDOM_EVENTS,

  // 7. 基础值配置
  baseValues: BASE_VALUES,

  // 8. 随机因素配置
  randomFactors: RANDOM_FACTORS,

  // 9. 职业列表
  professions: PROFESSIONS,
};

export default skinSimulationConfig;
