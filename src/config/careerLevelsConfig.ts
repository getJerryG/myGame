// 职业等级配置

export interface CareerLevel {
  name: string;
  subLevels: Array<{
    name: string;
    expRequired: number;
    salary: number;
    description: string;
  }>;
}

export const careerLevelsConfig: CareerLevel[] = [
  {
    name: '初级策划',
    subLevels: [
      {
        name: 'I',
        expRequired: 100,
        salary: 5000,
        description: '入门级策划，了解游戏开发基本流程',
      },
      {
        name: 'II',
        expRequired: 300,
        salary: 6000,
        description: '掌握基础策划技能，能够完成简单任务',
      },
      {
        name: 'III',
        expRequired: 600,
        salary: 7000,
        description: '熟练掌握策划技能，能够独立完成任务',
      },
    ],
  },
  {
    name: '中级策划',
    subLevels: [
      {
        name: 'I',
        expRequired: 1000,
        salary: 8000,
        description: '能够带领小型团队完成项目',
      },
      {
        name: 'II',
        expRequired: 1500,
        salary: 9000,
        description: '具备丰富的策划经验，能够解决复杂问题',
      },
      {
        name: 'III',
        expRequired: 2100,
        salary: 10000,
        description: '能够独立负责中型项目的策划工作',
      },
    ],
  },
  {
    name: '高级策划',
    subLevels: [
      {
        name: 'I',
        expRequired: 2800,
        salary: 12000,
        description: '能够负责大型项目的策划工作',
      },
      {
        name: 'II',
        expRequired: 3600,
        salary: 14000,
        description: '具备优秀的策划能力和领导力',
      },
      {
        name: 'III',
        expRequired: 4500,
        salary: 16000,
        description: '行业资深策划，能够制定游戏整体规划',
      },
    ],
  },
  {
    name: '资深策划',
    subLevels: [
      {
        name: 'I',
        expRequired: 5500,
        salary: 18000,
        description: '能够领导策划团队，制定战略规划',
      },
      {
        name: 'II',
        expRequired: 6600,
        salary: 20000,
        description: '行业专家，能够推动游戏行业发展',
      },
      {
        name: 'III',
        expRequired: 7800,
        salary: 22000,
        description: '顶尖策划，能够创造具有影响力的游戏',
      },
    ],
  },
  {
    name: '首席策划',
    subLevels: [
      {
        name: 'I',
        expRequired: 9100,
        salary: 25000,
        description: '公司核心策划，负责游戏产品线规划',
      },
      {
        name: 'II',
        expRequired: 10500,
        salary: 28000,
        description: '游戏行业领袖，具有广泛的影响力',
      },
      {
        name: 'III',
        expRequired: 12000,
        salary: 32000,
        description: '传奇策划，创造了多个经典游戏作品',
      },
    ],
  },
];
