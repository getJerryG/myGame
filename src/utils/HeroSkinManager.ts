// 英雄-皮肤关联管理模块
import type { SkinIndicatorConfig, SimulateResult } from './SkinSimulation';
import { calculateSkinMarketData } from './SkinSimulation';
import skinSimulationConfig from '../config/SkinSimulateConfig';

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
  status: 'in_development' | 'released' | 'deprecated'; // 英雄状态
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
  status: 'in_development' | 'released' | 'deprecated'; // 皮肤状态
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
const HEROES_STORAGE_KEY = 'hero-development-heroes';
const SKINS_STORAGE_KEY = 'skin-development-skins';

// 皮肤品质分类
export const SKIN_RARITIES = [
  { id: '伴生', name: '伴生', color: '#9E9E9E', baseCost: 0, basePrice: 288 },
  { id: '勇气', name: '勇气', color: '#4CAF50', baseCost: 200, basePrice: 588 },
  { id: '史诗', name: '史诗', color: '#2196F3', baseCost: 500, basePrice: 888 },
  {
    id: '传说',
    name: '传说',
    color: '#FF9800',
    baseCost: 1000,
    basePrice: 1688,
  },
  {
    id: '珍品限定',
    name: '珍品限定',
    color: '#F44336',
    baseCost: 1500,
    basePrice: 1988,
  },
  {
    id: '无双限定',
    name: '无双限定',
    color: '#270200',
    baseCost: 2000,
    basePrice: 2288,
  },
  {
    id: '皮肤无双限定',
    name: '皮肤无双限定',
    color: '#FF5722',
    baseCost: 3000,
    basePrice: 2588,
  },
] as const;

// 创作类型与皮肤品质关联
const CREATION_TYPE_RARITY_MAP = {
  自己创作: {
    cost: 400,
    color: '#4CAF50',
    availableRarities: ['伴生', '勇气', '史诗'],
  },
  合作创作: {
    cost: 500,
    color: '#2196F3',
    availableRarities: ['勇气', '史诗', '传说'],
  },
  聘请大师: {
    cost: 1500,
    color: '#FF9800',
    availableRarities: ['传说', '无双限定'],
  },
  特邀大师: {
    cost: 3000,
    color: '#F44336',
    availableRarities: ['珍品限定', '无双限定', '珍品无双限定'],
  },
} as const;

// 从本地存储获取英雄列表
export const getHeroesFromStorage = (): Hero[] => {
  try {
    const heroesJson = localStorage.getItem(HEROES_STORAGE_KEY);
    return heroesJson ? JSON.parse(heroesJson) : [];
  } catch (error) {
    console.error('Failed to get heroes from storage:', error);
    return [];
  }
};

// 从本地存储获取皮肤列表
export const getSkinsFromStorage = (): Skin[] => {
  try {
    const skinsJson = localStorage.getItem(SKINS_STORAGE_KEY);
    return skinsJson ? JSON.parse(skinsJson) : [];
  } catch (error) {
    console.error('Failed to get skins from storage:', error);
    return [];
  }
};

// 保存英雄列表到本地存储
export const saveHeroesToStorage = (heroes: Hero[]): void => {
  try {
    localStorage.setItem(HEROES_STORAGE_KEY, JSON.stringify(heroes));
  } catch (error) {
    console.error('Failed to save heroes to storage:', error);
  }
};

// 保存皮肤列表到本地存储
export const saveSkinsToStorage = (skins: Skin[]): void => {
  try {
    localStorage.setItem(SKINS_STORAGE_KEY, JSON.stringify(skins));
  } catch (error) {
    console.error('Failed to save skins to storage:', error);
  }
};

// 检查英雄是否存在
export const isHeroExists = (heroName: string): boolean => {
  const heroes = getHeroesFromStorage();
  return heroes.some((hero) => hero.name === heroName);
};

// 检查皮肤品质是否合法
export const isValidSkinRarity = (rarity: string): boolean => {
  return SKIN_RARITIES.some((skinRarity) => skinRarity.id === rarity);
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
const canCreateSkinWithRarity = (creationType: string, rarity: string, heroCount: number): boolean => {
  // 获取该创作类型允许的皮肤品质
  const creationTypeConfig = CREATION_TYPE_RARITY_MAP[creationType as keyof typeof CREATION_TYPE_RARITY_MAP];
  if (!creationTypeConfig) return false;

  // 检查是否允许该品质的皮肤
  const allowedRarity = creationTypeConfig.availableRarities.find((allowed) => allowed === rarity);
  if (!allowedRarity) {
    return false;
  }

  // 检查英雄数量是否满足要求
  const rarityConfig =
    skinSimulationConfig.rarityPermissions[rarity as keyof typeof skinSimulationConfig.rarityPermissions];
  if (rarityConfig && heroCount < rarityConfig.requiredHeroCount) {
    return false;
  }

  return true;
};

// 创建皮肤前的验证
export const validateSkinCreation = (
  skinData: Omit<Skin, 'id' | 'createdAt'>
): {
  valid: boolean;
  message: string;
} => {
  // 1. 验证英雄是否存在
  if (!isHeroExists(skinData.heroName)) {
    return {
      valid: false,
      message: '所属英雄不存在，请先创建英雄',
    };
  }

  // 2. 验证皮肤品质是否合法
  if (!isValidSkinRarity(skinData.rarity)) {
    return {
      valid: false,
      message: '无效的皮肤品质',
    };
  }

  // 3. 获取当前英雄数量
  const heroCount = getHeroesFromStorage().length;

  // 4. 验证创作类型是否允许创作该品质的皮肤，以及英雄数量是否满足要求
  if (!canCreateSkinWithRarity(skinData.creationType, skinData.rarity, heroCount)) {
    const rarityConfig =
      skinSimulationConfig.rarityPermissions[skinData.rarity as keyof typeof skinSimulationConfig.rarityPermissions];
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
    message: '验证通过',
  };
};

// 创建皮肤
export const createSkin = (skinData: Omit<Skin, 'id' | 'createdAt'>): Skin => {
  // 生成唯一ID
  const id = `skin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 根据皮肤品质获取基础研发时间和成本
  const rarityConfig = SKIN_RARITIES.find(rarity => rarity.id === skinData.rarity);
  const baseDevelopmentTime = rarityConfig ? 
    (rarityConfig.id === '传说' || rarityConfig.id === '无双限定' ? 30 : 
     rarityConfig.id === '史诗' ? 20 : 
     rarityConfig.id === '勇气' ? 15 : 10) : 10;
  const baseDevelopmentCost = rarityConfig ? rarityConfig.baseCost * 100 : 2000;

  // 根据创作类型调整研发时间和成本
  const creationTypeConfig = CREATION_TYPE_RARITY_MAP[skinData.creationType as keyof typeof CREATION_TYPE_RARITY_MAP];
  const timeMultiplier = creationTypeConfig ? 
    (skinData.creationType === '自己创作' ? 1.5 : 
     skinData.creationType === '合作创作' ? 1.0 : 
     skinData.creationType === '聘请大师' ? 0.7 : 0.5) : 1.0;
  const costMultiplier = creationTypeConfig ? 
    (skinData.creationType === '自己创作' ? 0.8 : 
     skinData.creationType === '合作创作' ? 1.0 : 
     skinData.creationType === '聘请大师' ? 1.5 : 2.0) : 1.0;

  // 计算最终研发时间和成本
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
    status: 'in_development',
    // 销量相关字段
    sales: {
      daily: 0,
      total: 0
    }
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
    console.warn('没有英雄数据，无法创建皮肤');
    return;
  }

  const skins = getSkinsFromStorage();

  for (let i = 0; i < count; i++) {
    const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
    const randomRarity = SKIN_RARITIES[Math.floor(Math.random() * SKIN_RARITIES.length)];
    const randomCreationType =
      Object.keys(CREATION_TYPE_RARITY_MAP)[Math.floor(Math.random() * Object.keys(CREATION_TYPE_RARITY_MAP).length)];

    // 验证是否可以创建该皮肤
    const skinData = {
      name: `${randomHero.name}皮肤${i + 1}`,
      icon: '🧱',
      heroName: randomHero.name,
      rarity: randomRarity.id,
      price: randomRarity.basePrice,
      effects: Math.floor(Math.random() * 100),
      description: `${randomHero.name}的${randomRarity.name}皮肤，具有独特的外观和效果`,
      creationType: randomCreationType,
      style: 'standard',
      designFit: Math.random(),
      scarcity: Math.random(),
      costEffectiveness: Math.random(),
      obtainDifficulty: Math.random(),
      communityHeat: Math.random(),
      negativePublicOpinion: Math.random(),
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
export const getAllSkinMarketData = (): Array<{ skin: Skin; marketData: SimulateResult }> => {
  return getSkinsFromStorage()
    .filter((skin) => skin.marketSimulation)
    .map((skin) => ({
      skin,
      marketData: skin.marketSimulation!,
    }));
};

// 验证英雄是否可以创建指定品质的皮肤（基于英雄数量）
export const validateHeroSkinCreation = (heroCount: number, rarity: string): boolean => {
  const rarityConfig = 
    skinSimulationConfig.rarityPermissions[rarity as keyof typeof skinSimulationConfig.rarityPermissions];
  return !rarityConfig || heroCount >= rarityConfig.requiredHeroCount;
};

// 推进研发进度
export const advanceDevelopment = (id: string, isHero: boolean = false): void => {
  if (isHero) {
    // 推进英雄研发进度
    const heroes = getHeroesFromStorage();
    const heroIndex = heroes.findIndex(hero => hero.id === id);
    
    if (heroIndex !== -1 && heroes[heroIndex].status === 'in_development') {
      // 每天推进的进度 = 100 / 研发时间
      const dailyProgress = 100 / heroes[heroIndex].developmentTime;
      heroes[heroIndex].developmentProgress = Math.min(100, heroes[heroIndex].developmentProgress + dailyProgress);
      
      // 如果研发完成，将状态改为已发布
      if (heroes[heroIndex].developmentProgress >= 100) {
        heroes[heroIndex].status = 'released';
        heroes[heroIndex].developmentProgress = 100;
      }
      
      saveHeroesToStorage(heroes);
    }
  } else {
    // 推进皮肤研发进度
    const skins = getSkinsFromStorage();
    const skinIndex = skins.findIndex(skin => skin.id === id);
    
    if (skinIndex !== -1 && skins[skinIndex].status === 'in_development') {
      // 每天推进的进度 = 100 / 研发时间
      const dailyProgress = 100 / skins[skinIndex].developmentTime;
      skins[skinIndex].developmentProgress = Math.min(100, skins[skinIndex].developmentProgress + dailyProgress);
      
      // 如果研发完成，将状态改为已发布并计算初始销量
      if (skins[skinIndex].developmentProgress >= 100) {
        skins[skinIndex].status = 'released';
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

// 计算皮肤初始销量
export const calculateSkinInitialSales = (skin: Skin, hero: Hero): void => {
  // 初始销量公式：英雄用户基数 × 英雄出场率 × 皮肤吸引力 × 价格系数 × 品质系数
  
  // 皮肤吸引力：基于设计契合度、稀缺感、社群讨论度等因素计算
  const skinAttraction = (skin.designFit + skin.scarcity + skin.communityHeat) / 3;
  
  // 价格系数：价格越高，系数越低（防止价格过高导致销量过低）
  const priceCoeff = Math.max(0.1, 1 - (skin.price - 200) / 10000);
  
  // 品质系数：不同品质的皮肤有不同的系数
  const rarityCoeff = SKIN_RARITIES.find(rarity => rarity.id === skin.rarity) ? 
    (skin.rarity === '传说' || skin.rarity === '无双限定' ? 1.5 : 
     skin.rarity === '史诗' ? 1.2 : 
     skin.rarity === '勇气' ? 1.0 : 0.8) : 0.8;
  
  // 计算初始销量（总销量）
  const initialTotalSales = Math.floor(100000 * hero.userBase * hero.pickRate * skinAttraction * priceCoeff * rarityCoeff);
  
  // 计算初始日销量（总销量的10%）
  const initialDailySales = Math.floor(initialTotalSales * 0.1);
  
  // 更新皮肤销量数据
  skin.sales = {
    daily: initialDailySales,
    total: initialTotalSales
  };
};

// 计算皮肤每日销量
export const calculateSkinDailySales = (skin: Skin, hero: Hero, gamePopularity: number, gameWordOfMouth: number): void => {
  if (skin.status !== 'released') return;
  
  // 每日销量公式：基础销量 × 热度系数 × 口碑系数 × 英雄表现系数 × 时间衰减系数
  
  // 基础销量：基于初始销量和当前状态计算
  const baseDailySales = skin.sales.daily;
  
  // 热度系数：游戏热度越高，销量越高
  const popularityCoeff = Math.max(0.5, gamePopularity / 100);
  
  // 口碑系数：游戏口碑越好，销量越高
  const wordOfMouthCoeff = Math.max(0.5, gameWordOfMouth / 100);
  
  // 英雄表现系数：英雄使用率和胜率越高，皮肤销量越高
  const heroPerformanceCoeff = Math.max(0.5, (hero.usageRate + hero.winRate) / 200);
  
  // 时间衰减系数：皮肤发布时间越长，销量越低
  const releaseDate = new Date(skin.createdAt);
  const currentDate = new Date();
  const daysSinceRelease = Math.floor((currentDate.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24));
  const timeDecayCoeff = Math.max(0.3, 1 - (daysSinceRelease / 365));
  
  // 计算当日销量
  const dailySales = Math.floor(baseDailySales * popularityCoeff * wordOfMouthCoeff * heroPerformanceCoeff * timeDecayCoeff);
  
  // 更新皮肤销量数据
  skin.sales.daily = dailySales;
  skin.sales.total += dailySales;
};

// 批量计算所有已发布皮肤的每日销量
export const calculateAllSkinDailySales = (gamePopularity: number, gameWordOfMouth: number): void => {
  const skins = getSkinsFromStorage();
  const heroes = getHeroesFromStorage();
  
  skins.forEach(skin => {
    if (skin.status === 'released') {
      const hero = heroes.find(h => h.name === skin.heroName);
      if (hero) {
        calculateSkinDailySales(skin, hero, gamePopularity, gameWordOfMouth);
      }
    }
  });
  
  saveSkinsToStorage(skins);
};

// 获取所有正在研发的项目（英雄和皮肤）
export const getInDevelopmentProjects = (): { type: 'hero' | 'skin'; item: Hero | Skin }[] => {
  const heroes = getHeroesFromStorage().filter(hero => hero.status === 'in_development');
  const skins = getSkinsFromStorage().filter(skin => skin.status === 'in_development');
  
  const projects: { type: 'hero' | 'skin'; item: Hero | Skin }[] = [];
  
  // 添加英雄项目
  heroes.forEach(hero => {
    projects.push({
      type: 'hero',
      item: hero
    });
  });
  
  // 添加皮肤项目
  skins.forEach(skin => {
    projects.push({
      type: 'skin',
      item: skin
    });
  });
  
  // 按研发进度排序
  return projects.sort((a, b) => {
    const progressA = a.type === 'hero' ? (a.item as Hero).developmentProgress : (a.item as Skin).developmentProgress;
    const progressB = b.type === 'hero' ? (b.item as Hero).developmentProgress : (b.item as Skin).developmentProgress;
    return progressA - progressB;
  });
};

// 创建皮肤前的验证（简化版，只验证必要条件）
export const validateSimpleSkinCreation = (
  skinData: Pick<Skin, 'heroName' | 'rarity' | 'creationType'>,
  heroCount: number
): {
  valid: boolean;
  message: string;
} => {
  // 1. 验证英雄是否存在
  if (!isHeroExists(skinData.heroName)) {
    return {
      valid: false,
      message: '所属英雄不存在，请先创建英雄',
    };
  }

  // 2. 验证皮肤品质是否合法
  if (!isValidSkinRarity(skinData.rarity)) {
    return {
      valid: false,
      message: '无效的皮肤品质',
    };
  }

  // 3. 验证英雄数量是否满足要求
  const rarityConfig =
    skinSimulationConfig.rarityPermissions[skinData.rarity as keyof typeof skinSimulationConfig.rarityPermissions];
  if (rarityConfig && heroCount < rarityConfig.requiredHeroCount) {
    return {
      valid: false,
      message: `创作${skinData.rarity}品质的皮肤需要至少${rarityConfig.requiredHeroCount}个英雄`,
    };
  }

  // 4. 验证创作类型是否允许创作该品质的皮肤
  const creationTypeConfig = CREATION_TYPE_RARITY_MAP[skinData.creationType as keyof typeof CREATION_TYPE_RARITY_MAP];
  const allowedRarity = creationTypeConfig?.availableRarities.find((allowed) => allowed === skinData.rarity);
  if (!allowedRarity) {
    return {
      valid: false,
      message: `该创作类型不允许创作${skinData.rarity}品质的皮肤`,
    };
  }

  return {
    valid: true,
    message: '验证通过',
  };
};
