// 导出应用相关类型
export * from "./app";

// 导出游戏相关类型
export * from "./game";

// 导出抽奖相关类型
export * from "./lottery";

// 导出模态框相关类型
export * from "./modal";

// 导出玩家相关类型
export * from "./player";

// 导出模拟相关类型
export * from "./simulation";
export * from "./simulation-history";
export * from "./simulation-report";
export * from "./simulation-results";
export * from "./simulation-stage";

// 导出技能相关类型
export * from "./skill";

// 添加缺失的类型定义
export interface GameTime {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  second: number;
}

export interface EventEffect {
  type: string;
  value: number;
  duration: number;
}

export interface GameEvent {
  id: string;
  type: string;
  name: string;
  description: string;
  effects: EventEffect[];
  probability: number;
  timestamp: number;
  triggeredBy?: string;
  conditions?: any[];
}

export interface BusinessData {
  downloads: number;
  activeUsers: number;
  revenue: number;
  marketShare: number;
  retentionRate: number;
  averagePlayTime: number;
  dailyGrowthRate: number;
  rating: number;
  feedbackCount: number;
  timestamp: number;
  date: string;
  hour: number;
  minute: number;
}

export interface GameReleaseData {
  id: string;
  name: string;
  version: string;
  status: string;
  createdAt: number;
  plannedReleaseDate?: number;
  type: string;
  description: string;
}

export interface GameReleaseResult {
  success: boolean;
  message: string;
  releaseId: string;
  timestamp: number;
  details: {
    downloaded: number;
    activeUsers: number;
    revenue: number;
  };
}
