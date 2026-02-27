// 模拟结果相关类型定义

export interface SimulationResults {
  id: string;
  simulationId: string;
  finalState: SimulationFinalState;
  metrics: SimulationPerformanceMetrics;
  keyEvents: SimulationKeyEvent[];
  timeline: SimulationTimelineEntry[];
}

export interface SimulationFinalState {
  status: 'completed' | 'failed' | 'aborted';
  reason: string;
  finalScore: number;
  finalLevel: number;
  finalFunds: number;
}

export interface SimulationPerformanceMetrics {
  totalDuration: number;
  averagePerformance: number;
  peakPerformance: number;
  resourceUtilization: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

export interface SimulationKeyEvent {
  id: string;
  timestamp: Date;
  type: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
}

export interface SimulationTimelineEntry {
  timestamp: Date;
  event: string;
  value: number;
  category: string;
}
