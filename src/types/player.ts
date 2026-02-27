// 玩家相关类型定义

export interface PlayerAttributes {
  strength: number;
  intelligence: number;
  agility: number;
  charisma: number;
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
