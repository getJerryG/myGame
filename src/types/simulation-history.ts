// 模拟历史记录类型定义

export interface SimulationHistoryEntry {
  id: string;
  timestamp: number;
  day: number;
  event: string;
  description: string;
  effects: {
    money?: number;
    reputation?: number;
    popularity?: number;
    wordOfMouth?: number;
  };
}

export interface SimulationHistory {
  entries: SimulationHistoryEntry[];
  currentDay: number;
}
