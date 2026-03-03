// 英雄-皮肤关联管理模块
import type { SkinIndicatorConfig, SimulateResult } from "./SkinSimulation";
import { calculateSkinMarketData } from "./SkinSimulation";
import skinSimulationConfig from "../config/SkinSimulateConfig";

// 类型定义
export interface Hero {
  id: string;
  name: string;
  icon: string;
  class: string;
  stats: {
    health: number;
    attack: number;
    defense: number;
  };
  description: string;
  createdAt: string;
  creationType: string;
  style: string;
  // 研发相关字段
  developmentTime: number; // 研发时间（天）
  developmentCost: number; // 研发成本
  developmentProgress: number; // 研发进度（0-100）
  status: "in_development" | "released" | "deprecated"; // 英雄状态
  // 模拟相关字段
  pickRate: number; // 英雄出场率（0-1）
  userBase: number; // 英雄用户基数（0-1）
  usageRate: number; // 使用率（0-100）
  winRate: number; // 胜率（0-100）
  banRate: number; // Ban率（0-100）
}

export interface Skin {
  id: string;
  name: string;
  icon: string;
  heroName: string;
  rarity: string;
  price: number;
  effects: number;
  description: string;
  createdAt: string;
  creationType: string;
  style: string;
  // 研发相关字段
  developmentTime: number; // 研发时间（天）
  developmentCost: number; // 研发成本
  developmentProgress: number; // 研发进度（0-100）
  status: "in_development" | "released" | "deprecated"; // 皮肤状态
  // 销量相关字段
  sales: {
    daily: number; // 日销量
    total: number; // 总销量
  };
  // 模拟相关字段
  designFit: number; // 设计契合度（0-1）
  scarcity: number; // 视觉稀缺感（0-1）
  costEffectiveness: number; // 性价比（0-1）
  obtainDifficulty: number; // 获取难度（0-1）
  communityHeat: number; // 社群讨论度（0-1）
  negativePublicOpinion: number; // 负面舆情（0-1）
  marketSimulation?: SimulateResult; // 市场表现模拟结果
}

// 皮肤品质配置类型
export interface SkinRarity {
  id: string;
  name: string;
  color: string;
  baseCost: number;
  basePrice: number;
}

// 本地存储键
const HeroesStorageKey = "hero-development-heroes";
const SkinsStorageKey = "skin-development-skins";

// 皮肤品质分类
export const SkinRarities = [
  { id: "伴生", name: "伴生", color: "#9E9E9E", baseCost: 0, basePrice: 288 },
  { id: "勇气", name: "勇气", color: "#4CAF50", baseCost: 200, basePrice: 588 },
  { id: "史诗", name: "史诗", color: "#2196F3", baseCost: 500, basePrice: 888 },
  {
    id: "传说",
    name: "传说",
    color: "#FF9800",
    baseCost: 1000,
    basePrice: 1688,
  },
  {
    id: "珍品限定",
    name: "珍品限定",
    color: "#F44336",
    baseCost: 1500,
    basePrice: 1988,
  },
  {
    id: "无双限定",
    name: "无双限定",
    color: "#270200",
    baseCost: 2000,
    basePrice: 2288,
  },
  {
    id: "皮肤无双限定",
    name: "皮肤无双限定",
    color: "#FF5722",
    baseCost: 3000,
    basePrice: 2588,
  },
] as const;

// 英雄职业类型
export const HeroClasses = [
  { id: "warrior", name: "战士", icon: "⚔️" },
  { id: "mage", name: "法师", icon: "✨" },
  { id: "archer", name: "射手", icon: "🏹" },
  { id: "tank", name: "坦克", icon: "🛡️" },
  { id: "assassin", name: "刺客", icon: "🗡️" },
  { id: "support", name: "辅助", icon: "🩹" },
] as const;

// 英雄风格类型
export const HeroStyles = [
  "传统",
  "现代",
  "科幻",
  "奇幻",
  "古风",
  "未来",
  "暗黑",
  "光明",
] as const;

// 创作类型与皮肤品质关联
const CreationTypeRarityMap = {
  selfCreation: {
    cost: 400,
    color: "#4CAF50",
    availableRarities: ["伴生", "勇气", "史诗"],
  },
  collaboration: {
    cost: 500,
    color: "#2196F3",
    availableRarities: ["勇气", "史诗", "传说"],
  },
  masterHiring: {
    cost: 1500,
    color: "#FF9800",
    availableRarities: ["传说", "无双限定"],
  },
  specialMaster: {
    cost: 3000,
    color: "#F44336",
    availableRarities: ["珍品限定", "无双限定", "珍品无双限定"],
  },
} as const;

// 英雄创作类型
export const HeroCreationTypes = [
  "自己创作",
  "合作创作",
  "聘请大师",
  "特邀大师",
] as const;

// 从本地存储获取英雄列表
export const getHeroesFromStorage = (): Hero[] => {
  try {
    const heroesJson = localStorage.getItem(HeroesStorageKey);
    return heroesJson ? JSON.parse(heroesJson) : [];
  } catch {
    return [];
  }
};

// 从本地存储获取皮肤列表
export const getSkinsFromStorage = (): Skin[] => {
  try {
    const skinsJson = localStorage.getItem(SkinsStorageKey);
    return skinsJson ? JSON.parse(skinsJson) : [];
  } catch {
    return [];
  }
};

// 保存英雄列表到本地存储
export const saveHeroesToStorage = (heroes: Hero[]): void => {
  try {
    localStorage.setItem(HeroesStorageKey, JSON.stringify(heroes));
  } catch {
    // 静默处理错误
  }
};

// 保存皮肤列表到本地存储
export const saveSkinsToStorage = (skins: Skin[]): void => {
  try {
    localStorage.setItem(SkinsStorageKey, JSON.stringify(skins));
  } catch {
    // 静默处理错误
  }
};

// 检查英雄是否存在
export const isHeroExists = (heroName: string): boolean => {
  const heroes = getHeroesFromStorage();
  return heroes.some((hero) => hero.name === heroName);
};

// 检查皮肤品质是否合法
export const isValidSkinRarity = (rarity: string): boolean => {
  return SkinRarities.some((skinRarity) => skinRarity.id === rarity);
};

// 获取所有皮肤的英雄
export const getAllSkinHeroes = (): Hero[] => {
  return getHeroesFromStorage();
};

// 获取皮肤的所属英雄
export const getSkinHero = (heroName: string): Hero | undefined => {
  return getHeroesFromStorage().find((hero) => hero.name === heroName);
};

// 验证创作类型是否允许创作指定品质的皮肤
// 在实际应用中，这里应该使用用户是否拥有英雄作为判断条件，简化为检查英雄数量
const canCreateSkinWithRarity = (
  creationType: string,
  rarity: string,
  heroCount: number,
): boolean => {
  // 获取该创作类型允许的皮肤品质
  const creationTypeConfig =
    CreationTypeRarityMap[creationType as keyof typeof CreationTypeRarityMap];
  if (!creationTypeConfig) return false;

  // 检查是否允许该品质的皮肤
  const allowedRarity = creationTypeConfig.availableRarities.find(
    (allowed) => allowed === rarity,
  );
  if (!allowedRarity) {
    return false;
  }

  // 检查英雄数量是否满足要求
  const rarityConfig =
    skinSimulationConfig.rarityPermissions[
      rarity as keyof typeof skinSimulationConfig.rarityPermissions
    ];
  if (rarityConfig && heroCount < rarityConfig.requiredHeroCount) {
    return false;
  }

  return true;
};

// 创建皮肤前的验证
export const validateSkinCreation = (
  skinData: Omit<Skin, "id" | "createdAt">,
): {
  valid: boolean;
  message: string;
} => {
  // 1. 验证英雄是否存在
  if (!isHeroExists(skinData.heroName)) {
    return {
      valid: false,
      message: "所属英雄不存在，请先创建英雄",
    };
  }

  // 2. 验证皮肤品质是否合法
  if (!isValidSkinRarity(skinData.rarity)) {
    return {
      valid: false,
      message: "无效的皮肤品质",
    };
  }

  // 3. 获取当前英雄数量
  const heroCount = getHeroesFromStorage().length;

  // 4. 验证创作类型是否允许创作该品质的皮肤，以及英雄数量是否满足要求
  if (
    !canCreateSkinWithRarity(skinData.creationType, skinData.rarity, heroCount)
  ) {
    const rarityConfig =
      skinSimulationConfig.rarityPermissions[
        skinData.rarity as keyof typeof skinSimulationConfig.rarityPermissions
      ];
    if (heroCount < (rarityConfig?.requiredHeroCount || 0)) {
      return {
        valid: false,
        message: `创作${skinData.rarity}品质的皮肤需要至少${rarityConfig?.requiredHeroCount}个英雄`,
      };
    }
    return {
      valid: false,
      message: `该创作类型不允许创作${skinData.rarity}品质的皮肤`,
    };
  }

  return {
    valid: true,
    message: "验证通过",
  };
};

// 计算基础研发时间
const calculateBaseDevelopmentTime = (rarity: string): number => {
  const rarityConfig = SkinRarities.find((r) => r.id === rarity);
  if (!rarityConfig) return 10;

  if (rarityConfig.id === "传说" || rarityConfig.id === "无双限定") {
    return 30;
  } else if (rarityConfig.id === "史诗") {
    return 20;
  } else if (rarityConfig.id === "勇气") {
    return 15;
  } else {
    return 10;
  }
};

// 计算基础研发成本
const calculateBaseDevelopmentCost = (rarity: string): number => {
  const rarityConfig = SkinRarities.find((r) => r.id === rarity);
  return rarityConfig ? rarityConfig.baseCost * 100 : 2000;
};

// 计算时间乘数
const calculateTimeMultiplier = (creationType: string): number => {
  const creationTypeConfig =
    CreationTypeRarityMap[creationType as keyof typeof CreationTypeRarityMap];
  if (!creationTypeConfig) return 1.0;

  switch (creationType) {
    case "自己创作":
      return 1.5;
    case "合作创作":
      return 1.0;
    case "聘请大师":
      return 0.7;
    case "特邀大师":
      return 0.5;
    default:
      return 1.0;
  }
};

// 计算成本乘数
const calculateCostMultiplier = (creationType: string): number => {
  const creationTypeConfig =
    CreationTypeRarityMap[creationType as keyof typeof CreationTypeRarityMap];
  if (!creationTypeConfig) return 1.0;

  switch (creationType) {
    case "自己创作":
      return 0.8;
    case "合作创作":
      return 1.0;
    case "聘请大师":
      return 1.5;
    case "特邀大师":
      return 2.0;
    default:
      return 1.0;
  }
};

// 创建皮肤
export const createSkin = (skinData: Omit<Skin, "id" | "createdAt">): Skin => {
  // 生成唯一ID
  const id = `skin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 计算研发时间和成本
  const baseDevelopmentTime = calculateBaseDevelopmentTime(skinData.rarity);
  const baseDevelopmentCost = calculateBaseDevelopmentCost(skinData.rarity);
  const timeMultiplier = calculateTimeMultiplier(skinData.creationType);
  const costMultiplier = calculateCostMultiplier(skinData.creationType);

  const developmentTime = Math.floor(baseDevelopmentTime * timeMultiplier);
  const developmentCost = Math.floor(baseDevelopmentCost * costMultiplier);

  // 创建皮肤对象
  const newSkin: Skin = {
    ...skinData,
    id,
    createdAt: new Date().toISOString(),
    // 研发相关字段
    developmentTime,
    developmentCost,
    developmentProgress: 0,
    status: "in_development",
    // 销量相关字段
    sales: {
      daily: 0,
      total: 0,
    },
  };

  // 保存到本地存储
  const skins = getSkinsFromStorage();
  skins.push(newSkin);
  saveSkinsToStorage(skins);

  // 计算并保存市场表现模拟数据
  const skinHero = getSkinHero(skinData.heroName);
  if (skinHero) {
    const skinIndicatorConfig: SkinIndicatorConfig = {
      skinId: newSkin.id,
      heroId: skinHero.id,
      pickRate: skinHero.pickRate,
      userBase: skinHero.userBase,
      designFit: newSkin.designFit,
      scarcity: newSkin.scarcity,
      costEffectiveness: newSkin.costEffectiveness,
      obtainDifficulty: newSkin.obtainDifficulty,
      communityHeat: newSkin.communityHeat,
      negativePublicOpinion: newSkin.negativePublicOpinion,
    };

    // 计算市场表现数据
    const marketData = calculateSkinMarketData(skinIndicatorConfig);

    // 更新皮肤对象
    newSkin.marketSimulation = marketData;

    // 重新保存到本地存储
    saveSkinsToStorage(skins);
  }

  return newSkin;
};

// 删除皮肤
export const deleteSkin = (skinId: string): void => {
  const skins = getSkinsFromStorage();
  const updatedSkins = skins.filter((skin) => skin.id !== skinId);
  saveSkinsToStorage(updatedSkins);
};

// 验证英雄是否可以创建
export const validateHeroCreation = (
  heroData: Omit<Hero, "id" | "createdAt">,
): {
  valid: boolean;
  message: string;
} => {
  // 1. 验证英雄名称是否已存在
  if (isHeroExists(heroData.name)) {
    return {
      valid: false,
      message: "英雄名称已存在，请使用其他名称",
    };
  }

  // 2. 验证英雄职业是否合法
  const isValidClass = HeroClasses.some((cls) => cls.name === heroData.class);
  if (!isValidClass) {
    return {
      valid: false,
      message: "无效的英雄职业",
    };
  }

  return {
    valid: true,
    message: "验证通过",
  };
};

// 创建英雄
export const createHero = (heroData: Omit<Hero, "id" | "createdAt">): Hero => {
  // 生成唯一ID
  const id = `hero-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 创建英雄对象
  const newHero: Hero = {
    ...heroData,
    id,
    createdAt: new Date().toISOString(),
    // 确保必要字段有默认值
    pickRate: heroData.pickRate || 0.01,
    userBase: heroData.userBase || 0.01,
    usageRate: heroData.usageRate || 0,
    winRate: heroData.winRate || 50,
    banRate: heroData.banRate || 0,
  };

  // 保存到本地存储
  const heroes = getHeroesFromStorage();
  heroes.push(newHero);
  saveHeroesToStorage(heroes);

  return newHero;
};

// 生成随机英雄数据
export const generateRandomHeroData = (): Omit<Hero, "id" | "createdAt"> => {
  // 随机选择英雄职业
  const randomClass =
    HeroClasses[Math.floor(Math.random() * HeroClasses.length)];

  // 随机选择英雄风格
  const randomStyle = HeroStyles[Math.floor(Math.random() * HeroStyles.length)];

  // 随机选择创作类型
  const randomCreationType =
    HeroCreationTypes[Math.floor(Math.random() * HeroCreationTypes.length)];

  // 随机生成英雄名称
  const heroNames = [
    "雷电",
    "火焰",
    "冰霜",
    "风暴",
    "大地",
    "光明",
    "黑暗",
    "星辰",
    "钢铁",
    "疾风",
    "幻影",
    "雷霆",
    "曙光",
    "暮色",
    "黎明",
    "黄昏",
  ];
  const heroAdjectives = [
    "勇士",
    "法师",
    "射手",
    "守护者",
    "刺客",
    "贤者",
    "行者",
    "猎人",
    "骑士",
    "术士",
    "游侠",
    "斗士",
    "祭司",
    "忍者",
    "武士",
    "宗师",
  ];
  const randomName = `${heroNames[Math.floor(Math.random() * heroNames.length)]}${heroAdjectives[Math.floor(Math.random() * heroAdjectives.length)]}`;

  // 随机生成基础属性（根据职业调整）
  let baseHealth = 1000;
  let baseAttack = 100;
  let baseDefense = 50;

  // 根据职业调整基础属性
  switch (randomClass.id) {
    case "warrior":
      baseHealth = 1500;
      baseAttack = 120;
      baseDefense = 80;
      break;
    case "mage":
      baseHealth = 800;
      baseAttack = 180;
      baseDefense = 30;
      break;
    case "archer":
      baseHealth = 900;
      baseAttack = 150;
      baseDefense = 40;
      break;
    case "tank":
      baseHealth = 2000;
      baseAttack = 80;
      baseDefense = 120;
      break;
    case "assassin":
      baseHealth = 700;
      baseAttack = 200;
      baseDefense = 20;
      break;
    case "support":
      baseHealth = 1000;
      baseAttack = 90;
      baseDefense = 60;
      break;
  }

  return {
    name: randomName,
    icon: randomClass.icon,
    class: randomClass.name,
    stats: {
      health: baseHealth + Math.floor(Math.random() * 200),
      attack: baseAttack + Math.floor(Math.random() * 30),
      defense: baseDefense + Math.floor(Math.random() * 20),
    },
    description: `${randomName}是一名强大的${randomClass.name}，擅长${
      randomClass.name === "战士"
        ? "近身战斗"
        : randomClass.name === "法师"
          ? "远程魔法攻击"
          : randomClass.name === "射手"
            ? "远程物理攻击"
            : randomClass.name === "坦克"
              ? "承受伤害和保护队友"
              : randomClass.name === "刺客"
                ? "暗杀和爆发伤害"
                : "辅助队友和提供增益效果"
    }。`,
    creationType: randomCreationType,
    style: randomStyle,
    // 研发相关字段
    developmentTime: 15 + Math.floor(Math.random() * 15), // 15-30天
    developmentCost: 5000 + Math.floor(Math.random() * 5000), // 5000-10000
    developmentProgress: 0,
    status: "in_development",
    // 模拟相关字段
    pickRate: 0.01 + Math.random() * 0.04, // 1%-5%
    userBase: 0.01 + Math.random() * 0.04, // 1%-5%
    usageRate: 0,
    winRate: 48 + Math.random() * 4, // 48%-52%
    banRate: 0,
  };
};

// 全自动生成英雄
export const autoGenerateHero = (): Hero => {
  // 生成随机英雄数据
  const heroData = generateRandomHeroData();

  // 验证英雄数据
  const validation = validateHeroCreation(heroData);
  if (!validation.valid) {
    // 如果生成的数据无效，重新生成
    return autoGenerateHero();
  }

  // 创建英雄
  return createHero(heroData);
};

// 批量生成英雄
export const batchGenerateHeroes = (count: number): Hero[] => {
  const generatedHeroes: Hero[] = [];

  for (let i = 0; i < count; i++) {
    const hero = autoGenerateHero();
    generatedHeroes.push(hero);
  }

  return generatedHeroes;
};

// 删除英雄时，同时删除其所有皮肤
export const deleteHeroAndSkins = (heroName: string): void => {
  // 删除英雄
  const heroes = getHeroesFromStorage();
  const updatedHeroes = heroes.filter((hero) => hero.name !== heroName);
  saveHeroesToStorage(updatedHeroes);

  // 删除该英雄的所有皮肤
  const skins = getSkinsFromStorage();
  const updatedSkins = skins.filter((skin) => skin.heroName !== heroName);
  saveSkinsToStorage(updatedSkins);
};

// 批量创建皮肤数据（用于测试）
export const batchCreateSkins = (count: number): void => {
  const heroes = getHeroesFromStorage();
  if (heroes.length === 0) {
    // console.warn("没有英雄数据，无法创建皮肤");
    return;
  }

  const skins = getSkinsFromStorage();

  for (let i = 0; i < count; i++) {
    const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
    const randomRarity =
      SkinRarities[Math.floor(Math.random() * SkinRarities.length)];
    const randomCreationType = Object.keys(CreationTypeRarityMap)[
      Math.floor(Math.random() * Object.keys(CreationTypeRarityMap).length)
    ];

    // 验证是否可以创建该皮肤
    const skinData: Omit<Skin, "id" | "createdAt"> = {
      name: `${randomHero.name}皮肤${i + 1}`,
      icon: "🧱",
      heroName: randomHero.name,
      rarity: randomRarity.id,
      price: randomRarity.basePrice,
      effects: Math.floor(Math.random() * 100),
      description: `${randomHero.name}的${randomRarity.name}皮肤，具有独特的外观和效果`,
      creationType: randomCreationType,
      style: "standard",
      designFit: Math.random(),
      scarcity: Math.random(),
      costEffectiveness: Math.random(),
      obtainDifficulty: Math.random(),
      communityHeat: Math.random(),
      negativePublicOpinion: Math.random(),
      // 研发相关字段
      developmentTime: 10,
      developmentCost: 2000,
      developmentProgress: 0,
      status: "in_development",
      // 销量相关字段
      sales: {
        daily: 0,
        total: 0,
      },
    };

    const validation = validateSkinCreation(skinData);
    if (validation.valid) {
      const newSkin = createSkin(skinData);
      skins.push(newSkin);
    }
  }

  saveSkinsToStorage(skins);
};

// 获取所有皮肤的市场表现模拟数据
export const getAllSkinMarketData = (): Array<{
  skin: Skin;
  marketData: SimulateResult;
}> => {
  return getSkinsFromStorage()
    .filter((skin) => skin.marketSimulation)
    .map((skin) => ({
      skin,
      marketData: skin.marketSimulation!,
    }));
};

// 验证英雄是否可以创建指定品质的皮肤（基于英雄数量）
export const validateHeroSkinCreation = (
  heroCount: number,
  rarity: string,
): boolean => {
  const rarityConfig =
    skinSimulationConfig.rarityPermissions[
      rarity as keyof typeof skinSimulationConfig.rarityPermissions
    ];
  return !rarityConfig || heroCount >= rarityConfig.requiredHeroCount;
};

// 英雄研发加速选项
export interface HeroAccelerateOption {
  id: string;
  name: string;
  description: string;
  costMultiplier: number; // 成本乘数
  timeReduction: number; // 时间减少百分比 (0-100)
  resourceType: "money" | "points" | "both";
}

// 研发加速选项配置
export const HeroAccelerateOptions: HeroAccelerateOption[] = [
  {
    id: "normal",
    name: "正常研发",
    description: "使用常规资源进行研发，无额外成本",
    costMultiplier: 1.0,
    timeReduction: 0,
    resourceType: "money",
  },
  {
    id: "fast",
    name: "快速研发",
    description: "增加50%成本，减少20%研发时间",
    costMultiplier: 1.5,
    timeReduction: 20,
    resourceType: "money",
  },
  {
    id: "super_fast",
    name: "超级研发",
    description: "增加100%成本，减少40%研发时间",
    costMultiplier: 2.0,
    timeReduction: 40,
    resourceType: "money",
  },
  {
    id: "urgent",
    name: "紧急研发",
    description: "增加200%成本，减少60%研发时间",
    costMultiplier: 3.0,
    timeReduction: 60,
    resourceType: "both",
  },
] as const;

// 推进研发进度 - 带加速选项
export const advanceDevelopment = (
  id: string,
  isHero = false,
  accelerateOptionId = "normal",
): void => {
  if (isHero) {
    // 推进英雄研发进度
    const heroes = getHeroesFromStorage();
    const heroIndex = heroes.findIndex((hero) => hero.id === id);

    if (heroIndex !== -1 && heroes[heroIndex].status === "in_development") {
      // 获取加速选项
      const accelerateOption =
        HeroAccelerateOptions.find((opt) => opt.id === accelerateOptionId) ||
        HeroAccelerateOptions[0];

      // 计算加速后的每天进度
      const baseDailyProgress = 100 / heroes[heroIndex].developmentTime;
      const timeReductionFactor = (100 - accelerateOption.timeReduction) / 100;
      const dailyProgress = baseDailyProgress / timeReductionFactor;

      // 推进进度
      heroes[heroIndex].developmentProgress = Math.min(
        100,
        heroes[heroIndex].developmentProgress + dailyProgress,
      );

      // 如果研发完成，将状态改为已发布并执行完成逻辑
      if (heroes[heroIndex].developmentProgress >= 100) {
        heroes[heroIndex].status = "released";
        heroes[heroIndex].developmentProgress = 100;

        // 执行英雄研发完成后的处理
        handleHeroDevelopmentComplete(heroes[heroIndex]);
      }

      saveHeroesToStorage(heroes);
    }
  } else {
    // 推进皮肤研发进度
    const skins = getSkinsFromStorage();
    const skinIndex = skins.findIndex((skin) => skin.id === id);

    if (skinIndex !== -1 && skins[skinIndex].status === "in_development") {
      // 获取加速选项
      const accelerateOption =
        HeroAccelerateOptions.find((opt) => opt.id === accelerateOptionId) ||
        HeroAccelerateOptions[0];

      // 计算加速后的每天进度
      const baseDailyProgress = 100 / skins[skinIndex].developmentTime;
      const timeReductionFactor = (100 - accelerateOption.timeReduction) / 100;
      const dailyProgress = baseDailyProgress / timeReductionFactor;

      // 推进进度
      skins[skinIndex].developmentProgress = Math.min(
        100,
        skins[skinIndex].developmentProgress + dailyProgress,
      );

      // 如果研发完成，将状态改为已发布并计算初始销量
      if (skins[skinIndex].developmentProgress >= 100) {
        skins[skinIndex].status = "released";
        skins[skinIndex].developmentProgress = 100;

        // 计算初始销量
        const skinHero = getSkinHero(skins[skinIndex].heroName);
        if (skinHero) {
          calculateSkinInitialSales(skins[skinIndex], skinHero);
        }
      }

      saveSkinsToStorage(skins);
    }
  }
};

// 英雄研发完成后的处理
export const handleHeroDevelopmentComplete = (hero: Hero): void => {
  // 1. 更新英雄状态为已发布
  hero.status = "released";
  hero.developmentProgress = 100;

  // 2. 初始化英雄的游戏数据
  hero.pickRate = Math.max(hero.pickRate, 0.02); // 至少2%的初始出场率
  hero.userBase = Math.max(hero.userBase, 0.02); // 至少2%的初始用户基数
  hero.usageRate = 0; // 初始使用率为0
  hero.winRate = Math.max(hero.winRate, 45); // 至少45%的初始胜率
  hero.banRate = 0; // 初始Ban率为0

  // 3. 保存更新后的英雄数据
  const heroes = getHeroesFromStorage();
  const heroIndex = heroes.findIndex((h) => h.id === hero.id);
  if (heroIndex !== -1) {
    heroes[heroIndex] = hero;
    saveHeroesToStorage(heroes);
  }
};

// 计算英雄研发成本
export const calculateHeroDevelopmentCost = (
  hero: Hero,
  accelerateOptionId = "normal",
): number => {
  const accelerateOption =
    HeroAccelerateOptions.find((opt) => opt.id === accelerateOptionId) ||
    HeroAccelerateOptions[0];
  return Math.floor(hero.developmentCost * accelerateOption.costMultiplier);
};

// 暂停英雄研发
export const pauseHeroDevelopment = (heroId: string): void => {
  const heroes = getHeroesFromStorage();
  const heroIndex = heroes.findIndex((hero) => hero.id === heroId);

  if (heroIndex !== -1 && heroes[heroIndex].status === "in_development") {
    // 这里可以添加暂停逻辑，比如保存当前进度，释放资源等
    // 目前简单实现为不改变状态，但可以扩展为添加"paused"状态
    saveHeroesToStorage(heroes);
  }
};

// 取消英雄研发
export const cancelHeroDevelopment = (heroId: string): void => {
  const heroes = getHeroesFromStorage();
  const heroIndex = heroes.findIndex((hero) => hero.id === heroId);

  if (heroIndex !== -1 && heroes[heroIndex].status === "in_development") {
    // 删除该英雄
    const updatedHeroes = heroes.filter((h) => h.id !== heroId);
    saveHeroesToStorage(updatedHeroes);
  }
};

// 获取英雄研发进度详情
export const getHeroDevelopmentDetails = (
  heroId: string,
): {
  hero: Hero | undefined;
  daysRemaining: number;
  progressPercentage: number;
  estimatedCompletionDate: string;
  developmentStage: "early" | "mid" | "late" | "completed";
} => {
  const heroes = getHeroesFromStorage();
  const hero = heroes.find((h) => h.id === heroId);

  if (!hero) {
    return {
      hero: undefined,
      daysRemaining: 0,
      progressPercentage: 0,
      estimatedCompletionDate: new Date().toISOString(),
      developmentStage: "completed",
    };
  }

  if (hero.status === "released" || hero.status === "deprecated") {
    return {
      hero,
      daysRemaining: 0,
      progressPercentage: 100,
      estimatedCompletionDate: hero.createdAt,
      developmentStage: "completed",
    };
  }

  const progressPercentage = hero.developmentProgress;
  const daysRemaining = Math.ceil(
    (100 - progressPercentage) / (100 / hero.developmentTime),
  );
  const estimatedCompletionDate = new Date();
  estimatedCompletionDate.setDate(
    estimatedCompletionDate.getDate() + daysRemaining,
  );

  let developmentStage: "early" | "mid" | "late" | "completed" = "early";
  if (progressPercentage >= 70) {
    developmentStage = "late";
  } else if (progressPercentage >= 30) {
    developmentStage = "mid";
  }

  return {
    hero,
    daysRemaining,
    progressPercentage,
    estimatedCompletionDate: estimatedCompletionDate.toISOString(),
    developmentStage,
  };
};

// 计算皮肤初始销量
export const calculateSkinInitialSales = (skin: Skin, hero: Hero): void => {
  // 初始销量公式：英雄用户基数 × 英雄出场率 × 皮肤吸引力 × 价格系数 × 品质系数

  // 皮肤吸引力：基于设计契合度、稀缺感、社群讨论度等因素计算
  const skinAttraction =
    (skin.designFit + skin.scarcity + skin.communityHeat) / 3;

  // 价格系数：价格越高，系数越低（防止价格过高导致销量过低）
  const priceCoeff = Math.max(0.1, 1 - (skin.price - 200) / 10000);

  // 品质系数：不同品质的皮肤有不同的系数
  const rarityCoeff = SkinRarities.find((rarity) => rarity.id === skin.rarity)
    ? skin.rarity === "传说" || skin.rarity === "无双限定"
      ? 1.5
      : skin.rarity === "史诗"
        ? 1.2
        : skin.rarity === "勇气"
          ? 1.0
          : 0.8
    : 0.8;

  // 计算初始销量（总销量）
  const initialTotalSales = Math.floor(
    100000 *
      hero.userBase *
      hero.pickRate *
      skinAttraction *
      priceCoeff *
      rarityCoeff,
  );

  // 计算初始日销量（总销量的10%）
  const initialDailySales = Math.floor(initialTotalSales * 0.1);

  // 更新皮肤销量数据
  skin.sales = {
    daily: initialDailySales,
    total: initialTotalSales,
  };
};

// 计算皮肤每日销量
export const calculateSkinDailySales = (
  skin: Skin,
  hero: Hero,
  gamePopularity: number,
  gameWordOfMouth: number,
): void => {
  if (skin.status !== "released") return;

  // 每日销量公式：基础销量 × 热度系数 × 口碑系数 × 英雄表现系数 × 时间衰减系数

  // 基础销量：基于初始销量和当前状态计算
  const baseDailySales = skin.sales.daily;

  // 热度系数：游戏热度越高，销量越高
  const popularityCoeff = Math.max(0.5, gamePopularity / 100);

  // 口碑系数：游戏口碑越好，销量越高
  const wordOfMouthCoeff = Math.max(0.5, gameWordOfMouth / 100);

  // 英雄表现系数：英雄使用率和胜率越高，皮肤销量越高
  const heroPerformanceCoeff = Math.max(
    0.5,
    (hero.usageRate + hero.winRate) / 200,
  );

  // 时间衰减系数：皮肤发布时间越长，销量越低
  const releaseDate = new Date(skin.createdAt);
  const currentDate = new Date();
  const daysSinceRelease = Math.floor(
    (currentDate.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const timeDecayCoeff = Math.max(0.3, 1 - daysSinceRelease / 365);

  // 计算当日销量
  const dailySales = Math.floor(
    baseDailySales *
      popularityCoeff *
      wordOfMouthCoeff *
      heroPerformanceCoeff *
      timeDecayCoeff,
  );

  // 更新皮肤销量数据
  skin.sales.daily = dailySales;
  skin.sales.total += dailySales;
};

// 批量计算所有已发布皮肤的每日销量
export const calculateAllSkinDailySales = (
  gamePopularity: number,
  gameWordOfMouth: number,
): void => {
  const skins = getSkinsFromStorage();
  const heroes = getHeroesFromStorage();

  skins.forEach((skin) => {
    if (skin.status === "released") {
      const hero = heroes.find((h) => h.name === skin.heroName);
      if (hero) {
        calculateSkinDailySales(skin, hero, gamePopularity, gameWordOfMouth);
      }
    }
  });

  saveSkinsToStorage(skins);
};

// 获取所有正在研发的项目（英雄和皮肤）
export const getInDevelopmentProjects = (): Array<{
  type: "hero" | "skin";
  item: Hero | Skin;
}> => {
  const heroes = getHeroesFromStorage().filter(
    (hero) => hero.status === "in_development",
  );
  const skins = getSkinsFromStorage().filter(
    (skin) => skin.status === "in_development",
  );

  const projects: Array<{ type: "hero" | "skin"; item: Hero | Skin }> = [];

  // 添加英雄项目
  heroes.forEach((hero) => {
    projects.push({
      type: "hero",
      item: hero,
    });
  });

  // 添加皮肤项目
  skins.forEach((skin) => {
    projects.push({
      type: "skin",
      item: skin,
    });
  });

  // 按研发进度排序
  return projects.sort((a, b) => {
    const progressA =
      a.type === "hero"
        ? (a.item as Hero).developmentProgress
        : (a.item as Skin).developmentProgress;
    const progressB =
      b.type === "hero"
        ? (b.item as Hero).developmentProgress
        : (b.item as Skin).developmentProgress;
    return progressA - progressB;
  });
};

// 创建皮肤前的验证（简化版，只验证必要条件）
export const validateSimpleSkinCreation = (
  skinData: Pick<Skin, "heroName" | "rarity" | "creationType">,
  heroCount: number,
): {
  valid: boolean;
  message: string;
} => {
  // 1. 验证英雄是否存在
  if (!isHeroExists(skinData.heroName)) {
    return {
      valid: false,
      message: "所属英雄不存在，请先创建英雄",
    };
  }

  // 2. 验证皮肤品质是否合法
  if (!isValidSkinRarity(skinData.rarity)) {
    return {
      valid: false,
      message: "无效的皮肤品质",
    };
  }

  // 3. 验证英雄数量是否满足要求
  const rarityConfig =
    skinSimulationConfig.rarityPermissions[
      skinData.rarity as keyof typeof skinSimulationConfig.rarityPermissions
    ];
  if (rarityConfig && heroCount < rarityConfig.requiredHeroCount) {
    return {
      valid: false,
      message: `创作${skinData.rarity}品质的皮肤需要至少${rarityConfig.requiredHeroCount}个英雄`,
    };
  }

  // 4. 验证创作类型是否允许创作该品质的皮肤
  const creationTypeConfig =
    CreationTypeRarityMap[
      skinData.creationType as keyof typeof CreationTypeRarityMap
    ];
  const allowedRarity = creationTypeConfig?.availableRarities.find(
    (allowed) => allowed === skinData.rarity,
  );
  if (!allowedRarity) {
    return {
      valid: false,
      message: `该创作类型不允许创作${skinData.rarity}品质的皮肤`,
    };
  }

  return {
    valid: true,
    message: "验证通过",
  };
};

// 英雄平衡性分析结果类型
export interface HeroBalanceAnalysis {
  hero: Hero;
  overallScore: number; // 整体平衡性评分 (0-100)
  attributeScore: number; // 属性平衡性评分 (0-100)
  performanceScore: number; // 游戏表现评分 (0-100)
  classBalanceScore: number; // 职业平衡性评分 (0-100)
  healthBalance: {
    value: number;
    ideal: number;
    deviation: number; // 偏离理想值的百分比
    status: "underpowered" | "balanced" | "overpowered";
  };
  attackBalance: {
    value: number;
    ideal: number;
    deviation: number;
    status: "underpowered" | "balanced" | "overpowered";
  };
  defenseBalance: {
    value: number;
    ideal: number;
    deviation: number;
    status: "underpowered" | "balanced" | "overpowered";
  };
  gamePerformance: {
    pickRate: {
      value: number;
      idealRange: [number, number];
      status: "low" | "balanced" | "high";
    };
    winRate: {
      value: number;
      idealRange: [number, number];
      status: "low" | "balanced" | "high";
    };
    banRate: {
      value: number;
      idealRange: [number, number];
      status: "low" | "balanced" | "high";
    };
    usageRate: {
      value: number;
      idealRange: [number, number];
      status: "low" | "balanced" | "high";
    };
  };
  classComparison: {
    averageClassPickRate: number;
    averageClassWinRate: number;
    averageClassBanRate: number;
    deviationFromClassAvg: {
      pickRate: number;
      winRate: number;
      banRate: number;
    };
  };
  recommendations: string[];
}

// 计算职业平均数据
export const calculateClassAverageStats = (
  className: string,
): {
  averagePickRate: number;
  averageWinRate: number;
  averageBanRate: number;
  averageHealth: number;
  averageAttack: number;
  averageDefense: number;
  heroCount: number;
} => {
  const heroes = getHeroesFromStorage().filter(
    (h) => h.class === className && h.status === "released",
  );

  if (heroes.length === 0) {
    return {
      averagePickRate: 0,
      averageWinRate: 0,
      averageBanRate: 0,
      averageHealth: 0,
      averageAttack: 0,
      averageDefense: 0,
      heroCount: 0,
    };
  }

  const totalPickRate = heroes.reduce((sum, hero) => sum + hero.pickRate, 0);
  const totalWinRate = heroes.reduce((sum, hero) => sum + hero.winRate, 0);
  const totalBanRate = heroes.reduce((sum, hero) => sum + hero.banRate, 0);
  const totalHealth = heroes.reduce((sum, hero) => sum + hero.stats.health, 0);
  const totalAttack = heroes.reduce((sum, hero) => sum + hero.stats.attack, 0);
  const totalDefense = heroes.reduce(
    (sum, hero) => sum + hero.stats.defense,
    0,
  );

  return {
    averagePickRate: totalPickRate / heroes.length,
    averageWinRate: totalWinRate / heroes.length,
    averageBanRate: totalBanRate / heroes.length,
    averageHealth: totalHealth / heroes.length,
    averageAttack: totalAttack / heroes.length,
    averageDefense: totalDefense / heroes.length,
    heroCount: heroes.length,
  };
};

// 分析英雄平衡性
export const analyzeHeroBalance = (hero: Hero): HeroBalanceAnalysis => {
  // 1. 计算职业平均数据
  const classStats = calculateClassAverageStats(hero.class);

  // 2. 计算理想属性值（基于职业平均值）
  const idealHealth = classStats.averageHealth;
  const idealAttack = classStats.averageAttack;
  const idealDefense = classStats.averageDefense;

  // 3. 分析属性平衡性
  const analyzeAttribute = (value: number, ideal: number) => {
    const deviation = (Math.abs(value - ideal) / ideal) * 100;
    let status: "underpowered" | "balanced" | "overpowered" = "balanced";

    if (deviation > 20) {
      status = value > ideal ? "overpowered" : "underpowered";
    }

    return {
      value,
      ideal,
      deviation,
      status,
    };
  };

  const healthBalance = analyzeAttribute(hero.stats.health, idealHealth);
  const attackBalance = analyzeAttribute(hero.stats.attack, idealAttack);
  const defenseBalance = analyzeAttribute(hero.stats.defense, idealDefense);

  // 4. 分析游戏表现
  const analyzePerformance = (
    value: number,
    idealMin: number,
    idealMax: number,
  ): {
    value: number;
    idealRange: [number, number];
    status: "low" | "balanced" | "high";
  } => {
    let status: "low" | "balanced" | "high" = "balanced";

    if (value < idealMin) {
      status = "low";
    } else if (value > idealMax) {
      status = "high";
    }

    return {
      value,
      idealRange: [idealMin, idealMax] as [number, number],
      status,
    };
  };

  const gamePerformance = {
    pickRate: analyzePerformance(hero.pickRate, 0.01, 0.15), // 1%-15%
    winRate: analyzePerformance(hero.winRate, 45, 55), // 45%-55%
    banRate: analyzePerformance(hero.banRate, 0, 20), // 0%-20%
    usageRate: analyzePerformance(hero.usageRate, 0, 30), // 0%-30%
  };

  // 5. 计算评分
  const attributeScore = Math.max(
    0,
    100 -
      (healthBalance.deviation +
        attackBalance.deviation +
        defenseBalance.deviation) /
        3,
  );

  // 游戏表现评分（胜率权重更高）
  let performanceScore = 100;
  if (gamePerformance.winRate.status !== "balanced") {
    performanceScore -= Math.abs(hero.winRate - 50) * 2;
  }
  if (gamePerformance.pickRate.status !== "balanced") {
    performanceScore -= Math.abs(hero.pickRate - 0.08) * 500;
  }
  if (gamePerformance.banRate.status !== "balanced") {
    performanceScore -= hero.banRate * 2;
  }
  performanceScore = Math.max(0, Math.min(100, performanceScore));

  // 职业平衡性评分
  const pickRateDeviation =
    (Math.abs(hero.pickRate - classStats.averagePickRate) /
      Math.max(0.01, classStats.averagePickRate)) *
    100;
  const winRateDeviation = Math.abs(hero.winRate - classStats.averageWinRate);
  const classBalanceScore = Math.max(
    0,
    100 - (pickRateDeviation + winRateDeviation) / 2,
  );

  // 整体评分
  const overallScore = Math.round(
    attributeScore * 0.3 + performanceScore * 0.5 + classBalanceScore * 0.2,
  );

  // 6. 生成建议
  const recommendations: string[] = [];

  if (healthBalance.status !== "balanced") {
    recommendations.push(
      `${healthBalance.status === "overpowered" ? "降低" : "提高"}生命值至${Math.round(idealHealth)}左右`,
    );
  }
  if (attackBalance.status !== "balanced") {
    recommendations.push(
      `${attackBalance.status === "overpowered" ? "降低" : "提高"}攻击力至${Math.round(idealAttack)}左右`,
    );
  }
  if (defenseBalance.status !== "balanced") {
    recommendations.push(
      `${defenseBalance.status === "overpowered" ? "降低" : "提高"}防御力至${Math.round(idealDefense)}左右`,
    );
  }

  if (gamePerformance.winRate.status === "high") {
    recommendations.push("降低英雄强度，使其胜率保持在45%-55%之间");
  } else if (gamePerformance.winRate.status === "low") {
    recommendations.push("提高英雄强度，使其胜率保持在45%-55%之间");
  }

  if (gamePerformance.pickRate.status === "high") {
    recommendations.push("考虑调整英雄机制，降低其出场率");
  } else if (gamePerformance.pickRate.status === "low") {
    recommendations.push("增强英雄吸引力，提高其出场率");
  }

  if (gamePerformance.banRate.status === "high") {
    recommendations.push("降低英雄Ban率，使其保持在合理范围内");
  }

  if (classBalanceScore < 70) {
    recommendations.push(`使英雄表现更接近${hero.class}职业的平均水平`);
  }

  // 7. 构建分析结果
  return {
    hero,
    overallScore,
    attributeScore,
    performanceScore,
    classBalanceScore,
    healthBalance,
    attackBalance,
    defenseBalance,
    gamePerformance,
    classComparison: {
      averageClassPickRate: classStats.averagePickRate,
      averageClassWinRate: classStats.averageWinRate,
      averageClassBanRate: classStats.averageBanRate,
      deviationFromClassAvg: {
        pickRate: hero.pickRate - classStats.averagePickRate,
        winRate: hero.winRate - classStats.averageWinRate,
        banRate: hero.banRate - classStats.averageBanRate,
      },
    },
    recommendations,
  };
};

// 分析所有英雄的平衡性
export const analyzeAllHeroesBalance = (): HeroBalanceAnalysis[] => {
  return getHeroesFromStorage()
    .filter((hero) => hero.status === "released")
    .map((hero) => analyzeHeroBalance(hero));
};

// 获取平衡性警告列表
export const getBalanceWarnings = (): Array<{
  heroId: string;
  heroName: string;
  heroClass: string;
  warningType: "attribute" | "performance" | "class";
  severity: "low" | "medium" | "high";
  message: string;
}> => {
  const analyses = analyzeAllHeroesBalance();
  const warnings: Array<{
    heroId: string;
    heroName: string;
    heroClass: string;
    warningType: "attribute" | "performance" | "class";
    severity: "low" | "medium" | "high";
    message: string;
  }> = [];

  analyses.forEach((analysis) => {
    const hero = analysis.hero;

    // 检查属性警告
    if (analysis.attributeScore < 70) {
      warnings.push({
        heroId: hero.id,
        heroName: hero.name,
        heroClass: hero.class,
        warningType: "attribute",
        severity: analysis.attributeScore < 50 ? "high" : "medium",
        message: `${hero.name}的属性平衡性较差，评分：${analysis.attributeScore}`,
      });
    }

    // 检查表现警告
    if (analysis.performanceScore < 70) {
      warnings.push({
        heroId: hero.id,
        heroName: hero.name,
        heroClass: hero.class,
        warningType: "performance",
        severity: analysis.performanceScore < 50 ? "high" : "medium",
        message: `${hero.name}的游戏表现平衡性较差，评分：${analysis.performanceScore}`,
      });
    }

    // 检查胜率异常
    if (hero.winRate < 40 || hero.winRate > 60) {
      warnings.push({
        heroId: hero.id,
        heroName: hero.name,
        heroClass: hero.class,
        warningType: "performance",
        severity: "high",
        message: `${hero.name}的胜率异常：${hero.winRate.toFixed(1)}%，建议调整`,
      });
    }

    // 检查Ban率过高
    if (hero.banRate > 30) {
      warnings.push({
        heroId: hero.id,
        heroName: hero.name,
        heroClass: hero.class,
        warningType: "performance",
        severity: "high",
        message: `${hero.name}的Ban率过高：${hero.banRate.toFixed(1)}%，建议削弱`,
      });
    }

    // 检查职业平衡性
    if (analysis.classBalanceScore < 60) {
      warnings.push({
        heroId: hero.id,
        heroName: hero.name,
        heroClass: hero.class,
        warningType: "class",
        severity: "medium",
        message: `${hero.name}与同职业英雄相比表现差异较大，评分：${analysis.classBalanceScore}`,
      });
    }
  });

  return warnings;
};

// 调整英雄属性
export const adjustHeroAttributes = (
  heroId: string,
  adjustments: {
    health?: number;
    attack?: number;
    defense?: number;
  },
): Hero | null => {
  const heroes = getHeroesFromStorage();
  const heroIndex = heroes.findIndex((h) => h.id === heroId);

  if (heroIndex === -1) {
    return null;
  }

  const hero = heroes[heroIndex];

  // 应用调整
  if (adjustments.health !== undefined) {
    hero.stats.health = Math.max(1, hero.stats.health + adjustments.health);
  }
  if (adjustments.attack !== undefined) {
    hero.stats.attack = Math.max(1, hero.stats.attack + adjustments.attack);
  }
  if (adjustments.defense !== undefined) {
    hero.stats.defense = Math.max(1, hero.stats.defense + adjustments.defense);
  }

  // 保存调整后的英雄
  heroes[heroIndex] = hero;
  saveHeroesToStorage(heroes);

  return hero;
};

// 获取平衡性报告
export const getBalanceReport = (): {
  overallAverageScore: number;
  balancedHeroesCount: number;
  totalHeroesCount: number;
  classBalanceOverview: Record<
    string,
    {
      className: string;
      averageScore: number;
      heroCount: number;
    }
  >;
  topBalancedHeroes: Array<{
    heroName: string;
    heroClass: string;
    score: number;
  }>;
  leastBalancedHeroes: Array<{
    heroName: string;
    heroClass: string;
    score: number;
  }>;
  warnings: Array<{
    heroId: string;
    heroName: string;
    heroClass: string;
    warningType: "attribute" | "performance" | "class";
    severity: "low" | "medium" | "high";
    message: string;
  }>;
} => {
  const analyses = analyzeAllHeroesBalance();
  const totalHeroesCount = analyses.length;

  // 计算总体平均评分
  const overallAverageScore =
    totalHeroesCount > 0
      ? Math.round(
          analyses.reduce((sum, a) => sum + a.overallScore, 0) /
            totalHeroesCount,
        )
      : 0;

  // 计算平衡英雄数量（评分 >= 70）
  const balancedHeroesCount = analyses.filter(
    (a) => a.overallScore >= 70,
  ).length;

  // 计算职业平衡概览
  const classBalanceMap: Record<
    string,
    { totalScore: number; heroCount: number }
  > = {};

  analyses.forEach((analysis) => {
    const className = analysis.hero.class;
    if (!classBalanceMap[className]) {
      classBalanceMap[className] = { totalScore: 0, heroCount: 0 };
    }
    classBalanceMap[className].totalScore += analysis.overallScore;
    classBalanceMap[className].heroCount++;
  });

  const classBalanceOverview: Record<
    string,
    {
      className: string;
      averageScore: number;
      heroCount: number;
    }
  > = {};

  Object.entries(classBalanceMap).forEach(([className, data]) => {
    classBalanceOverview[className] = {
      className,
      averageScore: Math.round(data.totalScore / data.heroCount),
      heroCount: data.heroCount,
    };
  });

  // 找出平衡性最好和最差的英雄
  const sortedAnalyses = [...analyses].sort(
    (a, b) => b.overallScore - a.overallScore,
  );
  const topBalancedHeroes = sortedAnalyses.slice(0, 5).map((a) => ({
    heroName: a.hero.name,
    heroClass: a.hero.class,
    score: a.overallScore,
  }));

  const leastBalancedHeroes = sortedAnalyses
    .slice(-5)
    .reverse()
    .map((a) => ({
      heroName: a.hero.name,
      heroClass: a.hero.class,
      score: a.overallScore,
    }));

  // 获取警告列表
  const warnings = getBalanceWarnings();

  return {
    overallAverageScore,
    balancedHeroesCount,
    totalHeroesCount,
    classBalanceOverview,
    topBalancedHeroes,
    leastBalancedHeroes,
    warnings,
  };
};
