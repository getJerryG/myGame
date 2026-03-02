// 模拟系统配置常量

export const SIMULATION_CONFIG = {
  // 模拟类型
  SIMULATION_TYPES: {
    GAME_DEV: 'game_dev',
    MARKET_ANALYSIS: 'market_analysis',
    RISK_ASSESSMENT: 'risk_assessment',
    STRATEGY_PLANNING: 'strategy_planning',
  },

  // 市场配置
  MARKET_CONFIG: {
    MAX_PLAYERS: 1000000,
    MIN_PLAYERS: 1000,
    DEFAULT_PLAYERS: 100000,
    PLAYER_GROWTH_RATE: 0.05,
    PLAYER_RETENTION_RATE: 0.85,

    // 市场情绪配置
    MARKET_SENTIMENT_LEVELS: {
      VERY_NEGATIVE: -2,
      NEGATIVE: -1,
      NEUTRAL: 0,
      POSITIVE: 1,
      VERY_POSITIVE: 2,
    },

    // 市场波动配置
    MARKET_VOLATILITY: 0.1,
    MAX_MARKET_SWING: 0.2,

    // 竞争配置
    MAX_COMPETITORS: 10,
    COMPETITOR_GROWTH_RATE: 0.03,
    COMPETITOR_INNOVATION_RATE: 0.02,
  },

  // 游戏开发配置
  GAME_DEV_CONFIG: {
    // 开发阶段
    DEV_PHASES: {
      CONCEPT: 'concept',
      DESIGN: 'design',
      DEVELOPMENT: 'development',
      TESTING: 'testing',
      LAUNCH: 'launch',
      POST_LAUNCH: 'post_launch',
    },

    // 开发时间
    PHASE_DURATION_DAYS: {
      concept: 7,
      design: 14,
      development: 60,
      testing: 30,
      launch: 7,
      post_launch: 90,
    },

    // 开发成本
    PHASE_COST_MULTIPLIER: {
      concept: 0.1,
      design: 0.2,
      development: 0.4,
      testing: 0.15,
      launch: 0.1,
      post_launch: 0.05,
    },

    // 质量配置
    QUALITY_LEVELS: {
      POOR: 1,
      AVERAGE: 2,
      GOOD: 3,
      EXCELLENT: 4,
      MASTERPIECE: 5,
    },

    // 创新配置
    INNOVATION_LEVELS: {
      LOW: 1,
      MEDIUM: 2,
      HIGH: 3,
      GROUNDBREAKING: 4,
    },

    // 游戏类型
    GAME_GENRES: [
      'Action',
      'Adventure',
      'RPG',
      'Strategy',
      'Simulation',
      'Puzzle',
      'Sports',
      'Racing',
      'Fighting',
      'Horror',
      'Sandbox',
      'MOBA',
      'Battle Royale',
    ],

    // 平台配置
    PLATFORMS: ['PC', 'Console', 'Mobile', 'Web', 'VR/AR'],
  },

  // 财务配置
  FINANCIAL_CONFIG: {
    // 收入来源
    REVENUE_SOURCES: [
      'Game Sales',
      'DLC',
      'Microtransactions',
      'Subscriptions',
      'Licensing',
      'Merchandise',
    ],

    // 支出类别
    EXPENSE_CATEGORIES: [
      'Development',
      'Marketing',
      'Operations',
      'Salaries',
      'Licensing',
      'Maintenance',
    ],

    // 税率配置
    TAX_RATES: {
      CORPORATE: 0.25,
      INCOME: 0.3,
      SALES: 0.08,
    },

    // 融资配置
    FUNDING_ROUNDS: [
      {
        name: 'Seed',
        minAmount: 100000,
        maxAmount: 500000,
        equityPercentage: 0.15,
      },
      {
        name: 'Series A',
        minAmount: 1000000,
        maxAmount: 5000000,
        equityPercentage: 0.2,
      },
      {
        name: 'Series B',
        minAmount: 5000000,
        maxAmount: 15000000,
        equityPercentage: 0.15,
      },
      {
        name: 'Series C',
        minAmount: 15000000,
        maxAmount: 50000000,
        equityPercentage: 0.1,
      },
    ],
  },

  // 团队配置
  TEAM_CONFIG: {
    // 角色配置
    ROLES: [
      'CEO',
      'Game Designer',
      'Programmer',
      'Artist',
      'Audio Designer',
      'QA Tester',
      'Marketing Manager',
      'Community Manager',
      'Producer',
      'Project Manager',
    ],

    // 薪资配置
    BASE_SALARIES: {
      CEO: 150000,
      'Game Designer': 80000,
      Programmer: 90000,
      Artist: 75000,
      'Audio Designer': 70000,
      'QA Tester': 50000,
      'Marketing Manager': 85000,
      'Community Manager': 60000,
      Producer: 95000,
      'Project Manager': 85000,
    },

    // 团队成长配置
    TEAM_GROWTH_RATE: 0.02,
    MAX_TEAM_SIZE: 100,

    // 团队效率配置
    TEAM_EFFICIENCY_LEVELS: {
      LOW: 0.7,
      MEDIUM: 1.0,
      HIGH: 1.3,
      EXCELLENT: 1.6,
    },
  },

  // 技术配置
  TECHNOLOGY_CONFIG: {
    // 技术栈
    TECH_STACKS: [
      'Unity',
      'Unreal Engine',
      'Godot',
      'Custom Engine',
      'HTML5/JS',
      'React Native',
      'Flutter',
    ],

    // 技术成本
    TECH_COSTS: {
      Unity: 0.02,
      'Unreal Engine': 0.05,
      Godot: 0,
      'Custom Engine': 0.1,
      'HTML5/JS': 0.01,
      'React Native': 0.015,
      Flutter: 0.015,
    },

    // 技术更新周期
    TECH_UPDATE_CYCLE_DAYS: 180,

    // 技术风险
    TECH_RISK_LEVELS: {
      LOW: 0.1,
      MEDIUM: 0.3,
      HIGH: 0.5,
      CRITICAL: 0.8,
    },
  },
} as const;
