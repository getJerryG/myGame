// 模拟阶段类型定义

export type SimulationStageType =
  | 'setup'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed';

export interface SimulationStage {
  id: string;
  name: string;
  type: SimulationStageType;
  startTime: number;
  endTime?: number;
  progress: number;
  description: string;
}

export interface SimulationStageConfig {
  stages: SimulationStage[];
  currentStageId: string;
  canProceed: boolean;
  canGoBack: boolean;
}
