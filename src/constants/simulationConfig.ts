// 模拟系统配置常量

export const SimulationConfig = {
  // 模拟类型
  SimulationTypes: {
    GameDev: "game_dev",
    MarketAnalysis: "market_analysis",
    RiskAssessment: "risk_assessment",
    StrategyPlanning: "strategy_planning",
  },

  // 市场配置
  MarketConfig: {
    MaxPlayers: 1000000,
    MinPlayers: 1000,
    DefaultPlayers: 100000,
    PlayerGrowthRate: 0.05,
    PlayerRetentionRate: 0.85,

    // 市场情绪配置
    MarketSentimentLevels: {
      VeryNegative: -2,
      Negative: -1,
      Neutral: 0,
      Positive: 1,
      VeryPositive: 2,
    },

    // 市场波动配置
    MarketVolatility: 0.1,
    MaxMarketSwing: 0.2,

    // 竞争配置
    MaxCompetitors: 10,
    CompetitorGrowthRate: 0.03,
    CompetitorInnovationRate: 0.02,
  },

  // 游戏开发配置
  GameDevConfig: {
    // 阶段名称映射
    PhaseNameMap: {
      Concept: "concept",
      Design: "design",
      Development: "development",
      Testing: "testing",
      Launch: "launch",
      PostLaunch: "postLaunch",
    },

    // 开发时间
    PhaseDurationDays: {
      concept: 7,
      design: 14,
      development: 60,
      testing: 30,
      launch: 7,
      postLaunch: 90,
    },

    // 开发成本
    PhaseCostMultiplier: {
      concept: 0.1,
      design: 0.2,
      development: 0.4,
      testing: 0.15,
      launch: 0.1,
      postLaunch: 0.05,
    },

    // 质量配置
    QualityLevels: {
      Poor: 1,
      Average: 2,
      Good: 3,
      Excellent: 4,
      Masterpiece: 5,
    },

    // 创新配置
    InnovationLevels: {
      Low: 1,
      Medium: 2,
      High: 3,
      Groundbreaking: 4,
    },

    // 游戏类型
    GameGenres: [
      "Action",
      "Adventure",
      "RPG",
      "Strategy",
      "Simulation",
      "Puzzle",
      "Sports",
      "Racing",
      "Fighting",
      "Horror",
      "Sandbox",
      "MOBA",
      "Battle Royale",
    ],

    // 平台配置
    Platforms: ["PC", "Console", "Mobile", "Web", "VR/AR"],
  },

  // 财务配置
  FinancialConfig: {
    // 收入来源
    RevenueSources: [
      "Game Sales",
      "DLC",
      "Microtransactions",
      "Subscriptions",
      "Licensing",
      "Merchandise",
    ],

    // 支出类别
    ExpenseCategories: [
      "Development",
      "Marketing",
      "Operations",
      "Salaries",
      "Licensing",
      "Maintenance",
    ],

    // 税率配置
    TaxRates: {
      Corporate: 0.25,
      Income: 0.3,
      Sales: 0.08,
    },

    // 融资配置
    FundingRounds: [
      {
        name: "Seed",
        minAmount: 100000,
        maxAmount: 500000,
        equityPercentage: 0.15,
      },
      {
        name: "Series A",
        minAmount: 1000000,
        maxAmount: 5000000,
        equityPercentage: 0.2,
      },
      {
        name: "Series B",
        minAmount: 5000000,
        maxAmount: 15000000,
        equityPercentage: 0.15,
      },
      {
        name: "Series C",
        minAmount: 15000000,
        maxAmount: 50000000,
        equityPercentage: 0.1,
      },
    ],
  },

  // 团队配置
  TeamConfig: {
    // 角色配置
    Roles: [
      "CEO",
      "Game Designer",
      "Programmer",
      "Artist",
      "Audio Designer",
      "QA Tester",
      "Marketing Manager",
      "Community Manager",
      "Producer",
      "Project Manager",
    ],

    // 薪资配置
    BaseSalaries: {
      CEO: 150000,
      "Game Designer": 80000,
      Programmer: 90000,
      Artist: 75000,
      "Audio Designer": 70000,
      "QA Tester": 50000,
      "Marketing Manager": 85000,
      "Community Manager": 60000,
      Producer: 95000,
      "Project Manager": 85000,
    },

    // 团队成长配置
    TeamGrowthRate: 0.02,
    MaxTeamSize: 100,

    // 团队效率配置
    TeamEfficiencyLevels: {
      Low: 0.7,
      Medium: 1.0,
      High: 1.3,
      Excellent: 1.6,
    },
  },

  // 技术配置
  TechnologyConfig: {
    // 技术栈
    TechStacks: [
      "Unity",
      "Unreal Engine",
      "Godot",
      "Custom Engine",
      "HTML5/JS",
      "React Native",
      "Flutter",
    ],

    // 技术成本
    TechCosts: {
      Unity: 0.02,
      "Unreal Engine": 0.05,
      Godot: 0,
      "Custom Engine": 0.1,
      "HTML5/JS": 0.01,
      "React Native": 0.015,
      Flutter: 0.015,
    },

    // 技术更新周期
    TechUpdateCycleDays: 180,

    // 技术风险
    TechRiskLevels: {
      Low: 0.1,
      Medium: 0.3,
      High: 0.5,
      Critical: 0.8,
    },
  },
} as const;
