// 游戏事件相关类型定义

export interface EventEffect {
  type: string;
  value: number;
  duration: number;
}

export interface EventCondition {
  type: string;
  value: unknown;
  operator: string;
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
  conditions?: EventCondition[];
}
