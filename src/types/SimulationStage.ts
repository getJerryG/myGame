// 模拟阶段相关类型定义

export interface SimulationStage {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  startDate: Date;
  endDate: Date;
  status: "pending" | "active" | "completed";
  goals: SimulationStageGoal[];
  events: SimulationStageEvent[];
}

export interface SimulationStageGoal {
  id: string;
  name: string;
  description: string;
  targetValue: number;
  actualValue: number;
  isCompleted: boolean;
  priority: "low" | "medium" | "high";
}

export interface SimulationStageEvent {
  id: string;
  name: string;
  type: string;
  probability: number;
  triggerCondition: string;
  effect: string;
  startTime: Date;
  endTime: Date;
}
