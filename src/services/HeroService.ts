// 英雄定位类型
export interface HeroRole {
  id: string;
  name: string;
  icon: string;
}

// 英雄类型
export interface HeroType {
  id: string;
  name: string;
}

// 研发方式
export interface DevelopmentMethod {
  id: string;
  name: string;
}

// 英雄状态
export type HeroStatus = 'in_development' | 'online';

// 英雄对象
export interface Hero {
  id: string;
  name: string;
  icon: string;
  class: string;
  type: string;
  stats: {
    health: number;
    attack: number;
    defense: number;
  };
  description: string;
  createdAt: string;
  creationType: 'selfCreation' | 'collaboration';
  style: 'standard';
  developmentTime: number;
  developmentCost: number;
  developmentProgress: number;
  status: HeroStatus;
  pickRate: number;
  userBase: number;
  usageRate: number;
  winRate: number;
  banRate: number;
}

// 英雄服务类
export class HeroService {
  // 英雄定位列表
  static readonly heroRoles: HeroRole[] = [
    { id: "warrior", name: "战士", icon: "⚔️" },
    { id: "mage", name: "法师", icon: "🔮" },
    { id: "archer", name: "射手", icon: "🏹" },
    { id: "assassin", name: "刺客", icon: "🗡️" },
    { id: "tank", name: "坦克", icon: "🛡️" },
    { id: "support", name: "辅助", icon: "💚" },
  ];

  // 英雄类型列表
  static readonly heroTypes: HeroType[] = [
    { id: "physical", name: "物理" },
    { id: "magic", name: "法术" },
    { id: "hybrid", name: "混合" },
  ];

  // 研发方式列表
  static readonly developmentMethods: DevelopmentMethod[] = [
    { id: "self", name: "自研" },
    { id: "cooperation", name: "联动" },
  ];

  // 英雄名称列表
  private static readonly heroNames: string[] = [
    "李白", "韩信", "赵云", "孙悟空", "后羿", "鲁班七号", 
    "妲己", "王昭君", "貂蝉", "吕布", "关羽", "张飞", 
    "刘备", "曹操", "孙权"
  ];

  // 英雄图标列表
  private static readonly heroIcons: string[] = [
    "⚔️", "🛡️", "🔮", "🏹", "🗡️", "💚", "🦸", "🦹", 
    "🧙", "🧝", "🧛", "🧟"
  ];

  // 生成随机英雄名称
  static generateRandomHeroName(): string {
    return this.heroNames[Math.floor(Math.random() * this.heroNames.length)];
  }

  // 生成随机英雄图标
  static generateRandomIcon(): string {
    return this.heroIcons[Math.floor(Math.random() * this.heroIcons.length)];
  }

  // 根据定位id获取定位名称
  static getRoleName(roleId: string): string {
    const role = this.heroRoles.find((r) => r.id === roleId);
    return role ? role.name : "未知定位";
  }

  // 根据类型id获取类型名称
  static getTypeName(typeId: string): string {
    const type = this.heroTypes.find((t) => t.id === typeId);
    return type ? type.name : "未知类型";
  }

  // 创建英雄对象
  static createHero(roleId: string, typeId: string, methodId: string): Hero {
    const roleName = this.getRoleName(roleId);
    const heroName = this.generateRandomHeroName();
    
    return {
      id: Date.now().toString(),
      name: heroName,
      icon: this.generateRandomIcon(),
      class: roleId,
      stats: {
        health: 100,
        attack: 10,
        defense: 5,
      },
      description: `${heroName}是一个强大的${roleName}`,
      createdAt: new Date().toISOString(),
      creationType: methodId === "self" ? "selfCreation" : "collaboration",
      style: "standard",
      developmentTime: 30,
      developmentCost: 10000,
      developmentProgress: 0,
      status: "in_development",
      pickRate: 0.1,
      userBase: 0.1,
      usageRate: 0,
      winRate: 50,
      banRate: 0,
      type: typeId // 添加typeId的使用
    };
  }

  // 获取英雄状态文本
  static getStatusText(status: HeroStatus): string {
    return status === 'in_development' ? '研发中' : '已上线';
  }

  // 获取英雄状态样式类
  static getStatusClass(status: HeroStatus): string {
    return status === 'in_development' ? 'developing' : 'online';
  }

  // 更新英雄研发进度
  static updateDevelopmentProgress(hero: Hero, progress: number): Hero {
    return {
      ...hero,
      developmentProgress: Math.min(Math.max(progress, 0), 100),
      status: progress >= 100 ? 'online' : 'in_development'
    };
  }
}
