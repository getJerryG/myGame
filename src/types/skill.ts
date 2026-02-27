// 技能相关类型定义

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: string;
  level: number;
  maxLevel: number;
  experience: number;
  nextLevelExperience: number;
  effects: SkillEffect[];
  requirements: SkillRequirement[];
}

export interface SkillEffect {
  id: string;
  type: string;
  value: number;
  description: string;
  duration?: number;
  isPassive: boolean;
}

export interface SkillRequirement {
  id: string;
  type: string;
  value: number;
  description: string;
}

export interface SkillTree {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
  connections: SkillConnection[];
}

export interface SkillConnection {
  fromSkillId: string;
  toSkillId: string;
  type: string;
}
