// 玩家相关类型定义
import type { Skill } from "./skill";
import type { CharacterStatus } from "../models/Character";

export interface PlayerAttributes {
  strength: number;
  intelligence: number;
  agility: number;
  charisma: number;
}

// 角色状态接口
export interface CharacterState {
  id: string;
  name: string;
  level: number;
  experience: number;
  nextLevelExperience: number;
  attributes: PlayerAttributes;
  stats: PlayerStats;
  career: PlayerCareer;
  skills: Skill[];
  status: CharacterStatus;
  funds: number;
  createdAt: Date;
  updatedAt: Date;
}

// 玩家完整状态接口
export interface PlayerFullState extends CharacterState {
  playerState: PlayerState;
  inventory: Record<string, number>;
  achievements: string[];
  currentObjective: string | null;
  completedObjectives: string[];
}

export interface PlayerStats {
  level: number;
  exp: number;
  nextLevelExp: number;
  funds: number;
  health: number;
  maxHealth: number;
}

export interface PlayerState {
  id: string;
  name: string;
  attributes: PlayerAttributes;
  stats: PlayerStats;
  isAlive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerCareer {
  title: string;
  level: number;
  subLevel: number;
  titleName: string;
  subLevelName: string;
}
