// 应用类型定义
export interface AvailableApp {
  id: string;
  name: string;
  icon: string;
  description: string;
  memory: string;
  category: "system" | "core" | "advanced";
  requiredLevelId: string;
  requiredSubLevel?: number;
}

// 应用状态类型
export type AppStatus = 'locked' | 'available' | 'downloading' | 'installed';

// 本地存储键名
const INSTALLED_APPS_KEY = "app-store-installed-apps";

// 应用商店服务类
export class AppStoreService {
  // 应用数据
  private static readonly availableApps: AvailableApp[] = [
    {
      id: "app-store",
      name: "应用商店",
      icon: "🏪",
      description: "所有高级应用的唯一获取入口",
      memory: "128MB",
      category: "system",
      requiredLevelId: "trainee-planner",
    },
    {
      id: "data-center",
      name: "数据中心",
      icon: "📊",
      description: "每日结算报表、游戏数据可视化",
      memory: "256MB",
      category: "system",
      requiredLevelId: "trainee-planner",
    },
    {
      id: "career-growth",
      name: "策划成长",
      icon: "📈",
      description: "职级体系、升级规则、权限管理",
      memory: "128MB",
      category: "system",
      requiredLevelId: "trainee-planner",
    },
    {
      id: "system-settings",
      name: "系统设置",
      icon: "⚙️",
      description: "游戏存档、音量、画面设置",
      memory: "128MB",
      category: "system",
      requiredLevelId: "trainee-planner",
    },
    {
      id: "wallet",
      name: "钱包",
      icon: "💰",
      description: "唯一财务入口：资金余额、收支流水",
      memory: "128MB",
      category: "core",
      requiredLevelId: "trainee-planner",
    },
    {
      id: "chat",
      name: "聊天",
      icon: "💬",
      description: "与团队沟通、玩家舆情反馈",
      memory: "128MB",
      category: "core",
      requiredLevelId: "trainee-planner",
    },
    {
      id: "hero-development",
      name: "英雄",
      icon: "🦸",
      description: "唯一英雄全生命周期管理",
      memory: "256MB",
      category: "core",
      requiredLevelId: "trainee-planner",
    },
    {
      id: "skin-development",
      name: "皮肤",
      icon: "🧵",
      description: "唯一皮肤全生命周期管理",
      memory: "128MB",
      category: "core",
      requiredLevelId: "trainee-planner",
    },
    {
      id: "event-development",
      name: "活动",
      icon: "🎪",
      description: "唯一运营活动管理",
      memory: "192MB",
      category: "core",
      requiredLevelId: "trainee-planner",
    },
    {
      id: "game-release",
      name: "游戏发布",
      icon: "📦",
      description: "唯一版本上线入口",
      memory: "320MB",
      category: "core",
      requiredLevelId: "trainee-planner",
    },
    {
      id: "task-center",
      name: "任务中心",
      icon: "📋",
      description: "日常任务、主线任务、成就任务",
      memory: "128MB",
      category: "advanced",
      requiredLevelId: "junior-planner",
      requiredSubLevel: 3,
    },
    {
      id: "collaboration-center",
      name: "联动中心",
      icon: "🤝",
      description: "全量可联动IP/工作室展示、联动项目管理",
      memory: "192MB",
      category: "advanced",
      requiredLevelId: "intermediate-planner",
      requiredSubLevel: 5,
    },
    {
      id: "public-opinion-center",
      name: "舆情中心",
      icon: "📢",
      description: "玩家社区评论、口碑变化明细",
      memory: "192MB",
      category: "advanced",
      requiredLevelId: "senior-planner",
      requiredSubLevel: 5,
    },
    {
      id: "event-log",
      name: "事件日志",
      icon: "📝",
      description: "历史随机事件全记录",
      memory: "128MB",
      category: "advanced",
      requiredLevelId: "intermediate-planner",
      requiredSubLevel: 3,
    },
    {
      id: "channel-delivery",
      name: "渠道投放",
      icon: "📣",
      description: "市场推广渠道选择、投放力度设置",
      memory: "192MB",
      category: "advanced",
      requiredLevelId: "expert-planner",
      requiredSubLevel: 5,
    },
  ];

  // 获取所有应用
  static getAllApps(): AvailableApp[] {
    return [...this.availableApps];
  }

  // 加载已安装应用
  static loadInstalledApps(): string[] {
    const saved = localStorage.getItem(INSTALLED_APPS_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  // 保存已安装应用
  static saveInstalledApps(apps: string[]): void {
    localStorage.setItem(INSTALLED_APPS_KEY, JSON.stringify(apps));
  }

  // 检查应用是否已安装
  static isInstalled(appId: string, installedApps: string[]): boolean {
    return installedApps.includes(appId);
  }

  // 检查应用是否可解锁
  static canUnlockApp(app: AvailableApp, subLevelIndex: number): boolean {
    if (app.requiredSubLevel) {
      return subLevelIndex + 1 >= app.requiredSubLevel;
    }
    return true;
  }

  // 获取等级名称
  static getLevelNameById(levelId: string): string {
    const levelMap: Record<string, string> = {
      "trainee-planner": "见习策划",
      "junior-planner": "初级策划",
      "intermediate-planner": "中级策划",
      "senior-planner": "高级策划",
      "expert-planner": "资深策划",
      "master-planner": "专家策划",
      "manager-planner": "策划经理",
      "director-planner": "策划总监",
    };
    return levelMap[levelId] || levelId;
  }

  // 获取小等级名称
  static getSubLevelName(_levelId: string, subLevelOrder: number): string {
    return `${subLevelOrder}`;
  }

  // 获取解锁条件文本
  static getUnlockConditionText(app: AvailableApp): string {
    const levelName = this.getLevelNameById(app.requiredLevelId);
    const subLevelName = app.requiredSubLevel
      ? this.getSubLevelName(app.requiredLevelId, app.requiredSubLevel)
      : "";
    return `${levelName}${subLevelName}`;
  }

  // 获取应用状态
  static getAppStatus(
    app: AvailableApp,
    installedApps: string[],
    isDownloadingCallback: (appId: string) => boolean,
    subLevelIndex: number
  ): AppStatus {
    if (this.isInstalled(app.id, installedApps)) {
      return 'installed';
    }

    if (isDownloadingCallback(app.id)) {
      return 'downloading';
    }

    if (!this.canUnlockApp(app, subLevelIndex)) {
      return 'locked';
    }

    return 'available';
  }

  // 获取应用状态文本
  static getAppStatusText(status: AppStatus): string {
    const statusMap: Record<AppStatus, string> = {
      locked: "未解锁",
      available: "可下载",
      downloading: "下载中",
      installed: "已安装",
    };
    return statusMap[status];
  }

  // 获取状态样式类
  static getStatusClass(status: AppStatus): string {
    const classMap: Record<AppStatus, string> = {
      locked: "status-locked",
      available: "status-available",
      downloading: "status-installed", // 下载中的样式与已安装相似
      installed: "status-installed",
    };
    return classMap[status];
  }

  // 过滤应用
  static filterApps(
    category: string,
    subLevelIndex: number
  ): AvailableApp[] {
    switch (category) {
      case "system":
        return this.availableApps.filter((app) => app.category === "system");
      case "unlocked":
        return this.availableApps.filter((app) => this.canUnlockApp(app, subLevelIndex));
      case "locked":
        return this.availableApps.filter((app) => !this.canUnlockApp(app, subLevelIndex));
      case "mini":
        return [];
      default:
        return this.availableApps;
    }
  }
}
