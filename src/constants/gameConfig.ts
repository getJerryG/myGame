// 游戏配置常量

export const GAME_CONFIG = {
  // 游戏基本信息
  NAME: 'Game Dev Simulator',
  VERSION: '1.0.0',
  DEBUG: true,

  // 时间配置
  TIME_SCALE: 1,
  DAYS_PER_SECOND: 1,
  HOURS_PER_DAY: 24,
  MINUTES_PER_HOUR: 60,
  SECONDS_PER_MINUTE: 60,

  // 初始资源配置
  STARTING_FUNDS: 10000,
  STARTING_EXP: 0,
  STARTING_LEVEL: 1,

  // 经验配置
  EXP_MULTIPLIER: 1.5,
  BASE_EXP_FOR_LEVEL: 100,

  // 资金配置
  FUNDS_MULTIPLIER: 2.0,
  BASE_FUNDS_FOR_LEVEL: 5000,

  // 随机事件配置
  RANDOM_EVENT_PROBABILITY: 0.05,
  MAX_ACTIVE_EVENTS: 5,
  EVENT_DURATION_DAYS: 7,

  // 模拟配置
  SIMULATION_MAX_DAYS: 365,
  SIMULATION_MIN_DAYS: 1,
  SIMULATION_DEFAULT_DAYS: 30,

  // 难度配置
  DIFFICULTY_SETTINGS: {
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
  UI_REFRESH_RATE: 60,
  MAX_NOTIFICATIONS: 5,
  NOTIFICATION_DURATION: 5000,

  // 存档配置
  AUTO_SAVE_INTERVAL_MINUTES: 10,
  MAX_SAVE_SLOTS: 5,

  // 成就配置
  MAX_ACHIEVEMENTS: 100,

  // 职业配置
  MAX_CAREER_LEVELS: 5,
  MAX_SUB_LEVELS: 3,

  // 模拟速度配置
  SIMULATION_SPEEDS: [0.5, 1, 2, 5, 10],
  DEFAULT_SIMULATION_SPEED: 1,
} as const;
