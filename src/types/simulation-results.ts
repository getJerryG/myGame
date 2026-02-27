// 模拟结果类型定义

export interface SimulationResult {
  id: string;
  timestamp: number;
  duration: number;
  finalScore: number;
  money: number;
  reputation: number;
  popularity: number;
  wordOfMouth: number;
  achievements: string[];
}

export interface SimulationResults {
  results: SimulationResult[];
  bestScore: number;
  totalSimulations: number;
}
