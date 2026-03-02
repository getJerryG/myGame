// 任务配置

export interface TaskConfig {
  id: string;
  name: string;
  description: string;
  type: "daily" | "weekly" | "monthly" | "achievement";
  difficulty: "easy" | "normal" | "hard" | "expert";
  expReward: number;
  fundsReward: number;
  requirements: Array<{
    type: string;
    value: number;
  }>;
  objectives: Array<{
    type: string;
    target: number;
  }>;
  isRepeatable: boolean;
  cooldownHours: number;
}

export const tasksConfig: TaskConfig[] = [
  {
    id: "daily-001",
    name: "每日签到",
    description: "每天登录游戏即可完成",
    type: "daily",
    difficulty: "easy",
    expReward: 50,
    fundsReward: 100,
    requirements: [],
    objectives: [
      {
        type: "login",
        target: 1,
      },
    ],
    isRepeatable: true,
    cooldownHours: 24,
  },
  {
    id: "daily-002",
    name: "完成一次模拟",
    description: "运行一次完整的游戏模拟",
    type: "daily",
    difficulty: "normal",
    expReward: 150,
    fundsReward: 300,
    requirements: [],
    objectives: [
      {
        type: "complete_simulation",
        target: 1,
      },
    ],
    isRepeatable: true,
    cooldownHours: 24,
  },
  {
    id: "weekly-001",
    name: "完成5次模拟",
    description: "一周内完成5次游戏模拟",
    type: "weekly",
    difficulty: "normal",
    expReward: 500,
    fundsReward: 1000,
    requirements: [],
    objectives: [
      {
        type: "complete_simulation",
        target: 5,
      },
    ],
    isRepeatable: true,
    cooldownHours: 168,
  },
  {
    id: "monthly-001",
    name: "获得10000经验",
    description: "一个月内获得10000经验值",
    type: "monthly",
    difficulty: "hard",
    expReward: 2000,
    fundsReward: 5000,
    requirements: [],
    objectives: [
      {
        type: "gain_exp",
        target: 10000,
      },
    ],
    isRepeatable: true,
    cooldownHours: 720,
  },
  {
    id: "achievement-001",
    name: "首次升级",
    description: "将角色等级提升到2级",
    type: "achievement",
    difficulty: "easy",
    expReward: 300,
    fundsReward: 500,
    requirements: [],
    objectives: [
      {
        type: "reach_level",
        target: 2,
      },
    ],
    isRepeatable: false,
    cooldownHours: 0,
  },
  {
    id: "achievement-002",
    name: "百万富翁",
    description: "拥有100万游戏资金",
    type: "achievement",
    difficulty: "hard",
    expReward: 5000,
    fundsReward: 10000,
    requirements: [],
    objectives: [
      {
        type: "reach_funds",
        target: 1000000,
      },
    ],
    isRepeatable: false,
    cooldownHours: 0,
  },
];
