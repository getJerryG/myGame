import { defineStore } from 'pinia';

// 定义英雄发展类型
interface Hero {
  id: string;
  name: string;
  type: 'game_designer' | 'programmer' | 'artist' | 'producer' | 'marketing';
  level: number;
  experience: number;
  experienceToNextLevel: number;
  skills: Array<{
    id: string;
    name: string;
    level: number;
    experience: number;
    maxLevel: number;
  }>;
  attributes: {
    creativity: number;
    technicalSkill: number;
    communication: number;
    leadership: number;
    problemSolving: number;
  };
  currentProject?: string;
  productivity: number;
  morale: number;
  trainingDays: number;
  lastTrained: number;
}

// 定义英雄发展状态类型
interface SimulationHeroDevelopmentState {
  // 英雄列表
  heroes: Hero[];
  // 英雄发展配置
  developmentConfig: {
    maxHeroes: number;
    baseExperienceToNextLevel: number;
    skillGrowthRate: number;
    attributeGrowthRate: number;
    maxSkillLevel: number;
  };
  // 技能配置
  skillConfig: Array<{
    id: string;
    name: string;
    type: 'creative' | 'technical' | 'managerial';
    description: string;
    baseExperienceToNextLevel: number;
  }>;
}

// 创建并导出英雄发展store
export const useSimulationHeroDevelopmentStore = defineStore('simulationHeroDevelopment', {
  state: (): SimulationHeroDevelopmentState => ({
    // 初始英雄列表
    heroes: [],
    // 初始英雄发展配置
    developmentConfig: {
      maxHeroes: 10,
      baseExperienceToNextLevel: 1000,
      skillGrowthRate: 0.1,
      attributeGrowthRate: 0.05,
      maxSkillLevel: 10,
    },
    // 初始技能配置
    skillConfig: [
      {
        id: 'skill_game_design',
        name: '游戏设计',
        type: 'creative',
        description: '设计游戏机制和玩法的能力',
        baseExperienceToNextLevel: 500,
      },
      {
        id: 'skill_programming',
        name: '编程',
        type: 'technical',
        description: '编写游戏代码的能力',
        baseExperienceToNextLevel: 600,
      },
      {
        id: 'skill_art',
        name: '美术',
        type: 'creative',
        description: '创建游戏美术资源的能力',
        baseExperienceToNextLevel: 500,
      },
      {
        id: 'skill_production',
        name: '项目管理',
        type: 'managerial',
        description: '管理游戏开发项目的能力',
        baseExperienceToNextLevel: 700,
      },
      {
        id: 'skill_marketing',
        name: '市场营销',
        type: 'managerial',
        description: '推广游戏的能力',
        baseExperienceToNextLevel: 600,
      },
    ],
  }),

  getters: {
    // 获取英雄总数
    totalHeroes: (state) => state.heroes.length,

    // 根据类型获取英雄
    getHeroesByType: (state) => (type: Hero['type']) => {
      return state.heroes.filter((hero) => hero.type === type);
    },

    // 获取最高等级英雄
    highestLevelHero: (state) => {
      if (state.heroes.length === 0) return null;
      return [...state.heroes].sort((a, b) => b.level - a.level)[0];
    },

    // 根据ID获取英雄
    getHeroById: (state) => (heroId: string) => {
      return state.heroes.find((hero) => hero.id === heroId);
    },
  },

  actions: {
    // 创建新英雄
    createHero(
      heroData: Omit<
        Hero,
        'id' | 'level' | 'experience' | 'experienceToNextLevel' | 'skills' | 'trainingDays' | 'lastTrained'
      >
    ) {
      if (this.heroes.length >= this.developmentConfig.maxHeroes) {
        throw new Error('已达到最大英雄数量限制');
      }

      // 为英雄分配基础技能
      const initialSkills = this.skillConfig.map((skill) => ({
        id: skill.id,
        name: skill.name,
        level: 1,
        experience: 0,
        maxLevel: this.developmentConfig.maxSkillLevel,
      }));

      const newHero: Hero = {
        ...heroData,
        id: `hero_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        level: 1,
        experience: 0,
        experienceToNextLevel: this.developmentConfig.baseExperienceToNextLevel,
        skills: initialSkills,
        trainingDays: 0,
        lastTrained: Date.now(),
      };

      this.heroes.push(newHero);
      return newHero;
    },

    // 为英雄添加经验值
    addHeroExperience(heroId: string, experience: number) {
      const hero = this.getHeroById(heroId);
      if (hero) {
        hero.experience += experience;

        // 检查是否升级
        while (hero.experience >= hero.experienceToNextLevel) {
          hero.experience -= hero.experienceToNextLevel;
          hero.level++;

          // 计算下一级所需经验
          hero.experienceToNextLevel = Math.round(
            this.developmentConfig.baseExperienceToNextLevel * Math.pow(1.1, hero.level - 1)
          );

          // 升级时随机提升属性
          Object.keys(hero.attributes).forEach((attr) => {
            const attribute = attr as keyof Hero['attributes'];
            hero.attributes[attribute] += this.developmentConfig.attributeGrowthRate;
          });
        }
      }
    },

    // 为技能添加经验值
    addSkillExperience(heroId: string, skillId: string, experience: number) {
      const hero = this.getHeroById(heroId);
      if (hero) {
        const skill = hero.skills.find((s) => s.id === skillId);
        if (skill && skill.level < this.developmentConfig.maxSkillLevel) {
          skill.experience += experience;

          // 检查技能是否升级
          const skillConfig = this.skillConfig.find((s) => s.id === skillId);
          if (skillConfig) {
            const skillExpToNextLevel = Math.round(
              skillConfig.baseExperienceToNextLevel * Math.pow(1.2, skill.level - 1)
            );

            if (skill.experience >= skillExpToNextLevel) {
              skill.experience -= skillExpToNextLevel;
              skill.level++;
            }
          }
        }
      }
    },

    // 训练英雄
    trainHero(heroId: string, days = 1) {
      const hero = this.getHeroById(heroId);
      if (hero) {
        hero.trainingDays += days;
        hero.lastTrained = Date.now();

        // 训练提升技能和属性
        const trainingExperience = days * 100;
        this.addHeroExperience(heroId, trainingExperience);

        // 随机提升一个技能
        const randomSkill = hero.skills[Math.floor(Math.random() * hero.skills.length)];
        this.addSkillExperience(heroId, randomSkill.id, trainingExperience * 0.5);

        // 提升士气
        hero.morale = Math.min(100, hero.morale + days * 2);
      }
    },

    // 更新英雄项目分配
    assignHeroToProject(heroId: string, projectId?: string) {
      const hero = this.getHeroById(heroId);
      if (hero) {
        hero.currentProject = projectId;
      }
    },

    // 重置英雄发展系统
    resetHeroDevelopmentSystem() {
      this.heroes = [];
      this.developmentConfig = {
        maxHeroes: 10,
        baseExperienceToNextLevel: 1000,
        skillGrowthRate: 0.1,
        attributeGrowthRate: 0.05,
        maxSkillLevel: 10,
      };
      // 技能配置保持不变，因为它们是固定的
    },
  },

  // 持久化存储
  persist: {
    key: 'simulation-hero-development',
    storage: localStorage,
  },
});
