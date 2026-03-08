// 模拟系统相关类型定义

export interface SimulationState {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isPaused: boolean;
  currentTime: SimulationTime;
  startTime: SimulationTime;
  endTime: SimulationTime;
  durationDays: number;
  config: SimulationConfig;
  stats: SimulationStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimulationTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface SimulationConfig {
  timeScale: number;
  difficulty: "easy" | "normal" | "hard";
  startingFunds: number;
  startingLevel: number;
  enableRandomEvents: boolean;
  eventFrequency: number;
}

export interface SimulationStats {
  totalEvents: number;
  totalDecisions: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  averageDailyRevenue: number;
  currentFunds: number;
  currentLevel: number;
}

export interface SimulationDecision {
  id: string;
  type: string;
  title: string;
  description: string;
  options: SimulationDecisionOption[];
  deadline?: SimulationTime;
  priority: "low" | "medium" | "high";
}

export interface SimulationDecisionOption {
  id: string;
  text: string;
  cost: number;
  benefit: number;
  risk: number;
  description: string;
}

export interface SimulationEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: SimulationTime;
  impact: "low" | "medium" | "high";
  isActive: boolean;
  durationDays: number;
  effect: string;
  // 扩展事件属性
  category: string; // 事件分类
  severity: "low" | "medium" | "high" | "critical"; // 事件严重程度
  options: SimulationEventOption[]; // 事件选项
  effects: SimulationEventEffect[]; // 事件效果
  triggeredBy?: string; // 触发该事件的事件ID
  isResolved: boolean; // 事件是否已解决
  resolutionTime?: SimulationTime; // 事件解决时间
  resolution?: string; // 事件解决方式
}

export interface SimulationEventOption {
  id: string;
  text: string;
  description: string;
  requirements?: SimulationEventRequirement[]; // 选择该选项的要求
  effects: SimulationEventEffect[]; // 选择该选项的效果
  cost?: {
    money?: number;
    reputation?: number;
    popularity?: number;
  }; // 选择该选项的成本
  risk?: number; // 选择该选项的风险
  successRate?: number; // 选择该选项的成功率
}

export interface SimulationEventRequirement {
  type:
    | "money"
    | "reputation"
    | "popularity"
    | "level"
    | "heroCount"
    | "skinCount";
  value: number;
  operator: ">=" | "<=" | ">" | "<" | "==";
}

export interface SimulationEventEffect {
  type:
    | "money"
    | "reputation"
    | "popularity"
    | "wordOfMouth"
    | "exp"
    | "heroCount"
    | "skinCount"
    | "gameSpeed"
    | "eventFrequency";
  value: number;
  duration?: number; // 效果持续时间（天）
  isPermanent?: boolean; // 效果是否永久
}

export interface SimulationHero {
  id: string;
  name: string;
  level: number;
  experience: number;
  skills: SimulationHeroSkill[];
  attributes: SimulationHeroAttributes;
  status: "active" | "resting" | "injured" | "unavailable";
}

export interface SimulationHeroSkill {
  id: string;
  name: string;
  level: number;
  experience: number;
  description: string;
}

export interface SimulationHeroAttributes {
  strength: number;
  intelligence: number;
  agility: number;
  charisma: number;
}

// 游戏时间类型
export interface GameTime {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  second: number;
}

// 完整的模拟状态，包含所有相关数据
export interface SimulationFullState {
  id: string;
  name: string;
  state: SimulationState;
  config: SimulationConfig;
  stats: SimulationStats;
  currentTime: SimulationTime;
  startTime: SimulationTime;
  endTime: SimulationTime;
  isRunning: boolean;
  isPaused: boolean;
  decisions: SimulationDecision[];
  events: SimulationEvent[];
  heroes: SimulationHero[];
  createdAt: Date;
  updatedAt?: Date;
}
