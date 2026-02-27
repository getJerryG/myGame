// 模拟报告类型定义

export interface DailyReport {
  day: number;
  date: string;
  money: number;
  reputation: number;
  popularity: number;
  wordOfMouth: number;
  heroCount: number;
  skinCount: number;
  ongoingProjects: number;
  activeEvents: number;
  dailyIncome: number;
}

export interface SimulationReport {
  reports: DailyReport[];
  totalDays: number;
  totalIncome: number;
  averagePopularity: number;
  averageWordOfMouth: number;
}
