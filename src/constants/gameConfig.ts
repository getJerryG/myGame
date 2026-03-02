// 游戏配置常量

export const GameConfig = {
  // 游戏基本信息
  Name: "Game Dev Simulator",
  Version: "1.0.0",
  Debug: true,

  // 时间配置
  TimeScale: 1,
  DaysPerSecond: 1,
  HoursPerDay: 24,
  MinutesPerHour: 60,
  SecondsPerMinute: 60,

  // 初始资源配置
  StartingFunds: 10000,
  StartingExp: 0,
  StartingLevel: 1,

  // 经验配置
  ExpMultiplier: 1.5,
  BaseExpForLevel: 100,

  // 资金配置
  FundsMultiplier: 2.0,
  BaseFundsForLevel: 5000,

  // 随机事件配置
  RandomEventProbability: 0.05,
  MaxActiveEvents: 5,
  EventDurationDays: 7,

  // 模拟配置
  SimulationMaxDays: 365,
  SimulationMinDays: 1,
  SimulationDefaultDays: 30,

  // 难度配置
  DifficultySettings: {
    easy: {
      expGain: 1.2,
      fundsGain: 1.2,
      eventFrequency: 0.3,
    },
    normal: {
      expGain: 1.0,
      fundsGain: 1.0,
      eventFrequency: 0.5,
    },
    hard: {
      expGain: 0.8,
      fundsGain: 0.8,
      eventFrequency: 0.7,
    },
  },

  // UI配置
  UiRefreshRate: 60,
  MaxNotifications: 5,
  NotificationDuration: 5000,

  // 存档配置
  AutoSaveIntervalMinutes: 10,
  MaxSaveSlots: 5,

  // 成就配置
  MaxAchievements: 100,

  // 职业配置
  MaxCareerLevels: 5,
  MaxSubLevels: 3,

  // 模拟速度配置
  SimulationSpeeds: [0.5, 1, 2, 5, 10],
  DefaultSimulationSpeed: 1,
} as const;
