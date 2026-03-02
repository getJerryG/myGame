// 模拟报告相关类型定义

export interface SimulationReport {
  id: string;
  simulationId: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  metrics: SimulationMetrics;
  insights: SimulationInsight[];
  recommendations: SimulationRecommendation[];
}

export interface SimulationMetrics {
  totalDays: number;
  totalEvents: number;
  totalRevenue: number;
  averageDailyRevenue: number;
  peakUsers: number;
  averageDailyUsers: number;
  retentionRate: number;
  conversionRate: number;
}

export interface SimulationInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  timestamp: Date;
}

export interface SimulationRecommendation {
  id: string;
  insightId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  expectedImpact: string;
}
