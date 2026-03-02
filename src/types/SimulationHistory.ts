// 模拟历史数据相关类型定义

export interface SimulationHistoryEntry {
  id: string;
  simulationId: string;
  timestamp: Date;
  eventType: string;
  eventData: Record<string, unknown>;
  outcome: string;
  playerAction?: string;
}

export interface SimulationHistory {
  entries: SimulationHistoryEntry[];
  totalEntries: number;
  currentPage: number;
  pageSize: number;
}

export interface SimulationHistoryFilter {
  eventTypes?: string[];
  startDate?: Date;
  endDate?: Date;
  outcome?: string;
}
